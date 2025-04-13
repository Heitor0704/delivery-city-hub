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
      Cartao: {
        Row: {
          ano_expiracao: string | null
          created_at: string
          cvc: string | null
          id: number
          mes_expiracao: string | null
          nome_cartao: string | null
          numero: string | null
          selecionado: boolean | null
          user_id: string | null
        }
        Insert: {
          ano_expiracao?: string | null
          created_at?: string
          cvc?: string | null
          id?: number
          mes_expiracao?: string | null
          nome_cartao?: string | null
          numero?: string | null
          selecionado?: boolean | null
          user_id?: string | null
        }
        Update: {
          ano_expiracao?: string | null
          created_at?: string
          cvc?: string | null
          id?: number
          mes_expiracao?: string | null
          nome_cartao?: string | null
          numero?: string | null
          selecionado?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      Categoria: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          created_at: string
          estabelecimento_id: number | null
          id: number
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string
          estabelecimento_id?: number | null
          id?: number
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string
          estabelecimento_id?: number | null
          id?: number
        }
        Relationships: []
      }
      Cidade: {
        Row: {
          cidade: string | null
          created_at: string
          estado: string | null
          id: number
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          estado?: string | null
          id?: number
        }
        Update: {
          cidade?: string | null
          created_at?: string
          estado?: string | null
          id?: number
        }
        Relationships: []
      }
      Cliente: {
        Row: {
          cartao_selecionado: number | null
          created_at: string
          endereco_selecionado: number
          id: number
          pedidos: number[] | null
          user_id: string | null
        }
        Insert: {
          cartao_selecionado?: number | null
          created_at?: string
          endereco_selecionado?: number
          id?: number
          pedidos?: number[] | null
          user_id?: string | null
        }
        Update: {
          cartao_selecionado?: number | null
          created_at?: string
          endereco_selecionado?: number
          id?: number
          pedidos?: number[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      Documento: {
        Row: {
          created_at: string
          foto_frente: string | null
          foto_verso: string | null
          id: number
          tipo: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          foto_frente?: string | null
          foto_verso?: string | null
          id?: number
          tipo?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          foto_frente?: string | null
          foto_verso?: string | null
          id?: number
          tipo?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Endereco: {
        Row: {
          bairro: string | null
          CEP: string | null
          cidade: string | null
          complemento: string | null
          created_at: string
          id: number
          numero: number | null
          referencia: string | null
          rua: string | null
          uf: string | null
          user_id: string | null
        }
        Insert: {
          bairro?: string | null
          CEP?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          id?: number
          numero?: number | null
          referencia?: string | null
          rua?: string | null
          uf?: string | null
          user_id?: string | null
        }
        Update: {
          bairro?: string | null
          CEP?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          id?: number
          numero?: number | null
          referencia?: string | null
          rua?: string | null
          uf?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Entrega: {
        Row: {
          created_at: string
          destinatario: number | null
          id: number
          motorista: number | null
          pedido: number | null
          remetente: number | null
          valor: number | null
        }
        Insert: {
          created_at?: string
          destinatario?: number | null
          id?: number
          motorista?: number | null
          pedido?: number | null
          remetente?: number | null
          valor?: number | null
        }
        Update: {
          created_at?: string
          destinatario?: number | null
          id?: number
          motorista?: number | null
          pedido?: number | null
          remetente?: number | null
          valor?: number | null
        }
        Relationships: []
      }
      Estabelecimento: {
        Row: {
          avaliacoes: number | null
          cidade_id: number | null
          created_at: string
          descrição: string | null
          endereco: Json | null
          forma_cobranca_entrega: string | null
          horarios: Json | null
          id: number
          logomarca: string | null
          nome_estabelecimento: string | null
          percentual_cobranca: number | null
          seguimentos: number[] | null
          status: string | null
          telefone: string | null
          tempo_max: number
          tempo_min: number
          tipo_entrega: string | null
          user_id: string | null
          valor_entrega: number
        }
        Insert: {
          avaliacoes?: number | null
          cidade_id?: number | null
          created_at?: string
          descrição?: string | null
          endereco?: Json | null
          forma_cobranca_entrega?: string | null
          horarios?: Json | null
          id?: number
          logomarca?: string | null
          nome_estabelecimento?: string | null
          percentual_cobranca?: number | null
          seguimentos?: number[] | null
          status?: string | null
          telefone?: string | null
          tempo_max?: number
          tempo_min?: number
          tipo_entrega?: string | null
          user_id?: string | null
          valor_entrega?: number
        }
        Update: {
          avaliacoes?: number | null
          cidade_id?: number | null
          created_at?: string
          descrição?: string | null
          endereco?: Json | null
          forma_cobranca_entrega?: string | null
          horarios?: Json | null
          id?: number
          logomarca?: string | null
          nome_estabelecimento?: string | null
          percentual_cobranca?: number | null
          seguimentos?: number[] | null
          status?: string | null
          telefone?: string | null
          tempo_max?: number
          tempo_min?: number
          tipo_entrega?: string | null
          user_id?: string | null
          valor_entrega?: number
        }
        Relationships: []
      }
      "Item Carrinho": {
        Row: {
          created_at: string
          id: number
          id_opcoes_cardapio: number[] | null
          id_pedido: number | null
          id_produto: number | null
          quantidade: number | null
          total: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          id_opcoes_cardapio?: number[] | null
          id_pedido?: number | null
          id_produto?: number | null
          quantidade?: number | null
          total?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          id_opcoes_cardapio?: number[] | null
          id_pedido?: number | null
          id_produto?: number | null
          quantidade?: number | null
          total?: number | null
        }
        Relationships: []
      }
      Motorista: {
        Row: {
          avaliacao: number | null
          created_at: string
          entrega_atual: number | null
          entregas: number[] | null
          foto: string | null
          id: number
          online: boolean | null
          stattus_cnh: string
          status_crv: string
          status_rg: string
          total_faturado: number | null
          user_id: string | null
          veiculo: number | null
        }
        Insert: {
          avaliacao?: number | null
          created_at?: string
          entrega_atual?: number | null
          entregas?: number[] | null
          foto?: string | null
          id?: number
          online?: boolean | null
          stattus_cnh?: string
          status_crv?: string
          status_rg?: string
          total_faturado?: number | null
          user_id?: string | null
          veiculo?: number | null
        }
        Update: {
          avaliacao?: number | null
          created_at?: string
          entrega_atual?: number | null
          entregas?: number[] | null
          foto?: string | null
          id?: number
          online?: boolean | null
          stattus_cnh?: string
          status_crv?: string
          status_rg?: string
          total_faturado?: number | null
          user_id?: string | null
          veiculo?: number | null
        }
        Relationships: []
      }
      "Nivel Cardapio": {
        Row: {
          ativo: boolean
          created_at: string
          estabelecimento_id: number
          id: number
          mostrar_preco: boolean | null
          nome: string
          obrigatorio: boolean
          ordem: number | null
          produto_id: number[] | null
          qtd_opcoes_max: number | null
          qtd_opcoes_min: number | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          estabelecimento_id: number
          id?: number
          mostrar_preco?: boolean | null
          nome: string
          obrigatorio?: boolean
          ordem?: number | null
          produto_id?: number[] | null
          qtd_opcoes_max?: number | null
          qtd_opcoes_min?: number | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          estabelecimento_id?: number
          id?: number
          mostrar_preco?: boolean | null
          nome?: string
          obrigatorio?: boolean
          ordem?: number | null
          produto_id?: number[] | null
          qtd_opcoes_max?: number | null
          qtd_opcoes_min?: number | null
        }
        Relationships: []
      }
      "Opcao Cardapio": {
        Row: {
          ativo: boolean
          created_at: string
          estabelecimento_id: number | null
          id: number
          nivel_id: number
          nome: string
          ordem: number | null
          valor: number | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          estabelecimento_id?: number | null
          id?: number
          nivel_id: number
          nome: string
          ordem?: number | null
          valor?: number | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          estabelecimento_id?: number | null
          id?: number
          nivel_id?: number
          nome?: string
          ordem?: number | null
          valor?: number | null
        }
        Relationships: []
      }
      Pedido: {
        Row: {
          cliente_userId: string | null
          created_at: string
          deslocamento: number
          endereco_destino: string | null
          endereco_origem: string | null
          entrega: boolean | null
          entrega_id: number | null
          entregador_id: number | null
          estabelecimento_id: number | null
          id: number
          status: string | null
          ultima_atualizacao: string | null
          valor_desconto: number
          valor_frete: number
          valor_taxa: number
          valor_total: number | null
        }
        Insert: {
          cliente_userId?: string | null
          created_at?: string
          deslocamento?: number
          endereco_destino?: string | null
          endereco_origem?: string | null
          entrega?: boolean | null
          entrega_id?: number | null
          entregador_id?: number | null
          estabelecimento_id?: number | null
          id?: number
          status?: string | null
          ultima_atualizacao?: string | null
          valor_desconto?: number
          valor_frete?: number
          valor_taxa?: number
          valor_total?: number | null
        }
        Update: {
          cliente_userId?: string | null
          created_at?: string
          deslocamento?: number
          endereco_destino?: string | null
          endereco_origem?: string | null
          entrega?: boolean | null
          entrega_id?: number | null
          entregador_id?: number | null
          estabelecimento_id?: number | null
          id?: number
          status?: string | null
          ultima_atualizacao?: string | null
          valor_desconto?: number
          valor_frete?: number
          valor_taxa?: number
          valor_total?: number | null
        }
        Relationships: []
      }
      Produto: {
        Row: {
          categoria_id: number | null
          created_at: string
          descricao: string | null
          estabelecimento_id: number
          estoque: number | null
          foto: string | null
          id: number
          max_adicionais: number | null
          max_sabores: number | null
          nome_produto: string | null
          ordem: number | null
          preco: number | null
          status: string | null
        }
        Insert: {
          categoria_id?: number | null
          created_at?: string
          descricao?: string | null
          estabelecimento_id?: number
          estoque?: number | null
          foto?: string | null
          id?: number
          max_adicionais?: number | null
          max_sabores?: number | null
          nome_produto?: string | null
          ordem?: number | null
          preco?: number | null
          status?: string | null
        }
        Update: {
          categoria_id?: number | null
          created_at?: string
          descricao?: string | null
          estabelecimento_id?: number
          estoque?: number | null
          foto?: string | null
          id?: number
          max_adicionais?: number | null
          max_sabores?: number | null
          nome_produto?: string | null
          ordem?: number | null
          preco?: number | null
          status?: string | null
        }
        Relationships: []
      }
      Seguimento: {
        Row: {
          ativo: boolean | null
          created_at: string
          id: number
          imagem: string | null
          ordem: number | null
          seguimento: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          id?: number
          imagem?: string | null
          ordem?: number | null
          seguimento?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          id?: number
          imagem?: string | null
          ordem?: number | null
          seguimento?: string | null
        }
        Relationships: []
      }
      Usuarios: {
        Row: {
          created_at: string
          documento: string | null
          email: string | null
          nome_usuario: string | null
          senha: string | null
          telefone: string | null
          tipo_usuario: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          documento?: string | null
          email?: string | null
          nome_usuario?: string | null
          senha?: string | null
          telefone?: string | null
          tipo_usuario?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          documento?: string | null
          email?: string | null
          nome_usuario?: string | null
          senha?: string | null
          telefone?: string | null
          tipo_usuario?: string | null
          user_id?: string
        }
        Relationships: []
      }
      Veiculo: {
        Row: {
          ano: string | null
          cor: string | null
          created_at: string
          foto: string[] | null
          id: number
          marca: string | null
          modelo: string | null
          placa: string | null
          user_id: string | null
        }
        Insert: {
          ano?: string | null
          cor?: string | null
          created_at?: string
          foto?: string[] | null
          id?: number
          marca?: string | null
          modelo?: string | null
          placa?: string | null
          user_id?: string | null
        }
        Update: {
          ano?: string | null
          cor?: string | null
          created_at?: string
          foto?: string[] | null
          id?: number
          marca?: string | null
          modelo?: string | null
          placa?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      view_estabelecimento: {
        Row: {
          avaliacoes: number | null
          cidade_id: number | null
          created_at: string | null
          descrição: string | null
          endereco: Json | null
          forma_cobranca_entrega: string | null
          horarios: Json | null
          id: number | null
          logomarca: string | null
          nome_estabelecimento: string | null
          pedidos: Json | null
          percentual_cobranca: number | null
          quantidade_produtos_ativos: number | null
          seguimentos: number[] | null
          status: string | null
          status_abertura: string | null
          telefone: string | null
          tempo_max: number | null
          tempo_min: number | null
          tipo_entrega: string | null
          user_id: string | null
          valor_entrega: number | null
        }
        Insert: {
          avaliacoes?: number | null
          cidade_id?: number | null
          created_at?: string | null
          descrição?: string | null
          endereco?: Json | null
          forma_cobranca_entrega?: string | null
          horarios?: Json | null
          id?: number | null
          logomarca?: string | null
          nome_estabelecimento?: string | null
          pedidos?: never
          percentual_cobranca?: number | null
          quantidade_produtos_ativos?: never
          seguimentos?: number[] | null
          status?: string | null
          status_abertura?: never
          telefone?: string | null
          tempo_max?: number | null
          tempo_min?: number | null
          tipo_entrega?: string | null
          user_id?: string | null
          valor_entrega?: number | null
        }
        Update: {
          avaliacoes?: number | null
          cidade_id?: number | null
          created_at?: string | null
          descrição?: string | null
          endereco?: Json | null
          forma_cobranca_entrega?: string | null
          horarios?: Json | null
          id?: number | null
          logomarca?: string | null
          nome_estabelecimento?: string | null
          pedidos?: never
          percentual_cobranca?: number | null
          quantidade_produtos_ativos?: never
          seguimentos?: number[] | null
          status?: string | null
          status_abertura?: never
          telefone?: string | null
          tempo_max?: number | null
          tempo_min?: number | null
          tipo_entrega?: string | null
          user_id?: string | null
          valor_entrega?: number | null
        }
        Relationships: []
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
    Enums: {},
  },
} as const
