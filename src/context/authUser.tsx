import { supabase } from '@/services/supabase';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

type State = {
    user: any | null
    time: string
}

interface AuthUserProviderProps {
    children: React.ReactNode
}
const AuthContext = React.createContext<State | undefined>(undefined)
const formatTime = (duration: number): string => {
    if (duration <= 0) return 'Tài khoản hết hạn'
    let day: number = Math.floor(duration / 86400);
    let hours: number = Math.floor((duration - day * 86400) / 3600);
    return `Hạn sử dụng còn ${day > 0 && `${day} ngày`} ${hours > 0 && `${hours} giờ`}`
};
const AuthUserProvider = ({ children }: AuthUserProviderProps) => {
    const [user, setUser] = useState<any | null>(null)
    const [time, setTime] = useState<any>()
    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {

            if (event == "PASSWORD_RECOVERY") {
                const newPassword = prompt("What would you like your new password to be?");
                return supabase.auth.updateUser({ password: newPassword || "123123" });
            }
            if (event === "SIGNED_OUT") {
                return setUser(null);
            }
            if (session && session.user) {
                setUser(session?.user);
                const { data: dataCheck } = await supabase
                    .from("user")
                    .select("*")
                    .eq("username", session?.user?.email);

                if (!dataCheck || dataCheck.length == 0) {
                    return
                }
                let time = formatTime(moment(dataCheck[0].expire_at).diff(moment(), 'seconds'))
                setTime(time)
            }


        });
        return () => {
            data.subscription.unsubscribe();
        };
    }, [])
    return (
        <AuthContext.Provider
            value={{
                user,
                time
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

