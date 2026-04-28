-- ═══════════════════════════════════════════════════════════════════
-- SEED TEST BILANCIO — Engagement completo per test "Genera Bilancio"
-- ─────────────────────────────────────────────────────────────────────
-- Inserisce 1 cliente + 1 engagement + tutti i form_data necessari +
-- 6 IRO materiali, in modo da poter generare un bilancio completo.
--
-- IMPORTANTE: tutti i record sono associati all'utente con email
-- 'dilonardoa28@gmail.com' (recuperato via subquery su auth.users).
--
-- Tutti i record sono PREFISSATI con "TEST BILANCIO" in modo da
-- essere facilmente identificabili e cancellabili.
--
-- Per cancellare il seed:
--   DELETE FROM clienti WHERE ragione_sociale LIKE 'TEST BILANCIO%';
--   (cascade eliminerà engagement, form_data, iro_engagement)
--
-- Esecuzione:
--   psql ... -f seed_test_bilancio.sql
--   oppure incolla nel SQL Editor di Supabase Studio.
-- ═══════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_user_id   uuid;
  v_cliente_id uuid;
  v_engagement_id uuid;
BEGIN
  -- Utente proprietario del seed: gino@esgnexus.it (consulente)
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'gino@esgnexus.it' LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utente gino@esgnexus.it non trovato in auth.users';
  END IF;

  -- Cliente
  INSERT INTO clienti (
    user_id, ragione_sociale, piva, codice_fiscale, ateco, settore,
    dipendenti, fatturato_eur, nazione, sito_web, indirizzo, note
  ) VALUES (
    v_user_id,
    'TEST BILANCIO Acme S.p.A.',
    'IT99999999991',
    '99999999991',
    '25.50.00',
    'Manifatturiero — Carpenteria meccanica e lavorazioni metalliche',
    142,
    18500000,
    'IT',
    'https://test-acme.example',
    'Via dell''Industria 12, 24050 Calcinate (BG)',
    'Cliente di test per validazione end-to-end del Generatore Bilancio.'
  ) RETURNING id INTO v_cliente_id;

  -- Engagement
  INSERT INTO engagements (
    user_id, cliente_id, codice_progetto, anno_rendicontazione,
    standard, stato, progresso, data_avvio, data_fine_prevista, budget_contrattuale, note
  ) VALUES (
    v_user_id, v_cliente_id,
    'TEST-BIL-2025-ACME-001',
    2025,
    'ENTRAMBI',
    'in_corso',
    72,
    '2025-01-15',
    '2025-09-30',
    45000,
    'Engagement di test per il modulo Genera Bilancio — dataset realistico completo.'
  ) RETURNING id INTO v_engagement_id;

  -- ═════════════════════════════════════════════════════════════════
  -- FORM DATA — popolamento di tutti i form rilevanti per il bilancio
  -- ═════════════════════════════════════════════════════════════════

  -- PROC-01: Avvio progetto + anagrafica + modello business
  INSERT INTO form_data (engagement_id, form_code, proc_code, status, data) VALUES
  (v_engagement_id, '01B', 'PROC-01', 'completato', jsonb_build_object(
    'ragione_sociale', 'TEST BILANCIO Acme S.p.A.',
    'settore', 'Manifatturiero — Carpenteria meccanica',
    'codice_ateco', '25.50.00',
    'descrizione_attivita', 'Lavorazioni meccaniche di precisione per il settore automotive e industriale.'
  )),
  (v_engagement_id, '01C', 'PROC-01', 'completato', jsonb_build_object(
    'modello', 'Produzione contoterzista B2B di componentistica meccanica per i settori automotive (40%), oil&gas (25%), industriale (35%). Supply chain integrata verticalmente con 3 stabilimenti in Lombardia.',
    'sedi', 'Sede legale e produttiva: Calcinate (BG). Stabilimento secondario: Ghisalba (BG). Magazzino logistico: Treviglio (BG).',
    'sede_legale', 'Calcinate (BG)',
    'perimetro_geografico', 'Lombardia (Italia)',
    'fatturato', '€ 18.500.000',
    'catena_valore', 'Fornitori upstream: 87 fornitori italiani ed europei (acciai, materie prime, semilavorati). Clienti downstream: 24 clienti OEM, 60% Italia / 40% UE.'
  ));

  -- PROC-02: Materialità — metodo + stakeholder + survey
  INSERT INTO form_data (engagement_id, form_code, proc_code, status, data) VALUES
  (v_engagement_id, '02B', 'PROC-02', 'completato', jsonb_build_object(
    'mappa_stakeholder', 'Identificate 8 categorie: Dipendenti, Clienti OEM, Fornitori critici, Banche, Comunità locale, Pubblica Amministrazione, Sindacati, Associazioni di categoria.'
  )),
  (v_engagement_id, '02C', 'PROC-02', 'completato', jsonb_build_object(
    'metodologia', 'Doppia materialità ESRS: identificazione IRO partendo dal catalogo settoriale (CSRD ESRS), workshop interno con CdA, intervista 6 stakeholder esterni rilevanti, scoring 1-5 per impatto e 1-20 per finanziaria.'
  )),
  (v_engagement_id, '02D', 'PROC-02', 'completato', jsonb_build_object(
    'approccio', 'Approccio inside-out (impatto sull''ambiente e sulla società) e outside-in (impatti finanziari di rischi/opportunità ESG sull''organizzazione), come da ESRS 1.'
  )),
  (v_engagement_id, '02E', 'PROC-02', 'completato', jsonb_build_object(
    'risposte', '94 dipendenti su 142 hanno risposto al survey interno (66%). Aree più materiali: salute & sicurezza, formazione, gender pay equity.'
  )),
  (v_engagement_id, '02F', 'PROC-02', 'completato', jsonb_build_object(
    'risposte', '12 stakeholder esterni intervistati (4 clienti OEM, 3 fornitori critici, 2 banche, 1 sindacato, 2 PA). Tasso di risposta 80%.'
  ));

  -- PROC-04: Raccolta dati — perimetro + GHG + KPI E/S/G + riformulazioni
  INSERT INTO form_data (engagement_id, form_code, proc_code, status, data) VALUES
  (v_engagement_id, '04A', 'PROC-04', 'completato', jsonb_build_object(
    'perimetro', 'Stabilimento Calcinate + Ghisalba (95% del fatturato consolidato). Esclusa filiale logistica Treviglio (operatività < 5%, dati non materialmente significativi).',
    'periodo', '1 gennaio – 31 dicembre 2024',
    'perimetro_organizzativo', 'Controllo operativo (operational control) come da GHG Protocol. Consolidamento contabile.'
  )),
  (v_engagement_id, '04B', 'PROC-04', 'completato', jsonb_build_object(
    'scope1', jsonb_build_array(
      jsonb_build_object('id', 1, 'descrizione', 'Gas naturale riscaldamento', 'unita', 'm³', 'valore', 184500, 'fattore', 0.001984, 'fonte_fe', 'ISPRA 2024', 'emissioni', 366.05, 'stato', 'validato'),
      jsonb_build_object('id', 2, 'descrizione', 'Diesel autotrazione flotta', 'unita', 'litri', 'valore', 12400, 'fattore', 0.002676, 'fonte_fe', 'DEFRA 2024', 'emissioni', 33.18, 'stato', 'validato')
    ),
    'scope2_mb', jsonb_build_array(
      jsonb_build_object('id', 3, 'descrizione', 'Energia elettrica rete (market-based)', 'unita', 'kWh', 'valore', 2840000, 'fattore', 0.000425, 'fonte_fe', 'AIB Residual Mix 2024', 'emissioni', 1207.0, 'stato', 'validato')
    ),
    'scope2_lb', jsonb_build_array(
      jsonb_build_object('id', 4, 'descrizione', 'Energia elettrica rete (location-based)', 'unita', 'kWh', 'valore', 2840000, 'fattore', 0.000311, 'fonte_fe', 'ISPRA 2024 mix nazionale', 'emissioni', 883.24, 'stato', 'validato')
    ),
    'scope3', jsonb_build_array(
      jsonb_build_object('id', 5, 'descrizione', 'Beni e servizi acquistati (cat. 1)', 'unita', '€', 'valore', 8900000, 'fattore', 0.00005, 'fonte_fe', 'Stima EEIO', 'emissioni', 445.0, 'stato', 'da_validare'),
      jsonb_build_object('id', 6, 'descrizione', 'Trasporto merci upstream (cat. 4)', 'unita', 'tkm', 'valore', 320000, 'fattore', 0.00009, 'fonte_fe', 'DEFRA 2024', 'emissioni', 28.8, 'stato', 'validato')
    )
  )),
  (v_engagement_id, '04C', 'PROC-04', 'completato', jsonb_build_object(
    'kpi_data', jsonb_build_object(
      'e01', jsonb_build_object('N1', '11200', 'N', '10220', 'src', 'Bollette + contabilità energetica', 'note', 'Conversione kWh → GJ', 'val', true),
      'e02', jsonb_build_object('N1', '2950000', 'N', '2840000', 'src', 'Bollette elettriche', 'note', '', 'val', true),
      'e04', jsonb_build_object('N1', '8.5', 'N', '12.3', 'src', 'GO + autoproduzione FV', 'note', 'Aumento da impianto FV 350 kWp', 'val', true),
      'e11', jsonb_build_object('N1', '4280', 'N', '4150', 'src', 'Contatori acquedotto', 'note', '', 'val', true),
      'e14', jsonb_build_object('N1', '92500', 'N', '88300', 'src', 'Registro MUD', 'note', '', 'val', true),
      'e16', jsonb_build_object('N1', '78', 'N', '82', 'src', 'Registro MUD + bolle uscita', 'note', 'Quota a recupero materia', 'val', true)
    )
  )),
  (v_engagement_id, '04D', 'PROC-04', 'completato', jsonb_build_object(
    'kpi_data', jsonb_build_object(
      's01', jsonb_build_object('N1', '138', 'N', '142', 'src', 'Payroll Zucchetti', 'note', 'FTE al 31.12.2024', 'val', true),
      's02', jsonb_build_object('N1', '24', 'N', '26', 'src', 'Payroll', 'note', '', 'val', true),
      's03', jsonb_build_object('N1', '12', 'N', '15', 'src', 'HR organigramma', 'note', '', 'val', true),
      's04', jsonb_build_object('N1', '0', 'N', '20', 'src', 'CdA + C-suite', 'note', '1 donna in CFO', 'val', true),
      's10', jsonb_build_object('N1', '8.5', 'N', '6.2', 'src', 'Calcolo HR', 'note', 'Turnover totale', 'val', true),
      's14', jsonb_build_object('N1', '4', 'N', '2', 'src', 'Reg. infortuni INAIL', 'note', '', 'val', true),
      's15', jsonb_build_object('N1', '15.8', 'N', '7.9', 'src', 'Calcolo TF', 'note', 'TF = (n*1.000.000)/ore lavorate', 'val', true),
      's18', jsonb_build_object('N1', '0.42', 'N', '0.18', 'src', 'Calcolo TG', 'note', 'TG = (gg*1000)/ore lavorate', 'val', true),
      's22', jsonb_build_object('N1', '3850', 'N', '4720', 'src', 'Reg. formazione', 'note', '', 'val', true),
      's23', jsonb_build_object('N1', '27.9', 'N', '33.2', 'src', 'Calcolo', 'note', 'Ore/dipendente', 'val', true),
      's30', jsonb_build_object('N1', '7.2', 'N', '5.8', 'src', 'Payroll', 'note', 'Pay gap junior in % - donna riceve 5.8% in meno', 'val', true),
      's33', jsonb_build_object('N1', '92', 'N', '87', 'src', 'Acquisti gestionale', 'note', '', 'val', true),
      's34', jsonb_build_object('N1', '0', 'N', '24', 'src', 'Questionari ESG fornitori', 'note', 'Avviato programma valutazione 2024', 'val', true),
      's35', jsonb_build_object('N1', '0', 'N', '18', 'src', 'Audit fornitori', 'note', '', 'val', true)
    )
  )),
  (v_engagement_id, '04E', 'PROC-04', 'completato', jsonb_build_object(
    'kpi_data', jsonb_build_object(
      'g01', jsonb_build_object('N1', '5', 'N', '5', 'src', 'Visura camerale', 'note', '', 'val', true),
      'g02', jsonb_build_object('N1', '40', 'N', '40', 'src', 'CdA', 'note', '2 indipendenti su 5', 'val', true),
      'g03', jsonb_build_object('N1', '20', 'N', '20', 'src', 'CdA', 'note', '1 donna in CdA', 'val', true),
      'g04', jsonb_build_object('N1', '6', 'N', '8', 'src', 'Verbali CdA', 'note', '', 'val', true),
      'g08', jsonb_build_object('N1', '0', 'N', '2', 'src', 'OdV', 'note', 'Sistema attivato 2024', 'val', true),
      'g09', jsonb_build_object('N1', '0', 'N', '2', 'src', 'OdV', 'note', 'Entrambe chiuse senza azioni disciplinari', 'val', true),
      'g10', jsonb_build_object('N1', '0', 'N', '0', 'src', 'IT/DPO', 'note', 'Nessun data breach 2024', 'val', true),
      'g11', jsonb_build_object('N1', '1', 'N', '0', 'src', 'CFO', 'note', '2024 nessuna sanzione', 'val', true),
      'g13', jsonb_build_object('N1', '420000', 'N', '485000', 'src', 'Bilancio civilistico', 'note', 'IRES + IRAP', 'val', true),
      'g16', jsonb_build_object('N1', '45', 'N', '78', 'src', 'Reg. formazione', 'note', '78% formati su anticorruzione e Modello 231', 'val', true)
    ),
    'modello_231', 'Adottato dal 2018, aggiornato 2024 con sezione anticorruzione',
    'anticorruzione', 'Codice Etico + Procedura anticorruzione integrata nel Modello 231. Formazione obbligatoria annuale.',
    'tax', 'Approccio fiscale prudenziale, nessun ruling. Tax rate effettivo 26.2%. Imposte pagate solo in Italia.',
    'privacy', 'DPO esterno nominato. Registro trattamenti aggiornato. Zero data breach nel 2024.',
    'antitrust', 'Nessun procedimento o sanzione antitrust nei ultimi 5 anni.'
  )),
  (v_engagement_id, '04F', 'PROC-04', 'completato', jsonb_build_object(
    'riformulazioni', 'Nessuna riformulazione: prima rendicontazione di sostenibilità per l''organizzazione (esercizio 2024).'
  ));

  -- PROC-05: Piano ESG — vision + obiettivi + governance
  INSERT INTO form_data (engagement_id, form_code, proc_code, status, data) VALUES
  (v_engagement_id, '05A', 'PROC-05', 'completato', jsonb_build_object(
    'vision', 'Diventare entro il 2030 un punto di riferimento nazionale per la carpenteria meccanica sostenibile, con processi a basso impatto ambientale e una filiera certificata ESG.',
    'mission_esg', 'Integrare i criteri ESG in ogni fase del nostro processo produttivo, mettendo le persone, la sicurezza e il rispetto del territorio al centro delle decisioni di business.',
    'pilastri', jsonb_build_array(
      jsonb_build_object('key', 'E', 'label', 'Ambiente', 'impegno', 'Riduzione 30% Scope 1+2 al 2030 (baseline 2024). Energia rinnovabile autoprodotta al 50% al 2027.'),
      jsonb_build_object('key', 'S', 'label', 'Sociale', 'impegno', 'TF infortuni < 5 entro il 2027. 50% donne in posizioni manageriali al 2030. 40h formazione pro-capite.'),
      jsonb_build_object('key', 'G', 'label', 'Governance', 'impegno', '100% fornitori critici qualificati ESG al 2027. Disclosure CSRD piena dal 2025.')
    ),
    'orizzonte', '2025-2030 (orizzonte 6 anni con check intermedi 2027)',
    'sdg', 'SDG 3 (Salute), SDG 5 (Parità di genere), SDG 7 (Energia pulita), SDG 8 (Lavoro dignitoso), SDG 12 (Produzione responsabile), SDG 13 (Clima)',
    'policy', 'Policy ambientale (ISO 14001 in corso di certificazione), Policy diversity & inclusion, Codice Etico aggiornato 2024.'
  )),
  (v_engagement_id, '05B', 'PROC-05', 'completato', jsonb_build_object(
    'integrazione', 'Ogni pilastro tradotto in obiettivi operativi annuali assegnati ai responsabili di funzione (Operations per E, HR per S, CFO per G). KPI integrati nel reporting trimestrale al CdA.',
    'obiettivi_smart', '12 obiettivi SMART al 2027 (4 per ogni pilastro), tracciati con dashboard interna mensile. Esempi: -15% Scope 1+2 entro 2026, +20% donne in mgmt entro 2026.'
  )),
  (v_engagement_id, '05C', 'PROC-05', 'completato', jsonb_build_object(
    'target', 'Target 2026: TF<10, donne mgmt 25%, rinnovabile 25%, fornitori valutati 100% (top 30). Target 2030: net-zero Scope 1+2.'
  )),
  (v_engagement_id, '05E', 'PROC-05', 'completato', jsonb_build_object(
    'periodo_piano', '2025-2030 (revisione annuale CdA)',
    'budget', 'CapEx 2025-2027: € 1.2M (impianto FV 500 kWp aggiuntivo, sostituzione flotta, formazione). OpEx ESG annuale: € 180K.',
    'capex_opex', 'Mix 80% CapEx (efficientamento) / 20% OpEx (formazione, certificazioni, audit)'
  )),
  (v_engagement_id, '05F', 'PROC-05', 'completato', jsonb_build_object(
    'governance_piano', 'Il CdA approva annualmente il Piano ESG e ne verifica l''avanzamento trimestralmente sulla base del reporting del Sustainability Manager.',
    'delega', 'Sustainability Manager (riporto diretto al CEO) coordina le funzioni: Operations (Scope 1/2), HR (KPI sociali), CFO (governance e finanza ESG). Audit interno del Modello 231.',
    'governance_report', 'Bilancio approvato dal CdA prima della pubblicazione (entro 6 mesi da chiusura esercizio). Verifica limited assurance da parte di soggetto terzo indipendente.'
  ));

  -- PROC-06: Bilancio (assurance)
  INSERT INTO form_data (engagement_id, form_code, proc_code, status, data) VALUES
  (v_engagement_id, '06A', 'PROC-06', 'in_corso', jsonb_build_object(
    'assurance', 'Limited assurance da parte di KPMG S.p.A. — engagement firmato 15.06.2025. Output atteso: dichiarazione di conformità ISAE 3000 (revised).'
  ));

  -- ═════════════════════════════════════════════════════════════════
  -- IRO ENGAGEMENT — 6 IRO materiali rappresentativi
  -- ═════════════════════════════════════════════════════════════════
  INSERT INTO iro_engagement (
    engagement_id, codice, tema, area, tipo,
    materialita_impatto, materialita_finanziaria, incluso, note
  ) VALUES
  (v_engagement_id, 'E1.1', 'Emissioni di gas serra (Scope 1+2)', 'E', 'Impatto', 4.2, 14.0, true, 'Settore energy-intensive, emissioni Scope 1+2 rilevanti'),
  (v_engagement_id, 'E5.1', 'Gestione rifiuti e materia prima seconda', 'E', 'Impatto', 3.8, 10.5, true, 'Carpenteria genera scarti metallici riciclabili'),
  (v_engagement_id, 'E1.2', 'Transizione energetica e dipendenza fossili', 'E', 'Rischio', 3.5, 16.0, true, 'Volatilità prezzo gas + ETS'),
  (v_engagement_id, 'S1.1', 'Salute e sicurezza dei lavoratori', 'S', 'Impatto', 4.8, 12.0, true, 'Lavorazioni meccaniche con rischi infortuni elevati'),
  (v_engagement_id, 'S1.2', 'Formazione e sviluppo professionale', 'S', 'Opportunità', 3.5, 9.5, true, 'Skill gap, retention talenti'),
  (v_engagement_id, 'G1.1', 'Anticorruzione e integrità etica', 'G', 'Rischio', 3.2, 11.0, true, 'B2B con PA e settore oil&gas, esposizione 231');

  RAISE NOTICE 'Seed completato. engagement_id = %, cliente_id = %', v_engagement_id, v_cliente_id;
END $$;
