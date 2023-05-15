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
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user)
        })

        return () => subscription.unsubscribe()
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

