import Button from "@/components/common/button";
import { oapcityVariants } from "@/helper/farmer-motion";
import { motion } from "framer-motion";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Api, TelegramClient } from "telegram";
import { NewMessage } from "telegram/events";
import { StringSession } from "telegram/sessions";

const apiID = Number(import.meta.env.VITE_API_ID)
const apiHash = import.meta.env.VITE_API_HASH

interface IInitialState {
    phoneNumber: string
    password: string
    phoneCode: string
}
const initialState: IInitialState = { phoneNumber: '', password: '', phoneCode: '' } // Initialize component initial state

const Login = () => {
    const arr = ["1BQAWZmxvcmEud2ViLnRlbGVncmFtLm9yZwG7ZxKcV8Hm6yk05ncaNI65p1S/P42XGb5+2GWVJK95Jho6k/W3V69n93Rv5+RefneTrPzwDJESEZRInnLZKIEoXl3kRM3BXVHXY6+N0Hnt7lQ2gYwNLFYvwZ2eDQwTI2q7Nf6Ulv0huVlGC7m+0uOwwhBVS95lO7Z7XA1VYyWFGNhADQuk8r+qXb20gjp6+bZOc3yu3aIiKeI9eWxoSnc5GNkMN2Mk+yQ1yFXzz0Nv7JlqGoxtnZ9xV4DW4+L2aRhMBNKAEBpUa+heWCNKXoxa5fCjfSjn5RFCFQq5nHG/chpD3Yms0HK0g0dm4IZb+5PPDJCUGNVGVe8lqHgRbSIIWA==", "1BQAWZmxvcmEud2ViLnRlbGVncmFtLm9yZwG7QMJov4h9tQqwYo70BHC+jrqKcghfAL9NCmxAggWYhW51tfPY90tzWYkKlQNStqATpkzOia4DARndVk2bsMgP4DgSvSnjZPNlLivtFSZaaRhxK/bH+/kmSL0rOJ96brAuVAX2oRIod1at3fzBY8NnNaD1A4XmV9NZjRtkzaptT3GtcR+WcxxsiLsM7z+NeQVwBOAhdC2VXSjXKpmpBSvpB92S8e4H3/HD1LZy3lACj8UFvscHMAKK2gybChcYP5LIYm5BeW31t/OcgzVqAUoBYay16ARRHNPjI4a9/tvjcpG3TphL+HGDayZpuxi48tRS85UDjXFvbP0QNobb33lkIA=="]
    const [{ phoneNumber, password, phoneCode }, setAuthInfo] = useState<IInitialState>(initialState)
    // async function clientStartHandler(): Promise<void> {
    //     try {
    //         await client.start({ phoneNumber, password: userAuthParamCallback(password), phoneCode: userAuthParamCallback(phoneCode), onError: () => { } })
    //         localStorage.setItem(phoneNumber, JSON.stringify(client.session.save())) // Save session to local storage
    //     } catch (error) {
    //       return  console.log(error)
    //     }
    // }
    // async function sendCodeHandler() {
    //     await client.connect() // Connecting to the server
    //     console.log(phoneNumber);
        
    //     await client.sendCode(
    //         {
    //             apiId: apiID,
    //             apiHash: apiHash
    //         },
    //         phoneNumber
    //     )
    // }
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
    const init = async () => {
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            const SESSION = new StringSession(element) // Get session from local storage
            const client = new TelegramClient(SESSION, apiID, apiHash, { connectionRetries: 5 })
            
            await client.connect() // Connecting to the server
           // const LIMIT = 4;
        const offsetId = 0;
        const offsetPeer = new Api.InputPeerEmpty();
        let offsetDate = 0;
        let chats = [];

        const result = await client.invoke(

            new Api.messages.GetDialogs({
                offsetId,
                offsetPeer,
                offsetDate,
                limit: 5
            }),
        );
            console.log(result);

            client.addEventHandler((event: any) => {
                if (event.isPrivate) {
                    // prints sender id
                   
                    
                    const message = event.message;
                    console.log(message.senderId);
                    // read message
                    // if (message.text == "hello") {
                    // const sender = await message.getSender();
                    // console.log("sender is", sender);
                    // await client.sendMessage(sender, {
                    //     message: `hi your id is ${message.senderId}`
                    // });
                }
                // console.log(event.message); // Log the message object

            }, new NewMessage({}));
        }
        // const SESSIONs = new StringSession(JSON.parse(localStorage.getItem('84346508758') as string)) // Get session from local storage
        
        // console.log(result);




        
    }
    useEffect(() => {
        init()
    },[])
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
                                    // onClick={sendCodeHandler}
                                    className="w-full"
                                    children={"Đăng snhập"}
                                />
                                <Button
                                    // onClick={clientStartHandler}
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
