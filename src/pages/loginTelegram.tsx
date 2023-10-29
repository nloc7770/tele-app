import React, { type BaseSyntheticEvent, useState, useEffect } from 'react'
import Button from "@/components/common/button";
import { useAuth } from "@/context/auth";
import { useToast } from "@/context/toast";
import { oapcityVariants } from "@/helper/farmer-motion";
import { motion } from "framer-motion";
import Home from "./homeTele";
import { secondsToHms } from '@/untils/string.helper';


interface IInitialState {
    phoneNumber: string
    password: string
    phoneCode: string
}

const initialState: IInitialState = { phoneNumber: '', password: '', phoneCode: '' }

const LoginTelegram = () => {

    const { client, user, appInfor } = useAuth()

    const [loading, setLoading] = useState(true);
    const { toggleToast } = useToast();
    const [isSubmitCode, setIsSubmitCode] = useState<boolean>(false)
    const [isRequedPassword, setIsRequedPassword] = useState<boolean>(false)

    const [{ phoneNumber, password, phoneCode }, setAuthInfo] = useState<IInitialState>(initialState)

    async function sendCodeHandler(): Promise<void> {
        try {

            if (!phoneNumber) return toggleToast({
                show: true,
                status: "fail",
                message: "Vui lòng nhập số điện thoại",
                time: 5000,
            });
            await client.connect() // Connecting to the server
            await client.sendCode(
                {
                    apiId: appInfor.id,
                    apiHash: appInfor.hash
                },
                phoneNumber
            )
            setIsSubmitCode(true)

        } catch (error: any) {



            if (error?.errorMessage === "PHONE_NUMBER_INVALID" || error?.errorMessage === "PHONE_CODE_HASH_EMPTY") {
                toggleToast({
                    show: true,
                    status: "fail",
                    message: "Số điện thoại không đúng định dạng. Vui lòng kiểm tra lại",
                    time: 5000,
                });
            }

            if (error?.errorMessage === "FLOOD") {
                toggleToast({
                    show: true,
                    status: "fail",
                    message: `Gửi quá nhiều yêu cầu vui lòng đợi ${secondsToHms(error?.seconds || 0)} giây để tiếp tục`,
                    time: 5000,
                });
            }


        }
    }


    async function clientStartHandler(): Promise<void> {
        try {
            const result = await client.start({
                phoneNumber,
                phoneCode: userAuthParamCallback('phoneCode', phoneCode),
                password: userAuthParamCallback('password', password),
                onError: (error: any) => {

                    if (error?.message === 'Password is empty') {
                        toggleToast({
                            show: true,
                            status: "fail",
                            message: "Bạn đã cài đặt mật khẩu cho tài khoản vui lòng nhập mật khẩu",
                            time: 5000,
                        });
                        setIsRequedPassword(true)

                    }

                    if (error?.errorMessage === 'PHONE_CODE_INVALID') {
                        toggleToast({
                            show: true,
                            status: "fail",
                            message: "Mã OTP không chính xác. Vui lòng kiểm tra lại",
                            time: 5000,
                        });

                    }

                    return Promise.reject(error)
                }
            })

            localStorage.setItem("sessionString", client.session.save() as any as string)
            location.reload()

        } catch (error) {

            console.dir(error)
            return Promise.reject(error)
        }

    }

    function inputChangeHandler({ target: { name, value } }: BaseSyntheticEvent): void {
        setAuthInfo((authInfo) => ({ ...authInfo, [name]: value }))
    }

    function userAuthParamCallback<T>(keyword: T, param: T): () => Promise<T> {
       
        return async function () {
            return await new Promise<T>((resolve) => {
                resolve(param)
            })
        }
    }

    return (
        <motion.div variants={oapcityVariants} exit="hidden" initial="hidden" animate="visible" className="flex flex-col h-[calc(100vh-64px)] w-screen">
            {user ? (
                <React.Fragment>
                    <Home />
                </React.Fragment>
            ) : (
                <div className="shadow-box p-[20px] md:p-10  flex items-center justify-center bg-base bg-cover bg-no-repeat bg-center flex-1">
                    <div className=" bg-white rounded-[24px] min-w-full md:min-w-[400px] flex shadow-box">
                        {loading && (
                            <motion.div
                                variants={oapcityVariants}
                                exit="hidden"
                                initial="hidden"
                                animate="visible"
                                className="right p-[20px] md:p-8 rounded-xl md:max-w-[400px] w-full flex flex-col"
                            >
                                <div className="w-full">
                                    {!isSubmitCode ? (
                                        <React.Fragment>
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

                                                <input style={{ backgroundColor: 'white' }}
                                                    className=" text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                                    id="phone"
                                                    type="text"
                                                    placeholder="Nhập vào số điện thoại có mã vùng"
                                                    name="phoneNumber"
                                                    value={phoneNumber}
                                                    onChange={inputChangeHandler}
                                                />
                                                <label className="block text-gray-700 text-sm font-bold mb-2" >
                                                    Mật khẩu
                                                </label>

                                                <input style={{ backgroundColor: 'white' }}
                                                    className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    id="phone"
                                                    type="text"
                                                    placeholder="Mật khẩu"
                                                    name="password"
                                                    value={password}
                                                    onChange={inputChangeHandler}
                                                />
                                                <span className='text-gray-500 text-xs'><span className='text-red-500'>Chú ý:</span> Nếu account không có mật khẩu vui lòng bỏ qua</span>

                                                <div className="flex items-center justify-between mt-6">
                                                    <Button
                                                        onClick={sendCodeHandler}
                                                        className="w-full"
                                                        children={"Đăng nhập"}
                                                    />
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <div className="mb-10">

                                                <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                                                    Xác nhận mã OTP
                                                </h2>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2" >
                                                    Nhập mã OTP
                                                </label>

                                                <input style={{ backgroundColor: 'white' }}
                                                    className=" text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                                    id="phone"
                                                    type="text"
                                                    placeholder="Nhập mã code"
                                                    name="phoneCode"
                                                    value={phoneCode}
                                                    onChange={inputChangeHandler}
                                                />
                                                {isRequedPassword ? (
                                                    <React.Fragment>
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                                                            Mật khẩu
                                                        </label>

                                                        <input style={{ backgroundColor: 'white' }}
                                                            className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            id="phone"
                                                            type="text"
                                                            placeholder="Mật khẩu"
                                                            name="password"
                                                            value={password}
                                                            onChange={inputChangeHandler}
                                                        />
                                                    </React.Fragment>
                                                ) : null

                                                }


                                                <div className="flex items-center justify-between mt-6 mb-3">
                                                    <Button
                                                        onClick={clientStartHandler}
                                                        className="w-full"
                                                        children={"Xác nhận mã OTP"}
                                                    />
                                                </div>

                                                <span onClick={() => setIsSubmitCode(false)} style={{ cursor: 'pointer' }} className='text-blue-500 text-xs mt-2'>Chưa nhận được mã OTP?</span>
                                            </div>
                                        </React.Fragment>
                                    )}

                                </div>

                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </motion.div >
    );
};
export default LoginTelegram;
