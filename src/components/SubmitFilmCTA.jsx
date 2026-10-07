import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const SubmitFilmCTA = ({ className, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const continueToSubmission = () => {
    setIsOpen(false);
    navigate("/submit-film");
  };

  const goToLogin = () => {
    setIsOpen(false);
    navigate("/my-account/");
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={`${className} cursor-pointer uppercase`}>
        {children}
      </button>
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-film-confirmation-title"
            aria-describedby="submit-film-confirmation-description"
            className="w-full max-w-lg rounded-2xl border border-cyan-300/25 bg-[#0b1115] p-6 text-white shadow-2xl sm:p-8"
          >
            <h2 id="submit-film-confirmation-title" className="text-2xl font-bold">
              Submit Your Film
            </h2>
            <p id="submit-film-confirmation-description" className="mt-3 leading-7 text-white/75">
              If you already have an existing account, please login to your dashboard.
              New users can continue to the checkout cart for the one-time $25.00 onboarding fee.
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={goToLogin}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-cyan-300/40 px-5 py-2.5 font-bold uppercase tracking-wide text-cyan-100 transition-colors hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                Login
              </button>
              <button
                type="button"
                onClick={continueToSubmission}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-b from-sky-500 to-[#00D0B8] px-5 py-2.5 font-bold uppercase text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                Continue to checkout
              </button>
            </div>
          </section>
        </div>,
        document.body
      )}
    </>
  );
};

SubmitFilmCTA.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default SubmitFilmCTA;
