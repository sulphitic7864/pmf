import React, { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  CardElement,
  useElements,
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { Country, State } from "country-state-city";
import { FaSpinner } from "react-icons/fa";
import { BsDot, BsThreeDots } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import {
  createpayment,
  getBillingDetailsbyuserId,
  getcheckemailadd,
  getcheckusername,
  getPackageById,
} from "../server/api_endpoints";
import { Link, useParams } from "react-router-dom";
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
  const [packagedetail, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUserNameError] = useState("");
  const [email, setEmail] = useState("");
  const [user_name, setUser_name] = useState("");
  const [emailAddress, setEmailAdd] = useState("");

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [billingDetails, setBillingDetails] = useState({});
  const usertoken = localStorage.getItem("token");
  const userId = localStorage.getItem("userid");
  const { packageid } = useParams();
  const navigate = useNavigate();

  const { cart, subtotal, totalAmount, discount, applyCoupon } =
    useContext(CartContext);
  const backendurl = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    const fetchCountries = () => {
      const getcountries = Country.getAllCountries();
      setCountries(getcountries);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      window.location.href = "/";
    }
  }, [cart]);

  useEffect(() => {
    const fetchStates = () => {
      const getstates = State.getStatesOfCountry(paymentDetails.country);
      setStates(getstates);
    };
    fetchStates();
  }, [paymentDetails.country]);

  useEffect(() => {
    const getPackageDetailsById = async () => {
      try {
        // const response = await getPackageById(packageid);
        setPackageDetails(cart);
        setLoading(false);
        console.log("yydata", cart);
        // setCustomerChange(CustomerData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getPackageDetailsById();
  }, [packageid]);
  console.log("PackageID", paymentDetails);

  useEffect(() => {
    window
      .fetch(`${backendurl}/payapi/payStripe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          email_add: "red@gmail.com",
          amount: totalAmount,
          currency: "usd",
        }),
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Unknown error occurred");
        }
        return response.json(); // Parse successful response
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setErrorMessage(""); // Clear error if request succeeds
      })
      .catch((error) => {
        // console.error("Error fetching clientSecret:", error);
        toast.error(error.message); // Set error message
      });

    // .then((response) => response.json())
    // .then((data) => setClientSecret(data.clientSecret))
    // .catch((error) => console.error("Error fetching clientSecret:", error));
  }, [totalAmount, paymentDetails]);

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

  useEffect(() => {
    const checkBilingDetailsuserID = async () => {
      if (userId) {
        setUserLoggedIn(true);
        // setEmailAdd(paymentDetails.email_add);
        try {
          const response = await getBillingDetailsbyuserId(userId);
          setPackageDetails(cart);
          console.log("Response", response.result);
          if (response.result) {
            setPaymentDetails(response.result);
          } else {
            toast.success("Billing failed. Please Complete Billing Details.");
            // setSnackbarMessage('Payment successfully!');
            setTimeout(() => {
              // window.location.reload();
              navigate("/my-account/edit-address");
            }, 1000);
            // alert('Billing failed. Please try again.');
            // navigate('/payment');
          }
        } catch (error) {
          console.error("Error checking user status:", error);
        }
      }
    };

    checkBilingDetailsuserID();
    {
      userLoggedIn ? setEmailAdd(paymentDetails.email_add) : setEmailAdd(email);
    }
    {
      userLoggedIn
        ? setUser_name(paymentDetails.username)
        : setUser_name(user_name);
    }
  }, [
    userId,
    paymentDetails.email_add,
    userLoggedIn,
    email,
    user_name,
    paymentDetails.username,
  ]);

  useEffect(() => {
    const checkEmail = async () => {
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
  }, [email, user_name]);

  console.log("WWWW", discount);

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-black px-10 md:px-16 lg:px-44 gap-10 pt-16 text-white">
      <div className="w-full md:w-1/2">
        <form className="space-y-4">
          <h3 className="text-3xl font-semibold">Billing details</h3>
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
            value={userLoggedIn ? paymentDetails.email_add : email}
            required
            onChange={
              userLoggedIn ? handleInputChange : (e) => setEmail(e.target.value)
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
              clientSecret={clientSecret}
              CardElement={CardElement}
              packagedetail={packagedetail}
              cart={cart}
              subtotal={subtotal}
              discount={discount}
              totalAmount={totalAmount}
              userLoggedIn={userLoggedIn}
              emailError={emailError}
              emailAddress={emailAddress}
              usernameError={usernameError}
              user_name={user_name}
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
  clientSecret,
  CardElement,
  packagedetail,
  cart,
  subtotal,
  discount,
  totalAmount,
  userLoggedIn,
  emailError,
  emailAddress,
  usernameError,
  user_name,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const backendurl = `${import.meta.env.VITE_API_URL}`;
  const {
    first_name,
    last_name,
    company_name,
    country,
    address1,
    address2,
    city,
    state,
    zip_code,
    phone,
    email_add,
    username,
    note,
  } = paymentDetails;

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
      const cardElement = elements.getElement(CardElement);
      // const {paymentIntent, error} = await stripe.paymentIntents.retrieve(clientSecret);
      // if (error) {
      //   console.log("xxxxxxxxxx",error);
      //   setErrorMessage(error.message);
      //   // Handle error here
      // } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      //   // Handle successful payment here
      // }

      // const result = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: {
      //     card: cardElement,
      //     billing_details: { email: "redsachintha@gmail.com" },
      //   },
      // });

      // if (result.error) {
      //   // Show error to your customer (for example, payment details incomplete)

      //   setErrorMessage(result.error.message);
      //   console.log(result.error.message);
      // } else {
      //   // Your customer will be redirected to your `return_url`. For some payment
      //   // methods like iDEAL, your customer will be redirected to an intermediate
      //   // site first to authorize the payment, then redirected to the `return_url`.
      // }

      // Step 2: Confirm Payment
      //  const cardElement = elements.getElement(CardElement);
      //  if (!cardElement) {
      //   console.error('CardElement is not available!');
      //   return;
      // }
      //  console.log("yyyyyyyyyyy",cardElement)
      //  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      //    payment_method: {
      //      card: cardElement,
      //      billing_details: {
      //       firstName,
      //       email,
      //      },
      //    },
      //  });
      // const { error, paymentIntent } = await stripe.confirmPayment({
      //   elements,
      //   confirmParams: {
      //     return_url: 'http://localhost:5173/success',
      //   },
      //   });

      // if (error) {
      //     setErrorMessage(error.message);
      // }
      // else if (paymentIntent && paymentIntent.status === 'succeeded') {
      //   console.log('Payment succeeded:', paymentIntent);
      //   console.log('Payment details:', paymentDetails);
      // Payment succeeded, send status to backend
      // try {
      //     const response = await axios.post(`${import.meta.env.VITE_API_URL}/payment-status`, {
      //         headers: {
      //             'Content-Type': 'application/json',
      //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //         },
      //         body: JSON.stringify({
      //             paymentIntentId: paymentIntent.id,
      //             amount: paymentIntent.amount,
      //             currency: paymentIntent.currency,
      //             status: paymentIntent.status,
      //             paymentDetails: JSON.stringify(paymentDetails),
      //         }),
      //     });

      //     if (!response.ok) {
      //         throw new Error('Failed to send payment status to the backend');
      //     }

      //     console.log('Payment status sent to backend successfully');
      // } catch (err) {
      //     console.error('Error sending payment status to backend:', err);
      //     setErrorMessage('Failed to update payment status. Please contact support.');
      // }
      // }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${backendurl}/success`, // Optional success page
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment confirmation error:", error.message);
        setIsSubmitting(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        if (cart) {
          const PackageData = cart.map((item) => ({
            packageid: item.id,
            itemtitle: item.title,
          }));
          const formData1 = {
            Addons: JSON.stringify(PackageData),
          };
          // const responsemultiaddon = createMultiaddon(formData1);

          const updateRequestBody = {
            paymentDetails: paymentDetails,
            paymentIntent: paymentIntent,
            PackageData: PackageData,
            userLoggedIn: userLoggedIn,
            emailAddress: emailAddress,
            user_name: user_name,
          };

          // Save payment details to the backend
          try {
            await createpayment(updateRequestBody)
              .then((response) => {
                if (response.status) {
                  setIsSubmitting(false);
                  toast.success(response.message);
                  // setSnackbarMessage('Payment successfully!');
                  setTimeout(() => {
                    window.location.reload();
                    window.location.href = "/";
                  }, 2000);
                }
              })
              .catch((error) => {
                console.error(error);
                toast.error(error);
                setIsSubmitting(false);
                // setIsDisabled(false);
              });

            // const response = await fetch(
            //   "http://localhost:3000/payapi/store-payment-details",
            //   {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //       paymentIntentId: paymentIntent.id,
            //       amount: paymentIntent.amount / 100,
            //       status: paymentIntent.status,
            //     }),
            //   }
            // );

            // const data = await response.json();
            // if (data.success) {
            //   alert('Payment successful and details saved!');
            //   // Redirect to success page after saving
            //   history.push('/success'); // Use history.push to redirect to the success page
            // } else {
            //   console.error('Failed to save payment details:', data.error);
            // }
          } catch (saveError) {
            console.error("Error saving payment details:", saveError);
          }
        }
      }

      setIsSubmitting(false);
    } catch (err) {
      console.log("xxxxxxx", err);
      setErrorMessage("Error processing payment. Please try again.", err);
    }
    setIsSubmitting(false);
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
        className="group w-max mt-5 relative px-5 text-sm py-3 border-[1px] text-white uppercase border-sky-500 bg-gradient-to-b from-[#01B7D5] to-[#00C7C1] overflow-hidden"
        type="submit"
        disabled={isSubmitting}
      >
        <div className="w-0 h-full top-0 left-0 absolute bg-blue-500 z-20 transition-all duration-300 group-hover:w-full"></div>
        <p className="relative z-30 ">
          {isSubmitting ? "Processing..." : "Submit"}
        </p>
      </button>

      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </form>
  );
};

export default CheckoutPage;
