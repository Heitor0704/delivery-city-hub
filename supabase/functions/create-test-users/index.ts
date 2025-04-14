
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // Verificar se a requisição é POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    console.log("Iniciando criação de usuários de teste")
    
    // Criar usuário administrador
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@fomex.com',
      password: 'admin123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Administrador Sistema',
        role: 'admin'
      }
    })
    
    if (adminError) throw adminError
    console.log("Usuário admin criado com sucesso")

    // Criar usuário gerente de cidade
    const { data: managerData, error: managerError } = await supabase.auth.admin.createUser({
      email: 'gerente@fomex.com',
      password: 'gerente123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Gerente São Paulo',
        role: 'cityManager'
      }
    })
    
    if (managerError) throw managerError
    console.log("Usuário gerente criado com sucesso")

    // Criar usuário dono de estabelecimento
    const { data: ownerData, error: ownerError } = await supabase.auth.admin.createUser({
      email: 'dono@fomex.com',
      password: 'dono123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Dono Restaurante',
        role: 'owner'
      }
    })
    
    if (ownerError) throw ownerError
    console.log("Usuário dono criado com sucesso")

    // Criar usuário cliente
    const { data: customerData, error: customerError } = await supabase.auth.admin.createUser({
      email: 'cliente@fomex.com',
      password: 'cliente123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Cliente Comum',
        role: 'customer'
      }
    })
    
    if (customerError) throw customerError
    console.log("Usuário cliente criado com sucesso")

    return new Response(
      JSON.stringify({
        message: 'Test users created successfully',
        users: {
          admin: adminData,
          manager: managerData,
          owner: ownerData,
          customer: customerData
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Erro ao criar usuários:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
