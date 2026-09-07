CREATE TABLE IF NOT EXISTS prospectos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo TEXT NOT NULL,
  edad INTEGER,
  nivel TEXT,
  objetivo TEXT,
  dias TEXT,
  horario TEXT,
  geografos INTEGER NOT NULL DEFAULT 1,
  inicio TEXT,
  prioridad TEXT NOT NULL DEFAULT 'C-B',
  origen TEXT NOT NULL DEFAULT 'web',
  estado TEXT NOT NULL DEFAULT 'Nuevo',
  whatsapp_enviado INTEGER NOT NULL DEFAULT 0,
  consentimiento INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_contact_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_prospectos_telefono ON prospectos(telefono);
CREATE INDEX IF NOT EXISTS idx_prospectos_estado ON prospectos(estado);
CREATE INDEX IF NOT EXISTS idx_prospectos_prioridad ON prospectos(prioridad);
CREATE INDEX IF NOT EXISTS idx_prospectos_created_at ON prospectos(created_at DESC);

CREATE TABLE IF NOT EXISTS prospecto_eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prospecto_id TEXT NOT NULL,
  tipo TEXT NOT NULL,
  detalle TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (prospecto_id) REFERENCES prospectos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_eventos_prospecto ON prospecto_eventos(prospecto_id, created_at DESC);