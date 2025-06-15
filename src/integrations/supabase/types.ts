export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      affiliate_clicks: {
        Row: {
          affiliate_id: string
          clicked_at: string
          id: number
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          affiliate_id: string
          clicked_at?: string
          id?: number
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          affiliate_id?: string
          clicked_at?: string
          id?: number
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          id: string
          processed_at: string | null
          requested_at: string
          status: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          id?: string
          processed_at?: string | null
          requested_at?: string
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          id?: string
          processed_at?: string | null
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          commission_amount: number
          created_at: string
          id: string
          order_id: string
          referred_user_id: string
          status: string
        }
        Insert: {
          affiliate_id: string
          commission_amount: number
          created_at?: string
          id?: string
          order_id: string
          referred_user_id: string
          status?: string
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          created_at?: string
          id?: string
          order_id?: string
          referred_user_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_referrals_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          affiliate_code: string
          affiliate_discount_type:
            | Database["public"]["Enums"]["discount_type"]
            | null
          affiliate_discount_value: number | null
          commission_rate: number
          created_at: string
          has_discount: boolean
          id: string
          payment_info: Json | null
          personal_info: Json | null
          promotion_methods: string | null
          social_media_urls: Json | null
          status: string
          tier: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          affiliate_discount_type?:
            | Database["public"]["Enums"]["discount_type"]
            | null
          affiliate_discount_value?: number | null
          commission_rate?: number
          created_at?: string
          has_discount?: boolean
          id?: string
          payment_info?: Json | null
          personal_info?: Json | null
          promotion_methods?: string | null
          social_media_urls?: Json | null
          status?: string
          tier?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          affiliate_discount_type?:
            | Database["public"]["Enums"]["discount_type"]
            | null
          affiliate_discount_value?: number | null
          commission_rate?: number
          created_at?: string
          has_discount?: boolean
          id?: string
          payment_info?: Json | null
          personal_info?: Json | null
          promotion_methods?: string | null
          social_media_urls?: Json | null
          status?: string
          tier?: string
          user_id?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          specific_user_ids: string[] | null
          times_used: number
          usage_limit: number | null
          user_segment: Database["public"]["Enums"]["user_segment_type"]
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          specific_user_ids?: string[] | null
          times_used?: number
          usage_limit?: number | null
          user_segment?: Database["public"]["Enums"]["user_segment_type"]
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          specific_user_ids?: string[] | null
          times_used?: number
          usage_limit?: number | null
          user_segment?: Database["public"]["Enums"]["user_segment_type"]
        }
        Relationships: []
      }
      exchange_rates: {
        Row: {
          created_at: string
          currency_pair: string
          id: number
          rate: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_pair: string
          id?: number
          rate: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_pair?: string
          id?: number
          rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          affiliate_code: string | null
          applied_discount_code: string | null
          created_at: string
          discount_amount: number | null
          id: string
          payment_method: string | null
          payment_provider: string | null
          payment_provider_invoice_id: string | null
          payment_status: string
          platform: string | null
          program_id: string
          program_name: string
          program_price: number
          selected_addons: Json | null
          total_price: number
          user_id: string
        }
        Insert: {
          affiliate_code?: string | null
          applied_discount_code?: string | null
          created_at?: string
          discount_amount?: number | null
          id?: string
          payment_method?: string | null
          payment_provider?: string | null
          payment_provider_invoice_id?: string | null
          payment_status?: string
          platform?: string | null
          program_id: string
          program_name: string
          program_price: number
          selected_addons?: Json | null
          total_price: number
          user_id: string
        }
        Update: {
          affiliate_code?: string | null
          applied_discount_code?: string | null
          created_at?: string
          discount_amount?: number | null
          id?: string
          payment_method?: string | null
          payment_provider?: string | null
          payment_provider_invoice_id?: string | null
          payment_status?: string
          platform?: string | null
          program_id?: string
          program_name?: string
          program_price?: number
          selected_addons?: Json | null
          total_price?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          state: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          state?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          state?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      trading_accounts: {
        Row: {
          bi_weekly_payout: boolean
          created_at: string
          id: string
          is_visible: boolean
          login_id: string
          order_id: string | null
          platform: Database["public"]["Enums"]["trading_platform"]
          profit_protect: boolean
          program_name: string
          starting_balance: number
          status: Database["public"]["Enums"]["trading_account_status"]
          user_id: string
        }
        Insert: {
          bi_weekly_payout?: boolean
          created_at?: string
          id?: string
          is_visible?: boolean
          login_id: string
          order_id?: string | null
          platform: Database["public"]["Enums"]["trading_platform"]
          profit_protect?: boolean
          program_name: string
          starting_balance: number
          status?: Database["public"]["Enums"]["trading_account_status"]
          user_id: string
        }
        Update: {
          bi_weekly_payout?: boolean
          created_at?: string
          id?: string
          is_visible?: boolean
          login_id?: string
          order_id?: string | null
          platform?: Database["public"]["Enums"]["trading_platform"]
          profit_protect?: boolean
          program_name?: string
          starting_balance?: number
          status?: Database["public"]["Enums"]["trading_account_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_accounts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trading_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      get_total_users_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      has_role: {
        Args: {
          user_id_to_check: string
          role_to_check: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      discount_type: "percentage" | "fixed_amount"
      trading_account_status: "active" | "passed" | "failed" | "inactive"
      trading_platform: "MT4" | "MT5" | "HT5"
      user_segment_type:
        | "all"
        | "new_users"
        | "returning_users"
        | "specific_users"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      discount_type: ["percentage", "fixed_amount"],
      trading_account_status: ["active", "passed", "failed", "inactive"],
      trading_platform: ["MT4", "MT5", "HT5"],
      user_segment_type: [
        "all",
        "new_users",
        "returning_users",
        "specific_users",
      ],
    },
  },
} as const
