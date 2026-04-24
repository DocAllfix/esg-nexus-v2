import { z } from 'zod';

export const clienteSchema = z.object({
  ragione_sociale: z.string().min(1, 'Ragione sociale obbligatoria'),
  piva: z
    .string()
    .regex(/^[0-9]{11,16}$/, 'P.IVA non valida')
    .optional()
    .or(z.literal('')),
  codice_fiscale: z.string().max(16).optional().or(z.literal('')),
  ateco: z.string().max(10).optional(),
  settore: z.string().optional(),
  dipendenti: z.coerce.number().int().positive().optional(),
  fatturato_eur: z.coerce.number().int().nonnegative().optional(),
  nazione: z.string().length(2).default('IT'),
});

export const engagementSchema = z.object({
  cliente_id: z.string().uuid('Cliente obbligatorio'),
  anno_rendicontazione: z.coerce.number().int().min(2020).max(2035),
  standard: z.enum(['GRI', 'CSRD_ESRS', 'ENTRAMBI']),
  data_avvio: z.string().optional(),
  data_fine_prevista: z.string().optional(),
  budget_contrattuale: z.coerce.number().int().nonnegative().optional(),
});

export const rischioSchema = z.object({
  descrizione: z.string().min(1),
  categoria: z.string().optional(),
  probabilita: z.coerce.number().int().min(1).max(5),
  impatto: z.coerce.number().int().min(1).max(5),
});

export const contattoClienteSchema = z.object({
  cliente_id: z.string().uuid(),
  nome: z.string().min(1),
  ruolo: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  telefono: z.string().optional(),
});

export const scadenzaSchema = z.object({
  engagement_id: z.string().uuid(),
  descrizione: z.string().min(1),
  data_scadenza: z.string(),
  priorita: z.enum(['bassa', 'media', 'alta', 'critica']).default('media'),
});

export const ghgVoceSchema = z.object({
  engagement_id: z.string().uuid(),
  scope: z.enum(['1', '2', '3']),
  categoria: z.string().optional(),
  descrizione: z.string().min(1),
  quantita: z.coerce.number().nonnegative(),
  unita: z.string().min(1),
  fattore_emissione: z.coerce.number().nonnegative(),
});

export const kpiValoreSchema = z.object({
  engagement_id: z.string().uuid(),
  kpi_code: z.string().min(1),
  area: z.enum(['E', 'S', 'G']),
  valore_attuale: z.coerce.number().optional(),
  valore_target: z.coerce.number().optional(),
  unita: z.string().optional(),
  anno: z.coerce.number().int().optional(),
});
