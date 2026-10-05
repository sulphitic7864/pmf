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

const checkoutInputClass =
  "w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-60";

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
    theme: "night",
    variables: {
      colorPrimary: "#00D0B8",
      colorBackground: "#151c20",
      colorText: "#f8fafc",
      colorDanger: "#fca5a5",
      borderRadius: "8px",
      fontFamily: "system-ui, sans-serif",
    },
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
    <main className="relative isolate min-h-screen overflow-hidden bg-[#05090c] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-40 top-20 -z-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 -z-0 h-96 w-96 rounded-full bg-teal-400/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl">
        <header className="mb-8 border-b border-white/10 pb-6 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">Place My Films</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Complete your film submission</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            Add your film and billing details, review your order, and securely complete your submission.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-8">
      <div className="min-w-0 space-y-5">
        {!userLoggedIn ? (
          <section className="rounded-xl border border-white/10 bg-[#0b1115] p-5 sm:p-6">
            <h2 className="text-xl font-semibold">Filmmaker account</h2>
            <p className="mt-1 text-sm text-white/60">Log in or create an account to continue your submission.</p>
            <div className="mt-4 flex gap-2 border-b border-white/10">
              <button type="button" onClick={() => { setAccountMode("register"); setAuthError(""); }} className={`border-b-2 px-3 py-2 text-sm ${accountMode === "register" ? "border-cyan-300 text-cyan-200" : "border-transparent text-gray-400"}`}>New filmmaker</button>
              <button type="button" onClick={() => { setAccountMode("login"); setAuthError(""); }} className={`border-b-2 px-3 py-2 text-sm ${accountMode === "login" ? "border-cyan-300 text-cyan-200" : "border-transparent text-gray-400"}`}>Log in</button>
            </div>
            {accountMode === "login" ? (
              <form onSubmit={handleAccountLogin} className="mt-4 space-y-3">
                <label className="block text-sm text-white/80">Username or email
                  <input className={`${checkoutInputClass} mt-1`} autoComplete="username" value={loginIdentifier} onChange={(event) => setLoginIdentifier(event.target.value)} required />
                </label>
                <label className="block text-sm text-white/80">Password
                  <input className={`${checkoutInputClass} mt-1`} type="password" autoComplete="current-password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required />
                </label>
                <button className="rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300" type="submit">Log in and continue</button>
              </form>
            ) : (
              <div className="mt-4 space-y-3">
                <label className="block text-sm text-white/80">Choose a username
                  <input className={`${checkoutInputClass} mt-1`} autoComplete="username" value={user_name} onChange={(event) => setUser_name(event.target.value)} required />
                </label>
                <p className="text-xs leading-5 text-gray-400">After successful payment, we’ll create your filmmaker account and email your login password.</p>
              </div>
            )}
            {authError && <p role="alert" className="mt-3 text-sm text-red-300">{authError}</p>}
            {emailError === 200 && accountMode === "register" && <p role="alert" className="mt-3 text-sm text-amber-200">This email already has an account. Log in to continue without creating a duplicate.</p>}
            {usernameError === 200 && accountMode === "register" && <p role="alert" className="mt-3 text-sm text-amber-200">That username is already taken.</p>}
          </section>
        ) : (
          <p className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-200">Logged in as {paymentDetails.email_add || email || "filmmaker"}</p>
        )}
        <form className="space-y-5 rounded-xl border border-white/10 bg-[#0b1115] p-5 sm:p-6">
          <section className="space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl font-semibold sm:text-2xl">Film details</h2>
            <p className="mt-1 text-sm text-white/55">Tell us about the film you’re submitting.</p>
          </div>
          <label className="block text-sm font-medium text-white/80">Film title
            <input className={`${checkoutInputClass} mt-1`} type="text" value={filmTitle} onChange={(event) => setFilmTitle(event.target.value)} required />
          </label>
          <label className="block text-sm font-medium text-white/80">Film file
            <input className={`${checkoutInputClass} mt-1 cursor-pointer file:mr-4 file:rounded file:border-0 file:bg-cyan-400/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-cyan-200`} type="file" accept="video/*,.mov" onChange={(event) => {
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
          </section>
          <section className="space-y-4 border-t border-white/10 pt-5">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl font-semibold sm:text-2xl">Billing details</h2>
            <p className="mt-1 text-sm text-white/55">Enter the billing information for your payment.</p>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <div className="flex w-full flex-col gap-2">
              <label className="block text-sm font-medium text-white/80">First name</label>
              <input
                className={checkoutInputClass}
                type="text"
                name="first_name"
                value={paymentDetails.first_name}
                required
                onChange={handleInputChange}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="block text-sm font-medium text-white/80">Last name</label>
              <input
                className={checkoutInputClass}
                type="text"
                name="last_name"
                value={paymentDetails.last_name}
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <label className="block text-sm font-medium text-white/80">Company name (optional)</label>
          <input
            className={checkoutInputClass}
            type="text"
            name="company_name"
            value={paymentDetails.company_name}
            onChange={handleInputChange}
          />

          <label className="block text-sm font-medium text-white/80">Country / Region</label>
          <select
            className={checkoutInputClass}
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

          <label className="block text-sm font-medium text-white/80">Street address line 1</label>
          <input
            className={checkoutInputClass}
            type="text"
            name="address1"
            value={paymentDetails.address1}
            required
            onChange={handleInputChange}
          />

          <label className="block text-sm font-medium text-white/80">
          Street address line 2
          </label>
          <input
            className={checkoutInputClass}
            type="text"
            name="address2"
            value={paymentDetails.address2}
            onChange={handleInputChange}
          />

          <label className="block text-sm font-medium text-white/80">Town / City</label>
          <input
            className={checkoutInputClass}
            type="text"
            name="city"
            value={paymentDetails.city}
            required
            onChange={handleInputChange}
          />

          <label className="block text-sm font-medium text-white/80">State</label>
          <select
            className={checkoutInputClass}
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

          <label className="block text-sm font-medium text-white/80">ZIP Code</label>
          <input
            className={checkoutInputClass}
            type="text"
            name="zip_code"
            value={paymentDetails.zip_code}
            required
            onChange={handleInputChange}
          />

          <label className="block text-sm font-medium text-white/80">Phone</label>
          <input
            className={checkoutInputClass}
            type="tel"
            name="phone"
            value={paymentDetails.phone}
            required
            onChange={handleInputChange}
          />

          <label className="block text-sm font-medium text-white/80">Email address</label>
          <input
            className={checkoutInputClass}
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
            className={checkoutInputClass}
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

          <div className="border-t border-white/10 pt-5">
            <h2 className="text-xl font-semibold sm:text-2xl">Additional information</h2>
            <p className="mt-1 text-sm text-white/55">Add any optional notes for your submission.</p>
          </div>
          <label className="block text-sm font-medium text-white/80">Order notes (optional)</label>
          <textarea
            rows={6}
            className={`${checkoutInputClass} resize-y`}
            name="note"
            value={paymentDetails.note}
            placeholder="Notes about your order, e.g. special notes for delivery."
            onChange={handleInputChange}
          ></textarea>
          </section>
        </form>
      </div>
      <div className="min-w-0">
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
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#0b1115] text-white/70">
            <FaSpinner className="animate-spin text-3xl text-cyan-300" />
            <p>Loading secure payment form...</p>
          </div>
        )}
      </div>
    </div>
      </div>
    </main>
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
      className="space-y-5 rounded-xl border border-white/10 bg-[#0b1115] p-5 text-white shadow-[0_20px_70px_rgba(0,0,0,0.3)] sm:p-6 lg:sticky lg:top-24"
    >
      <div className="border-b border-white/10 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Secure checkout</p>
        <h2 className="mt-2 text-2xl font-semibold">Your order</h2>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#10171b] px-4">
        <div className="flex flex-col gap-8 w-full">
          <table className="w-full border-collapse text-left  ">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 text-sm font-semibold uppercase tracking-wider text-white/55">Product</th>
                <th className="py-4 text-right text-sm font-semibold uppercase tracking-wider text-white/55">Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 font-medium">{item.title}</td>
                  <td className="py-4 text-right font-medium">{`$${Number(
                    item.amount
                  ).toFixed(2)}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between text-sm text-white/65">
        <span>Subtotal</span>
        <span>{`$${subtotal.toFixed(2)}`}</span>
      </div>
      <div className="flex justify-between text-sm text-white/65">
        <span>Discount</span>
        <span>{`$${discount}`}</span>
      </div>
      <div className="flex justify-between border-t border-white/10 pt-4">
        <p className="text-lg font-semibold">Total</p>
        <p className="text-xl font-bold text-cyan-200">${totalAmount.toFixed(2)}</p>
      </div>
      {/* <LinkAuthenticationElement /> */}

      {/* <h3 className="text-lg font-semibold">Shipping</h3> */}
      {/* <AddressElement options={{ mode: "shipping", allowedCountries: ["US"] }} /> */}

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">Payment method</h3>
        <PaymentElement />
      </div>

      <label htmlFor="exclusiveEmails" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/65">
        <input className="mt-1 accent-cyan-400" type="checkbox" id="exclusiveEmails" name="exclusiveEmails" />
        <span>
          I would like to receive exclusive emails with discounts and product
          information
        </span>
      </label>

      <label htmlFor="termsConditions" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/75">
        <input
          className="mt-1 accent-cyan-400"
          type="checkbox"
          id="termsConditions"
          name="termsConditions"
          required
        />
        <span>
          I have read and agree to Place My Films, LLC. terms and conditions *
        </span>
      </label>

      <button
        className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-wait disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Submit"}
      </button>

      {errorMessage && <div role="alert" className="rounded-md border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{errorMessage}</div>}
    </form>
  );
};

export default CheckoutPage;
