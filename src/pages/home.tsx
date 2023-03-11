import { useAuth } from '@/context/auth';
import { useState } from 'react';
import { Api } from 'telegram/tl/api';

export default function index() {
    const [file, setFile] = useState();
    const fileReader = new FileReader();
    const { client, user } = useAuth();

    // const handleOnChange = (e: any) => {
    //     setFile(e.target.files[0]);
    // };
    const handleOnSubmit = async () => {
        try {
            const result = await client.invoke(
                new Api.contacts.AddContact({
                    id: user.username,
                    firstName: "loc",
                    lastName: "nguyen",
                    phone: "+84347779264",
                    addPhonePrivacyException: true,
                })
            );
            console.log(result); // prints the result
        // e.preventDefault(); if (file) {
        //     fileReader.onload = function (event: any) {
        //         const csvOutput = event.target.result;
        //     };
        //     fileReader.readAsText(file);
        // }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className='w-full h-full'><div style={{ textAlign: "center" }}>
            <h1>Import tele-script </h1>
                {/* <input
                    type={"file"}
                    id={"csvFileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                /> */}
                <button
                    onClick={() => {
                        handleOnSubmit();
                    }}
                >
                    IMPORT CSV
                </button>
        </div></div>
    )
}
