import { useUserAuth } from '@/context/authUser';
import { useToast } from '@/context/toast';
import { supabase } from '@/services/supabase';
import moment from "moment";
import { useEffect, useState } from 'react';
import LoginTelegram from './loginTelegram';

// import Login from './logins';

export default function index() {
     
    const { user } = useUserAuth();
    const [isAuth, setIsAuth] = useState(true);
    const { toggleToast } = useToast();
    useEffect(() => {
        checkAuth();
    }, []);
    const checkAuth = async () => {
        try {
            const { data: dataCheck } = await supabase
                .from("user")
                .select("*")
                .eq("username", user?.email);
            if (!dataCheck || dataCheck.length == 0) {
                return setIsAuth(false);
            }
            if (dataCheck) {
                setIsAuth(true);
            }
            if (!dataCheck[0].active) {
                setIsAuth(false);
            }
            if (moment().isAfter(dataCheck[0].expire_at)) {
                setIsAuth(false);
            }
        } catch (error) {
            return toggleToast({
                show: true,
                status: "fail",
                message: "Lỗi hệ thống",
                time: 5000,
            });
        }
    };

    return (
        <div>
            {isAuth ? <>
                <LoginTelegram/>
            </>
                : <p className='text-black text-4xl font-extrabold mt-10'>Tài khoản bị khóa hoặc hết hạn</p>}
        </div>

    )
}
