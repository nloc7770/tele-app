import { useAuth } from '@/context/auth';
import { useToast } from '@/context/toast';
import Papa from "papaparse";
import { useState } from 'react';
import { Api } from 'telegram';
import { generateRandomBytes, readBigIntFromBuffer } from 'telegram/Helpers';
interface Item {
    index: number,
    phone: string,
    firstName: string,
    lastName: string,
}

export default function index() {
    const { client, user } = useAuth();
    const [data, setData] = useState<Item[]>([]);
    const [error, setError] = useState("");
    const { toggleToast } = useToast();

    const handleOnChange = (e: any) => {
        try {
            const file =(e.target as HTMLInputElement)?.files?.[0]
            // If user clicks the parse button without
            // a file we show a error
            if (!file) return toggleToast({
                show: true,
                status: "fail",
                message: "Lỗi hệ thống",
                time: 5000,
            });

            // Initialize a reader which allows user
            // to read any file or blob.
            const reader = new FileReader();

            // Event listener on reader when the file
            // loads, we parse it and set the data.
            reader.onload = async ({ target }: any) => {
                const csv: any = Papa.parse(target.result, { header: true });
                const parsedData = csv?.data;
                const launchOptimistic = parsedData.map((elem: any, index: any) => (
                    {
                        index: index + 1,
                        phone: elem.phone,
                        firstName: elem.firstName,
                        lastName: elem.lastName,
                    }
                ));
                for (let index = 0; index < launchOptimistic.length; index++) {
                    const element = launchOptimistic[index];
                    await client.invoke(
                        new Api.contacts.ImportContacts({
                            contacts: [
                                new Api.InputPhoneContact({
                                    clientId: readBigIntFromBuffer(generateRandomBytes(8)),
                                    phone: `+${element.phone}`,
                                    firstName: element.firstName,
                                    lastName: element.lastName,
                                }),
                            ],
                        })
                    )
                }
                setData(launchOptimistic);
            };
            reader.readAsText(file);
            toggleToast({
                show: true,
                status: "success",
                message: "Thêm liên hệ thành công",
                time: 5000,
            });
        } catch (error) {
            toggleToast({
                show: true,
                status: "fail",
                message: "Lỗi hệ thống",
                time: 5000,
            });
        }
    };
    
    return (
        <div className='flex flex-col justify-center items-center w-full'>
            <h1>Import tele-script </h1>
            <div className='my-5 self-end flex'>
                <label className="p-3 border-2 rounded-lg bg-blue-200 hover:bg-blue-400 cursor-pointer ">
                    <input
                        onChange={handleOnChange}
                        id="csvInput"
                        name="file"
                        type="File"
                        accept={".csv"}
                    />

                    Thêm liên hệ
                </label>
            </div>
            <div className='w-full'>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Số điện thoại</th>
                            <th>Họ</th>
                            <th>Tên</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 && data?.map((item, index) =>
                            <tr key={index}>
                                <th>{item?.index}</th>
                                <th>{item?.phone}</th>
                                <th>{item?.firstName}</th>
                                <th>{item?.lastName}</th>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
