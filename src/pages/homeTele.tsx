import { useAuth } from '@/context/auth';
import { useToast } from '@/context/toast';
import { supabase } from '@/services/supabase';
import moment from 'moment';
import Papa from "papaparse";
import React, { useEffect, useState } from 'react';
import History from "./history";
import { Api } from 'telegram';
import { generateRandomBytes, readBigIntFromBuffer } from 'telegram/Helpers';
type Item = {
    index: number,
    phone: string,
    firstName: string,
    lastName: string,
    status: number,
}

export default function index() {
    const { client, user, result } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState("");
    const { toggleToast } = useToast();
    const [loading, setLoading] = useState<boolean>(false)
    // const [page, setPage] = useState([])
    const [pageActive, setPageActive] = useState<number>(0)
    const [pageRunning, setPageRunning] = useState<number>(0)
    const [isImport, setIsImport] = useState<boolean>(false)
    const [totalData, setTotalData] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [isHistory, setIsHistory] = useState<boolean>(false);

    const init = async () => {
        setTotalData(result.originalArgs.users.length)
        const { data: dataRes } = await supabase
            .from('checking')
            .select('*')
            .eq('phone', user?.phone)
            .gt('created_at', moment().format("YYYY-MM-DD"));
        setIsImport((dataRes && dataRes.length > 0) ? dataRes[0].is_import : false)
    }
    useEffect(() => {
        init()
    }, []);
    const handleOnChange = (e: any) => {
        try {
            if (isImport && totalData > 2800) {
                return toggleToast({
                    show: true,
                    status: "warning",
                    message: "Đạt giới hạn thêm liên hệ.",
                    time: 5000,
                });
            }
            setPageActive(0)
            setPageRunning(0)
            const file = (e.target as HTMLInputElement)?.files?.[0]
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
                        id: `${user?.phone}${elem.phone}`,
                        index: index + 1,
                        phone: elem.phone,
                        firstName: elem.firstName,
                        lastName: elem.lastName,
                        status: 0,
                        username: user?.phone,
                        clientId: readBigIntFromBuffer(generateRandomBytes(8)),
                    }
                ));
                function sliceIntoChunks(arr: Item[], chunkSize: number) {
                    const res = [];
                    for (let i = 0; i < arr.length; i += chunkSize) {
                        const chunk = arr.slice(i, i + chunkSize);
                        res.push(chunk);
                    }
                    return res;
                }

                setData(sliceIntoChunks(launchOptimistic, 1000));
            };
            reader.readAsText(file);
            toggleToast({
                show: true,
                status: "success",
                message: "Lấy danh sách liên hệ thành công",
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

    const handleAddContact = async (number: number) => {
        if (loading) {
            return toggleToast({
                show: true,
                status: "fail",
                message: "Đang trong tiến trình",
                time: 5000,
            });
        }
        setLoading(true)
        await supabase.from('checking').upsert({ phone: user?.phone, is_import: true })
        let arrContacts = []
        for (let index = 0; index < data[number].length; index++) {
            const element = data[number][index];
            if (element.phone && element.firstName) {
                let a = new Api.InputPhoneContact(element)
                arrContacts.push(a)

            }
        }


        (async function run() {
            await client.connect(); // This assumes you have already authenticated with .start()

            let result = await client.invoke(
                new Api.contacts.ImportContacts({
                    contacts: arrContacts,
                })
            )

            for (let index = 0; index < result?.users.length; index++) {
                const element = result?.users[index];
                let item = element.phone.substr(element.phone.length - 5)
                let searchLastname = data[number].findIndex((x: any) => x.phone.substr(x.phone.length - 5) == item)
                if (data[number][searchLastname].status == 0) {
                    data[number][searchLastname].status = 1
                }

            }
            for (let index = 0; index < data[number].length; index++) {
                const element = data[number][index];
                if (element.status != 1) {
                    element.status = 2
                }
            }
        })();

        setLoading(false)
        setPageRunning(number + 1)
        if ((number + 1) * 100 / data?.length == 100) {
            toggleToast({
                show: true,
                status: "success",
                message: "Hoàn thành!",
                time: 5000,
            });
            return setTimeout(() => {
                // location.reload()
            }, 7000);
        }
        setPageActive(number + 1)
        toggleToast({
            show: true,
            status: "warning",
            message: "Vui lòng chờ 1 phút để tiến trình tiếp tục!",
            time: 60000,
        });
        setTimeout(async () => {
            if (data?.length !== number) {
                await handleAddContact(number + 1)
            }
        }, 60000);
    }
    const onLogout = async () => {
        await client?.invoke(new Api.auth.LogOut())
        localStorage.removeItem("sessionString")
        location.reload()
    };

    return (
        <React.Fragment>

            <div className='flex flex-col justify-center items-center w-full px-10'>
                {isActive ? <React.Fragment>
                    {data?.length > 0 && <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${pageRunning * 100 / data?.length}%` }}>{(pageRunning * 100 / data?.length).toFixed(2)}%</div>
                    </div>}
                    <div className='my-5 justify-between flex w-full fixed z-10 bg-white px-10 py-10 h-30 top-10'>
                        <div className='flex flex-row'>
                            <label className="p-3 border-2 rounded-lg mr-2 cursor-pointer border-black text-black">
                                <div
                                    className='text-black'
                                >
                                    Tổng số liên hệ đã thêm : {totalData}
                                </div>
                            </label>
                            <label className="p-3 border-2 rounded-lg bg-blue-300 hover:bg-blue-500 cursor-pointer border-black mr-2 text-black">
                                <div
                                    onClick={() => {
                                        setIsHistory(!isHistory)
                                    }}
                                >
                                    {!isHistory ? "Xem lịch sử" : "Thêm liên hệ"}
                                </div>
                            </label>
                        </div>
                        {!isHistory && <div className='flex flex-row'>
                            <a className="p-3 border-2 rounded-lg bg-blue-200 hover:bg-blue-400 cursor-pointer border-black mr-2 text-black" href='https://res.cloudinary.com/dfs1kb2dk/raw/upload/v1684045982/telegram_xcel/templet_add_account_tlrz93.csv'>
                                Lấy file mẫu
                            </a>
                            <label className="p-3 border-2 rounded-lg bg-blue-200 hover:bg-blue-400 cursor-pointer border-black mr-2 text-black">
                                <input
                                    onChange={
                                        handleOnChange
                                    }
                                    id="csvInput"
                                    name="file"
                                    type="File"
                                    accept={".csv"}
                                />

                                Lấy danh sách liên hệ
                            </label>

                            <label className="p-3 border-2 rounded-lg bg-blue-300 hover:bg-blue-500 cursor-pointer border-black mr-2 text-black">
                                <div
                                    onClick={() => {
                                        handleAddContact(0)
                                    }}
                                >
                                    Thêm liên hệ
                                </div>
                            </label>
                            <label className="p-3 border-2 rounded-lg bg-blue-300 hover:bg-blue-500 cursor-pointer border-black text-black">
                                <div
                                    onClick={() => {
                                        onLogout()
                                    }}
                                >
                                    Đổi tài khoản
                                </div>
                            </label>
                        </div>}
                    </div>
                    <div className='mt-40' style={{ minHeight: '68vh' }}>
                        {data && data?.length > 0 && <div className="flex items-center space-x-1 self-end mt-3">
                            <a onClick={() => {
                                if (pageActive != 0) {
                                    setPageActive(pageActive - 1)
                                }
                            }} className="flex items-center px-4 py-2 text-gray-500 bg-gray-300 rounded-md">
                                Trang trước
                            </a>

                            <a key={index + "itemsss"} onClick={() => {
                            }} className={`px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-400 hover:text-white`}>
                                {pageActive + 1 + "/" + data?.length}
                            </a>
                            <a
                                onClick={() => {
                                    if (pageActive + 1 < data?.length) {
                                        setPageActive(pageActive + 1)
                                    }
                                }} className="px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md hover:bg-blue-400 hover:text-white">
                                Trang sau
                            </a>
                        </div>}
                        {isHistory ? <History /> :
                            <div className="relative items-center block w-full p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700 mt-2">
                                <table className={`text-black ${loading && "opacity-20"}`}>
                                    <thead>
                                        <tr >
                                            <th style={{ width: 100 }}>STT</th>
                                            <th style={{ width: 300 }}>Số điện thoại</th>
                                            <th style={{ width: 350 }}>Họ</th>
                                            <th style={{ width: 350 }}>Tên</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data && data[pageActive]?.length > 0 && data[pageActive]?.map((item: any, index: any) => {
                                            return (
                                                item?.phone && <tr key={index} >
                                                    <th>{item?.index}</th>
                                                    <th>{item?.phone}</th>
                                                    <th >{item?.firstName}</th>
                                                    <th>{item?.lastName}</th>
                                                    <th>{item?.status == 1 ? "Thành công" : item.status == 0 ? "Chưa xử lý" : "Sđt chưa đăng kí telegram hoặc tài khoản chưa đủ điều kiện để thêm liên hệ "}</th>
                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                </table>
                                {loading && <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 w-full h-full bg-transparent flex justify-center">
                                    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/4000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                    <span className="sr-only">Loading...</span>
                                </div>}
                            </div>}
                        {data && data?.length > 0 && <div className="flex items-center space-x-1 self-end mt-3 mb-3">
                            <a onClick={() => {
                                if (pageActive != 0) {
                                    setPageActive(pageActive - 1)
                                }
                            }} className="flex items-center px-4 py-2 text-gray-500 bg-gray-300 rounded-md">
                                Trang trước
                            </a>
                            <a key={index + "itemsss"} onClick={() => {
                            }} className={`px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-400 hover:text-white`}>
                                {pageActive + 1 + "/" + data?.length}
                            </a>

                            <a
                                onClick={() => {
                                    if (pageActive + 1 < data?.length) {
                                        setPageActive(pageActive + 1)
                                    }
                                }} className="px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md hover:bg-blue-400 hover:text-white">
                                Trang sau
                            </a>
                        </div>
                        }
                    </div>
                </React.Fragment> : <p className='text-black text-4xl font-extrabold'>Tài khoản bị khóa hoặc hết hạn</p>}


            </div>

            <footer className="bg-white dark:bg-gray-900">
                <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <a href="#" className="flex items-center">
                                <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="Supertool Logo" />
                                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Supertool</span>
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Gia hạn - yêu cầu hỗ trợ liên hệ</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="#" className="hover:underline">Tele: @ihopez</a>
                                    </li>
                                    <li>
                                        <span  className="hover:underline">Nhận viết Tools vs nâng cấp theo yêu cầu.</span>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="#" className="hover:underline">Supertool™</a>. All Rights Reserved.
                        </span>
                        
                    </div>
                </div>
            </footer>

        </React.Fragment>


    )
}
