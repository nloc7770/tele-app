import {motion} from 'framer-motion';
import React,{useEffect} from 'react';
import {Api,TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions';

// interface to declare all our prop types
interface Props {
    user: any;
}
const apiID=Number(import.meta.env.VITE_API_ID);

const apiHash=import.meta.env.VITE_API_HASH;
const Chat: React.FC<Props>=({
    user
}) => {
    const arr=[
        "1BQAWZmxvcmEud2ViLnRlbGVncmFtLm9yZwG7ZxKcV8Hm6yk05ncaNI65p1S/P42XGb5+2GWVJK95Jho6k/W3V69n93Rv5+RefneTrPzwDJESEZRInnLZKIEoXl3kRM3BXVHXY6+N0Hnt7lQ2gYwNLFYvwZ2eDQwTI2q7Nf6Ulv0huVlGC7m+0uOwwhBVS95lO7Z7XA1VYyWFGNhADQuk8r+qXb20gjp6+bZOc3yu3aIiKeI9eWxoSnc5GNkMN2Mk+yQ1yFXzz0Nv7JlqGoxtnZ9xV4DW4+L2aRhMBNKAEBpUa+heWCNKXoxa5fCjfSjn5RFCFQq5nHG/chpD3Yms0HK0g0dm4IZb+5PPDJCUGNVGVe8lqHgRbSIIWA==",
        "1BQAWZmxvcmEud2ViLnRlbGVncmFtLm9yZwG7QMJov4h9tQqwYo70BHC+jrqKcghfAL9NCmxAggWYhW51tfPY90tzWYkKlQNStqATpkzOia4DARndVk2bsMgP4DgSvSnjZPNlLivtFSZaaRhxK/bH+/kmSL0rOJ96brAuVAX2oRIod1at3fzBY8NnNaD1A4XmV9NZjRtkzaptT3GtcR+WcxxsiLsM7z+NeQVwBOAhdC2VXSjXKpmpBSvpB92S8e4H3/HD1LZy3lACj8UFvscHMAKK2gybChcYP5LIYm5BeW31t/OcgzVqAUoBYay16ARRHNPjI4a9/tvjcpG3TphL+HGDayZpuxi48tRS85UDjXFvbP0QNobb33lkIA==",
    ];
    const initchat=async () => {
        for(let index=0;index<1;index++) {
            const element=arr[index];

            const SESSION=new StringSession(element); // Get session from local storage

            const client=new TelegramClient(SESSION,apiID,apiHash,{
                connectionRetries: 5,
            });

            await client.connect(); // This assumes you have already authenticated with .start()
            console.log(user);
            
            // const result = await client.invoke(
            //     new Api.messages.get({
            //       id: [id],
            //     })
            //   );
            // console.log(result);

        }
    }
    useEffect(() => {
        if(user==0) return
        initchat()
    },[user])


    return (
        <img />
    );
};

export default Chat;