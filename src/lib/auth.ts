import type {
  AuthChangeEvent,
  AuthResponse,
  Session,
  User,
} from '@supabase/supabase-js';
import { supabase } from './supabase';

export function signUp(email: string, password: string): Promise<AuthResponse> {
  return supabase.auth.signUp({ email, password });
}

export function signIn(email: string, password: string): Promise<AuthResponse> {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    // No active session is not a real error for callers; surface other errors.
    if (error.name === 'AuthSessionMissingError') return null;
    throw error;
  }
  return data.user;
}

export type AuthChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;

export function onAuthChange(callback: AuthChangeCallback): () => void {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => {
    data.subscription.unsubscribe();
  };
}
