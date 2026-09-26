// Çarpım Tablosu — Cloudflare Worker
// - /api/scores : D1 veritabanı ile skor kaydetme + lider tablosu
// - diğer tüm yollar : public/ içindeki statik dosyalar (ASSETS binding)
// D1'e "DB" binding'i ile erişilir; API anahtarı gerekmez.

const CORS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

async function getLeaderboard(env) {
  const { results } = await env.DB.prepare(
    `SELECT name, MAX(score) AS score, MAX(stars) AS stars
     FROM scores
     GROUP BY name
     ORDER BY score DESC, stars DESC
     LIMIT 20`
  ).all();
  return json({ ok: true, leaderboard: results || [] });
}

async function saveScore(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "Geçersiz istek" }, 400); }

  const name = String(body.name || "").trim().slice(0, 20);
  const mode = String(body.mode || "").trim().slice(0, 10);
  const score = Math.max(0, Math.min(1000, parseInt(body.score, 10) || 0));
  const correct = Math.max(0, Math.min(100, parseInt(body.correct, 10) || 0));
  const total = Math.max(1, Math.min(100, parseInt(body.total, 10) || 10));
  const stars = Math.max(0, Math.min(3, parseInt(body.stars, 10) || 0));

  if (!name) return json({ error: "İsim gerekli" }, 400);

  await env.DB.prepare(
    `INSERT INTO scores (name, mode, score, correct, total, stars)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(name, mode, score, correct, total, stars).run();
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/scores") {
      try {
        if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
        if (!env.DB) return json({ error: "Veritabanı bağlı değil" }, 500);
        if (request.method === "GET") return await getLeaderboard(env);
        if (request.method === "POST") return await saveScore(request, env);
        return json({ error: "İzin verilmeyen metot" }, 405);
      } catch (e) {
        return json({ error: String(e) }, 500);
      }
    }

    // Statik dosyalar (public/)
    return env.ASSETS.fetch(request);
  },
};
