import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';

type State = {
    user: any | null
}

interface AuthUserProviderProps {
    children: React.ReactNode
}
const AuthContext = React.createContext<State | undefined>(undefined)

const AuthUserProvider = ({ children }: AuthUserProviderProps) => {
    const [user, setUser] = useState<any | null>(null)
    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "PASSWORD_RECOVERY") {
                const newPassword = prompt("What would you like your new password to be?");
                supabase.auth.updateUser({ password: newPassword||"123123" });  
            } else if (event === "SIGNED_IN") {
                setUser(session?.user);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        });
        return () => {
            data.subscription.unsubscribe();
        };
    }, [])
    return (
        <AuthContext.Provider
            value={{
                user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

function useUserAuth() {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthUserProvider')
    }
    return context
}
export { AuthUserProvider, useUserAuth };

