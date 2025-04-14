
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req) => {
  // Verificar se a requisição é POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
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
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
