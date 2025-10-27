import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
  read?: boolean;
}

export async function submitContactMessage(data: Omit<ContactMessage, 'id' | 'created_at' | 'read'>) {
  const { data: message, error } = await supabase
    .from('contact_messages')
    .insert([data])
    .select()
    .maybeSingle();

  if (error) throw error;
  return message;
}
