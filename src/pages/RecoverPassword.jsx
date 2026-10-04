import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../server/api_endpoints";

const RecoverPassword = () => {
  const [recoverEmail, setRecoverEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [step, setStep] = React.useState(1);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!recoverEmail) {
      toast.error("Please enter your email or username");
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.SEND_OTP,
        {
          usernameOrEmail: recoverEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("OTP sent successfully!");
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleConfirmOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.CONFIRM_OTP,
        {
          usernameOrEmail: recoverEmail,
          enteredOTP: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("OTP validated successfully!");
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleRecoverPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    try {
      const response = await axios.patch(
        API_ENDPOINTS.RECOVER_PASSWORD,
        {
          usernameOrEmail: recoverEmail,
          newPassword: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate('/')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen px-16 md:px-32 lg:px-44 py-10 w-full bg-black">
      <h1 className="text-4xl text-white">Account</h1>
      <div className="flex items-center text-white justify-center mt-10">
        {step === 1 ? (
          <div className="w-full max-w-5xl flex justify-center">
            <div className="sm:w-2/3 lg:w-1/2 flex flex-col p-8 rounded-l-lg">
              <h2 className="text-md mb-6 text-center">
                Lost your password? Please enter your username or email address.
                You will receive a link to create a new password via email.
              </h2>
              <form onSubmit={handleSendOTP}>
                <div className="mb-4">
                  <label
                    className="block text-center text-white text-sm font-bold mb-2"
                    htmlFor="recoverEmail"
                  >
                    Username or Email*
                  </label>
                  <input
                    className="appearance-none bg-[#333] border-none rounded-md w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    id="recoverEmail"
                    type="text"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className="group h-auto py-3 flex items-center hover:text-gray-500 justify-center w-full relative px-5 text-sm border-none rounded-sm text-white bg-gradient-to-b from-sky-500 to-[#00D0B8] overflow-hidden"
                    type="submit"
                  >
                    <p className="z-50 w-max relative">Send OTP</p>
                    <div className="w-0 h-full top-0 left-0 absolute bg-white z-20 transition-all duration-300 group-hover:w-full"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : step === 2 ? (
          <div className="w-full max-w-5xl flex justify-center">
            <div className="sm:w-2/3 lg:w-1/2 flex flex-col p-8 rounded-l-lg">
              <h2 className="text-md mb-6 text-center">
                Please enter the OTP sent to your email/phone.
              </h2>
              <form onSubmit={handleConfirmOTP}>
                <div className="mb-4">
                  <label
                    className="block text-center text-white text-sm font-bold mb-2"
                    htmlFor="otp"
                  >
                    Enter OTP*
                  </label>
                  <input
                    className="appearance-none bg-[#333] border-none rounded-md w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className="group h-auto py-3 flex items-center hover:text-gray-500 justify-center w-full relative px-5 text-sm border-none rounded-sm text-white bg-gradient-to-b from-sky-500 to-[#00D0B8] overflow-hidden"
                    type="submit"
                  >
                    <p className="z-50 w-max relative">Confirm OTP</p>
                    <div className="w-0 h-full top-0 left-0 absolute bg-white z-20 transition-all duration-300 group-hover:w-full"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl flex justify-center">
            <div className="sm:w-2/3 lg:w-1/2 flex flex-col md:p-8 rounded-l-lg">
              <h2 className="text-md mb-6 text-center">
                Enter your new password.
              </h2>
              <form onSubmit={handleRecoverPassword}>
                <div className="mb-4 relative">
                  <label
                    className="block text-center text-white text-sm font-bold mb-2"
                    htmlFor="newPassword"
                  >
                    Enter New Password*
                  </label>
                  <input
                    className="appearance-none bg-[#333] border-none rounded-md w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span
                    className="absolute right-3 top-9 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className="group h-auto py-3 flex items-center hover:text-gray-500 justify-center w-full relative px-5 text-sm border-none rounded-sm text-white bg-gradient-to-b from-sky-500 to-[#00D0B8] overflow-hidden"
                    type="submit"
                  >
                    <p className="z-50 w-max relative">Reset Password</p>
                    <div className="w-0 h-full top-0 left-0 absolute bg-white z-20 transition-all duration-300 group-hover:w-full"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoverPassword;