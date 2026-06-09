import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment.development';

// Limpiar el URL base (sin /rest/v1/)
const baseUrl = environment.urlapi ? environment.urlapi.replace('/rest/v1/', '') : '';
const supabaseUrl = baseUrl || '';
const supabaseAnonKey = environment.apikey || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase: missing URL or anon key. Check .env.development');
}
console.log({
  urlapi: environment.urlapi,
  baseUrl,
  supabaseUrl,
  apikey: environment.apikey?.substring(0, 20) + '...'
});
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
