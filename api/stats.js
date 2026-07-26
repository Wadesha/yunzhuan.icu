// 统计数据 API - 返回真实访问统计
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-cache');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) {
        return res.status(200).json({
            ok: false,
            reason: 'KV not configured',
            message: '请在 Vercel 后台创建 KV Storage 并连接到项目'
        });
    }

    try {
        const today = new Date().toISOString().slice(0, 10);

        // Pipeline 批量获取数据
        const commands = [
            ['GET', 'total_pv'],
            ['GET', 'daily_pv:' + today],
            ['SCARD', 'total_uv'],
            ['SCARD', 'daily_uv:' + today]
        ];

        const response = await fetch(kvUrl + '/pipeline', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + kvToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commands)
        });

        const results = await response.json();

        const totalPV = parseInt(results[0]?.result) || 0;
        const todayPV = parseInt(results[1]?.result) || 0;
        const totalUV = parseInt(results[2]?.result) || 0;
        const todayUV = parseInt(results[3]?.result) || 0;

        return res.status(200).json({
            ok: true,
            totalPV: totalPV,
            todayPV: todayPV,
            totalUV: totalUV,
            todayUV: todayUV,
            date: today,
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        return res.status(200).json({
            ok: false,
            error: e.message
        });
    }
};
