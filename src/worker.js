import { DEFAULT_CONTENT } from "./defaults.js";

const COOKIE = "jj_session";
const SESSION_DAYS = 90;
const enc = new TextEncoder();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await api(request, env, url);
      } catch (e) {
        return json({ error: "server_error", detail: String((e && e.message) || e) }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

// ---------- routing ----------

async function api(request, env, url) {
  const p = url.pathname;
  const m = request.method;

  // Public
  if (p === "/api/session" && m === "GET") {
    const content = await getContent(env);
    return json({ unlocked: await hasSession(request, env), title: content.gate.title, hint: content.gate.hint });
  }
  if (p === "/api/unlock" && m === "POST") return unlock(request, env);

  // Admin
  if (p.startsWith("/api/admin/")) {
    if (!(await isAdmin(request, env))) return json({ error: "unauthorized" }, 401);
    return admin(request, env, url);
  }

  // Video stream uses its own short-lived token (checked inside)
  if (p === "/api/video/stream" && m === "GET") return videoStream(request, env, url);

  // Everything else needs her session
  if (!(await hasSession(request, env))) return json({ error: "locked" }, 401);

  if (p === "/api/content" && m === "GET") return json(publicContent(await getContent(env)));
  if (p.startsWith("/api/media/") && m === "GET") {
    const key = decodeURIComponent(p.slice("/api/media/".length));
    const content = await getContent(env);
    if (!referencedKeys(content).includes(key)) return new Response("Not found", { status: 404 });
    return serveR2(env, key, request);
  }
  if (p === "/api/video/status" && m === "GET") return json(await videoStatus(env));
  if (p === "/api/video/start" && m === "POST") return videoStart(env);
  if (p === "/api/video/finish" && m === "POST") return videoFinish(env);
  if (p === "/api/reply" && m === "POST") return saveReply(request, env);

  return json({ error: "not_found" }, 404);
}

async function admin(request, env, url) {
  const p = url.pathname;
  const m = request.method;

  if (p === "/api/admin/content" && m === "GET") return json(await getContent(env));
  if (p === "/api/admin/content" && m === "PUT") {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "invalid_content" }, 400);
    await env.KV.put("content", JSON.stringify(body));
    return json({ ok: true });
  }
  if (p === "/api/admin/content/reset" && m === "POST") {
    await env.KV.delete("content");
    return json({ ok: true });
  }

  if (p === "/api/admin/upload" && m === "POST") {
    const type = request.headers.get("content-type") || "application/octet-stream";
    const name = (url.searchParams.get("name") || "file").replace(/[^\w.\-]+/g, "_").slice(-60);
    const key = `media/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${name}`;
    await env.MEDIA.put(key, request.body, { httpMetadata: { contentType: type } });
    return json({ ok: true, key });
  }
  if (p.startsWith("/api/admin/media/")) {
    const key = decodeURIComponent(p.slice("/api/admin/media/".length));
    if (m === "GET") return serveR2(env, key, request);
    if (m === "DELETE") {
      await env.MEDIA.delete(key);
      return json({ ok: true });
    }
  }

  if (p === "/api/admin/stats" && m === "GET") {
    return json({
      unlocks: (await env.KV.get("log:unlocks", "json")) || [],
      replies: (await env.KV.get("replies", "json")) || [],
      video: await videoStatus(env),
    });
  }
  if (p === "/api/admin/video/reset" && m === "POST") {
    await env.KV.delete("video:state");
    return json({ ok: true });
  }
  if (p === "/api/admin/replies" && m === "DELETE") {
    await env.KV.delete("replies");
    return json({ ok: true });
  }

  return json({ error: "not_found" }, 404);
}

// ---------- content ----------

async function getContent(env) {
  const stored = await env.KV.get("content", "json");
  if (!stored) return structuredClone(DEFAULT_CONTENT);
  // Fill in any sections or settings added after the content was first saved.
  return deepMerge(structuredClone(DEFAULT_CONTENT), stored);
}

function deepMerge(base, over) {
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = isObj(base[k]) && isObj(v) ? deepMerge(base[k], v) : v;
  return out;
}

function publicContent(c) {
  const out = structuredClone(c);
  if (out.gate) delete out.gate.answers;
  if (out.video) {
    out.video.enabled = !!(out.video.enabled && out.video.key);
    delete out.video.key;
  }
  return out;
}

function referencedKeys(c) {
  const keys = [];
  for (const ph of (c.photos && c.photos.items) || []) if (ph && ph.key) keys.push(ph.key);
  for (const it of (c.timeline && c.timeline.items) || []) if (it && it.photo) keys.push(it.photo);
  for (const it of (c.story && c.story.photoZoom && c.story.photoZoom.items) || []) if (it && it.photo) keys.push(it.photo);
  if (c.music && c.music.key) keys.push(c.music.key);
  return keys;
}

// ---------- password ----------

// Ignore Thai vowels, tone marks, spaces and punctuation; treat ช like ฉ.
export function skeleton(s) {
  return String(s || "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/[\s\-_.,!?~'"]/g, "")
    .replace(/[ฯ-ฺเ-๎]/g, "")
    .replace(/[ชฌ]/g, "ฉ");
}

async function unlock(request, env) {
  let body = {};
  try {
    body = await request.json();
  } catch {}
  const content = await getContent(env);
  const guess = skeleton(body.password);
  const ok = guess.length > 0 && (content.gate.answers || []).some((a) => skeleton(a) === guess);
  if (!ok) return json({ error: "wrong" }, 401);

  const log = (await env.KV.get("log:unlocks", "json")) || [];
  log.unshift({ t: new Date().toISOString(), country: (request.cf && request.cf.country) || "" });
  await env.KV.put("log:unlocks", JSON.stringify(log.slice(0, 50)));

  const exp = Date.now() + SESSION_DAYS * 864e5;
  const token = `${exp}.${await sign(env, `s:${exp}`)}`;
  return json(
    { ok: true },
    200,
    { "set-cookie": `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}` }
  );
}

async function hasSession(request, env) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return false;
  const [exp, sig] = match[1].split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await sign(env, `s:${exp}`));
}

// ---------- watch-once video ----------

async function videoStatus(env) {
  const content = await getContent(env);
  const v = content.video || {};
  const enabled = !!(v.enabled && v.key);
  const st = (await env.KV.get("video:state", "json")) || {};
  const windowMs = (Number(v.windowMinutes) || 20) * 60000;
  let state = "unwatched";
  let remainingSec = 0;
  if (st.finishedAt) state = "watched";
  else if (st.firstPlayAt) {
    const left = st.firstPlayAt + windowMs - Date.now();
    if (left > 0) {
      state = "playing";
      remainingSec = Math.round(left / 1000);
    } else state = "watched";
  }
  return { enabled, state, remainingSec, firstPlayAt: st.firstPlayAt || null, finishedAt: st.finishedAt || null };
}

async function videoStart(env) {
  const status = await videoStatus(env);
  if (!status.enabled) return json({ error: "disabled" }, 404);
  if (status.state === "watched") return json({ error: "watched" }, 410);
  const content = await getContent(env);
  const windowMs = (Number(content.video.windowMinutes) || 20) * 60000;
  let st = (await env.KV.get("video:state", "json")) || {};
  if (!st.firstPlayAt) {
    st = { firstPlayAt: Date.now() };
    await env.KV.put("video:state", JSON.stringify(st));
  }
  const exp = st.firstPlayAt + windowMs;
  const t = `${exp}.${await sign(env, `v:${exp}:${content.video.key}`)}`;
  return json({ ok: true, src: `/api/video/stream?t=${encodeURIComponent(t)}`, remainingSec: Math.round((exp - Date.now()) / 1000) });
}

async function videoFinish(env) {
  const st = (await env.KV.get("video:state", "json")) || {};
  if (st.firstPlayAt && !st.finishedAt) {
    st.finishedAt = Date.now();
    await env.KV.put("video:state", JSON.stringify(st));
  }
  return json({ ok: true });
}

async function videoStream(request, env, url) {
  const content = await getContent(env);
  const key = content.video && content.video.key;
  const [exp, sig] = (url.searchParams.get("t") || "").split(".");
  if (!key || !exp || !sig || Number(exp) < Date.now()) return new Response("Expired", { status: 403 });
  if (!safeEqual(sig, await sign(env, `v:${exp}:${key}`))) return new Response("Forbidden", { status: 403 });
  const st = (await env.KV.get("video:state", "json")) || {};
  if (st.finishedAt) return new Response("Watched", { status: 410 });
  return serveR2(env, key, request, { "cache-control": "no-store", "content-disposition": "inline" });
}

// ---------- replies ----------

async function saveReply(request, env) {
  let body = {};
  try {
    body = await request.json();
  } catch {}
  const text = String(body.text || "").trim().slice(0, 4000);
  if (!text) return json({ error: "empty" }, 400);
  const replies = (await env.KV.get("replies", "json")) || [];
  replies.unshift({ t: new Date().toISOString(), text });
  await env.KV.put("replies", JSON.stringify(replies.slice(0, 300)));
  return json({ ok: true });
}

// ---------- helpers ----------

async function serveR2(env, key, request, extra = {}) {
  const rangeHeader = request.headers.get("range");
  let obj;
  try {
    obj = await env.MEDIA.get(key, rangeHeader ? { range: request.headers } : undefined);
  } catch {
    return new Response("Range not satisfiable", { status: 416 });
  }
  if (!obj) return new Response("Not found", { status: 404 });
  const h = new Headers();
  obj.writeHttpMetadata(h);
  h.set("etag", obj.httpEtag);
  h.set("accept-ranges", "bytes");
  h.set("cache-control", "private, max-age=3600");
  for (const [k, v] of Object.entries(extra)) h.set(k, v);
  if (rangeHeader && obj.range) {
    let start, end;
    if ("suffix" in obj.range) {
      start = obj.size - obj.range.suffix;
      end = obj.size - 1;
    } else {
      start = obj.range.offset || 0;
      end = obj.range.length != null ? start + obj.range.length - 1 : obj.size - 1;
    }
    h.set("content-range", `bytes ${start}-${end}/${obj.size}`);
    h.set("content-length", String(end - start + 1));
    return new Response(obj.body, { status: 206, headers: h });
  }
  h.set("content-length", String(obj.size));
  return new Response(obj.body, { headers: h });
}

async function isAdmin(request, env) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 16 || !token) return false;
  return safeEqual(token, env.ADMIN_TOKEN);
}

async function sign(env, msg) {
  if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
  const key = await crypto.subtle.importKey("raw", enc.encode(env.SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function safeEqual(a, b) {
  const x = enc.encode(String(a));
  const y = enc.encode(String(b));
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}
