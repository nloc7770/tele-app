import { CloseIcon, MenuIcon } from "@/components/icons";
import { useUserAuth } from "@/context/authUser";
import { oapcityVariants } from "@/helper/farmer-motion";
import { supabase } from "@/services/supabase";
import { Popover, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Api } from "telegram";

export let setMenu: any = () => { };

const Header = () => {
    const navigate = useNavigate();
    const { user, time } = useUserAuth();
    const [show, setShow] = useState(false);
    setMenu = setShow;
    const onLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className={"border-b-[1px] border-silver bg-blue-500 text-slate-700 sticky w-full top-0 left-0 z-[50] h-16"}>
            <div className="absolute top-full left-0 ">
                {show && (
                    <motion.div
                        variants={oapcityVariants}
                        exit="hidden"
                        initial="hidden"
                        animate="visible"
                        style={{ background: "rgba(0, 0, 0, 0.5)" }}
                        className="w-screen  absolute top-0 z-0 h-screen"
                        onClick={() => setShow(false)}
                    ></motion.div>
                )}
            </div>
            <div className={"py-[12px] px-4 xl:px-[32px] w-screen justify-between flex items-center "}>
                <div className="font-[500] text-xl">
                    <div className="flex items-center">
                        <div className="md:pr-2.5 pr-[0px] lg:hidden">
                            {!show && (
                                <MenuIcon
                                    onClick={() => {
                                        setShow(true);
                                    }}
                                    className="w-12 fill-gray"
                                />
                            )}
                            {show && (
                                <CloseIcon
                                    onClick={() => {
                                        setShow(false);
                                    }}
                                    className="w-12 fill-gray"
                                />
                            )}
                        </div>
                        <img
                            onClick={() => {
                                navigate("/");
                            }}
                            className="md:h-[36px] h-[28px]  cursor-pointer"
                            src="/images/logo.svg"
                            alt=""
                        />
                    </div>
                </div>
                <span className="hidden md:block text-lg truncate text-white ">
                    {time}
                </span>
                {user && (
                    <div className="profile items-center">
                        <div className="flex items-center ">
                            <div className="ml-2 flex items-center lg:ml-0">
                                <Popover className="relative">
                                    {({ close }) => {
                                        return (
                                            <>
                                                <Popover.Button
                                                    className={` h-[40px] text-black body-2-highlight group rounded-lg flex justify-center items-center text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                                                >
                                                    <img
                                                        className="border-[1px] rounded-full border-smoke md:mr-2 md:h-10 md:w-10 h-[35px] w-[35px] text-orange-300 fill-black transition ease-in-out duration-150 object-cover"
                                                        src={"/images/avatar-icon.png"}
                                                    />
                                                    <span className="hidden md:block body-2-highlight max-w-[13rem] truncate">
                                                        {user?.email}
                                                    </span>
                                                    <img src="/images/chevron-black-down.png" className="w-[24px] ml-[6px]"></img>
                                                </Popover.Button>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-200"
                                                    enterFrom="opacity-0 translate-y-1"
                                                    enterTo="opacity-100 translate-y-0"
                                                    leave="transition ease-in duration-150"
                                                    leaveFrom="opacity-100 translate-y-0"
                                                    leaveTo="opacity-0 translate-y-1"
                                                >
                                                    <Popover.Panel className="shadow-box bg-white right-0 absolute z-[50]  min-w-[calc(100vw-32px)] md:min-w-full  mt-3 transform sm:px-0 border-[1px] border-[#5551FF] rounded-[12px] overflow-hidden">
                                                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                                            <div className=" bg-white p-[20px] min-w-[273px]">
                                                            </div>
                                                            <hr className="bg-white mx-4 text-[#E8E8E8]"></hr>
                                                            <div className="px-[20px] pt-[10px] pb-[20px] bg-white" onClick={() => close()}>
                                                                <span className="cursor-pointer	flex items-center " onClick={() => onLogout()}>
                                                                    <img src="/images/log-out.png" className="w-[22px]" />
                                                                    <span className="body-2-highlight ml-[10px] text-[#383838]">Đăng xuất</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Popover.Panel>
                                                </Transition>
                                            </>
                                        );
                                    }}
                                </Popover>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
