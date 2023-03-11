import { useAuth } from '@/context/auth';
import { useState } from 'react';
import { TelegramClient } from 'telegram';
import { generateRandomBytes, readBigIntFromBuffer } from 'telegram/Helpers';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl/api';


export default function index() {
    const [file, setFile] = useState();
    const fileReader = new FileReader();
    const { client, user } = useAuth();

    // const handleOnChange = (e: any) => {
    //     setFile(e.target.files[0]);
    // };
    const handleOnSubmit = async () => {

        await client.connect(); // This assumes you have already authenticated with .start()
        const result = await client.invoke(
            new Api.contacts.ImportContacts({
                contacts: [
                    new Api.InputPhoneContact({
                        clientId: readBigIntFromBuffer(generateRandomBytes(8)),
                        phone: "+84347779264",
                        firstName: "Test Loc Them tư contract",
                        lastName: "ádasdas",
                    }),
                ],
            })
        )

        console.log(result); // prints the result
        // e.preventDefault(); if (file) {
        //     fileReader.onload = function (event: any) {
        //         const csvOutput = event.target.result;
        //     };
        //     fileReader.readAsText(file);
        // }

    };
    return (
        <div ><div style={{ textAlign: "center" }}>
            <h1>Import tele-script </h1>
            {/* <input
                    type={"file"}
                    id={"csvFileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                /> */}

            <button
                type='button'
                onClick={() => {
                    handleOnSubmit();
                }}
            >
                IMPORT CSV
            </button>
        </div></div>
    )
}
