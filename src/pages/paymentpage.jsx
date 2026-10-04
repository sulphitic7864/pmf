import { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  useElements,
  Elements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Country, State } from "country-state-city";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import {
  API_ENDPOINTS,
  createpayment,
  getBillingDetailsbyuserId,
  getcheckemailadd,
  getcheckusername,
  getPackageById,
} from "../server/api_endpoints";
import { useSearchParams } from "react-router-dom";
import { CartContext } from "../constants/CartContext";
import { useNavigate } from "react-router-dom";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const initialCheckoutDetails = {
  first_name: "",
  last_name: "",
  company_name: "",
  country: "US",
  address1: "",
  address2: "",
  city: "",
  state: "SC",
  zip_code: "",
  phone: "",
  email_add: "",
  username: "",
  note: "",
};

// Checkout Page Component
const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState(null);

  const [paymentDetails, setPaymentDetails] = useState(initialCheckoutDetails);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [message, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUserNameError] = useState("");
  const [email, setEmail] = useState("");
  const [user_name, setUser_name] = useState("");
  const [emailAddress, setEmailAdd] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));
  const [userId, setUserId] = useState(() => localStorage.getItem("userid"));
  const [accountMode, setAccountMode] = useState("register");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [filmTitle, setFilmTitle] = useState("");
  const [filmFile, setFilmFile] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { cart, subtotal, totalAmount, discount, setCart } =
    useContext(CartContext);
  const festivalPackageId = searchParams.get("packageId") || String(cart[0]?.id || cart[0]?.packageid || "");

  useEffect(() => {
    const fetchCountries = () => {
      const getcountries = Country.getAllCountries();
      setCountries(getcountries);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    let isActive = true;
    const currentPackage = cart.find((item) => String(item.id || item.packageid) === festivalPackageId);
    if (currentPackage) {
      if (cart.length !== 1) setCart([currentPackage]);
      return () => { isActive = false; };
    }
    if (!festivalPackageId) {
      navigate("/contest", { replace: true });
      return () => { isActive = false; };
    }

    const loadFestival = async () => {
      try {
        const response = await getPackageById(festivalPackageId);
        if (!response?.result) throw new Error("Festival details could not be loaded.");
        const selectedPackage = {
          ...response.result,
          id: response.result.id || festivalPackageId,
          packageid: response.result.id || festivalPackageId,
        };
        if (isActive) {
          setCart([selectedPackage]);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(error.message);
          navigate("/contest", { replace: true });
        }
      }
    };

    loadFestival();
    return () => { isActive = false; };
  }, [festivalPackageId, cart, navigate, setCart]);

  useEffect(() => {
    const fetchStates = () => {
      const getstates = State.getStatesOfCountry(paymentDetails.country);
      setStates(getstates);
    };
    fetchStates();
  }, [paymentDetails.country]);

  useEffect(() => {
    if (!festivalPackageId) return;
    let isActive = true;
    fetch(API_ENDPOINTS.PAY_STRIPE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageId: festivalPackageId }),
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Unknown error occurred");
        }
        return response.json(); // Parse successful response
      })
      .then((data) => {
        if (isActive) {
          setClientSecret(data.clientSecret);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        if (isActive) toast.error(error.message);
      });
    return () => { isActive = false; };
  }, [festivalPackageId]);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
    loader: "auto",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handleAccountLogin = async (event) => {
    event.preventDefault();
    setAuthError("");
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        usernameOrEmail: loginIdentifier,
        password: loginPassword,
      });
      const result = response.data?.result;
      if (response.data?.response_code !== 200 || !result?.token) {
        throw new Error(response.data?.message || "Login failed.");
      }
      localStorage.setItem("token", result.token);
      localStorage.setItem("userid", result.userId);
      setUserId(String(result.userId));
      setUserLoggedIn(true);
      setLoginPassword("");
    } catch (error) {
      setAuthError(error.response?.data?.message || "Invalid login credentials.");
    }
  };

  useEffect(() => {
    if (!userLoggedIn || !userId) return;
    let isActive = true;
    const loadAccountDetails = async () => {
      try {
        const [billingResponse, userResponse] = await Promise.all([
          getBillingDetailsbyuserId(userId),
          axios.get(API_ENDPOINTS.GET_USER_DETAILS(userId)),
        ]);
        const account = userResponse.data?.result?.[0] || userResponse.data?.result;
        const billing = billingResponse?.result;
        if (isActive) {
          if (billing) setPaymentDetails((current) => ({ ...current, ...billing }));
          const accountEmail = billing?.email_add || account?.email || "";
          setEmail(accountEmail);
          setEmailAdd(accountEmail);
          setUser_name(account?.username || billing?.username || "");
        }
      } catch (error) {
        console.error("Error loading account details:", error);
      }
    };
    loadAccountDetails();
    return () => { isActive = false; };
  }, [userLoggedIn, userId]);

  useEffect(() => {
    const checkEmail = async () => {
      if (userLoggedIn) return;
      if (email.length === 0) {
        setEmailError("");
        return;
      }
      console.log("emailaddress", email);
      try {
        const response = await getcheckemailadd(email);
        const xxxx = response.response_code;
        console.log("yyya", xxxx);
        // const code = response.response.data.status
        if (xxxx == 200) {
          // setEmailAdd(email);
          setEmailError(response.response_code);
        } else {
          setEmailError("");
        }
      } catch (error) {
        setEmailError("Error checking email. Try again later.", error);
      }
    };

    const checkUsername = async () => {
      if (userLoggedIn) return;
      if (user_name.length === 0) {
        setUserNameError("");
        return;
      }
      console.log("Username", user_name);
      try {
        const response = await getcheckusername(user_name);
        console.log("yyyauser", response);
        const xxxx = response.response_code;

        // const code = response.response.data.status
        if (xxxx == 200) {
          // setEmailAdd(email);
          setUserNameError(response.response_code);
        } else {
          setUserNameError("");
        }
      } catch (error) {
        setUserNameError("Error checking username. Try again later.", error);
      }
    };

    // Delay request until user stops typing (debounce)
    const delayDebounce = setTimeout(() => {
      checkEmail();
      checkUsername();
    }, 500); // Wait 500ms before sending request

    return () => clearTimeout(delayDebounce); // Cleanup function
  }, [email, user_name, userLoggedIn]);

  console.log("WWWW", discount);

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-black px-10 md:px-16 lg:px-44 gap-10 pt-16 text-white">
      <div className="w-full md:w-1/2">
        {!userLoggedIn ? (
          <section className="mb-6 rounded-lg border border-white/10 bg-[#171717] p-5">
            <h2 className="text-xl font-semibold">Filmmaker account</h2>
            <div className="mt-4 flex gap-2 border-b border-white/10">
              <button type="button" onClick={() => { setAccountMode("register"); setAuthError(""); }} className={`border-b-2 px-3 py-2 text-sm ${accountMode === "register" ? "border-cyan-300 text-cyan-200" : "border-transparent text-gray-400"}`}>New filmmaker</button>
              <button type="button" onClick={() => { setAccountMode("login"); setAuthError(""); }} className={`border-b-2 px-3 py-2 text-sm ${accountMode === "login" ? "border-cyan-300 text-cyan-200" : "border-transparent text-gray-400"}`}>Log in</button>
            </div>
            {accountMode === "login" ? (
              <form onSubmit={handleAccountLogin} className="mt-4 space-y-3">
                <label className="block text-sm">Username or email
                  <input className="mt-1 w-full rounded border border-white/15 bg-[#333] p-2" autoComplete="username" value={loginIdentifier} onChange={(event) => setLoginIdentifier(event.target.value)} required />
                </label>
                <label className="block text-sm">Password
                  <input className="mt-1 w-full rounded border border-white/15 bg-[#333] p-2" type="password" autoComplete="current-password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required />
                </label>
                <button className="rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300" type="submit">Log in and continue</button>
              </form>
            ) : (
              <div className="mt-4 space-y-3">
                <label className="block text-sm">Choose a username
                  <input className="mt-1 w-full rounded border border-white/15 bg-[#333] p-2" autoComplete="username" value={user_name} onChange={(event) => setUser_name(event.target.value)} required />
                </label>
                <p className="text-xs leading-5 text-gray-400">After successful payment, we’ll create your filmmaker account and email your login password.</p>
              </div>
            )}
            {authError && <p role="alert" className="mt-3 text-sm text-red-300">{authError}</p>}
            {emailError === 200 && accountMode === "register" && <p role="alert" className="mt-3 text-sm text-amber-200">This email already has an account. Log in to continue without creating a duplicate.</p>}
            {usernameError === 200 && accountMode === "register" && <p role="alert" className="mt-3 text-sm text-amber-200">That username is already taken.</p>}
          </section>
        ) : (
          <p className="mb-6 rounded-lg border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-200">Logged in as {paymentDetails.email_add || email || "filmmaker"}</p>
        )}
        <form className="space-y-4">
          <h3 className="text-3xl font-semibold">Film details</h3>
          <label className="block">Film title
            <input className="mt-1 w-full rounded border border-gray-900 bg-[#333] p-2" type="text" value={filmTitle} onChange={(event) => setFilmTitle(event.target.value)} required />
          </label>
          <label className="block">Film file
            <input className="mt-1 w-full rounded border border-gray-900 bg-[#333] p-2" type="file" accept="video/*,.mov" onChange={(event) => {
              const file = event.target.files?.[0] || null;
              const maxSize = String(festivalPackageId) === "1" ? 500 * 1024 * 1024 : 3 * 1024 * 1024 * 1024;
              if (file && file.size > maxSize) {
                setFilmFile(null);
                event.target.value = "";
                setErrorMessage(`This festival accepts video files up to ${String(festivalPackageId) === "1" ? "500 MB" : "3 GB"}.`);
                return;
              }
              setFilmFile(file);
              setErrorMessage("");
            }} required />
          </label>
          {filmFile && <p className="text-xs text-gray-400">Selected: {filmFile.name}</p>}
          {message && <p role="alert" className="text-sm text-red-300">{message}</p>}
          <h3 className="pt-4 text-3xl font-semibold">Billing details</h3>
          <div className="flex w-full gap-2">
            <div className="flex flex-col gap-2 w-full">
              <label className="block">First name</label>
              <input
                className="w-full p-2 border bg-[#333] border-gray-900 rounded"
                type="text"
                name="first_name"
                value={paymentDetails.first_name}
                required
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="block">Last name</label>
              <input
                className="w-full p-2 border bg-[#333] border-gray-900 rounded"
                type="text"
                name="last_name"
                value={paymentDetails.last_name}
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <label className="block">Company name (optional)</label>
          <input
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            type="text"
            name="company_name"
            value={paymentDetails.company_name}
            onChange={handleInputChange}
          />

          <label className="block">Country / Region</label>
          <select
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            name="country"
            value={paymentDetails.country}
            required
            onChange={handleInputChange}
          >
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>

          <label className="block">Street address line 1</label>
          <input
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            type="text"
            name="address1"
            value={paymentDetails.address1}
            required
            onChange={handleInputChange}
          />

          <label className="block">
          Street address line 2
          </label>
          <input
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            type="text"
            name="address2"
            value={paymentDetails.address2}
            onChange={handleInputChange}
          />

          <label className="block">Town / City</label>
          <input
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            type="text"
            name="city"
            value={paymentDetails.city}
            required
            onChange={handleInputChange}
          />

          <label className="block">State</label>
          <select
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            name="state"
            value={paymentDetails.state}
            required
            onChange={handleInputChange}
          >
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>

          <label className="block">ZIP Code</label>
          <input
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            type="text"
            name="zip_code"
            value={paymentDetails.zip_code}
            required
            onChange={handleInputChange}
          />

          <label className="block">Phone</label>
          <input
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            type="tel"
            name="phone"
            value={paymentDetails.phone}
            required
            onChange={handleInputChange}
          />

          <label className="block">Email address </label>
          <input
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            type="email"
            name={userLoggedIn ? "email_add" : "email"}
              value={userLoggedIn ? (paymentDetails.email_add || email) : email}
              readOnly={userLoggedIn}
            required
            onChange={
              userLoggedIn ? handleInputChange : (e) => { setEmail(e.target.value); setEmailAdd(e.target.value); }
            }
            // onChange={handleInputChange}
          />

          {/* <label className="block">Account username *</label>
          <input
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            type="text"
            name={userLoggedIn ? "username" : "user_name"}
            value={userLoggedIn ? paymentDetails.username : user_name}
            required
            onChange={
              userLoggedIn
                ? handleInputChange
                : (e) => setUser_name(e.target.value)
            }
          /> */}

          <input
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            type="hidden"
            name="id"
            value={paymentDetails.id}
            required
            onChange={handleInputChange}
          />

          <h1 className="text-3xl font-semibold">Additional information</h1>
          <label className="block">Order notes (optional)</label>
          <textarea
            rows={6}
            className="w-full p-2 border bg-[#333] border-gray-900 rounded"
            name="note"
            value={paymentDetails.note}
            placeholder="Notes about your order, e.g. special notes for delivery."
            onChange={handleInputChange}
          ></textarea>
        </form>
      </div>
      <div className="w-full md:w-1/2">
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              paymentDetails={paymentDetails}
              cart={cart}
              subtotal={subtotal}
              discount={discount}
              totalAmount={totalAmount}
              userLoggedIn={userLoggedIn}
              emailError={emailError}
              emailAddress={emailAddress}
              usernameError={usernameError}
              user_name={user_name}
              festivalPackageId={festivalPackageId}
              filmTitle={filmTitle}
              filmFile={filmFile}
              setCart={setCart}
            />
          </Elements>
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center h-1/2">
            <FaSpinner className="animate-spin text-4xl" />
            <p>Loading stripe form . . .</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Checkout Form Component
const CheckoutForm = ({
  paymentDetails,
  cart,
  subtotal,
  discount,
  totalAmount,
  userLoggedIn,
  emailError,
  emailAddress,
  usernameError,
  user_name,
  festivalPackageId,
  filmTitle,
  filmFile,
  setCart,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { first_name } = paymentDetails;

  console.log("paymentDetails", userLoggedIn);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!stripe || !elements) {
      console.log("rrrrrrrrrrrrrrrrry");
      setErrorMessage("Stripe has not loaded yet.");
      setIsSubmitting(false);
      return;
    }
    if (!first_name) {
      console.log("rrrrrrrrrrrrrrrrrx");
      setErrorMessage("Please fill in all the required fields on the form.");
      setIsSubmitting(false);
      return;
    }

    if (!filmTitle.trim() || !filmFile) {
      setErrorMessage("Enter a film title and select the film file before paying.");
      setIsSubmitting(false);
      return;
    }

    if (!emailAddress || (!userLoggedIn && !user_name.trim())) {
      setErrorMessage("Enter your email and filmmaker username to continue.");
      setIsSubmitting(false);
      return;
    }

    if (emailError === 200 && !userLoggedIn) {
      setErrorMessage("This email already has an account. Log in to continue.");
      setIsSubmitting(false);
      return;
    }

    if (emailError === 200 && !userLoggedIn) {
      console.log("rrrrrrrrrrrrrrrrr");
      setErrorMessage(
        "Email Already Registered , Please Enter valid email or Login use email."
      );
      setIsSubmitting(false);
      return;
    }

    if (usernameError === 200 && !userLoggedIn) {
      console.log("rrrrrrrrrrrrrrrrr");
      setErrorMessage(
        "UserName Already Registered , Please Enter valid username or Login use UserName."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/my-account/submissions`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment could not be completed.");
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        setErrorMessage("Your payment is still processing. The film has not been submitted yet.");
        return;
      }

      const submissionData = new FormData();
      submissionData.append("paymentIntentId", paymentIntent.id);
      submissionData.append("packageId", festivalPackageId);
      submissionData.append("filmTitle", filmTitle.trim());
      submissionData.append("username", user_name);
      submissionData.append("paymentDetails", JSON.stringify({
        ...paymentDetails,
        email_add: emailAddress,
      }));
      submissionData.append("video", filmFile);

      const response = await createpayment(submissionData, localStorage.getItem("token"));
      if (!response.status) throw new Error(response.message || "Submission could not be saved.");

      if (response.result?.token) localStorage.setItem("token", response.result.token);
      if (response.result?.userId) localStorage.setItem("userid", response.result.userId);
      setCart([]);
      toast.success(response.message);
      navigate("/my-account/submissions", { replace: true });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || "Error processing payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("discount",discount)
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 from-[#00B7D3] to-[#00BDCD] rounded-lg bg-gradient-to-b text-white"
    >
      <h3 className="text-2xl text-center">Your Order</h3>

      <div className="pt-4 rounded flex justify-between w-full">
        <div className="flex flex-col gap-8 w-full">
          <table className="w-full border-collapse text-left  ">
            <thead>
              <tr className="border-b border-gray-500">
                <th className="py-4 text-xl">Product</th>
                <th className="py-4 text-right text-xl">Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="py-4">{item.title}</td>
                  <td className="py-4 text-right">{`${Number(
                    item.amount
                  ).toFixed(2)}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between py-4">
        <span>Subtotal</span>
        <span>{`$${subtotal.toFixed(2)}`}</span>
      </div>
      <div className="flex justify-between py-4">
        <span>Discount</span>
        <span>{`$${discount}`}</span>
      </div>
      <div className="flex justify-between py-4">
        <p className="text-lg font-semibold">Total</p>
        <p className="text-lg font-semibold">${totalAmount.toFixed(2)}</p>
      </div>
      {/* <LinkAuthenticationElement /> */}

      {/* <h3 className="text-lg font-semibold">Shipping</h3> */}
      {/* <AddressElement options={{ mode: "shipping", allowedCountries: ["US"] }} /> */}

      <h3 className="text-lg font-semibold">Payment</h3>
      <PaymentElement />

      <div className="flex items-center gap-2">
        <input type="checkbox" id="exclusiveEmails" name="exclusiveEmails" />
        <label htmlFor="exclusiveEmails">
          I would like to receive exclusive emails with discounts and product
          information
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="termsConditions"
          name="termsConditions"
          required
        />
        <label htmlFor="termsConditions">
          I have read and agree to Place My Films, LLC. terms and conditions *
        </label>
      </div>

      <button
        className="mt-5 w-max rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-5 py-3 text-sm font-semibold uppercase text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-wait disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Submit"}
      </button>

      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </form>
  );
};

export default CheckoutPage;
