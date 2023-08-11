import Chat from "@/components/chat";
import {useEffect,useState} from "react";

import {Api,TelegramClient} from "telegram";

import {NewMessage} from "telegram/events";

import {StringSession} from "telegram/sessions";

const apiID=Number(import.meta.env.VITE_API_ID);

const apiHash=import.meta.env.VITE_API_HASH;

interface IInitialState {
    phoneNumber: string;

    password: string;

    phoneCode: string;
}

const Login=() => {
    const [chats,setChats]=useState([]);

    const [chatIndex,setChatIndex]=useState();
    const [client,setClient]=useState();

    const arr=[
        "1BQAWZmxvcmEud2ViLnRlbGVncmFtLm9yZwG7ZxKcV8Hm6yk05ncaNI65p1S/P42XGb5+2GWVJK95Jho6k/W3V69n93Rv5+RefneTrPzwDJESEZRInnLZKIEoXl3kRM3BXVHXY6+N0Hnt7lQ2gYwNLFYvwZ2eDQwTI2q7Nf6Ulv0huVlGC7m+0uOwwhBVS95lO7Z7XA1VYyWFGNhADQuk8r+qXb20gjp6+bZOc3yu3aIiKeI9eWxoSnc5GNkMN2Mk+yQ1yFXzz0Nv7JlqGoxtnZ9xV4DW4+L2aRhMBNKAEBpUa+heWCNKXoxa5fCjfSjn5RFCFQq5nHG/chpD3Yms0HK0g0dm4IZb+5PPDJCUGNVGVe8lqHgRbSIIWA==",
        "1BQAWZmxvcmEud2ViLnRlbGVncmFtLm9yZwG7QMJov4h9tQqwYo70BHC+jrqKcghfAL9NCmxAggWYhW51tfPY90tzWYkKlQNStqATpkzOia4DARndVk2bsMgP4DgSvSnjZPNlLivtFSZaaRhxK/bH+/kmSL0rOJ96brAuVAX2oRIod1at3fzBY8NnNaD1A4XmV9NZjRtkzaptT3GtcR+WcxxsiLsM7z+NeQVwBOAhdC2VXSjXKpmpBSvpB92S8e4H3/HD1LZy3lACj8UFvscHMAKK2gybChcYP5LIYm5BeW31t/OcgzVqAUoBYay16ARRHNPjI4a9/tvjcpG3TphL+HGDayZpuxi48tRS85UDjXFvbP0QNobb33lkIA==",
    ];

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

    const init=async () => {
        for(let index=1;index<2;index++) {
            const element=arr[index];

            const SESSION=new StringSession(element); // Get session from local storage

            const client=new TelegramClient(SESSION,apiID,apiHash,{
                connectionRetries: 5,
            });

            await client.connect(); // Connecting to the server
            setClient(client)
            // const LIMIT = 4;
            // client.addEventHandler((event: any) => {
            //     if(event.isPrivate) {
            //         getListChat()
            //     }
            // },new NewMessage({}));

        }

        // const SESSIONs = new StringSession(JSON.parse(localStorage.getItem('84346508758') as string)) // Get session from local storage

        // console.log(result);

    };
    const getListChat=async () => {

        const offsetId=0;

        const offsetPeer=new Api.InputPeerEmpty();

        let offsetDate=0;

        const result: any=await client.invoke(
            new Api.messages.GetDialogs({
                offsetId,
                offsetPeer,
                offsetDate,
                limit: 10000
            })
        );

        // const results: any = await client.invoke(

        //     new Api.photos.GetUserPhotos({

        //       userId: result.chats[0].id,

        //       offset: 43,

        //       maxId: readBigIntFromBuffer(generateRandomBytes(8)),

        //       limit: 100,

        //     })

        //   );

        // const results: any = await client.invoke(

        //     new Api.upload.GetFile({

        //       fileToken: Buffer.from(result.chats[0].photo.strippedThumb.buffer),

        //       offset: readBigIntFromBuffer(generateRandomBytes(8)),

        //     })

        //   );



        //  const a = document.createElement("a");

        //  document.body.appendChild(a);

        //  a.href = url;

        //  a.download = "filename.jpg";

        //  a.click();

        //  window.URL.revokeObjectURL(url);

        //     console.log(url);

        // const results = await client.invoke(

        //     new Api.upload.GetCdnFile({

        //       fileToken:.buffer,

        //       offset: 0,

        //       limit: 100,

        //     })

        //   );

        // const results: any = await client.invoke(new Api.upload.GetFile({

        //     offset: 0,

        //     limit: 1024 * 1024,

        //     precise: false,

        //     cdnSupported: false,

        //     location: new Api.InputFileLocation({

        //          volumeId: result.chats[0].accessHash                     ,

        //         localId: 1,

        //         secret: readBigIntFromBuffer(generateRandomBytes(8)),

        //         fileReference:

        //     }),

        //     }));

        // console.log(results); // prints the result
        // let arrs=[]
        // for(let index=0;index<result.chats.length;index++) {
        //     const element=result.chats[index];
        //     if(element.username) {
        //         const buffers=await client.downloadProfilePhoto(element.username)
        //         const blob=new Blob([buffers] as any);
        //         const url=window.URL.createObjectURL(blob);
        //         arrs.push({
        //             src: url
        //         })
        //     }
        // }

        // setChats(arrs)
        //  const buffers=await client.downloadProfilePhoto(result.chats[0].username)
        //                     const blob=new Blob([buffers] as any);
        //                     const url=window.URL.createObjectURL(blob);
        //                     console.log(url);
        // const buffers = await client.downloadProfilePhoto( result.chats[0].username)

        // console.log("Downloaded image is",buffers);




        //  const blob = new Blob([result.chats[0].photo.strippedThumb]);
        //  const buffers = await client.downloadProfilePhoto( result.chats[0].username)
        //  console.log(buffers);

        let a=result.messages.filter((item: any) => item.peerId.className==='PeerUser'&&item.className==="Message")
        let res=a.map((s: any) => s.id);

        const user: any=await client.invoke(
            new Api.messages.GetMessages({
                id: res
            })
        );

        let arrUser: any=[]
        let users=user.users.filter((item: any) => !item.self)

        for(let index=0;index<user.messages.length;index++) {
            const element=user.messages[index];
            if(users[index].username) {
                if(users[index].photo) {
                    const buffers=await client.downloadProfilePhoto(users[index].username)
                    const blob=new Blob([buffers] as any);
                    const url=window.URL.createObjectURL(blob);

                    arrUser.push({
                        name: users[index].firstName,
                        img: url,
                        lastMessage: element.message,
                        id: element.id,
                        chatId: element.chatId
                    })
                } else {
                    arrUser.push({
                        name: users[index].firstName,
                        img: null,
                        lastMessage: element.message,
                        id: element.id,
                        chatId: element.chatId
                    })
                }
            }
        }

        //  const url = window.URL.createObjectURL(blob);

        //  const a = document.createElement("a");

        //  document.body.appendChild(a);

        //  a.href = url;

        //  a.download = "filename.jpg";

        //  a.click();

        //  window.URL.revokeObjectURL(url);
        setChats(arrUser)
    }
    useEffect(() => {
        init();
        getListChat()
    },[]);

    if(!chats) return
    return <div className="w-full flex justify-between">
        <div className="flex flex-col bg-slate-400 w-[300px] h-screen">
            {chats.map((item) => {
                return <div className="flex  justify-start p-3 cursor-pointer" key={item.id} onClick={() => {setChatIndex(item)}}>
                    <img src={!item?.img? "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg":item.img} alt="" className="w-[50px] h-[50px]  border-[2px] border-black rounded-full" />
                    <div className="flex flex-col">
                        <span className="font-bold">{item.name}</span>
                        <span className="font-semi text-sm">{item.lastMessage}</span>
                    </div>
                </div>
            })}
        </div>
        {chatIndex&&<Chat user={chatIndex} client={client} />}
    </div>;
};

export default Login;
