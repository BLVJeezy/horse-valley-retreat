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
      availability_blocks: {
        Row: {
          created_at: string
          end_date: string
          guest_name: string | null
          id: string
          source: string
          start_date: string
          status: string
        }
        Insert: {
          created_at?: string
          end_date: string
          guest_name?: string | null
          id?: string
          source?: string
          start_date: string
          status?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          guest_name?: string | null
          id?: string
          source?: string
          start_date?: string
          status?: string
        }
        Relationships: []
      }
      booking_requests: {
        Row: {
          arrival_time: string | null
          availability_block_id: string | null
          booking_for: string | null
          business_trip: boolean | null
          country: string | null
          created_at: string
          end_date: string
          first_name: string | null
          guest_email: string
          guest_name: string
          guest_phone: string | null
          guests: number
          house_rules_accepted: boolean
          id: string
          insurance_added: boolean
          insurance_amount: number | null
          last_name: string | null
          message: string | null
          payment_method: string | null
          phone_country_code: string | null
          property_slug: string | null
          special_requests: string | null
          start_date: string
          status: string
          total_amount: number | null
          updated_at: string
          wants_car_rental: boolean
          wants_transfer: boolean
        }
        Insert: {
          arrival_time?: string | null
          availability_block_id?: string | null
          booking_for?: string | null
          business_trip?: boolean | null
          country?: string | null
          created_at?: string
          end_date: string
          first_name?: string | null
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          guests: number
          house_rules_accepted?: boolean
          id?: string
          insurance_added?: boolean
          insurance_amount?: number | null
          last_name?: string | null
          message?: string | null
          payment_method?: string | null
          phone_country_code?: string | null
          property_slug?: string | null
          special_requests?: string | null
          start_date: string
          status?: string
          total_amount?: number | null
          updated_at?: string
          wants_car_rental?: boolean
          wants_transfer?: boolean
        }
        Update: {
          arrival_time?: string | null
          availability_block_id?: string | null
          booking_for?: string | null
          business_trip?: boolean | null
          country?: string | null
          created_at?: string
          end_date?: string
          first_name?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          guests?: number
          house_rules_accepted?: boolean
          id?: string
          insurance_added?: boolean
          insurance_amount?: number | null
          last_name?: string | null
          message?: string | null
          payment_method?: string | null
          phone_country_code?: string | null
          property_slug?: string | null
          special_requests?: string | null
          start_date?: string
          status?: string
          total_amount?: number | null
          updated_at?: string
          wants_car_rental?: boolean
          wants_transfer?: boolean
        }
        Relationships: []
      }
      ical_feeds: {
        Row: {
          created_at: string
          ical_url: string
          id: string
          is_active: boolean
          label: string
          last_sync_error: string | null
          last_sync_status: string | null
          last_synced_at: string | null
          source: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ical_url: string
          id?: string
          is_active?: boolean
          label: string
          last_sync_error?: string | null
          last_sync_status?: string | null
          last_synced_at?: string | null
          source: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ical_url?: string
          id?: string
          is_active?: boolean
          label?: string
          last_sync_error?: string | null
          last_sync_status?: string | null
          last_synced_at?: string | null
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          is_live: boolean
          mirror_photos: boolean
          name: string
          price_per_night: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_live?: boolean
          mirror_photos?: boolean
          name: string
          price_per_night?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_live?: boolean
          mirror_photos?: boolean
          name?: string
          price_per_night?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      seasonal_rates: {
        Row: {
          created_at: string
          end_date: string
          id: string
          min_nights: number | null
          name: string
          price_per_night: number
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          min_nights?: number | null
          name: string
          price_per_night: number
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          min_nights?: number | null
          name?: string
          price_per_night?: number
          start_date?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          base_price_per_night: number
          cleaning_fee: number
          currency: string
          default_min_nights: number
          id: number
          security_deposit: number
          tourist_tax_per_person_per_night: number
          updated_at: string
        }
        Insert: {
          base_price_per_night?: number
          cleaning_fee?: number
          currency?: string
          default_min_nights?: number
          id?: number
          security_deposit?: number
          tourist_tax_per_person_per_night?: number
          updated_at?: string
        }
        Update: {
          base_price_per_night?: number
          cleaning_fee?: number
          currency?: string
          default_min_nights?: number
          id?: number
          security_deposit?: number
          tourist_tax_per_person_per_night?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
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
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
