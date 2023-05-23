import React, { useEffect, useState } from 'react';
import { Api } from 'telegram';
import { TelegramClient } from 'telegram/client/TelegramClient';
import { StringSession } from 'telegram/sessions';
import { useToast } from './toast';

const apiID = Number(import.meta.env.VITE_API_ID)
const apiHash = import.meta.env.VITE_API_HASH
const stringSession = new StringSession(localStorage.getItem("sessionString") || "");
const client = new TelegramClient(stringSession, apiID, apiHash, {
    connectionRetries: 5,
});
type State = {
    client: any | null
    loading: boolean
    user: any | null
    result:any
}

interface AuthProviderProps {
    children: React.ReactNode
}
const AuthContext = React.createContext<State | undefined>(undefined)

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<any | null>(null)
    const [result, setResult] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const { toggleToast } = useToast();

    const init = async () => {
        await client.connect();
        if (await client.checkAuthorization()) {
            const me = await client.getMe();
            setUser(me)
                toggleToast({
            show: true,
            status: "success",
            message: 'You should now be connected.',
            time: 5000,
                });
            const result = await client.invoke(
                new Api.contacts.GetContacts({})
            );
            setResult(result)
        }
        setLoading(false)
    }
    useEffect(() => {
        init()
    }, []);

    return (
        <AuthContext.Provider
            value={{
                client,
                loading,
                user,
                result
            }}
        >
            {!loading && children}
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

