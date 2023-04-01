import { useAuth } from '@/context/auth';
import { useToast } from '@/context/toast';
import { supabase } from '@/services/supabase';
import { useEffect, useState } from 'react';

export default function index() {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState("");
    const { toggleToast } = useToast();
    const [loading, setLoading] = useState<boolean>(false)
    const { client, user } = useAuth();
    // const [page, setPage] = useState([])
    const [pageActive, setPageActive] = useState<number>(0)

    const init = async () => {
        const { data: dataRes } = await supabase
            .from('data')
            .select('*')
            .eq('username', user?.phone)
        if (dataRes) {
            dataRes.sort(function (a: any, b: any) { return a.index - b.index });
        }

        function sliceIntoChunks(arr: any, chunkSize: number) {
            const res = [];
            for (let i = 0; i < arr.length; i += chunkSize) {
                const chunk = arr.slice(i, i + chunkSize);
                res.push(chunk);
            }
            return res;
        }

        setData(sliceIntoChunks(dataRes, 20));
    }
    useEffect(() => {
        init()
    }, []);

    return (
        <div className='flex flex-col justify-center items-center w-full'>
            <h1>Lịch sử thêm liên hệ </h1>
            <div className="relative items-center block w-full p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700">
                <table className={`${loading && "opacity-20"}`}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Số điện thoại</th>
                            <th>Họ</th>
                            <th>Tên</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data[pageActive]?.length > 0 && data[pageActive]?.map((item: any, index: any) => {
                            return (
                                item?.phone && <tr key={index} >
                                    <th>{item?.index}</th>
                                    <th>{item?.phone}</th>
                                    <th>{item?.firstName}</th>
                                    <th>{item?.lastName}</th>
                                    <th>{item?.status == 1 ? "Thành công" : item.status == 0 ? "Chưa xử lý" : "Thất bại"}</th>
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </table>
            </div>
            {data && data?.length > 0 && <div className="flex items-center space-x-1 self-end mt-3">
                <a onClick={() => {
                    if (pageActive != 0) {
                        setPageActive(pageActive - 1)
                    }
                }} className="flex items-center px-4 py-2 text-gray-500 bg-gray-300 rounded-md">
                    Trang trước
                </a>
                {/* {data?.map((item: any, index: any) => {
                    return */}
                <a key={index + "itemsss"} onClick={() => {
                }} className={`px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-400 hover:text-white`}>
                    {pageActive + 1 + "/" + data?.length}
                </a>
                {/* }
                )} */}
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

    )
}
