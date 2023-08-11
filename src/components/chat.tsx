import React,{useEffect,useState} from 'react';
import {Api,TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';

// interface to declare all our prop types
interface Props {
    user: any;
    client:any
}
const apiID=Number(import.meta.env.VITE_API_ID);

const apiHash=import.meta.env.VITE_API_HASH;
const Chat: React.FC<Props>=({
    user,
    client
}) => {
    const [chats,setChats]=useState([]);
    const [chat,setChat]=useState();

   
    const initchat=async () => {
            const messages=new Array<Api.Message>();
            for await(const message of client.iterMessages(user.chatId,{limit: 10})) {
                messages.push(message);
            }
            setChats(messages.reverse())

            //     const messages = new Array<Api.Message>();
            //      for await (const message of client.iterMessages(chat,{fromUser:"me"}){
            //         console.log(message.id, message.text)
            //      }
    }
    useEffect(() => {
        initchat()
    },[user])

    if(!chats) return <></>
    const sendChat=async(e: any) => {
        if(e.key==='Enter'&&chat) {
              const result = await client.sendMessage(user.chatId,{message:chat})
                if(result){
                    initchat()
                    setChat('')
                }            
        }

    }
    return (
        <div className='w-full bg-slate-200 flex flex-col'>
            {chats.map((item) => {
                return <div className={`text-left my-2 h-10 bg-black   ${item?.sender.self&&'text-right right-0 bg-slate-900'}`}>
                    <p className='p-3 '>{item.message}</p>
                </div>
            })}
            <input className='bg-white text-black'
                value={chat}
                onChange={(e) => {
                    setChat(e.target.value)
                }}
                onKeyDown={sendChat}
            />
        </div>
    );
};

export default Chat;