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
  const [changePasswordEnabled, setChangePasswordEnabled] = useState(false);

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
    setAccountDetails((current) => ({ ...current, [name]: value }));
    setError((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };
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
    if (changePasswordEnabled) {
      errors.currentPassword = accountDetails.currentPassword
        ? ""
        : "Enter your current password";
      errors.newPassword = accountDetails.newPassword
        ? ""
        : "Enter a new password";
      errors.confirmNewPassword = accountDetails.confirmNewPassword
        ? accountDetails.confirmNewPassword === accountDetails.newPassword
          ? ""
          : "Passwords do not match"
        : "Confirm your new password";
    }

    setError(errors);
    return Object.values(errors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const requestBody = {
          firstName: accountDetails.firstName,
          lastName: accountDetails.lastName,
          username: accountDetails.displayName,
          email: accountDetails.email,
          ...(changePasswordEnabled
            ? {
                currentPassword: accountDetails.currentPassword,
                newPassword: accountDetails.newPassword,
              }
            : {}),
        };

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

        if (response.status === 200) {
          toast.success("Account details updated successfully");
          setAccountDetails({
            ...accountDetails,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
          setChangePasswordEnabled(false);
        }
      } catch {
        toast.error("Failed to update account details. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-5 rounded-xl border border-white/10 bg-[#0b1115] p-4 sm:p-6">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit} autoComplete="off">
        <h1 className="mb-2 text-2xl font-semibold text-white">Account Settings</h1>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="flex w-full flex-col gap-2 sm:w-1/2">
            <label className="text-white">First name *</label>
            <input
              name="firstName"
              type="text"
              autoComplete="given-name"
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
              autoComplete="family-name"
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
          autoComplete="nickname"
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
          autoComplete="email"
          value={accountDetails.email}
          placeholder=""
          className="w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          onChange={handleInputChange}
        />
        {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
        <section className="mt-5 space-y-3 rounded-lg border border-white/10 p-4" aria-labelledby="password-change-heading">
          <div>
            <h2 id="password-change-heading" className="text-xl font-bold text-white">Password</h2>
            <p className="mt-1 text-sm text-gray-400">
              Your password stays unchanged when you update your account details.
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              checked={changePasswordEnabled}
              onChange={(event) => {
                setChangePasswordEnabled(event.target.checked);
                setAccountDetails((current) => ({
                  ...current,
                  currentPassword: "",
                  newPassword: "",
                  confirmNewPassword: "",
                }));
                setError((current) => ({
                  ...current,
                  currentPassword: "",
                  newPassword: "",
                  confirmNewPassword: "",
                }));
              }}
              className="h-4 w-4 accent-cyan-400"
            />
            Change password
          </label>
          {changePasswordEnabled && (
            <div className="space-y-3 border-t border-white/10 pt-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white" htmlFor="currentPassword">
                  Current password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={accountDetails.currentPassword}
                  className="w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  onChange={handleInputChange}
                />
                {error.currentPassword && (
                  <p className="text-sm text-red-500">{error.currentPassword}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white" htmlFor="newPassword">
                  New password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={accountDetails.newPassword}
                  className="w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  onChange={handleInputChange}
                />
                {error.newPassword && (
                  <p className="text-sm text-red-500">{error.newPassword}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white" htmlFor="confirmNewPassword">
                  Confirm new password
                </label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  autoComplete="new-password"
                  value={accountDetails.confirmNewPassword}
                  className="w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  onChange={handleInputChange}
                />
                {error.confirmNewPassword && (
                  <p className="text-sm text-red-500">{error.confirmNewPassword}</p>
                )}
              </div>
            </div>
          )}
        </section>
        <button
          type="submit"
          className="mt-3 w-full rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
        >
          Save changes
        </button>
      </form>
    </div>
  );
};

export default AccountContent;
