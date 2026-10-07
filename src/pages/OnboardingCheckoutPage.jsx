import { useEffect, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../server/api_endpoints";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const OnboardingPaymentForm = ({ email, onComplete, onError, isFinalizing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || isSubmitting) return;

    setIsSubmitting(true);
    onError("");
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/onboarding`,
          payment_method_data: {
            billing_details: { email },
          },
        },
        redirect: "if_required",
      });
      if (error) throw new Error(error.message || "Payment could not be completed.");
      if (paymentIntent?.status !== "succeeded") {
        throw new Error("Payment has not completed. Please try again.");
      }
      await onComplete(paymentIntent.id);
    } catch (error) {
      onError(error.message || "Payment could not be completed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement options={{ layout: "tabs" }} />
      <button
        type="submit"
        disabled={!stripe || isSubmitting || isFinalizing}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-gradient-to-b from-sky-500 to-[#00D0B8] px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting || isFinalizing ? "Processing payment..." : "Pay $25.00 and create account"}
      </button>
    </form>
  );
};

OnboardingPaymentForm.propTypes = {
  email: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  isFinalizing: PropTypes.bool.isRequired,
};

const OnboardingCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [username, setUsername] = useState(location.state?.username || "");
  const [firstName, setFirstName] = useState(location.state?.firstName || "");
  const [lastName, setLastName] = useState(location.state?.lastName || "");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/my-account/orders", { replace: true });
    }
  }, [navigate]);

  const finishOnboarding = async (intentId) => {
    setIsFinalizing(true);
    setErrorMessage("");
    setPaymentIntentId(intentId);
    try {
      const response = await axios.post(API_ENDPOINTS.COMPLETE_ONBOARDING, {
        paymentIntentId: intentId,
      });
      if (!response.data?.status) {
        throw new Error(response.data?.message || "Account setup could not be completed.");
      }
      toast.success(response.data.message || "Onboarding is complete. Please log in.");
      navigate("/my-account/", {
        replace: true,
        state: { onboardingComplete: true },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Payment succeeded, but account setup could not be completed. Retry account setup."
      );
    } finally {
      setIsFinalizing(false);
    }
  };

  const startCheckout = async (event) => {
    event.preventDefault();
    if (isStartingCheckout) return;

    setIsStartingCheckout(true);
    setErrorMessage("");
    try {
      const response = await axios.post(API_ENDPOINTS.ONBOARDING_PAYMENT_INTENT, {
        email: email.trim(),
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      if (!response.data?.status) {
        throw new Error(response.data?.message || "Onboarding checkout could not be started.");
      }
      if (response.data.complete) {
        toast.success(response.data.message || "Onboarding is complete. Please log in.");
        navigate("/my-account/", {
          replace: true,
          state: { onboardingComplete: true },
        });
        return;
      }
      if (!response.data.clientSecret) {
        throw new Error("Secure payment details could not be loaded.");
      }
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Onboarding checkout could not be started."
      );
    } finally {
      setIsStartingCheckout(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05090c] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
        <section className="rounded-2xl border border-white/10 bg-[#0b1115] p-6 shadow-2xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Place My Films
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Filmmaker onboarding
          </h1>
          <p className="mt-3 max-w-xl leading-7 text-white/65">
            The one-time onboarding payment is $25.00. Once your account is set up, submitting films is free.
            Festival entry fees are charged separately only when you enter a festival.
          </p>

          {!clientSecret ? (
            <form onSubmit={startCheckout} className="mt-8 space-y-5">
              <label className="block text-sm font-medium text-white/80">
                First name
                <input
                  className="mt-1 w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-white/80">
                Last name
                <input
                  className="mt-1 w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-white/80">
                Username
                <input
                  className="mt-1 w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  autoComplete="username"
                  minLength={2}
                  maxLength={100}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-white/80">
                Email address
                <input
                  className="mt-1 w-full rounded-md border border-white/10 bg-[#242829] px-3 py-2.5 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={isStartingCheckout}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-gradient-to-b from-sky-500 to-[#00D0B8] px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                {isStartingCheckout ? "Preparing secure checkout..." : "Continue to $25 checkout"}
              </button>
            </form>
          ) : (
            <div className="mt-8 space-y-5">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
                <div>
                  <p className="font-semibold">One-time onboarding fee: $25.00</p>
                  <p className="mt-1 text-sm text-white/55">{email}</p>
                </div>
                <p className="shrink-0 text-xl font-bold text-cyan-200">$25.00</p>
              </div>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "night",
                    variables: {
                      colorPrimary: "#00D0B8",
                      colorBackground: "#151c20",
                      colorText: "#f8fafc",
                      colorDanger: "#fca5a5",
                      borderRadius: "8px",
                      fontFamily: "system-ui, sans-serif",
                    },
                  },
                }}
              >
                <OnboardingPaymentForm
                  email={email}
                  onComplete={finishOnboarding}
                  onError={setErrorMessage}
                  isFinalizing={isFinalizing}
                />
              </Elements>
              {paymentIntentId && errorMessage && (
                <button
                  type="button"
                  disabled={isFinalizing}
                  onClick={() => finishOnboarding(paymentIntentId)}
                  className="w-full rounded-lg border border-cyan-300/40 px-4 py-3 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-300/10 disabled:cursor-wait disabled:opacity-60"
                >
                  {isFinalizing ? "Completing account setup..." : "Retry account setup"}
                </button>
              )}
            </div>
          )}
          {errorMessage && (
            <p role="alert" className="mt-4 rounded-lg border border-rose-300/20 bg-rose-300/5 px-4 py-3 text-sm text-rose-200">
              {errorMessage}
            </p>
          )}
          <p className="mt-6 text-sm text-white/55">
            Already have an account?{" "}
            <Link to="/my-account/" className="font-semibold text-cyan-200 hover:text-white">
              Log in
            </Link>
          </p>
        </section>

        <aside className="h-fit rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Checkout summary</p>
          <div className="mt-6 flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="font-semibold">One-time onboarding fee: $25.00</p>
              <p className="mt-1 text-sm leading-6 text-white/55">
                Includes filmmaker account setup. No recurring charges.
              </p>
            </div>
            <p className="shrink-0 font-bold">$25.00</p>
          </div>
          <div className="mt-5 flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-cyan-200">$25.00</span>
          </div>
          <p className="mt-5 text-sm leading-6 text-white/55">
            Film uploads after onboarding are free. A fee is charged only when you enter a Film Festival contest.
          </p>
          <Link to="/contest" className="mt-5 inline-flex text-sm font-semibold text-cyan-200 hover:text-white">
            Browse Film Festivals
          </Link>
        </aside>
      </div>
    </main>
  );
};

export default OnboardingCheckoutPage;
