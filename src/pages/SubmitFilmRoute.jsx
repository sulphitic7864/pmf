import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../server/api_endpoints";

const SubmitFilmRoute = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/onboarding", { replace: true });
      return () => {
        isActive = false;
      };
    }

    const checkOnboarding = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.ONBOARDING_STATUS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.data?.status) {
          throw new Error(response.data?.message || "Unable to check onboarding status.");
        }
        if (isActive) {
          navigate(
            response.data.onboardingPaid ? "/my-account/orders" : "/onboarding",
            {
              replace: true,
              state: response.data.onboardingPaid ? undefined : response.data.user,
            }
          );
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.response?.data?.message ||
              "We couldn't verify your account. Please log in again."
          );
        }
      }
    };

    checkOnboarding();
    return () => {
      isActive = false;
    };
  }, [navigate]);

  if (error) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#05090c] px-5 text-center text-white">
        <p role="alert" className="max-w-lg text-rose-200">{error}</p>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userid");
            navigate("/my-account/", { replace: true });
          }}
          className="cursor-pointer rounded-full bg-gradient-to-b from-sky-500 to-[#00D0B8] px-6 py-3 font-bold uppercase text-white"
        >
          Login
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#05090c] text-white">
      <p role="status">Checking your filmmaker account...</p>
    </main>
  );
};

export default SubmitFilmRoute;
