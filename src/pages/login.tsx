import Button from "@/components/common/button";
// import { useToast } from "@/context/toast";
import { oapcityVariants } from "@/helper/farmer-motion";
// import { supabaseClient } from "@/services/supabase";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/auth";

const Login = () => {
    const { client } = useAuth()

    const [loading, setLoading] = useState(true);

    // const init = async () => {
    //     directus.auth.token.then((element) => { });
    //     directus.auth
    //         .refresh()
    //         .then((data: any) => {
    //             getProfile();
    //         })
    //         .catch((error) => {
    //             setLoading(true);
    //         });
    // };
    // useEffect(() => {
    //     init();
    // }, []);
    // const url = import.meta.env.VITE_CMS + "/auth/login/keycloak?redirect=" + location.href;
    // const onClick = () => {
    //     location.href = url;
    // };

    const onLogin = async (e: any) => {
        e.preventDefault();

        let phone = e.target.elements.email?.value;
        await client.start({
            phoneNumber: phone,
            phoneCode: async () => await  prompt('Please enter your code'),
            // TODO implement actual error handling 
            onError: console.error
        })
        console.log("You should now be connected.");
        localStorage.setItem("sessionString", client.session.save() as any as string)
        await client.sendMessage("me", { message: "Hello!" });
    }

    return (
        <motion.div variants={oapcityVariants} exit="hidden" initial="hidden" animate="visible" className="flex flex-col h-screen w-screen">
            <div className="shadow-box p-[20px] md:p-10 md:min-h-[calc(100vh-136px)] flex items-center justify-center bg-base bg-cover bg-no-repeat bg-center flex-1">
                <div className="md:mt-[10px] mt-[250px] bg-white rounded-[24px] min-w-full md:min-w-[400px] flex shadow-box">
                    {loading && (
                        <motion.div
                            variants={oapcityVariants}
                            exit="hidden"
                            initial="hidden"
                            animate="visible"
                            className="right p-[20px] md:p-8 rounded-xl md:max-w-[400px] w-full flex flex-col"
                        >
                            <div className="w-full">
                                <div className="mb-10">
                                    <div className="flex justify-center">
                                        <img  src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" className="animate-pulse animate-bounce h-16 cursor-pointer" alt="logo" />

                                    </div>
                                    <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                                        Đăng nhập
                                    </h2>
                                </div>
                                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onLogin}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                                            Số điện thoại
                                        </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="email" />
                                    </div>
                                    {/* <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                                            
                                        </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                                    </div> */}
                                    <div className="flex items-center justify-between">
                                        <Button
                                        
                                            className="w-full"
                                            children={"Đăng nhập"}
                                        />
                                    </div>
                                </form>
                            </div>

                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div >
    );
};
export default Login;
