import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../server/api_endpoints';
import { jwtDecode } from 'jwt-decode';
import { Country, State } from 'country-state-city';

const AddressContent = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userID, setUserID] = useState(null);
  const [hasBillingDetails, setHasBillingDetails] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    country: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    email_add: "",
    username: "",
    note: "",
  });

  const [states, setStates] = useState([]);
  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    email_add: "",
  });

  const token = localStorage.getItem("token");
  const countries = Country.getAllCountries();

  useEffect(() => {
    if (token === null) return;
    const decoded = jwtDecode(token);
    setUserID(decoded.UserId);
  }, []);

  // New effect to fetch user email
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!userID) return;
      
      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_USER_DETAILS(userID),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status && response.data.response_code === 200) {
          const userData = response.data.result[0];
          setAddressDetails(prev => ({
            ...prev,
            email_add: userData.email
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user email", error);
      }
    };

    fetchUserEmail();
  }, [userID, token]);

  useEffect(() => {
    if (addressDetails.country) {
      const countryStates = State.getStatesOfCountry(addressDetails.country);
      setStates(countryStates);
    }
  }, [addressDetails.country]);

  useEffect(() => {
    const getBillingDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          API_ENDPOINTS.GET_BILLING_DETAILS_BY_USER(userID),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success && response.data.response_code === 200) {
          const data = response.data.result;
          setHasBillingDetails(true);
          setAddressDetails({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            company_name: data.company_name || "",
            country: data.country || "",
            address1: data.address1 || "",
            address2: data.address2 || "",
            city: data.city || "",
            state: data.state || "",
            zip_code: data.zip_code || "",
            phone: data.phone || "",
            email_add: data.email_add || "",
            username: data.username || "",
            note: data.note || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch billing details", error);
        setHasBillingDetails(false);
      } finally {
        setLoading(false);
      }
    };

    if (userID) {
      getBillingDetails();
    }
  }, [userID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent email field from being modified
    if (name === 'email_add') return;
    
    setAddressDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "country") {
      setAddressDetails((prev) => ({
        ...prev,
        state: "",
      }));
    }

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newError = { ...error };

    if (!addressDetails.first_name.trim()) {
      newError.first_name = "First name is required";
      isValid = false;
    }

    if (!addressDetails.last_name.trim()) {
      newError.last_name = "Last name is required";
      isValid = false;
    }

    if (!addressDetails.address1.trim()) {
      newError.address1 = "Street address is required";
      isValid = false;
    }

    if (!addressDetails.city.trim()) {
      newError.city = "City is required";
      isValid = false;
    }

    if (!addressDetails.state.trim()) {
      newError.state = "State is required";
      isValid = false;
    }

    if (!addressDetails.zip_code.trim()) {
      newError.zip_code = "ZIP code is required";
      isValid = false;
    }

    if (!addressDetails.phone.trim()) {
      newError.phone = "Phone number is required";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setSubmitting(true);

    try {
      let response;
      if (hasBillingDetails) {
        const updateBody = {
          firstName: addressDetails.first_name,
          lastName: addressDetails.last_name,
          company: addressDetails.company_name,
          country: addressDetails.country,
          address_line_01: addressDetails.address1,
          address_line_02: addressDetails.address2,
          city: addressDetails.city,
          state: addressDetails.state,
          zip: addressDetails.zip_code,
          phone: addressDetails.phone,
          email: addressDetails.email_add,
          note: addressDetails.note,
        };

        response = await axios.put(
          API_ENDPOINTS.UPDATE_BILLING_BY_USER(userID),
          updateBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        const createBody = {
          firstName: addressDetails.first_name,
          lastName: addressDetails.last_name,
          companyName: addressDetails.company_name,
          country: addressDetails.country,
          streetAddress: addressDetails.address1,
          apartment: addressDetails.address2,
          city: addressDetails.city,
          state: addressDetails.state,
          zipCode: addressDetails.zip_code,
          phone: addressDetails.phone,
          email: addressDetails.email_add,
          username: addressDetails.username,
          orderNotes: addressDetails.note,
          user_id: userID,
        };

        response = await axios.post(
          API_ENDPOINTS.CREATE_BILLING,
          createBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.status) {
        toast.success(
          hasBillingDetails
            ? "Billing details updated successfully"
            : "Billing details created successfully"
        );
        setHasBillingDetails(true);
      } else {
        toast.error(
          hasBillingDetails
            ? "Failed to update billing details"
            : "Failed to create billing details"
        );
      }
    } catch (error) {
      console.error("Error handling billing details:", error);
      toast.error(
        hasBillingDetails
          ? "Failed to update billing details"
          : "Failed to create billing details"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 rounded-xl border border-white/10 bg-[#0b1115] p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">Billing Address</h1>
      {loading && <p className="text-sm text-gray-400">Loading saved billing details...</p>}
      <p className="text-gray-400">
        The following addresses will be used on the checkout page by default.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-6">
        Billing address
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="flex w-full flex-col gap-2 sm:w-1/2">
            <label className="text-white">First name *</label>
            <input
              className={`p-2 rounded bg-[#333] text-white ${
                error.first_name ? "border border-red-500" : ""
              }`}
              type="text"
              name="first_name"
              value={addressDetails.first_name}
              onChange={handleInputChange}
              required
            />
            {error.first_name && (
              <span className="text-red-500 text-sm">{error.first_name}</span>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-1/2">
            <label className="text-white">Last name *</label>
            <input
              className={`p-2 rounded bg-[#333] text-white ${
                error.last_name ? "border border-red-500" : ""
              }`}
              type="text"
              name="last_name"
              value={addressDetails.last_name}
              onChange={handleInputChange}
              required
            />
            {error.last_name && (
              <span className="text-red-500 text-sm">{error.last_name}</span>
            )}
          </div>
        </div>

        <label className="text-white">Company name</label>
        <input
          className="p-2 rounded bg-[#333] text-white"
          type="text"
          name="company_name"
          value={addressDetails.company_name}
          onChange={handleInputChange}
        />

        <label className="text-white">Country / Region *</label>
        <select
          className="p-2 rounded bg-[#333] text-white"
          name="country"
          value={addressDetails.country}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>

        <label className="text-white">Street address line 1 *</label>
        <input
          className={`p-2 rounded bg-[#333] text-white ${
            error.address1 ? "border border-red-500" : ""
          }`}
          type="text"
          name="address1"
          value={addressDetails.address1}
          onChange={handleInputChange}
          required
        />
        {error.address1 && (
          <span className="text-red-500 text-sm">{error.address1}</span>
        )}

        <label className="text-white">Street address line 2</label>
        <input
          className="p-2 rounded bg-[#333] text-white"
          type="text"
          name="address2"
          value={addressDetails.address2}
          onChange={handleInputChange}
        />

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="flex w-full flex-col gap-2 sm:w-1/2">
            <label className="text-white">Town / City *</label>
            <input
              className={`p-2 rounded bg-[#333] text-white ${
                error.city ? "border border-red-500" : ""
              }`}
              type="text"
              name="city"
              value={addressDetails.city}
              onChange={handleInputChange}
              required
            />
            {error.city && (
              <span className="text-red-500 text-sm">{error.city}</span>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-1/2">
            <label className="text-white">State *</label>
            <select
              className={`p-2 rounded bg-[#333] text-white ${
                error.state ? "border border-red-500" : ""
              }`}
              name="state"
              value={addressDetails.state}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            {error.state && (
              <span className="text-red-500 text-sm">{error.state}</span>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="flex w-full flex-col gap-2 sm:w-1/2">
            <label className="text-white">ZIP Code *</label>
            <input
              className={`p-2 rounded bg-[#333] text-white ${
                error.zip_code ? "border border-red-500" : ""
              }`}
              type="text"
              name="zip_code"
              value={addressDetails.zip_code}
              onChange={handleInputChange}
              required
            />
            {error.zip_code && (
              <span className="text-red-500 text-sm">{error.zip_code}</span>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-1/2">
            <label className="text-white">Phone *</label>
            <input
              className={`p-2 rounded bg-[#333] text-white ${
                error.phone ? "border border-red-500" : ""
              }`}
              type="tel"
              name="phone"
              value={addressDetails.phone}
              onChange={handleInputChange}
              required
            />
            {error.phone && (
              <span className="text-red-500 text-sm">{error.phone}</span>
            )}
          </div>
        </div>

        <label className="text-white">Email address *</label>
        <input
          className="p-2 rounded bg-[#333] text-white"
          type="email"
          name="email_add"
          value={addressDetails.email_add}
          onChange={handleInputChange}
          required
          disabled
        />
        {error.email_add && (
          <span className="text-red-500 text-sm">{error.email_add}</span>
        )}

        <label className="text-white">Order Notes</label>
        <textarea
          className="p-2 rounded bg-[#333] text-white"
          name="note"
          value={addressDetails.note}
          onChange={handleInputChange}
          rows="4"
        />

        <button
          type="submit"
          disabled={submitting}
          className=" bg-gradient-to-b from-[#6496d3] to-[#00C7C1] mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Updating..."
            : hasBillingDetails
            ? "Update Address"
            : "Save Address"}
        </button>
      </form>
    </div>
  );
};

export default AddressContent;
