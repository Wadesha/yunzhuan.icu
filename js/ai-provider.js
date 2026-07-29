/* ================================================================
 * ai-provider.js v1.0 (v39)
 * AI Provider 抽象层 + 多 Provider 接入 + 缓存
 *
 * 暴露对象：window.AIProvider
 *   .config                { openai, ollama, deepseek, local }
 *   .setConfig(providerKey, cfg)
 *   .getConfig()
 *   .save() / .load()
 *   .complete(prompt, options) -> Promise<string>
 *   .listProviders() -> string[]
 *   .clearCache()
 *   .stats()
 *
 * 不破坏现有 AITutor.diagnose/explain；local 模式沿用模板生成。
 * ================================================================ */
(function() {
  'use strict';

  var CACHE_KEY = 'ai_cache';
  var CONFIG_KEY = 'ai_config';
  var CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  var DEFAULT_MODELS = {
    openai: 'gpt-4o-mini',
    ollama: 'llama3.1',
    deepseek: 'deepseek-chat',
    local: 'template-v1'
  };

  // ---------------- Cache Layer ----------------
  function loadCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {}
    return {};
  }

  function saveCache(cache) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      // storage may be full; prune old entries and try again
      pruneCache(cache, 0.5);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e2) {}
    }
  }

  function pruneCache(cache, ratio) {
    var keys = Object.keys(cache);
    if (!keys.length) return;
    keys.sort(function(a, b) { return (cache[a].ts || 0) - (cache[b].ts || 0); });
    var cut = Math.max(1, Math.floor(keys.length * ratio));
    for (var i = 0; i < cut; i++) delete cache[keys[i]];
  }

  function hashPrompt(prompt, options) {
    var str = (prompt || '') + '||' + JSON.stringify(options || {});
    // Simple FNV-1a style 32-bit hash, deterministic, no crypto deps
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return ('0000000' + h.toString(16)).slice(-8) +
           ('0000000' + str.length.toString(16)).slice(-8);
  }

  function getCached(prompt, options) {
    var key = hashPrompt(prompt, options);
    var cache = loadCache();
    var entry = cache[key];
    if (!entry) return null;
    if (Date.now() - (entry.ts || 0) > CACHE_TTL_MS) {
      delete cache[key];
      saveCache(cache);
      return null;
    }
    return entry;
  }

  function setCached(prompt, options, response, provider) {
    var key = hashPrompt(prompt, options);
    var cache = loadCache();
    cache[key] = {
      prompt: prompt,
      response: response,
      provider: provider,
      ts: Date.now()
    };
    saveCache(cache);
  }

  // ---------------- Local Template Fallback ----------------
  function localTemplate(prompt, options) {
    var p = String(prompt || '').toLowerCase();
    var subjectHint = '';
    var subjMatch = p.match(/subject[=:\s]+["']?([a-z]+)/i);
    if (subjMatch) subjectHint = subjMatch[1].toUpperCase();

    // Detect question generation request
    if (p.indexOf('json') !== -1 && p.indexOf('question') !== -1) {
      return JSON.stringify({
        questions: [
          {
            qid: 'q-local-' + Date.now(),
            stem: '【本地模板】关于 ' + subjectHint + ' 的练习题：请描述此主题的核心概念。',
            choices: { A: '概念 A', B: '概念 B', C: '概念 C', D: '概念 D' },
            answer: 'A',
            explanation: '本地模板生成，请配置 AI Provider 以获得真实题目。',
            difficulty: 'medium',
            topicCode: 'T-LOCAL'
          }
        ]
      });
    }
    // Generic explanation template
    return '【本地 AI（模板模式）】\n' +
      '当前未配置 AI Provider 或网络请求失败。\n' +
      '提示：这是一个针对 ' + (subjectHint || '当前主题') + ' 的回复占位。\n' +
      '请在 Dashboard → AI Provider Settings 配置 OpenAI / DeepSeek API Key，\n' +
      '或启动本地 Ollama 服务以获得更智能的 AI 回答。\n' +
      '—— 来自 AI Provider Local Fallback ——';
  }

  // ---------------- Provider Implementations ----------------
  function callOpenAI(apiKey, model, prompt, options) {
    var sysPrompt = options && options.systemPrompt ? options.systemPrompt :
      'You are a helpful academic assistant. Reply concisely in 中文 unless asked otherwise.';
    var body = {
      model: model || DEFAULT_MODELS.openai,
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: (options && options.temperature != null) ? options.temperature : 0.5,
      max_tokens: (options && options.maxTokens) || 800
    };
    return fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(body)
    }).then(function(res) {
      if (!res.ok) throw new Error('OpenAI HTTP ' + res.status);
      return res.json();
    }).then(function(data) {
      var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!content) throw new Error('OpenAI: empty response');
      return content;
    });
  }

  function callDeepSeek(apiKey, model, prompt, options) {
    var body = {
      model: model || DEFAULT_MODELS.deepseek,
      messages: [
        { role: 'system', content: (options && options.systemPrompt) || 'You are a helpful academic assistant. Reply in 中文.' },
        { role: 'user', content: prompt }
      ],
      temperature: (options && options.temperature != null) ? options.temperature : 0.5,
      max_tokens: (options && options.maxTokens) || 800
    };
    return fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(body)
    }).then(function(res) {
      if (!res.ok) throw new Error('DeepSeek HTTP ' + res.status);
      return res.json();
    }).then(function(data) {
      var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!content) throw new Error('DeepSeek: empty response');
      return content;
    });
  }

  function callOllama(endpoint, model, prompt, options) {
    var url = (endpoint || 'http://localhost:11434') + '/v1/chat/completions';
    var body = {
      model: model || DEFAULT_MODELS.ollama,
      messages: [
        { role: 'system', content: (options && options.systemPrompt) || 'You are a helpful academic assistant. Reply in 中文.' },
        { role: 'user', content: prompt }
      ],
      stream: false,
      options: { temperature: (options && options.temperature != null) ? options.temperature : 0.5 }
    };
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function(res) {
      if (!res.ok) throw new Error('Ollama HTTP ' + res.status);
      return res.json();
    }).then(function(data) {
      var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!content) throw new Error('Ollama: empty response');
      return content;
    });
  }

  // ---------------- Config Persistence ----------------
  function defaultConfig() {
    return {
      active: 'local', // local | openai | ollama | deepseek
      openai: { apiKey: '', model: DEFAULT_MODELS.openai },
      ollama: { endpoint: 'http://localhost:11434', model: DEFAULT_MODELS.ollama },
      deepseek: { apiKey: '', model: DEFAULT_MODELS.deepseek },
      local: { enabled: true }
    };
  }

  function loadConfig() {
    try {
      var raw = localStorage.getItem(CONFIG_KEY);
      if (!raw) return defaultConfig();
      var parsed = JSON.parse(raw);
      var base = defaultConfig();
      // shallow merge
      Object.keys(parsed || {}).forEach(function(k) {
        if (typeof parsed[k] === 'object' && parsed[k] !== null) {
          base[k] = Object.assign({}, base[k], parsed[k]);
        } else {
          base[k] = parsed[k];
        }
      });
      return base;
    } catch (e) {
      return defaultConfig();
    }
  }

  function saveConfig(cfg) {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
      return true;
    } catch (e) {
      return false;
    }
  }

  // ---------------- Main complete() ----------------
  function complete(prompt, options) {
    options = options || {};
    var cacheEnabled = options.cache !== false;

    if (cacheEnabled) {
      var hit = getCached(prompt, options);
      if (hit) {
        return Promise.resolve(hit.response).then(function(r) {
          return { text: r, provider: hit.provider, cached: true };
        });
      }
    }

    var cfg = loadConfig();
    var active = options.provider || cfg.active || 'local';

    function fallback(reason) {
      var txt = localTemplate(prompt, options);
      if (cacheEnabled) setCached(prompt, options, txt, 'local');
      return { text: txt, provider: 'local', cached: false, fallbackReason: reason || '' };
    }

    function runProvider() {
      if (active === 'openai' && cfg.openai && cfg.openai.apiKey) {
        return callOpenAI(cfg.openai.apiKey, cfg.openai.model, prompt, options)
          .then(function(txt) { return { text: txt, provider: 'openai' }; });
      }
      if (active === 'deepseek' && cfg.deepseek && cfg.deepseek.apiKey) {
        return callDeepSeek(cfg.deepseek.apiKey, cfg.deepseek.model, prompt, options)
          .then(function(txt) { return { text: txt, provider: 'deepseek' }; });
      }
      if (active === 'ollama') {
        return callOllama(cfg.ollama.endpoint, cfg.ollama.model, prompt, options)
          .then(function(txt) { return { text: txt, provider: 'ollama' }; });
      }
      // unknown or no key configured
      return Promise.reject(new Error('Provider ' + active + ' not available'));
    }

    return runProvider().then(function(result) {
      if (cacheEnabled) setCached(prompt, options, result.text, result.provider);
      return { text: result.text, provider: result.provider, cached: false };
    }).catch(function(err) {
      console.warn('[AIProvider] ' + active + ' failed, fallback to local:', err && err.message);
      return fallback(err && err.message);
    });
  }

  // ---------------- Stats ----------------
  function stats() {
    var cache = loadCache();
    var keys = Object.keys(cache);
    var byProvider = {};
    var now = Date.now();
    var valid = 0;
    keys.forEach(function(k) {
      var entry = cache[k];
      var p = entry.provider || 'unknown';
      byProvider[p] = (byProvider[p] || 0) + 1;
      if (now - (entry.ts || 0) <= CACHE_TTL_MS) valid++;
    });
    return {
      totalEntries: keys.length,
      validEntries: valid,
      expiredEntries: keys.length - valid,
      byProvider: byProvider,
      ttlMs: CACHE_TTL_MS,
      config: loadConfig()
    };
  }

  function clearCache() {
    try { localStorage.removeItem(CACHE_KEY); return true; } catch (e) { return false; }
  }

  function listProviders() {
    return ['local', 'openai', 'deepseek', 'ollama'];
  }

  function setConfig(providerKey, partial) {
    var cfg = loadConfig();
    if (providerKey === 'active') {
      cfg.active = partial;
    } else if (cfg[providerKey]) {
      cfg[providerKey] = Object.assign({}, cfg[providerKey], partial || {});
    } else {
      cfg[providerKey] = partial || {};
    }
    return saveConfig(cfg);
  }

  // ---------------- Public API ----------------
  window.AIProvider = {
    complete: complete,
    config: loadConfig(),
    getConfig: loadConfig,
    setConfig: setConfig,
    save: function() { return saveConfig(loadConfig()); },
    load: loadConfig,
    clearCache: clearCache,
    stats: stats,
    listProviders: listProviders,
    _internal: {
      hashPrompt: hashPrompt,
      loadCache: loadCache,
      DEFAULT_MODELS: DEFAULT_MODELS
    }
  };
})();
