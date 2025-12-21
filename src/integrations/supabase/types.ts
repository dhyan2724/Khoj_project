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
      bus_routes: {
        Row: {
          id: string
          route_number: string
          name: string
          name_gu: string | null
          start_point: string
          end_point: string
          distance: number | null
          estimated_time: number | null
          first_bus: string | null
          last_bus: string | null
          frequency: string | null
          fare: number | null
          color: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          route_number: string
          name: string
          name_gu?: string | null
          start_point: string
          end_point: string
          distance?: number | null
          estimated_time?: number | null
          first_bus?: string | null
          last_bus?: string | null
          frequency?: string | null
          fare?: number | null
          color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          route_number?: string
          name?: string
          name_gu?: string | null
          start_point?: string
          end_point?: string
          distance?: number | null
          estimated_time?: number | null
          first_bus?: string | null
          last_bus?: string | null
          frequency?: string | null
          fare?: number | null
          color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bus_stops: {
        Row: {
          id: string
          name: string
          name_gu: string | null
          latitude: number
          longitude: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          name_gu?: string | null
          latitude: number
          longitude: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          name_gu?: string | null
          latitude?: number
          longitude?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      route_stops: {
        Row: {
          id: string
          route_id: string
          stop_id: string
          stop_order: number
          created_at: string | null
        }
        Insert: {
          id?: string
          route_id: string
          stop_id: string
          stop_order: number
          created_at?: string | null
        }
        Update: {
          id?: string
          route_id?: string
          stop_id?: string
          stop_order?: number
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            referencedRelation: "bus_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_stop_id_fkey"
            columns: ["stop_id"]
            referencedRelation: "bus_stops"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          category: string
          created_at: string | null
          from_stop: string | null
          id: string
          payment_status: string | null
          price: number
          route_number: string | null
          status: string | null
          to_stop: string | null
          type: string
          user_id: string
          valid_from: string | null
          valid_until: string
        }
        Insert: {
          category: string
          created_at?: string | null
          from_stop?: string | null
          id?: string
          payment_status?: string | null
          price: number
          route_number?: string | null
          status?: string | null
          to_stop?: string | null
          type: string
          user_id: string
          valid_from?: string | null
          valid_until: string
        }
        Update: {
          category?: string
          created_at?: string | null
          from_stop?: string | null
          id?: string
          payment_status?: string | null
          price?: number
          route_number?: string | null
          status?: string | null
          to_stop?: string | null
          type?: string
          user_id?: string
          valid_from?: string | null
          valid_until?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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

type PublicSchema = Database[keyof Database]

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
