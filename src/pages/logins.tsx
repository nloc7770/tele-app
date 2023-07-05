import Button from "@/components/common/button";
import { oapcityVariants } from "@/helper/farmer-motion";
import { motion } from "framer-motion";
import { BaseSyntheticEvent, useState } from "react";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const apiID = Number(import.meta.env.VITE_API_ID)
const apiHash = import.meta.env.VITE_API_HASH

interface IInitialState {
    phoneNumber: string
    password: string
    phoneCode: string
}
const initialState: IInitialState = { phoneNumber: '', password: '', phoneCode: '' } // Initialize component initial state
const stringSession = new StringSession(localStorage.getItem("sessionString") as string);
const client = new TelegramClient(stringSession, apiID, apiHash, { connectionRetries: 5 })

const Login = () => {
    const [{ phoneNumber, password, phoneCode }, setAuthInfo] = useState<IInitialState>(initialState)
    async function clientStartHandler(): Promise<void> {
        console.log(phoneNumber);
        await client.start({ phoneNumber, password: userAuthParamCallback(password), phoneCode: userAuthParamCallback(phoneCode), onError: () => { } })
        localStorage.setItem(phoneNumber, JSON.stringify(client.session.save())) // Save session to local storage
    }

    function inputChangeHandler({ target: { name, value } }: BaseSyntheticEvent): void {
        setAuthInfo((authInfo) => ({ ...authInfo, [name]: value }))
    }

    function userAuthParamCallback<T>(param: T): () => Promise<T> {
        return async function () {
            return await new Promise<T>(resolve => {
                resolve(param)
            })
        }
    }

    return (
        <motion.div variants={oapcityVariants} exit="hidden" initial="hidden" animate="visible" className="flex flex-col h-[calc(100vh-64px)] w-screen">
            <div className="shadow-box p-[20px] md:p-10  flex items-center justify-center bg-base bg-cover bg-no-repeat bg-center flex-1">
                <div className=" bg-white rounded-[24px] min-w-full md:min-w-[400px] flex shadow-box">
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
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" className="animate-pulse animate-bounce h-16 cursor-pointer" alt="logo" />

                                </div>
                                <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                                    Đăng nhập vào tool
                                </h2>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" >
                                    Số điện thoại
                                </label>
                                <input
                                    onChange={inputChangeHandler}
                                    style={{ backgroundColor: 'white' }}
                                    className=" text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    name="phoneNumber"
                                    type="text"
                                    placeholder="Nhập vào số điện thoại có mã vùng" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" >
                                    password
                                </label>
                                <input
                                    onChange={inputChangeHandler}
                                    name="password"
                                    style={{ backgroundColor: 'white' }} className=" text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="text" placeholder="Nhập vào số điện thoại có mã vùng" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" >
                                    phoneCode
                                </label>
                                <input
                                    onChange={inputChangeHandler}
                                    name="phoneCode"
                                    style={{ backgroundColor: 'white' }} className=" text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="text" placeholder="Nhập vào số điện thoại có mã vùng" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Button
                                    onClick={clientStartHandler}
                                    className="w-full"
                                    children={"Đăng nhập"}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div >
    );
};
export default Login;
