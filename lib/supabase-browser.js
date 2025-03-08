'use client';

import { createClient } from '@supabase/supabase-js';

// These values are hardcoded here to ensure they're available in the client component
// This is safe since these are public keys meant to be exposed to the browser
const supabaseUrl = 'https://yuyoureweuzdsgqmzqsu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eW91cmV3ZXV6ZHNncW16cXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTMzMTgsImV4cCI6MjA1NjY4OTMxOH0.ZfJgOvEqi3S5axy6loJGJAVMlUMewXDRO3lia_NmDjg';

export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};
