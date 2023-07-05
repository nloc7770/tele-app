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
}

interface AuthProviderProps {
    children: React.ReactNode
}
const AuthContext = React.createContext<State | undefined>(undefined)

const AuthProvider = ({ children }: AuthProviderProps) => {
    return (
        <AuthContext.Provider
            value={{
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

