import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../server/api_endpoints";
import { jwtDecode } from "jwt-decode";
import DashboardOverview, { MessagesScreen } from "./DashboardOverview";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import Dropzone from "react-dropzone";
import { CgClose } from "react-icons/cg";
import { Country, State } from "country-state-city";

const DashboardComponents = () => {
  const { pathname } = useLocation();

  function AdminComponent(pathname) {
    switch (pathname) {
      case "/my-account/":
        return <DashboardOverview />;

      case "/my-account/orders":
        return <OrderContent />;

      case "/my-account/submissions":
        return <DashboardOverview />;

      case "/my-account/messages":
        return <MessagesScreen />;

      case "/my-account/edit-address":
        return <AddressContent />;

      case "/my-account/payment-methods":
        return <PaymentContent />;

      case "/my-account/edit-account":
        return <AccountContent />;

      default:
        return (
          <div>
            <h1>Page not found</h1>
          </div>
        );
    }
  }
  return <>{AdminComponent(pathname)}</>;
};

export default DashboardComponents;

const OrderContent = () => {
  const [userID, setUserID] = useState(null);
  const [package99Count, setPackage99Count] = useState(0);
  const [package299Count, setPackage299Count] = useState(0);
  const [usedCounts, setUsedCounts] = useState({
    package_99_count: 0,
    package_299_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [currentPackageType, setCurrentPackageType] = useState(null);
  const [videos99, setVideos99] = useState([]);
  const [videos299, setVideos299] = useState([]);

  // Get user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = jwtDecode(token);
    setUserID(decoded.UserId);
  }, []);

  // Fetch videos
  useEffect(() => {
    if (!userID) return;

    const getVideosByUserId = async () => {
      try {
        const requestBody = { user_id: userID };
        const response = await axios.post(
          API_ENDPOINTS.GET_USER_VIDEOS,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status) {
          const videos = response.data.result;
          const filtered99 = videos.filter((video) => video.packageType === "99");
          const filtered299 = videos.filter((video) => video.packageType === "299");
          setVideos99(filtered99);
          setVideos299(filtered299);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    getVideosByUserId();
  }, [userID]);

  // Fetch 99 package count
  useEffect(() => {
    if (!userID) return;

    const fetch99Count = async () => {
      try {
        const requestBody = {
          user_id: userID,
          packageType: "99",
        };
        const response = await axios.post(
          API_ENDPOINTS.GET_VIDEO_COUNT_99,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.response_code === 200) {
          setPackage99Count(response.data.count_99);
        }
      } catch (error) {
        console.error("Error fetching 99 package count:", error);
      }
    };

    fetch99Count();
  }, [userID]);

  // Fetch 299 package count
  useEffect(() => {
    if (!userID) return;

    const fetch299Count = async () => {
      try {
        const requestBody = {
          user_id: userID,
          packageType: "299",
        };
        const response = await axios.post(
          API_ENDPOINTS.GET_VIDEO_COUNT_299,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.response_code === 200) {
          setPackage299Count(response.data.count_299);
        }
      } catch (error) {
        console.error("Error fetching 299 package count:", error);
      }
    };

    fetch299Count();
  }, [userID]);

  // Fetch used video counts
  useEffect(() => {
    if (!userID) return;

    const fetchUsedCounts = async () => {
      try {
        const requestBody = { user_id: userID };
        const response = await axios.post(
          API_ENDPOINTS.GET_USED_VIDEO_COUNTS,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.response_code === 200) {
          setUsedCounts({
            package_99_count: response.data.result.package_99_count,
            package_299_count: response.data.result.package_299_count,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching used counts:", error);
        setLoading(false);
      }
    };

    fetchUsedCounts();
  }, [userID]);

  const handleDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const handleOpenModal = (packageType) => {
    setCurrentPackageType(packageType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(undefined);
    setCurrentPackageType(null);
  };

  const checkVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        const duration = video.duration / 60; // Convert to minutes
        resolve(duration);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("Error loading video metadata"));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("❌ Please select a file!", { position: "top-right" });
      return;
    }

    setUploadLoading(true);

    try {
      // Check file size
      const maxSizeMB = currentPackageType === "99" ? 500 : 3072;
      if (selectedFile.size / 3072 / 3072 > maxSizeMB) {
        toast.warning(`⚠️ File size should be less than ${maxSizeMB} MB!`, {
          position: "top-right",
        });
        setUploadLoading(false);
        return;
      }

      // Check video duration
      toast.info("⏳ Checking video duration...", { position: "top-right" });
      const duration = await checkVideoDuration(selectedFile);

      // Validate duration based on package type
      if (currentPackageType === "99") {
        if (duration < 23 || duration > 25) {
          toast.warning(
            "⚠️ For the $99 package, video must be between 23-25 minutes!", 
            { position: "top-right" }
          );
          setUploadLoading(false);
          return;
        }
      } else if (currentPackageType === "299") {
        if (duration < 75) {
          toast.warning(
            "⚠️ For the $299 package, video must be 75 minutes or longer!", 
            { position: "top-right" }
          );
          setUploadLoading(false);
          return;
        }
      }

      // Proceed with upload
      toast.info("⏳ Uploading video, please wait...", { position: "top-right" });
      
      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("user_id", userID);
      formData.append("packageType", currentPackageType);

      const response = await axios.post(API_ENDPOINTS.UPLOAD_VIDEO, formData);

      if (response.data.response_code === 200) {
        toast.success("✅ File uploaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          handleCloseModal();
        }, 2000);

        setSelectedFile(undefined);
        setUploadLoading(false);

        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("❌ Error uploading file. Please try again!", {
        position: "top-right",
        autoClose: 3000,
      });
      setUploadLoading(false);
    }
  };

  const canUpload99 = package99Count > usedCounts.package_99_count;
  const canUpload299 = package299Count > usedCounts.package_299_count;

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0b1115] px-6 py-12 text-gray-300">
        <p className="text-center">Loading submissions...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5 rounded-xl border border-white/10 bg-[#0b1115] p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-white">New Submission</h1>

        {/* $99 Package Section */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-white">$99 package</h2>
              <p className="text-sm text-gray-200">
                Videos used: {usedCounts.package_99_count} / {package99Count}
              </p>
            </div>
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                canUpload99
                  ? "bg-gradient-to-b from-sky-500 to-[#00D0B8] text-white hover:opacity-90"
                  : "cursor-not-allowed border border-cyan-300/15 bg-cyan-400/10 text-cyan-100/50"
              }`}
              disabled={!canUpload99}
              onClick={() => handleOpenModal("99")}
            >
              Add Video
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {videos99.length > 0 ? (
              videos99.map((video) => (
                <div key={video.id} className="border p-2 rounded-md">
                  <video width="100%" controls>
                    <source src={video.url} type="video/mp4" />
                  </video>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No videos available.</p>
            )}
          </div>
        </div>

        {/* $299 Package Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-white">$299 package</h2>
              <p className="text-sm text-gray-200">
                Videos used: {usedCounts.package_299_count} / {package299Count}
              </p>
            </div>
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                canUpload299
                  ? "bg-gradient-to-b from-sky-500 to-[#00D0B8] text-white hover:opacity-90"
                  : "cursor-not-allowed border border-cyan-300/15 bg-cyan-400/10 text-cyan-100/50"
              }`}
              disabled={!canUpload299}
              onClick={() => handleOpenModal("299")}
            >
              Add Video
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {videos299.length > 0 ? (
              videos299.map((video) => (
                <div key={video.id} className="border p-2 rounded-md">
                  <video width="100%" controls>
                    <source src={video.url} type="video/mp4" />
                  </video>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No videos available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full z-[100] flex items-center justify-center">
          <div
            className="absolute w-full h-full bg-black opacity-70 cursor-pointer"
            onClick={handleCloseModal}
          />
          <button
            className="absolute right-4 top-4 flex aspect-square w-10 items-center justify-center rounded-full border border-white/15 bg-[#11191d] text-xl font-bold text-white hover:bg-white/10 sm:right-6 sm:top-6"
            onClick={handleCloseModal}
          >
            <CgClose />
          </button>
          <div className="relative h-auto max-h-[90vh] w-[min(92vw,48rem)] overflow-y-auto rounded-xl border border-white/10 bg-[#0b1115] p-5 text-white shadow-2xl sm:p-8">
            <h1 className="mb-4 text-2xl font-bold">Upload Video</h1>
            <p className="text-sm text-gray-300">Allowed extension: mp4, zip.</p>
            <p className="mb-2 text-sm text-gray-300">
              Max allowed size: {currentPackageType === "99" ? "500 MB" : "3072 MB"} for ${currentPackageType} package
            </p>
            <p className="mb-4 text-sm font-medium text-gray-200">
              {currentPackageType === "99" 
                ? "Video duration must be between 23-25 minutes"
                : "Video duration must be 75 minutes or longer"}
            </p>
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div
                    {...getRootProps()}
                    className="z-[100] flex min-h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-black/20 p-5 text-center hover:border-cyan-300/60 sm:min-h-64"
                  >
                    <input {...getInputProps()} type="file" accept="video/*" />
                    <div className="items-center justify-center text-center">
                      {selectedFile ? (
                        <div className="flex items-center justify-center mx-auto mb-2">
                          <iframe
                            src={URL.createObjectURL(selectedFile)}
                            alt="profile"
                            className="w-[250px] md:w-[400px] lg:w-[500px] aspect-video"
                          />
                        </div>
                      ) : (
                        <FaCloudUploadAlt
                          className="items-center justify-center mx-auto mb-2 text-4xl"
                          color="darkblue"
                        />
                      )}
                      {!selectedFile && (
                        <p className="text-sm text-gray-500">
                          Drag &apos;n&apos; drop some files here, or click to select files
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedFile && (
                    <div className="flex items-center justify-center mx-auto gap-2 mb-2">
                      <p className="text-sm text-cyan-200">
                        {selectedFile.name}
                      </p>
                      <FaTrash
                        className="text-md text-red-500 cursor-pointer"
                        onClick={() => setSelectedFile(undefined)}
                      />
                    </div>
                  )}
                </section>
              )}
            </Dropzone>
            <button
              className="mt-4 w-full rounded-md bg-cyan-400 px-5 py-3 font-semibold text-[#031015] hover:bg-cyan-300 sm:w-auto"
              onClick={handleSubmit}
              disabled={uploadLoading}
            >
              {uploadLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

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

const PaymentContent = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token === null) return;
    try {
      const decoded = jwtDecode(token);
      setUserID(decoded.UserId);
    } catch {
      setError("Invalid token");
    }
  }, [token]);

  useEffect(() => {
    if (!userID) return;

    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch(
          API_ENDPOINTS.GET_PAYMENT_DETAILS_BY_USER(userID),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();

        if (data.success) {
          // Remove duplicates by keeping only the first occurrence of each pay_id
          const uniquePayments = data.result.reduce((acc, current) => {
            const payIdExists = acc.find(
              item => item.payments.pay_id === current.payments.pay_id
            );
            if (!payIdExists) {
              acc.push(current);
            }
            return acc;
          }, []);
          
          setPaymentData(uniquePayments);
        } else {
          setError("Failed to fetch payment data");
        }
      } catch {
        setError("Error fetching payment data");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [userID]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toLowerCase(),
    }).format(amount);
  };

  if (!token) {
    return (
      <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
        <div className="rounded-lg">
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400">
              Please login to view payment history
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
        <div className="rounded-lg">
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400">Loading payment history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
        <div className="rounded-lg">
          <div className="flex justify-center items-center h-40">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-64 max-w-4xl rounded-xl border border-white/10 bg-[#0b1115] p-4">
      <div className="rounded-lg">
        <div className="border-b border-gray-800 p-4">
          <h2 className="text-xl font-semibold text-white">Payment History</h2>
        </div>
        <div className="p-4">
          {paymentData.length > 0 ? (
            <div className="space-y-4">
              {paymentData.map((payment) => (
                <div
                  key={payment.payments.pay_id}
                  className="border border-gray-800 rounded-lg p-4 bg-gray-800 shadow-sm hover:bg-gray-750"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Payment ID</p>
                      <p className="font-medium text-gray-200">
                        {payment.payments.pay_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="font-medium text-gray-200">
                        {formatCurrency(
                          payment.payments.amount,
                          payment.payments.currency
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="font-medium text-gray-200">
                        {payment.user.firstName} {payment.user.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium text-gray-200">
                        {payment.user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="font-medium text-gray-200">
                        {formatDate(payment.payments.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.payments.status === "succeeded"
                            ? "bg-green-900 text-green-200"
                            : "bg-yellow-900 text-yellow-200"
                        }`}
                      >
                        {payment.payments.status.charAt(0).toUpperCase() +
                          payment.payments.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">
              No payment history available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

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

