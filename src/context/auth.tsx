import React, { useEffect, useState } from 'react';
import { TelegramClient } from 'telegram/client/TelegramClient';
import { StringSession } from 'telegram/sessions';
import { useToast } from './toast';

const apiID = Number(import.meta.env.VITE_API_ID)
const apiHash = import.meta.env.VITE_API_HASH
const stringSession = new StringSession(localStorage.getItem("sessionString") || "");
const client = new TelegramClient(stringSession, apiID, apiHash, {});
type State = {
    client: any | null
    logout: () => void
    loading: boolean
    user: any | null
}

interface AuthProviderProps {
    children: React.ReactNode
}
const AuthContext = React.createContext<State | undefined>(undefined)

const AuthProvider = ({ children }: AuthProviderProps) => {
    const { toggleToast } = useToast();
    const [user, setUser] = useState<any | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    async function getUserData() {


    }
    const init = async () => {
        await client.connect();
        if (await client.checkAuthorization()) {
            const me = await client.getMe();
            console.log(me)
            
            setUser(me)
        }
    }
    useEffect(() => {
        init()
    }, []);
    // const isLogged = useMemo(() => {
    //     return !!user
    // }, [user])

    const logout = async () => {
    }
    return (
        <AuthContext.Provider
            value={{
                client,
                loading,
             
                logout,
                user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider')
    }
    return context
}
export { AuthProvider, useAuth };

