import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../server/api_endpoints';
import { jwtDecode } from 'jwt-decode';

const AccountContent = () => {
  const [accountDetails, setAccountDetails] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [userID, setUserID] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token === null) return;
    const decoded = jwtDecode(token);
    setUserID(decoded.UserId);
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_USER_DETAILS(userID),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data.result[0];
        setAccountDetails({
          firstName: data.firstName ? data.firstName : "",
          lastName: data.lastName ? data.lastName : "",
          displayName: data.username ? data.username : "",
          email: data.email ? data.email : "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } catch {
        console.log("Failed to fetch user details");
      }
    };
    getUserDetails();
  }, [userID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails({ ...accountDetails, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const validate = () => {
    let errors = {};
    errors.firstName = accountDetails.firstName ? "" : "This field is required";
    errors.lastName = accountDetails.lastName ? "" : "This field is required";
    errors.displayName = accountDetails.displayName
      ? ""
      : "This field is required";
    errors.email = accountDetails.email
      ? /$^|.+@.+..+/.test(accountDetails.email)
        ? ""
        : "Email is not valid"
      : "This field is required";
    errors.newPassword =
      accountDetails.currentPassword === ""
        ? ""
        : accountDetails.newPassword === ""
        ? "This field is required"
        : "";
    errors.confirmNewPassword =
      accountDetails.newPassword === "" ? "" : "This field is required";
    errors.confirmNewPassword =
      accountDetails.confirmNewPassword === accountDetails.newPassword
        ? ""
        : "Passwords do not match";

    setError({ ...errors });
    return Object.values(errors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    console.log("1111111");
    e.preventDefault();
    console.log("1111111");
    if (validate()) {
      try {
        const requestBody = {
          firstName: accountDetails.firstName,
          lastName: accountDetails.lastName,
          username: accountDetails.displayName,
          email: accountDetails.email,
          currentPassword: accountDetails.currentPassword || "",
          newPassword: accountDetails.newPassword || "",
        };

        console.log(token);
        const response = await axios.put(
          API_ENDPOINTS.UPDATE_USER_DETAILS(userID),
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token
              "Content-Type": "application/json",
            },
          }
        );

        console.log("response", response);
        if (response.status === 200) {
          toast.success("Account details updated successfully");
          setAccountDetails({
            ...accountDetails,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
        }
      } catch {
        toast.error("Failed to update account details. Please try again.");
        console.log(accountDetails);
      }
    }
  };

  return (
    <div className="space-y-5 rounded-xl border border-white/10 bg-[#0b1115] p-4 sm:p-6">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <h1 className="mb-2 text-2xl font-semibold text-white">Account Settings</h1>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="flex w-full flex-col gap-2 sm:w-1/2">
            <label className="text-white">First name *</label>
            <input
              name="firstName"
              type="text"
              value={accountDetails.firstName}
              placeholder=""
              className="w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              onChange={handleInputChange}
            />
            {error.firstName && (
              <p className="text-red-500 text-sm">{error.firstName}</p>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-1/2">
            <label className="text-white">Last name *</label>
            <input
              name="lastName"
              type="text"
              value={accountDetails.lastName}
              placeholder=""
              className="w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              onChange={handleInputChange}
            />
            {error.lastName && (
              <p className="text-red-500 text-sm">{error.lastName}</p>
            )}
          </div>
        </div>
        <label className="text-white">Display name *</label>
        <input
          name="displayName"
          type="text"
          value={accountDetails.displayName}
          placeholder=""
          className="w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          onChange={handleInputChange}
        />
        {error.displayName && (
          <p className="text-red-500 text-sm">{error.displayName}</p>
        )}
        <p className="text-gray-400 text-sm">
          This will be how your name will be displayed in the account section
          and in reviews
        </p>

        <label className="text-white">Email address *</label>
        <input
          name="email"
          type="email"
          value={accountDetails.email}
          placeholder=""
          className="w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          onChange={handleInputChange}
        />
        {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
        <h2 className="text-white text-2xl font-bold mt-5">Password change</h2>
        <label className="text-white">
          Current password (leave blank to leave unchanged)
        </label>
        <input
          name="currentPassword"
          type="password"
          value={accountDetails.currentPassword}
          className="w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          onChange={handleInputChange}
        />
        {error.currentPassword && (
          <p className="text-red-500 text-sm">{error.currentPassword}</p>
        )}
        <label className="text-white">
          New password (leave blank to leave unchanged)
        </label>
        <input
          name="newPassword"
          type="password"
          value={accountDetails.newPassword}
          className="w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          onChange={handleInputChange}
        />
        {error.newPassword && (
          <p className="text-red-500 text-sm">{error.newPassword}</p>
        )}
        <label className="text-white">Confirm new password</label>
        <input
          name="confirmNewPassword"
          type="password"
          value={accountDetails.confirmNewPassword}
          className="p-2 rounded bg-[#333] text-blue-500/70"
          onChange={handleInputChange}
        />
        {error.confirmNewPassword && (
          <p className="text-red-500 text-sm">{error.confirmNewPassword}</p>
        )}
        <button
          type="submit"
          className="mt-3 w-full rounded-md bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 font-semibold text-[#031015] transition-opacity hover:opacity-90 sm:w-auto"
        >
          Save changes
        </button>
      </form>
    </div>
  );
};

export default AccountContent;
