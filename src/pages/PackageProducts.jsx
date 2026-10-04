import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, CircleCheck, Film } from "lucide-react";
import { getPackageById } from "../server/api_endpoints";
import { CartContext } from "../constants/CartContext";
import festivalReelBackground from "../assets/images/CinematicFilmFestivalReelBranding.png";

const PackageProducts = () => {
  const { packageid } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [packagedetail, setPackageDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const getPackageDetailsById = async () => {
      try {
        const response = await getPackageById(packageid);
        if (!response?.result) {
          throw new Error("Package details could not be loaded.");
        }
        if (isActive) setPackageDetails(response.result);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isActive) setError("We couldn't load this package. Please try again.");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    getPackageDetailsById();
    return () => {
      isActive = false;
    };
  }, [packageid]);

  const descriptionItems =
    packagedetail?.description?.split(",").map((item) => item.trim()).filter(Boolean) || [];
  const amount = Number(packagedetail?.amount || 0);

  const packageDetails = {
    packageid,
    id: packagedetail?.id ?? packageid,
    title: packagedetail?.title,
    description: packagedetail?.description,
    amount: packagedetail?.amount,
  };

  const handleProceedToPayment = () => {
    addToCart(packageDetails);
    navigate("/checkout");
  };

  return (
    <main className="relative isolate flex min-h-[calc(100vh-106px)] items-center justify-center overflow-hidden bg-[#05090c] px-5 py-10 sm:px-8 md:justify-end md:px-[5vw] lg:px-[7vw] lg:py-14">
      <img
        src={festivalReelBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/35 to-black/65" />

      {loading ? (
        <div className="relative z-10 rounded-xl border border-white/10 bg-[#080c0e]/90 px-8 py-6 text-center text-gray-200 shadow-2xl">
          Loading festival package...
        </div>
      ) : error || !packagedetail ? (
        <div role="alert" className="relative z-10 rounded-xl border border-red-300/20 bg-[#080c0e]/95 px-8 py-6 text-center text-red-200 shadow-2xl">
          {error || "This package is unavailable."}
        </div>
      ) : (
        <section className="relative z-10 w-full max-w-[38rem] rounded-2xl border border-cyan-400/60 bg-[#090d0f]/95 p-6 text-white shadow-2xl shadow-black/50 backdrop-blur-md sm:p-8 md:w-[58%] lg:w-full lg:p-10">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-300">
                <Film size={17} aria-hidden="true" />
                <span>Film festival submission</span>
              </div>
              <h1 className="break-words text-2xl font-semibold leading-tight sm:text-3xl">
                {packagedetail.title}
              </h1>
            </div>
            <p className="shrink-0 text-xl font-semibold tabular-nums sm:text-2xl">
              ${Number.isFinite(amount) ? amount.toFixed(2) : packagedetail.amount}
            </p>
          </div>

          <div className="mt-5 space-y-2 text-sm leading-6 text-gray-300 sm:text-base">
            {descriptionItems.length > 0 ? descriptionItems.map((feature, index) => (
              <p key={index} className={index === 0 ? "text-white" : ""}>{feature}</p>
            )) : <p>No description available.</p>}
          </div>

          <div className="my-6 border-t border-cyan-400/40" />

          <dl className="space-y-3 text-sm sm:text-base">
            <div className="flex items-center justify-between gap-4 text-gray-300">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">${Number.isFinite(amount) ? amount.toFixed(2) : packagedetail.amount}</dd>
            </div>
          </dl>

          <div className="my-6 border-t border-cyan-400/40" />

          <div className="flex items-center justify-between gap-4">
            <span className="text-xl font-semibold sm:text-2xl">Total</span>
            <span className="text-2xl font-bold tabular-nums text-cyan-300 sm:text-3xl">
              ${Number.isFinite(amount) ? amount.toFixed(2) : packagedetail.amount}
            </span>
          </div>

          <button
            type="button"
            onClick={handleProceedToPayment}
            className="mt-10 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 text-base font-semibold text-[#031015] transition-colors hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#090d0f] sm:text-lg"
          >
            Proceed to Payment
            <ArrowRight size={20} aria-hidden="true" />
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <CircleCheck size={15} className="text-cyan-300" aria-hidden="true" />
            Secure payment and film upload
          </p>
        </section>
      )}
    </main>
  );
};

export default PackageProducts;