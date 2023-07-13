import React, { useEffect, useState } from 'react';
import { Api } from 'telegram';
import { TelegramClient } from 'telegram/client/TelegramClient';
import { StringSession } from 'telegram/sessions';
import { useToast } from './toast';
import { hashs } from '@/const';


type State = {
    client: any | null
    loading: boolean
    user: any | null
    result: any
}

interface AuthProviderProps {
    children: React.ReactNode
}
const AuthContext = React.createContext<State | undefined>(undefined)

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<any | null>(null)
    const [result, setResult] = useState<any>()
    const [client, setClient] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const { toggleToast } = useToast();

    const init = async () => {
        const randomInfo = hashs[Math.floor(Math.random()*hashs.length)];
        const stringSession = new StringSession(localStorage.getItem("sessionString") || "");
        const clientTele = new TelegramClient(stringSession, randomInfo.id, randomInfo.hash, {
            connectionRetries: 5,
        });
        await clientTele.connect();
        setClient(clientTele)

        if (await clientTele.checkAuthorization()) {
            const me = await clientTele.getMe();
            setUser(me)
            toggleToast({
                show: true,
                status: "success",
                message: 'You should now be connected.',
                time: 5000,
            });
            const result = await clientTele.invoke(
                new Api.contacts.GetContacts({})
            );
            setResult(result)
        }
        setLoading(false)
    }
    useEffect(() => {
        init()
    }, []);

    const getListUserAdd = async()=>{
        await client.connect(); // This assumes you have already authenticated with .start()
        const result = await client.invoke(
            new Api.contacts.GetContacts({})
        );
        setResult(result)
        
        
    }

    return (
        <AuthContext.Provider
            value={{
                client,
                loading,
                user,
                result,
                getListUserAdd
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

