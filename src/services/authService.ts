import { supabase } from "../config/supabaseClient";

export const loginWithEmail = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
    });
    if (error) throw error;
    return data;
};

export const registerWithEmail = async (email: string, pass: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
            data: {
                name: name
            }
        }
    });
    if (error) throw error;
    return data;
};



export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};
