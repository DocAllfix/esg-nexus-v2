-- ═══════════════════════════════════════════════════════════════════
-- ESG NEXUS — Seed: catalogo_iro (24 entries) + kpi_definizioni
-- ═══════════════════════════════════════════════════════════════════

-- ─── catalogo_iro — 24 IRO entries ───────────────────────────────────────────
INSERT INTO catalogo_iro (codice, tema, area, tipo, prospettiva, descrizione, score_impatto, score_finanziario, categoria) VALUES

-- ENVIRONMENTAL
('E-CC-01', 'Cambiamenti climatici', 'E', 'Rischio',     'Finanziaria',  'Rischi fisici e di transizione legati al cambiamento climatico',          4.2, 4.5, 'Clima'),
('E-CC-02', 'Cambiamenti climatici', 'E', 'Opportunità', 'Entrambe',     'Opportunità da economia a basse emissioni e prodotti green',               3.8, 4.0, 'Clima'),
('E-CC-03', 'Cambiamenti climatici', 'E', 'Impatto',     'Impatto',      'Emissioni di gas serra e contributo al riscaldamento globale',             4.5, 3.5, 'Clima'),
('E-EN-01', 'Energia',              'E', 'Impatto',     'Entrambe',     'Consumo di energia da fonti non rinnovabili',                             3.5, 3.8, 'Energia'),
('E-EN-02', 'Energia',              'E', 'Opportunità', 'Finanziaria',  'Efficienza energetica e riduzione costi operativi',                       3.2, 4.2, 'Energia'),
('E-WA-01', 'Acqua',                'E', 'Impatto',     'Impatto',      'Prelievo e consumo idrico in zone di stress idrico',                      3.8, 3.0, 'Acqua'),
('E-BD-01', 'Biodiversità',         'E', 'Impatto',     'Impatto',      'Perdita di biodiversità e degrado degli ecosistemi',                      4.0, 2.8, 'Biodiversità'),
('E-CE-01', 'Economia circolare',   'E', 'Opportunità', 'Entrambe',     'Transizione verso modelli di produzione e consumo circolari',             3.0, 3.5, 'Circolarità'),
('E-PO-01', 'Inquinamento',         'E', 'Impatto',     'Entrambe',     'Emissioni inquinanti in aria, acqua e suolo',                             3.5, 3.2, 'Inquinamento'),

-- SOCIAL
('S-WC-01', 'Condizioni di lavoro', 'S', 'Impatto',     'Entrambe',     'Salute, sicurezza e benessere dei lavoratori',                           4.0, 3.5, 'Lavoro'),
('S-WC-02', 'Condizioni di lavoro', 'S', 'Rischio',     'Finanziaria',  'Rischi legali e reputazionali da violazioni dei diritti lavorativi',     3.5, 4.0, 'Lavoro'),
('S-EQ-01', 'Parità di genere',     'S', 'Impatto',     'Entrambe',     'Divario retributivo e di rappresentanza di genere',                      3.2, 3.0, 'Diversità'),
('S-DI-01', 'Diversità e inclusione','S','Opportunità', 'Entrambe',     'Benefici della forza lavoro diversificata per innovazione e performance', 3.0, 3.8, 'Diversità'),
('S-CH-01', 'Comunità locali',      'S', 'Impatto',     'Impatto',      'Impatti delle operazioni sulle comunità locali',                          3.5, 2.5, 'Comunità'),
('S-SC-01', 'Catena di fornitura',  'S', 'Rischio',     'Entrambe',     'Rischi sociali e ambientali nella catena di fornitura',                   4.0, 4.2, 'Fornitura'),
('S-CS-01', 'Consumatori',          'S', 'Rischio',     'Finanziaria',  'Protezione dei consumatori, privacy e sicurezza dei prodotti',            3.8, 4.0, 'Consumatori'),

-- GOVERNANCE
('G-BE-01', 'Etica aziendale',      'G', 'Rischio',     'Entrambe',     'Rischi di corruzione, frode e pratiche anticoncorrenziali',               4.5, 4.5, 'Etica'),
('G-TR-01', 'Trasparenza',          'G', 'Opportunità', 'Finanziaria',  'Reporting ESG come leva per accesso a capitale e fiducia degli stakeholder',3.0,4.0,'Reporting'),
('G-CG-01', 'Corporate governance', 'G', 'Rischio',     'Finanziaria',  'Carenze nel sistema di controllo interno e supervisione del CdA',        3.5, 4.2, 'Governance'),
('G-TC-01', 'Compliance normativa', 'G', 'Rischio',     'Finanziaria',  'Rischi di non conformità a CSRD, ESRS, tassonomia UE',                   4.2, 4.8, 'Compliance'),
('G-DT-01', 'Dati e cybersecurity', 'G', 'Rischio',     'Finanziaria',  'Violazioni di dati, cyberattacchi e perdita di informazioni riservate',  4.0, 4.5, 'Tecnologia'),
('G-IN-01', 'Innovazione',          'G', 'Opportunità', 'Finanziaria',  'Innovazione tecnologica per sostenibilità e creazione di valore',         3.2, 3.8, 'Innovazione'),
('G-ST-01', 'Stakeholder',          'G', 'Impatto',     'Entrambe',     'Gestione delle relazioni con stakeholder chiave',                         3.0, 3.2, 'Stakeholder'),
('G-RM-01', 'Risk management',      'G', 'Rischio',     'Finanziaria',  'Inadeguatezza dei sistemi di identificazione e gestione dei rischi ESG', 4.0, 4.3, 'Rischi');

-- ─── kpi_definizioni — base KPI library ──────────────────────────────────────
INSERT INTO kpi_definizioni (code, label, area, unita, descrizione, framework) VALUES
-- Environmental
('E-GHG-S1',   'Emissioni GHG Scope 1',          'E', 'tCO2e',   'Emissioni dirette da fonti di proprietà o controllate',           'GRI 305'),
('E-GHG-S2',   'Emissioni GHG Scope 2',          'E', 'tCO2e',   'Emissioni indirette da energia acquistata',                       'GRI 305'),
('E-GHG-S3',   'Emissioni GHG Scope 3',          'E', 'tCO2e',   'Altre emissioni indirette nella catena del valore',               'GRI 305'),
('E-EN-TOT',   'Consumo energetico totale',       'E', 'MWh',     'Energia totale consumata (rinnovabile + non rinnovabile)',         'GRI 302'),
('E-EN-REN',   'Quota energia rinnovabile',       'E', '%',       'Percentuale di energia da fonti rinnovabili',                     'GRI 302'),
('E-WA-TOT',   'Prelievo idrico totale',          'E', 'm³',      'Volume totale di acqua prelevata da tutte le fonti',              'GRI 303'),
('E-WA-RIC',   'Acqua riciclata/riutilizzata',    'E', '%',       'Percentuale di acqua riciclata sul totale prelevato',             'GRI 303'),
('E-WS-TOT',   'Rifiuti totali prodotti',         'E', 't',       'Peso totale dei rifiuti generati',                               'GRI 306'),
('E-WS-REC',   'Tasso di riciclo rifiuti',        'E', '%',       'Percentuale di rifiuti avviati a riciclo/recupero',               'GRI 306'),
-- Social
('S-EMP-TOT',  'Numero dipendenti totale',        'S', 'n',       'Numero totale di dipendenti (FTE)',                               'GRI 2'),
('S-EMP-F',    'Quota dipendenti donne',          'S', '%',       'Percentuale di dipendenti di genere femminile',                   'GRI 405'),
('S-MGT-F',    'Donne in posizioni manageriali',  'S', '%',       'Percentuale di donne in ruoli di management',                    'GRI 405'),
('S-INF-RATE', 'Tasso infortuni sul lavoro',      'S', 'per 1M h','Numero infortuni per milione di ore lavorate (TRIR)',             'GRI 403'),
('S-TRAIN-H',  'Ore formazione pro capite',       'S', 'h/FTE',   'Ore medie di formazione per dipendente per anno',                'GRI 404'),
('S-TURN',     'Tasso di turnover volontario',    'S', '%',       'Percentuale di dimissioni volontarie sul totale dipendenti',      'GRI 401'),
-- Governance
('G-BD-F',     'Donne nel CdA',                  'G', '%',       'Percentuale di donne nel Consiglio di Amministrazione',          'GRI 405'),
('G-BD-IND',   'Amministratori indipendenti',     'G', '%',       'Percentuale di consiglieri indipendenti nel CdA',                'GRI 2'),
('G-ETH-TR',   'Ore formazione anticorruzione',   'G', 'h/FTE',   'Ore medie di formazione su etica/anticorruzione per dipendente', 'GRI 205'),
('G-CSRD-REP', 'Conformità CSRD',                'G', 'bool',    'Rendicontazione conforme a CSRD/ESRS completata',                'CSRD');
