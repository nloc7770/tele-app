import { supabase } from "@/services/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-center" >
            <div style={{ width: "30%", height: "50%" }}>
                <div className="auth">
                    <Auth
                        supabaseClient={supabase}
                        view="sign_in"
                        appearance={{ theme: ThemeSupa }}
                        providers={[]}
                    />
                </div>
            </div>
        </div>
    );
};
export default Login;
