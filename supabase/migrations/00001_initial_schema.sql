-- ═══════════════════════════════════════════════════════════════════
-- ESG NEXUS — Initial Schema (18 tables)
-- Fix REM-009: nazione varchar(2) ISO alpha-2
-- Fix PROMPT-002: piva varchar(16) EU support
-- ═══════════════════════════════════════════════════════════════════

-- ─── users_profile ───────────────────────────────────────────────────────────
CREATE TABLE users_profile (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text,
  studio_nome text,
  email       text,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── clienti ─────────────────────────────────────────────────────────────────
CREATE TABLE clienti (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ragione_sociale text NOT NULL,
  piva            varchar(16) UNIQUE,           -- Fix PROMPT-002: IT(11) + EU(up to 15)
  codice_fiscale  varchar(16),
  ateco           varchar(10),
  settore         text,
  dipendenti      integer CHECK (dipendenti > 0),
  fatturato_eur   bigint CHECK (fatturato_eur >= 0),
  nazione         varchar(2) NOT NULL DEFAULT 'IT', -- Fix REM-009: ISO 3166-1 alpha-2
  sito_web        text,
  indirizzo       text,
  note            text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_clienti_user_id ON clienti(user_id);

-- ─── contatti_cliente ────────────────────────────────────────────────────────
CREATE TABLE contatti_cliente (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id  uuid NOT NULL REFERENCES clienti(id) ON DELETE CASCADE,
  nome        text NOT NULL,
  cognome     text NOT NULL,
  ruolo       text,
  email       text,
  telefono    text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_contatti_cliente_id ON contatti_cliente(cliente_id);

-- ─── engagements ─────────────────────────────────────────────────────────────
CREATE TABLE engagements (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id           uuid NOT NULL REFERENCES clienti(id) ON DELETE CASCADE,
  codice_progetto      text UNIQUE,
  anno_rendicontazione integer NOT NULL CHECK (anno_rendicontazione BETWEEN 2015 AND 2050),
  standard             text NOT NULL CHECK (standard IN ('GRI', 'CSRD_ESRS', 'ENTRAMBI')),
  stato                text NOT NULL DEFAULT 'in_corso'
                         CHECK (stato IN ('in_corso', 'completato', 'sospeso', 'annullato')),
  progresso            integer NOT NULL DEFAULT 0 CHECK (progresso BETWEEN 0 AND 100),
  data_avvio           date,
  data_fine_prevista   date,
  data_fine_effettiva  date,
  budget_contrattuale  integer CHECK (budget_contrattuale >= 0),
  note                 text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_engagements_user_id   ON engagements(user_id);
CREATE INDEX idx_engagements_cliente_id ON engagements(cliente_id);

-- ─── engagement_fasi ─────────────────────────────────────────────────────────
CREATE TABLE engagement_fasi (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  proc_code     text NOT NULL,  -- PROC-00 … PROC-07
  label         text NOT NULL,
  stato         text NOT NULL DEFAULT 'non_iniziata'
                  CHECK (stato IN ('non_iniziata', 'in_corso', 'completata')),
  progresso     integer NOT NULL DEFAULT 0 CHECK (progresso BETWEEN 0 AND 100),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (engagement_id, proc_code)
);
CREATE INDEX idx_engagement_fasi_eng ON engagement_fasi(engagement_id);

-- ─── form_data ───────────────────────────────────────────────────────────────
CREATE TABLE form_data (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  form_code     text NOT NULL,   -- e.g. '00A'
  proc_code     text NOT NULL,   -- e.g. 'PROC-00'
  status        text NOT NULL DEFAULT 'non_iniziato'
                  CHECK (status IN ('non_iniziato', 'in_corso', 'completato')),
  data          jsonb NOT NULL DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (engagement_id, form_code)
);
CREATE INDEX idx_form_data_eng       ON form_data(engagement_id);
CREATE INDEX idx_form_data_proc_code ON form_data(engagement_id, proc_code);

-- ─── rischi ──────────────────────────────────────────────────────────────────
CREATE TABLE rischi (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  engagement_id uuid REFERENCES engagements(id) ON DELETE CASCADE,
  codice        text,
  descrizione   text NOT NULL,
  categoria     text,
  probabilita   integer NOT NULL CHECK (probabilita BETWEEN 1 AND 5),
  impatto       integer NOT NULL CHECK (impatto BETWEEN 1 AND 5),
  score         integer GENERATED ALWAYS AS (probabilita * impatto) STORED,
  stato         text NOT NULL DEFAULT 'aperto'
                  CHECK (stato IN ('aperto', 'in_mitigazione', 'chiuso')),
  note          text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_rischi_user_id       ON rischi(user_id);
CREATE INDEX idx_rischi_engagement_id ON rischi(engagement_id);

-- ─── catalogo_iro ────────────────────────────────────────────────────────────
CREATE TABLE catalogo_iro (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codice              text NOT NULL UNIQUE,
  tema                text NOT NULL,
  area                text NOT NULL CHECK (area IN ('E', 'S', 'G')),
  tipo                text NOT NULL CHECK (tipo IN ('Impatto', 'Rischio', 'Opportunità')),
  prospettiva         text,
  descrizione         text,
  score_impatto       numeric(3,1),
  score_finanziario   numeric(3,1),
  categoria           text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ─── iro_engagement ──────────────────────────────────────────────────────────
CREATE TABLE iro_engagement (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id           uuid NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  catalogo_iro_id         uuid REFERENCES catalogo_iro(id),
  codice                  text NOT NULL,
  tema                    text NOT NULL,
  area                    text NOT NULL,
  tipo                    text NOT NULL,
  materialita_finanziaria numeric(3,1),
  materialita_impatto     numeric(3,1),
  incluso                 boolean NOT NULL DEFAULT true,
  note                    text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_iro_engagement_eng ON iro_engagement(engagement_id);

-- ─── ghg_voci ────────────────────────────────────────────────────────────────
CREATE TABLE ghg_voci (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id     uuid NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  scope             integer NOT NULL CHECK (scope IN (1, 2, 3)),
  categoria         text NOT NULL,
  descrizione       text,
  quantita          numeric(15,4),
  unita             text,
  fattore_emissione numeric(15,6),
  co2e_tonnellate   numeric(15,4) GENERATED ALWAYS AS (
                      CASE WHEN quantita IS NOT NULL AND fattore_emissione IS NOT NULL
                           THEN ROUND((quantita * fattore_emissione / 1000)::numeric, 4)
                           ELSE NULL END
                    ) STORED,
  fonte_dato        text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ghg_voci_eng ON ghg_voci(engagement_id);

-- ─── kpi_valori ──────────────────────────────────────────────────────────────
CREATE TABLE kpi_valori (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id  uuid NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  area           text NOT NULL CHECK (area IN ('E', 'S', 'G')),
  kpi_code       text NOT NULL,
  label          text NOT NULL,
  valore_attuale numeric(15,4),
  valore_target  numeric(15,4),
  unita          text,
  anno           integer,
  note           text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (engagement_id, kpi_code, anno)
);
CREATE INDEX idx_kpi_valori_eng ON kpi_valori(engagement_id);

-- ─── scadenze ────────────────────────────────────────────────────────────────
CREATE TABLE scadenze (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  titolo        text NOT NULL,
  descrizione   text,
  data_scadenza date NOT NULL,
  stato         text NOT NULL DEFAULT 'pending'
                  CHECK (stato IN ('pending', 'completata', 'scaduta')),
  priorita      text NOT NULL DEFAULT 'media'
                  CHECK (priorita IN ('bassa', 'media', 'alta', 'critica')),
  notificata_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_scadenze_eng          ON scadenze(engagement_id);
CREATE INDEX idx_scadenze_data_stato   ON scadenze(data_scadenza, stato);

-- ─── azioni_giorno ───────────────────────────────────────────────────────────
CREATE TABLE azioni_giorno (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  engagement_id uuid REFERENCES engagements(id) ON DELETE CASCADE,
  titolo        text NOT NULL,
  completata    boolean NOT NULL DEFAULT false,
  data_azione   date NOT NULL DEFAULT CURRENT_DATE,
  priorita      text NOT NULL DEFAULT 'media'
                  CHECK (priorita IN ('bassa', 'media', 'alta')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_azioni_giorno_user_data ON azioni_giorno(user_id, data_azione);

-- ─── eventi_log ──────────────────────────────────────────────────────────────
CREATE TABLE eventi_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  engagement_id uuid REFERENCES engagements(id) ON DELETE SET NULL,
  tipo          text NOT NULL,
  titolo        text NOT NULL,
  descrizione   text,
  metadata      jsonb NOT NULL DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_eventi_log_user    ON eventi_log(user_id, created_at DESC);
CREATE INDEX idx_eventi_log_eng     ON eventi_log(engagement_id);

-- ─── milestone ───────────────────────────────────────────────────────────────
CREATE TABLE milestone (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id  uuid NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  titolo         text NOT NULL,
  descrizione    text,
  data_prevista  date,
  data_effettiva date,
  completata     boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_milestone_eng ON milestone(engagement_id);

-- ─── capitoli_bilancio ───────────────────────────────────────────────────────
CREATE TABLE capitoli_bilancio (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  codice        text NOT NULL,
  titolo        text NOT NULL,
  stato         text NOT NULL DEFAULT 'bozza'
                  CHECK (stato IN ('bozza', 'in_revisione', 'approvato')),
  contenuto     text,
  note          text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_capitoli_bilancio_eng ON capitoli_bilancio(engagement_id);

-- ─── fatturazioni ────────────────────────────────────────────────────────────
CREATE TABLE fatturazioni (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id   uuid NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  numero_fattura  text,
  data_fattura    date,
  importo_cent    integer NOT NULL CHECK (importo_cent >= 0), -- centesimi
  stato           text NOT NULL DEFAULT 'da_emettere'
                    CHECK (stato IN ('da_emettere', 'emessa', 'pagata', 'annullata')),
  note            text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_fatturazioni_eng ON fatturazioni(engagement_id);

-- ─── kpi_definizioni (catalog — 18th table) ──────────────────────────────────
CREATE TABLE kpi_definizioni (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE,
  label       text NOT NULL,
  area        text NOT NULL CHECK (area IN ('E', 'S', 'G')),
  unita       text,
  descrizione text,
  framework   text,  -- GRI, CSRD_ESRS, ENTRAMBI
  created_at  timestamptz NOT NULL DEFAULT now()
);
