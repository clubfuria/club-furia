import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cqfxomvrkkaegtfkboun.supabase.co'

const supabaseKey = 'sb_publishable_77uyRViR14U9tq9y9vJkTQ_D6y3-Elz'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)