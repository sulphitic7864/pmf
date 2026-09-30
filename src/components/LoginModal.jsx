import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { GrClose } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { API_ENDPOINTS } from "../server/api_endpoints";

const initialLoginData = { loginemail: "", loginpassword: "" };

const LoginModal = ({ showModal, setShowModal }) => {
  const [loginData, setLoginData] = useState(initialLoginData);
  const dropdownRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginData.loginemail === "" || loginData.loginpassword === "") {
      alert("Please fill in all fields");
      return;
    }
    try {
      const requestBody = {
        usernameOrEmail: loginData.loginemail,
        password: loginData.loginpassword,
      };
      const response = await axios.post(API_ENDPOINTS.LOGIN, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.response_code === 200) {
        localStorage.setItem("token", response.data.result.token);
        localStorage.setItem('userid', response.data.result.userId);
        toast.success(response.data.message);
        setLoginData(initialLoginData);
        setTimeout(() => {
          setShowModal(false);
          navigate("/my-account/");
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      toast.error("Invalid login credentials");
    }
  };

  return (
    <>
      <div
        ref={dropdownRef}
        className="w-[19rem] absolute top-10 -right-28 sm:right-0 min-h-96 z-[100] p-5 bg-black "
      >
        <div className="mb-3 flex items-center justify-between ">
          <h2 className="text-white text-3xl font-semibold">Login</h2>
          <div
            className="w-10 h-10 cursor-pointer flex items-center justify-center hover:rotate-180 transition-all duration-300"
            onClick={() => setShowModal(!showModal)}
          >
            <GrClose className=" text-2xl" />
          </div>
        </div>
        <div>
          <div className="w-full flex flex-col gap-2 mb-2">
            <input
              id="loginemail"
              type="text"
              value={loginData.loginemail}
              onChange={handleLoginChange}
              placeholder="Username or Email"
              className="w-full bg-[#333] rounded-md  p-3 text-sky-600 focus:outline-none focus:bg-sky-100 mb-2"
            />
            <div className="relative">
              <input
                id="loginpassword"
                type={showPassword ? "text" : "password"}
                value={loginData.loginpassword}
                onChange={handleLoginChange}
                placeholder="Password"
                className="w-full bg-[#333] rounded-md  p-3 text-sky-600 focus:outline-none focus:bg-sky-100"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="text-white"
            />
            <label htmlFor="remember" className="text-white">
              Remember me
            </label>
          </div>
          <button
            onClick={handleLogin}
            className="bg-gradient-to-b from-sky-500 to-[#00D0B8] rounded-md text-white px-2 py-3 w-full"
          >
            Login
          </button>
        </div>
        <div className="text-white text-center mt-4 flex flex-col gap-2 ">
          <Link
            to={"/my-account/lost-password/"}
            className="text-sm text-gray-300/80"
          >
            Lost your password?
          </Link>
          <Link
            to={"/my-account/"}
            className="text-md font-semibold text-gray-300/80"
          >
            Create An Account
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
