import React, { useEffect, useState } from "react";
import { useWebContext } from "../context/contextprovider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import { initFlowbite } from "flowbite";

const Login = () => {
  const navigate = useNavigate();

  const { LoginAPI, loader, FetchDNSDdata } = useWebContext();
  useEffect(() => {
    initFlowbite();
  }, []);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState();
  const handleLogin = async (e) => {
    e.preventDefault();
    const val = await LoginAPI(email, password);
    if (val) {
      toast.success("Logged In successfully");
      navigate("/dashboard");
    } else {
      toast.error("Logged In failed");
    }
  };
  return (
    <div class="flex justify-center items-center h-screen">
      {loader ? (
        <div
          className="flex items-center justify-center"
          style={{ width: "100%", height: "100vh" }}
        >
          <div>
            <MoonLoader color="#1A56DB" />
          </div>
        </div>
      ) : (
        <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form class="space-y-6" action="#">
            <h5 class="text-xl font-medium text-gray-900 dark:text-white">
              Sign in to Dns Manager by Abhay
            </h5>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="email"
                required
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              onClick={(e) => handleLogin(e)}
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login to your account
            </button>
            <div class=" flex justify-center items-center text-sm font-medium text-gray-500 dark:text-gray-300">
              Not have credentials? Try contacting the admin abhayptsr@gmail.com
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
