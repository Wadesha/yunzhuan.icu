// 访问记录 API - 使用 Vercel KV 存储数据
module.exports = async (req, res) => {
    // 处理 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 解析请求体
    let body = req.body;
    if (!body || typeof body !== 'object') {
        try {
            const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            body = JSON.parse(raw);
        } catch (e) {
            body = {};
        }
    }

    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    // KV 未配置时静默返回
    if (!kvUrl || !kvToken) {
        return res.status(200).json({ ok: false, reason: 'KV not configured' });
    }

    try {
        const today = new Date().toISOString().slice(0, 10);
        const path = body.path || '/';
        const visitorId = body.visitorId || '';
        const referrer = body.referrer || '';

        // 使用 pipeline 批量执行命令，减少 KV 调用次数
        const commands = [
            ['INCR', 'total_pv'],
            ['INCR', 'daily_pv:' + today],
            ['INCR', 'page_pv:' + path]
        ];

        if (visitorId) {
            commands.push(['SADD', 'total_uv', visitorId]);
            commands.push(['SADD', 'daily_uv:' + today, visitorId]);
        }

        if (referrer) {
            commands.push(['INCR', 'ref_pv:' + referrer]);
        }

        await fetch(kvUrl + '/pipeline', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + kvToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commands)
        });

        return res.status(200).json({ ok: true });
    } catch (e) {
        return res.status(200).json({ ok: false, error: e.message });
    }
};
