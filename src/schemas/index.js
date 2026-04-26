import { z } from 'zod';

// ISO date string YYYY-MM-DD; accepts empty string for "not set"
const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data non valida (formato YYYY-MM-DD)');

const dateOptional = dateString.optional().or(z.literal(''));

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
  sito_web: z.string().url().optional().or(z.literal('')),
  indirizzo: z.string().optional(),
  note: z.string().optional(),
});

export const engagementSchema = z.object({
  cliente_id: z.string().uuid('Cliente obbligatorio'),
  anno_rendicontazione: z.coerce.number().int().min(2020).max(2035),
  standard: z.enum(['GRI', 'CSRD_ESRS', 'ENTRAMBI']),
  data_avvio: dateOptional,
  data_fine_prevista: dateOptional,
  data_fine_effettiva: dateOptional,
  budget_contrattuale: z.coerce.number().int().nonnegative().optional(),
  note: z.string().optional(),
});

export const rischioSchema = z.object({
  descrizione: z.string().min(1),
  categoria: z.string().optional(),
  probabilita: z.coerce.number().int().min(1).max(5),
  impatto: z.coerce.number().int().min(1).max(5),
});

export const contattoClienteSchema = z.object({
  cliente_id: z.string().uuid(),
  nome: z.string().min(1, 'Nome obbligatorio'),
  cognome: z.string().min(1, 'Cognome obbligatorio'),
  ruolo: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  telefono: z.string().optional(),
});

export const scadenzaSchema = z.object({
  engagement_id: z.string().uuid(),
  titolo: z.string().min(1, 'Titolo obbligatorio'),
  descrizione: z.string().optional(),
  data_scadenza: dateString,
  priorita: z.enum(['bassa', 'media', 'alta', 'critica']).default('media'),
});

export const ghgVoceSchema = z.object({
  engagement_id: z.string().uuid(),
  scope: z.coerce
    .number()
    .int()
    .refine((v) => [1, 2, 3].includes(v), 'Scope deve essere 1, 2 o 3'),
  categoria: z.string().min(1, 'Categoria obbligatoria'),
  descrizione: z.string().optional(),
  quantita: z.coerce.number().nonnegative().optional(),
  unita: z.string().optional(),
  fattore_emissione: z.coerce.number().nonnegative().optional(),
});

export const kpiValoreSchema = z.object({
  engagement_id: z.string().uuid(),
  kpi_code: z.string().min(1),
  label: z.string().min(1, 'Label obbligatoria'),
  area: z.enum(['E', 'S', 'G']),
  valore_attuale: z.coerce.number().optional(),
  valore_target: z.coerce.number().optional(),
  unita: z.string().optional(),
  anno: z.coerce.number().int().optional(),
});
