// Vercel Serverless Function: AI Chat Proxy
// Endpoint: /api/ai-chat
// Method: POST
// Body: { message: string, history?: Array<{role: string, content: string}> }
// Requires env var: OPENAI_API_KEY (or ANTHROPIC_API_KEY)

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return res.status(500).json({
            error: 'AI service not configured. Set OPENAI_API_KEY environment variable.'
        });
    }

    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const systemPrompt = `你是一个专业的美国大学留学申请顾问助手，名叫 yunzhuan AI。
你的职责是帮助学生和家长解答关于美国大学申请的各种问题，包括：
- 选校建议和学校对比
- 专业选择和职业规划
- 申请时间线和材料准备
- 文书写作建议和润色
- 标化考试准备
- 奖学金和费用问题

回答要求：
1. 用中文回答，专业术语可以用英文
2. 结构清晰，多用列表和小标题
3. 给出具体、可操作的建议
4. 如果不确定，直接说明，不要编造信息
5. 鼓励用户提供更多背景信息以获得更精准的建议

重要免责声明：AI 生成的内容仅供参考，不构成专业的留学申请建议。重大决策请咨询专业顾问。`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: message }
        ];

        if (process.env.ANTHROPIC_API_KEY) {
            // Anthropic Claude
            const anthropicMessages = messages
                .filter(m => m.role !== 'system')
                .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20240620',
                    max_tokens: 1024,
                    system: systemPrompt,
                    messages: anthropicMessages
                })
            });

            const data = await response.json();
            if (!response.ok) {
                return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
            }

            const reply = data.content?.[0]?.text || '抱歉，我无法生成回复。';
            return res.status(200).json({ reply, model: 'claude-3-5-sonnet' });
        } else {
            // OpenAI (default)
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            const data = await response.json();
            if (!response.ok) {
                return res.status(response.status).json({ error: data.error?.message || 'OpenAI API error' });
            }

            const reply = data.choices?.[0]?.message?.content || '抱歉，我无法生成回复。';
            return res.status(200).json({ reply, model: data.model });
        }

    } catch (error) {
        console.error('AI chat error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
