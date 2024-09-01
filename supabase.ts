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
      admins: {
        Row: {
          id: string
          profile_id: string
        }
        Insert: {
          id?: string
          profile_id: string
        }
        Update: {
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admins_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      battery: {
        Row: {
          battery_chemistry: Database["public"]["Enums"]["battery_chemistry"]
          capacity: number
          cycle_life: number
          depth_of_discharge: number
          id: string
          manufacturer: string
          name: string | null
          price: number
          specs: Json | null
          voltage: number
          weight: number
        }
        Insert: {
          battery_chemistry: Database["public"]["Enums"]["battery_chemistry"]
          capacity: number
          cycle_life: number
          depth_of_discharge: number
          id?: string
          manufacturer: string
          name?: string | null
          price: number
          specs?: Json | null
          voltage: number
          weight: number
        }
        Update: {
          battery_chemistry?: Database["public"]["Enums"]["battery_chemistry"]
          capacity?: number
          cycle_life?: number
          depth_of_discharge?: number
          id?: string
          manufacturer?: string
          name?: string | null
          price?: number
          specs?: Json | null
          voltage?: number
          weight?: number
        }
        Relationships: []
      }
      inverter: {
        Row: {
          efficiency: number
          id: string
          manufacturer: string
          name: string
          price: number
          size: string
          specs: Json | null
          type: Database["public"]["Enums"]["inverter_type"]
          voltage: number
        }
        Insert: {
          efficiency: number
          id?: string
          manufacturer: string
          name: string
          price: number
          size: string
          specs?: Json | null
          type: Database["public"]["Enums"]["inverter_type"]
          voltage: number
        }
        Update: {
          efficiency?: number
          id?: string
          manufacturer?: string
          name?: string
          price?: number
          size?: string
          specs?: Json | null
          type?: Database["public"]["Enums"]["inverter_type"]
          voltage?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      solar_panel: {
        Row: {
          cell_technology: string
          height: number
          id: string
          manufacturer: string
          name: string
          price: number
          specs: Json | null
          wattage: number
          weight: number
          width: number
        }
        Insert: {
          cell_technology: string
          height: number
          id?: string
          manufacturer: string
          name: string
          price: number
          specs?: Json | null
          wattage: number
          weight: number
          width: number
        }
        Update: {
          cell_technology?: string
          height?: number
          id?: string
          manufacturer?: string
          name?: string
          price?: number
          specs?: Json | null
          wattage?: number
          weight?: number
          width?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      battery_chemistry: "lithium-ion" | "lead-acid" | "nickel-cadmium"
      inverter_type:
        | "hybrid"
        | "micro"
        | "string"
        | "power optimizer"
        | "grid-tied"
        | "off-grid"
        | "single-phase"
        | "three-phase"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
