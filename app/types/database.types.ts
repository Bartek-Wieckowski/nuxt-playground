export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          company: string | null
          country: string
          customer_id: number
          first_name: string
          id: number
          is_default: boolean
          last_name: string
          postal_code: string
          street: string
          type: string
        }
        Insert: {
          city: string
          company?: string | null
          country: string
          customer_id: number
          first_name: string
          id?: number
          is_default?: boolean
          last_name: string
          postal_code: string
          street: string
          type?: string
        }
        Update: {
          city?: string
          company?: string | null
          country?: string
          customer_id?: number
          first_name?: string
          id?: number
          is_default?: boolean
          last_name?: string
          postal_code?: string
          street?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string | null
          id: number
          is_active: boolean
          name: string
          parent_id: number | null
          slug: string
          sort_order: number
          store_id: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          parent_id?: number | null
          slug: string
          sort_order?: number
          store_id?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          parent_id?: number | null
          slug?: string
          sort_order?: number
          store_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string | null
          gender: string | null
          id: number
          is_active: boolean
          last_name: string | null
          marketing_consent: boolean
          phone: string | null
          store_id: number
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          gender?: string | null
          id?: number
          is_active?: boolean
          last_name?: string | null
          marketing_consent?: boolean
          phone?: string | null
          store_id: number
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          gender?: string | null
          id?: number
          is_active?: boolean
          last_name?: string | null
          marketing_consent?: boolean
          phone?: string | null
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "customers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          description: string | null
          id: number
          name: string
          store_id: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          store_id?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          store_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          expires_at: string | null
          id: number
          is_active: boolean
          promotion_id: number | null
          store_id: number
          usage_count: number
          usage_limit: number | null
        }
        Insert: {
          code: string
          expires_at?: string | null
          id?: number
          is_active?: boolean
          promotion_id?: number | null
          store_id: number
          usage_count?: number
          usage_limit?: number | null
        }
        Update: {
          code?: string
          expires_at?: string | null
          id?: number
          is_active?: boolean
          promotion_id?: number | null
          store_id?: number
          usage_count?: number
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_codes_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_codes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          department_id: number | null
          email: string
          first_name: string
          hired_at: string
          id: number
          is_active: boolean
          last_name: string
          role: string
          store_id: number | null
        }
        Insert: {
          department_id?: number | null
          email: string
          first_name: string
          hired_at: string
          id?: number
          is_active?: boolean
          last_name: string
          role: string
          store_id?: number | null
        }
        Update: {
          department_id?: number | null
          email?: string
          first_name?: string
          hired_at?: string
          id?: number
          is_active?: boolean
          last_name?: string
          role?: string
          store_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          id: number
          quantity: number
          reorder_point: number
          reserved_quantity: number
          updated_at: string
          variant_id: number
          warehouse_id: number
        }
        Insert: {
          id?: number
          quantity?: number
          reorder_point?: number
          reserved_quantity?: number
          updated_at?: string
          variant_id: number
          warehouse_id: number
        }
        Update: {
          id?: number
          quantity?: number
          reorder_point?: number
          reserved_quantity?: number
          updated_at?: string
          variant_id?: number
          warehouse_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          discount_amount: number
          id: number
          order_id: number
          product_name: string
          quantity: number
          total: number
          unit_price: number
          variant_id: number
          variant_info: Json | null
        }
        Insert: {
          discount_amount?: number
          id?: number
          order_id: number
          product_name: string
          quantity: number
          total: number
          unit_price: number
          variant_id: number
          variant_info?: Json | null
        }
        Update: {
          discount_amount?: number
          id?: number
          order_id?: number
          product_name?: string
          quantity?: number
          total?: number
          unit_price?: number
          variant_id?: number
          variant_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string
          changed_by: number | null
          id: number
          note: string | null
          order_id: number
          status: string
        }
        Insert: {
          changed_at?: string
          changed_by?: number | null
          id?: number
          note?: string | null
          order_id: number
          status: string
        }
        Update: {
          changed_at?: string
          changed_by?: number | null
          id?: number
          note?: string | null
          order_id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_id: number | null
          currency: string
          customer_id: number
          delivered_at: string | null
          discount_amount: number
          discount_code_id: number | null
          id: number
          notes: string | null
          ordered_at: string
          payment_method: string | null
          payment_status: string
          shipped_at: string | null
          shipping_address_id: number | null
          shipping_cost: number
          status: string
          store_id: number
          subtotal: number
          tax_amount: number
          total: number
        }
        Insert: {
          billing_address_id?: number | null
          currency?: string
          customer_id: number
          delivered_at?: string | null
          discount_amount?: number
          discount_code_id?: number | null
          id?: number
          notes?: string | null
          ordered_at?: string
          payment_method?: string | null
          payment_status?: string
          shipped_at?: string | null
          shipping_address_id?: number | null
          shipping_cost?: number
          status?: string
          store_id: number
          subtotal: number
          tax_amount?: number
          total: number
        }
        Update: {
          billing_address_id?: number | null
          currency?: string
          customer_id?: number
          delivered_at?: string | null
          discount_amount?: number
          discount_code_id?: number | null
          id?: number
          notes?: string | null
          ordered_at?: string
          payment_method?: string | null
          payment_status?: string
          shipped_at?: string | null
          shipping_address_id?: number | null
          shipping_cost?: number
          status?: string
          store_id?: number
          subtotal?: number
          tax_amount?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_discount_code"
            columns: ["discount_code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          id: number
          is_primary: boolean
          product_id: number
          sort_order: number
          url: string
          variant_id: number | null
        }
        Insert: {
          alt_text?: string | null
          id?: number
          is_primary?: boolean
          product_id: number
          sort_order?: number
          url: string
          variant_id?: number | null
        }
        Update: {
          alt_text?: string | null
          id?: number
          is_primary?: boolean
          product_id?: number
          sort_order?: number
          url?: string
          variant_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color: string | null
          id: number
          is_active: boolean
          material: string | null
          price_modifier: number
          product_id: number
          size: string | null
          sku: string
        }
        Insert: {
          color?: string | null
          id?: number
          is_active?: boolean
          material?: string | null
          price_modifier?: number
          product_id: number
          size?: string | null
          sku: string
        }
        Update: {
          color?: string | null
          id?: number
          is_active?: boolean
          material?: string | null
          price_modifier?: number
          product_id?: number
          size?: string | null
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          category_id: number | null
          cost_price: number | null
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          sku: string
          store_id: number
          supplier_id: number | null
          tax_rate: number
          weight_kg: number | null
        }
        Insert: {
          base_price: number
          category_id?: number | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          sku: string
          store_id: number
          supplier_id?: number | null
          tax_rate?: number
          weight_kg?: number | null
        }
        Update: {
          base_price?: number
          category_id?: number | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          sku?: string
          store_id?: number
          supplier_id?: number | null
          tax_rate?: number
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          applies_to: string
          description: string | null
          ends_at: string | null
          id: number
          is_active: boolean
          min_order_amount: number | null
          name: string
          starts_at: string
          store_id: number
          type: string
          value: number | null
        }
        Insert: {
          applies_to?: string
          description?: string | null
          ends_at?: string | null
          id?: number
          is_active?: boolean
          min_order_amount?: number | null
          name: string
          starts_at: string
          store_id: number
          type: string
          value?: number | null
        }
        Update: {
          applies_to?: string
          description?: string | null
          ends_at?: string | null
          id?: number
          is_active?: boolean
          min_order_amount?: number | null
          name?: string
          starts_at?: string
          store_id?: number
          type?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          id: number
          purchase_order_id: number
          quantity_ordered: number
          quantity_received: number
          unit_cost: number
          variant_id: number
        }
        Insert: {
          id?: number
          purchase_order_id: number
          quantity_ordered: number
          quantity_received?: number
          unit_cost: number
          variant_id: number
        }
        Update: {
          id?: number
          purchase_order_id?: number
          quantity_ordered?: number
          quantity_received?: number
          unit_cost?: number
          variant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          expected_at: string | null
          id: number
          notes: string | null
          ordered_at: string | null
          received_at: string | null
          status: string
          store_id: number
          supplier_id: number
          total_cost: number | null
          warehouse_id: number
        }
        Insert: {
          expected_at?: string | null
          id?: number
          notes?: string | null
          ordered_at?: string | null
          received_at?: string | null
          status?: string
          store_id: number
          supplier_id: number
          total_cost?: number | null
          warehouse_id: number
        }
        Update: {
          expected_at?: string | null
          id?: number
          notes?: string | null
          ordered_at?: string | null
          received_at?: string | null
          status?: string
          store_id?: number
          supplier_id?: number
          total_cost?: number | null
          warehouse_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          customer_id: number
          id: number
          is_approved: boolean
          is_verified_purchase: boolean
          product_id: number
          rating: number
          title: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          customer_id: number
          id?: number
          is_approved?: boolean
          is_verified_purchase?: boolean
          product_id: number
          rating: number
          title?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          customer_id?: number
          id?: number
          is_approved?: boolean
          is_verified_purchase?: boolean
          product_id?: number
          rating?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          carrier: string | null
          delivered_at: string | null
          estimated_delivery: string | null
          id: number
          order_id: number
          shipped_at: string | null
          shipping_method_id: number | null
          status: string
          tracking_number: string | null
        }
        Insert: {
          carrier?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          id?: number
          order_id: number
          shipped_at?: string | null
          shipping_method_id?: number | null
          status?: string
          tracking_number?: string | null
        }
        Update: {
          carrier?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          id?: number
          order_id?: number
          shipped_at?: string | null
          shipping_method_id?: number | null
          status?: string
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_shipping_method_id_fkey"
            columns: ["shipping_method_id"]
            isOneToOne: false
            referencedRelation: "shipping_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_methods: {
        Row: {
          carrier: string | null
          estimated_days_max: number | null
          estimated_days_min: number | null
          free_above: number | null
          id: number
          is_active: boolean
          name: string
          price: number
          store_id: number
        }
        Insert: {
          carrier?: string | null
          estimated_days_max?: number | null
          estimated_days_min?: number | null
          free_above?: number | null
          id?: number
          is_active?: boolean
          name: string
          price: number
          store_id: number
        }
        Update: {
          carrier?: string | null
          estimated_days_max?: number | null
          estimated_days_min?: number | null
          free_above?: number | null
          id?: number
          is_active?: boolean
          name?: string
          price?: number
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "shipping_methods_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          country: string
          created_at: string
          currency: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
          timezone: string
        }
        Insert: {
          country: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          slug: string
          timezone?: string
        }
        Update: {
          country?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
          timezone?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          country: string
          id: number
          is_active: boolean
          lead_time_days: number | null
          name: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          country: string
          id?: number
          is_active?: boolean
          lead_time_days?: number | null
          name: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          id?: number
          is_active?: boolean
          lead_time_days?: number | null
          name?: string
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          address: string
          city: string
          id: number
          is_active: boolean
          name: string
          store_id: number
        }
        Insert: {
          address: string
          city: string
          id?: number
          is_active?: boolean
          name: string
          store_id: number
        }
        Update: {
          address?: string
          city?: string
          id?: number
          is_active?: boolean
          name?: string
          store_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          added_at: string
          customer_id: number
          id: number
          product_id: number
          variant_id: number | null
        }
        Insert: {
          added_at?: string
          customer_id: number
          id?: number
          product_id: number
          variant_id?: number | null
        }
        Update: {
          added_at?: string
          customer_id?: number
          id?: number
          product_id?: number
          variant_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

A new version of Supabase CLI is available: v2.98.2 (currently installed v2.65.5)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
