function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

function clean(value, max = 180) {
  return String(value ?? '').trim().slice(0, max);
}

function normalizePhone(value) {
  return clean(value, 30).replace(/[^0-9+]/g, '');
}

function id() {
  return crypto.randomUUID();
}

async function createProspect(request, env) {
  if (!env.DB) return json({ ok: false, error: 'DB_NOT_CONFIGURED' }, 503);

  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'INVALID_JSON' }, 400); }

  const nombre = clean(body.nombre, 100);
  const telefono = normalizePhone(body.telefono);
  const consentimiento = body.consentimiento === true || body.consentimiento === 1;

  if (!nombre || !telefono) return json({ ok: false, error: 'NAME_PHONE_REQUIRED' }, 400);
  if (!consentimiento) return json({ ok: false, error: 'CONSENT_REQUIRED' }, 400);

  const now = new Date().toISOString();
  const prospectoId = id();
  const prioridad = ['C-A', 'C-B', 'C-C'].includes(body.prioridad) ? body.prioridad : 'C-B';
  const estado = 'Nuevo';

  await env.DB.prepare(`
    INSERT INTO prospectos (
      id,nombre,telefono,tipo,edad,nivel,objetivo,dias,horario,geografos,inicio,
      prioridad,origen,estado,whatsapp_enviado,consentimiento,created_at,updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    prospectoId,
    nombre,
    telefono,
    clean(body.tipo, 60) || 'Sin especificar',
    body.edad ? Number(body.edad) : null,
    clean(body.nivel, 60),
    clean(body.objetivo, 120),
    clean(body.dias, 120),
    clean(body.horario, 120),
    body.geografos === false || body.geografos === 'No' ? 0 : 1,
    clean(body.inicio, 80),
    prioridad,
    clean(body.origen, 80) || 'web',
    estado,
    0,
    1,
    now,
    now
  ).run();

  await env.DB.prepare(
    'INSERT INTO prospecto_eventos (prospecto_id,tipo,detalle,created_at) VALUES (?,?,?,?)'
  ).bind(prospectoId, 'filtro_completado', clean(body.origen, 80) || 'web', now).run();

  return json({ ok: true, id: prospectoId, estado, prioridad }, 201);
}

async function markWhatsApp(request, env, prospectoId) {
  if (!env.DB) return json({ ok: false, error: 'DB_NOT_CONFIGURED' }, 503);
  const now = new Date().toISOString();
  await env.DB.prepare('UPDATE prospectos SET whatsapp_enviado=1, updated_at=? WHERE id=?').bind(now, prospectoId).run();
  await env.DB.prepare('INSERT INTO prospecto_eventos (prospecto_id,tipo,created_at) VALUES (?,?,?)').bind(prospectoId, 'whatsapp_abierto', now).run();
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/prospectos' && request.method === 'POST') {
      return createProspect(request, env);
    }

    const whatsappMatch = url.pathname.match(/^\/api\/prospectos\/([^/]+)\/whatsapp$/);
    if (whatsappMatch && request.method === 'POST') {
      return markWhatsApp(request, env, whatsappMatch[1]);
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ ok: false, error: 'NOT_FOUND' }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};