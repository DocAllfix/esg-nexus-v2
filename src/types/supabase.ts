export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      azioni_giorno: {
        Row: {
          completata: boolean
          created_at: string
          data_azione: string
          engagement_id: string | null
          id: string
          priorita: string
          titolo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completata?: boolean
          created_at?: string
          data_azione?: string
          engagement_id?: string | null
          id?: string
          priorita?: string
          titolo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completata?: boolean
          created_at?: string
          data_azione?: string
          engagement_id?: string | null
          id?: string
          priorita?: string
          titolo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "azioni_giorno_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "azioni_giorno_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      capitoli_bilancio: {
        Row: {
          codice: string
          contenuto: string | null
          created_at: string
          engagement_id: string
          id: string
          note: string | null
          stato: string
          titolo: string
          updated_at: string
        }
        Insert: {
          codice: string
          contenuto?: string | null
          created_at?: string
          engagement_id: string
          id?: string
          note?: string | null
          stato?: string
          titolo: string
          updated_at?: string
        }
        Update: {
          codice?: string
          contenuto?: string | null
          created_at?: string
          engagement_id?: string
          id?: string
          note?: string | null
          stato?: string
          titolo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "capitoli_bilancio_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capitoli_bilancio_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogo_iro: {
        Row: {
          area: string
          categoria: string | null
          codice: string
          created_at: string
          descrizione: string | null
          id: string
          prospettiva: string | null
          score_finanziario: number | null
          score_impatto: number | null
          tema: string
          tipo: string
        }
        Insert: {
          area: string
          categoria?: string | null
          codice: string
          created_at?: string
          descrizione?: string | null
          id?: string
          prospettiva?: string | null
          score_finanziario?: number | null
          score_impatto?: number | null
          tema: string
          tipo: string
        }
        Update: {
          area?: string
          categoria?: string | null
          codice?: string
          created_at?: string
          descrizione?: string | null
          id?: string
          prospettiva?: string | null
          score_finanziario?: number | null
          score_impatto?: number | null
          tema?: string
          tipo?: string
        }
        Relationships: []
      }
      clienti: {
        Row: {
          ateco: string | null
          codice_fiscale: string | null
          created_at: string
          dipendenti: number | null
          fatturato_eur: number | null
          id: string
          indirizzo: string | null
          nazione: string
          note: string | null
          piva: string | null
          ragione_sociale: string
          settore: string | null
          sito_web: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ateco?: string | null
          codice_fiscale?: string | null
          created_at?: string
          dipendenti?: number | null
          fatturato_eur?: number | null
          id?: string
          indirizzo?: string | null
          nazione?: string
          note?: string | null
          piva?: string | null
          ragione_sociale: string
          settore?: string | null
          sito_web?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ateco?: string | null
          codice_fiscale?: string | null
          created_at?: string
          dipendenti?: number | null
          fatturato_eur?: number | null
          id?: string
          indirizzo?: string | null
          nazione?: string
          note?: string | null
          piva?: string | null
          ragione_sociale?: string
          settore?: string | null
          sito_web?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contatti_cliente: {
        Row: {
          cliente_id: string
          cognome: string
          created_at: string
          email: string | null
          id: string
          nome: string
          ruolo: string | null
          telefono: string | null
        }
        Insert: {
          cliente_id: string
          cognome: string
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          ruolo?: string | null
          telefono?: string | null
        }
        Update: {
          cliente_id?: string
          cognome?: string
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          ruolo?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contatti_cliente_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clienti"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_fasi: {
        Row: {
          created_at: string
          engagement_id: string
          id: string
          label: string
          proc_code: string
          progresso: number
          stato: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          engagement_id: string
          id?: string
          label: string
          proc_code: string
          progresso?: number
          stato?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          engagement_id?: string
          id?: string
          label?: string
          proc_code?: string
          progresso?: number
          stato?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_fasi_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_fasi_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      engagements: {
        Row: {
          anno_rendicontazione: number
          budget_contrattuale: number | null
          cliente_id: string
          codice_progetto: string | null
          created_at: string
          data_avvio: string | null
          data_fine_effettiva: string | null
          data_fine_prevista: string | null
          id: string
          note: string | null
          progresso: number
          standard: string
          stato: string
          updated_at: string
          user_id: string
        }
        Insert: {
          anno_rendicontazione: number
          budget_contrattuale?: number | null
          cliente_id: string
          codice_progetto?: string | null
          created_at?: string
          data_avvio?: string | null
          data_fine_effettiva?: string | null
          data_fine_prevista?: string | null
          id?: string
          note?: string | null
          progresso?: number
          standard: string
          stato?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          anno_rendicontazione?: number
          budget_contrattuale?: number | null
          cliente_id?: string
          codice_progetto?: string | null
          created_at?: string
          data_avvio?: string | null
          data_fine_effettiva?: string | null
          data_fine_prevista?: string | null
          id?: string
          note?: string | null
          progresso?: number
          standard?: string
          stato?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagements_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clienti"
            referencedColumns: ["id"]
          },
        ]
      }
      eventi_log: {
        Row: {
          created_at: string
          descrizione: string | null
          engagement_id: string | null
          id: string
          metadata: Json
          tipo: string
          titolo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descrizione?: string | null
          engagement_id?: string | null
          id?: string
          metadata?: Json
          tipo: string
          titolo: string
          user_id: string
        }
        Update: {
          created_at?: string
          descrizione?: string | null
          engagement_id?: string | null
          id?: string
          metadata?: Json
          tipo?: string
          titolo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventi_log_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventi_log_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      fatturazioni: {
        Row: {
          created_at: string
          data_fattura: string | null
          engagement_id: string
          id: string
          importo_cent: number
          note: string | null
          numero_fattura: string | null
          stato: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fattura?: string | null
          engagement_id: string
          id?: string
          importo_cent: number
          note?: string | null
          numero_fattura?: string | null
          stato?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fattura?: string | null
          engagement_id?: string
          id?: string
          importo_cent?: number
          note?: string | null
          numero_fattura?: string | null
          stato?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fatturazioni_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fatturazioni_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      form_data: {
        Row: {
          created_at: string
          data: Json
          engagement_id: string
          form_code: string
          id: string
          proc_code: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          engagement_id: string
          form_code: string
          id?: string
          proc_code: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          engagement_id?: string
          form_code?: string
          id?: string
          proc_code?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_data_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_data_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      ghg_voci: {
        Row: {
          categoria: string
          co2e_tonnellate: number | null
          created_at: string
          descrizione: string | null
          engagement_id: string
          fattore_emissione: number | null
          fonte_dato: string | null
          id: string
          quantita: number | null
          scope: number
          unita: string | null
          updated_at: string
        }
        Insert: {
          categoria: string
          co2e_tonnellate?: number | null
          created_at?: string
          descrizione?: string | null
          engagement_id: string
          fattore_emissione?: number | null
          fonte_dato?: string | null
          id?: string
          quantita?: number | null
          scope: number
          unita?: string | null
          updated_at?: string
        }
        Update: {
          categoria?: string
          co2e_tonnellate?: number | null
          created_at?: string
          descrizione?: string | null
          engagement_id?: string
          fattore_emissione?: number | null
          fonte_dato?: string | null
          id?: string
          quantita?: number | null
          scope?: number
          unita?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ghg_voci_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ghg_voci_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      iro_engagement: {
        Row: {
          area: string
          catalogo_iro_id: string | null
          codice: string
          created_at: string
          engagement_id: string
          id: string
          incluso: boolean
          materialita_finanziaria: number | null
          materialita_impatto: number | null
          note: string | null
          tema: string
          tipo: string
          updated_at: string
        }
        Insert: {
          area: string
          catalogo_iro_id?: string | null
          codice: string
          created_at?: string
          engagement_id: string
          id?: string
          incluso?: boolean
          materialita_finanziaria?: number | null
          materialita_impatto?: number | null
          note?: string | null
          tema: string
          tipo: string
          updated_at?: string
        }
        Update: {
          area?: string
          catalogo_iro_id?: string | null
          codice?: string
          created_at?: string
          engagement_id?: string
          id?: string
          incluso?: boolean
          materialita_finanziaria?: number | null
          materialita_impatto?: number | null
          note?: string | null
          tema?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iro_engagement_catalogo_iro_id_fkey"
            columns: ["catalogo_iro_id"]
            isOneToOne: false
            referencedRelation: "catalogo_iro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iro_engagement_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iro_engagement_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_definizioni: {
        Row: {
          area: string
          code: string
          created_at: string
          descrizione: string | null
          framework: string | null
          id: string
          label: string
          unita: string | null
        }
        Insert: {
          area: string
          code: string
          created_at?: string
          descrizione?: string | null
          framework?: string | null
          id?: string
          label: string
          unita?: string | null
        }
        Update: {
          area?: string
          code?: string
          created_at?: string
          descrizione?: string | null
          framework?: string | null
          id?: string
          label?: string
          unita?: string | null
        }
        Relationships: []
      }
      kpi_valori: {
        Row: {
          anno: number | null
          area: string
          created_at: string
          engagement_id: string
          id: string
          kpi_code: string
          label: string
          note: string | null
          unita: string | null
          updated_at: string
          valore_attuale: number | null
          valore_target: number | null
        }
        Insert: {
          anno?: number | null
          area: string
          created_at?: string
          engagement_id: string
          id?: string
          kpi_code: string
          label: string
          note?: string | null
          unita?: string | null
          updated_at?: string
          valore_attuale?: number | null
          valore_target?: number | null
        }
        Update: {
          anno?: number | null
          area?: string
          created_at?: string
          engagement_id?: string
          id?: string
          kpi_code?: string
          label?: string
          note?: string | null
          unita?: string | null
          updated_at?: string
          valore_attuale?: number | null
          valore_target?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_valori_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_valori_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone: {
        Row: {
          completata: boolean
          created_at: string
          data_effettiva: string | null
          data_prevista: string | null
          descrizione: string | null
          engagement_id: string
          id: string
          titolo: string
          updated_at: string
        }
        Insert: {
          completata?: boolean
          created_at?: string
          data_effettiva?: string | null
          data_prevista?: string | null
          descrizione?: string | null
          engagement_id: string
          id?: string
          titolo: string
          updated_at?: string
        }
        Update: {
          completata?: boolean
          created_at?: string
          data_effettiva?: string | null
          data_prevista?: string | null
          descrizione?: string | null
          engagement_id?: string
          id?: string
          titolo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestone_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestone_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      rischi: {
        Row: {
          categoria: string | null
          codice: string | null
          created_at: string
          descrizione: string
          engagement_id: string | null
          id: string
          impatto: number
          note: string | null
          probabilita: number
          score: number | null
          stato: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria?: string | null
          codice?: string | null
          created_at?: string
          descrizione: string
          engagement_id?: string | null
          id?: string
          impatto: number
          note?: string | null
          probabilita: number
          score?: number | null
          stato?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria?: string | null
          codice?: string | null
          created_at?: string
          descrizione?: string
          engagement_id?: string | null
          id?: string
          impatto?: number
          note?: string | null
          probabilita?: number
          score?: number | null
          stato?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rischi_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rischi_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      scadenze: {
        Row: {
          created_at: string
          data_scadenza: string
          descrizione: string | null
          engagement_id: string
          id: string
          notificata_at: string | null
          priorita: string
          stato: string
          titolo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_scadenza: string
          descrizione?: string | null
          engagement_id: string
          id?: string
          notificata_at?: string | null
          priorita?: string
          stato?: string
          titolo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_scadenza?: string
          descrizione?: string | null
          engagement_id?: string
          id?: string
          notificata_at?: string | null
          priorita?: string
          stato?: string
          titolo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scadenze_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scadenze_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      users_profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          studio_nome: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          studio_nome?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          studio_nome?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_engagement_summary: {
        Row: {
          anno_rendicontazione: number | null
          budget_contrattuale: number | null
          cliente_nome: string | null
          cliente_settore: string | null
          codice_progetto: string | null
          data_avvio: string | null
          data_fine_prevista: string | null
          form_completati: number | null
          form_totali: number | null
          id: string | null
          progresso: number | null
          scadenze_imminenti: number | null
          standard: string | null
          stato: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_fatturato_annuo: {
        Row: {
          anno: number | null
          fatturato_eur: number | null
          num_engagement: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_ghg_totali: {
        Row: {
          engagement_id: string | null
          num_voci: number | null
          scope: number | null
          totale_co2e_t: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ghg_voci_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ghg_voci_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      v_kpi_dashboard: {
        Row: {
          area: string | null
          engagement_id: string | null
          kpi_compilati: number | null
          kpi_target_raggiunti: number | null
          num_kpi: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_valori_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_valori_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "v_engagement_summary"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
