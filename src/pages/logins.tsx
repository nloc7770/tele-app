import Button from "@/components/common/button";
import { useAuth } from "@/context/auth";
import { useToast } from "@/context/toast";
import { oapcityVariants } from "@/helper/farmer-motion";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./homeTele";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const Login = () => {
  const { client, user, setClient } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { toggleToast } = useToast();
  const [teleToken, setTeleToken] = useState({
    id: "",
    hash: "",
  });
  const [phone, setPhone] = useState("");
  const onLogin = async (e: any) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (!phone) {
        setLoading(false);

        return toggleToast({
          show: true,
          status: "fail",
          message: "Vui lòng nhập số điện thoại",
          time: 5000,
        });
      }

      await client.start({
        phoneNumber: phone,
        phoneCode: async () =>
          prompt("Nhập code từ số điện thoại hoặc telegram"),
        password: async () => prompt("Please enter your password: "),
        // TODO implement actual error handling
        onError: (error: any) => {
          return toggleToast({
            show: true,
            status: "fail",
            message: error?.message,
            time: 5000,
          });
        },
      });
      setLoading(false);
      localStorage.setItem(
        "sessionString",
        client.session.save() as any as string
      );
      localStorage.setItem("id", teleToken.id);
      localStorage.setItem("hash", teleToken.hash);
      // location.href = "https://tele-app-kappa.vercel.app/"
      location.reload();
    } catch (error) {
      setClient(undefined);
      setStep(1);
      setLoading(false);
      setPhone("");
      setTeleToken({
        id: "",
        hash: "",
      });
      return toggleToast({
        show: true,
        status: "fail",
        message: "login fail",
        time: 5000,
      });
    }
  };

  const onStartClient = async (e: any) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (!teleToken.id) {
        setLoading(false);

        return toggleToast({
          show: true,
          status: "fail",
          message: "Vui lòng nhập id app",
          time: 5000,
        });
      }

      if (!teleToken.hash) {
        setLoading(false);

        return toggleToast({
          show: true,
          status: "fail",
          message: "Vui lòng nhập hash",
          time: 5000,
        });
      }
      const stringSession = new StringSession(
        localStorage.getItem("sessionString") || ""
      );
      const clientTele = new TelegramClient(
        stringSession,
        parseInt(teleToken.id),
        teleToken.hash,
        {
          connectionRetries: 5,
        }
      );
      await clientTele.connect();
      setLoading(false);
      setClient(clientTele);
      setStep(2);
    } catch (error) {
      setLoading(false);
      console.dir(error);
    }
  };

  return (
    <motion.div
      variants={oapcityVariants}
      exit="hidden"
      initial="hidden"
      animate="visible"
      className="flex flex-col h-[calc(100vh-64px)] w-screen"
    >
      {user ? (
        <>
          <Home />
        </>
      ) : (
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
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
                      className="animate-pulse animate-bounce h-16 cursor-pointer"
                      alt="logo"
                    />
                  </div>
                  <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                    Đăng nhập vào tool
                  </h2>
                </div>
                {step === 1 ? (
                  <form
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    id="token"
                    onSubmit={onStartClient}
                  >
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Id app
                      </label>
                      <input
                        style={{ backgroundColor: "white" }}
                        className=" text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="id"
                        name="id"
                        type="text"
                        value={teleToken.id}
                        onChange={(e) => {
                          setTeleToken({ ...teleToken, id: e.target.value });
                        }}
                        defaultValue={""}
                        placeholder="Nhập vào id app"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Hash app
                      </label>
                      <input
                        style={{ backgroundColor: "white" }}
                        className=" text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="hash"
                        name="hash"
                        value={teleToken.hash}
                        type="text"
                        onChange={(e) => {
                          setTeleToken({
                            ...teleToken,
                            hash: e.target.value,
                          });
                        }}
                        defaultValue={""}
                        placeholder="Nhập vào hash"
                      />
                    </div>
                    {/* <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                                            
                                        </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                                    </div> */}
                    <div className="flex items-center justify-between">
                      <Button
                        className="w-full"
                        children={"Tiếp theo"}
                        disabled={loading}
                      />
                    </div>
                  </form>
                ) : (
                  <form
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    onSubmit={onLogin}
                    id="logn"
                  >
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Số điện thoại
                      </label>
                      <input
                        style={{ backgroundColor: "white" }}
                        className=" text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="phone"
                        id="phone"
                        defaultValue={""}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        type="text"
                        placeholder="Nhập vào số điện thoại có mã vùng"
                      />
                    </div>
                    {/* <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                                            
                                        </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                                    </div> */}

                    <div className="flex items-center justify-between">
                      <Button className="w-full" children={"Đăng nhập"} />
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default Login;
