import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PricingInfoModal = ({ packageDetails, isOpen, onClose }) => {
  const isShortFilm = packageDetails.description
    ?.toLowerCase()
    .includes("horror");

  const shortFilmRules = {
    title: "SUBMISSION RULES",
    content: [
      "Who can enter the Fright For Your Life short-film competition?",
      "Fright For Your Life is open to all independent short-film filmmakers anywhere in the world that meet the following criteria:",
      "• Category is horror films only.",
      "• Films selected will win an opportunity for distribution, and the top streamer will receive an award for most streamed.",
      "• Total runtime for shorts must be no more than 25 minutes and no less than 23 minutes.",
      "• The film must not have been screened, broadcasted, streamed, on television, internet, and/or released via home video or other public distribution platforms. They will not be considered so please don't waste your time or money.",
      "• Resolution for upload must be no more than 720dp and 700mb. A high resolution of 1080 or 4k will be required if participants win.",
      "• Must have music clearance.",
      "• Talent release forms must be signed.",
      "• Location agreements must be signed.",
      "• Must have captions.",
      "• Formatted for upload must be compressed into a zip file and film must be mp4 or mov.",
      "",
      "What steps do I need to take to submit to Place My Films for Fright For Your Life?",
      "1. Create a good quality film",
      '2. Purchase our "Fight For Your Life" plan for $99.00',
      "3. Upload your film to the Place My Films Website",
      "4. Expect us to get back to you with a response to your awesome film",
    ],
  };

  const featuredFilmRules = {
    title: "Featured Films Upload Requirements",
    content: [
      "Upload your film here! Film must be 75 minutes or longer to qualify.",

      "File size must not exceed 3GB.",
      "If your file is larger than 3GB, please use our contact form to reach out to us and we can provide you with a link that allows larger uploads.",
    ],
  };

  const content = isShortFilm ? shortFilmRules : featuredFilmRules;

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            className="bg-gradient-to-b from-[#6496d3] to-[#00C7C1] text-white p-8 rounded-lg max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              {content.title}
            </h2>

            <div className="space-y-4">
              {content.content.map((item, index) => (
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                  className="text-lg"
                >
                  {item}
                </motion.p>
              ))}
            </div>

            <div className="mt-8 flex justify-center flex-col items-center space-y-4">
              <Link
                to="/specification"
                className="text-white font-semibold text-lg underline transition-colors duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-t from-[#01f8df] via-[#01e3de] to-[#00b1db]"
              >
                Click here for detailed specifications
              </Link>
              <Link to={`/checkout?packageId=${encodeURIComponent(packageDetails.id)}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-gradient-to-b from-sky-500 to-[#00D0B8] px-12 py-3 text-xl font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Submit to Festival
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PricingCard = ({ packageDetails }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const descriptionItems =
    packageDetails.description?.split(",").map((item) => item.trim()) || [];

  return (
    <div className="w-full relative h-[600px] bg-red-300 flex flex-col items-center px-6 lg:px-12 py-5 bg-about-banner bg-center bg-cover rounded-2xl border-[3px] border-black hover:border-sky-500 transition-all duration-500">
      <div className="absolute w-full h-full top-0 rounded-2xl left-0 z-10 bg-[rgba(0,0,0,0.5)]"></div>
      <div className="flex flex-col items-center z-20 w-full h-full">
        <motion.h2
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-[#00C7C2] to-[#00C7C1] w-[70%] text-lg text-center px-4 py-[0.4rem] uppercase text-white font-[400] cursor-pointer hover:opacity-90 transition-opacity rounded-md"
        >
          Click for more info
        </motion.h2>

        <div className="flex flex-col items-center flex-grow justify-between py-8">
          <div className="text-center">
            <h3 className="text-white text-[1.6rem] mb-4">
              {packageDetails.title}
            </h3>
            <h1 className="text-7xl gradient-text font-extrabold md:scale-125 mt-6">
              ${packageDetails.amount}
            </h1>
          </div>

          <div className="w-full flex-grow flex flex-col mt-10">
            <h2 className="w-full text-xl font-semibold text-white pt-5">
              Upload
            </h2>
            <div className="text-white w-full text-xl pl-0 pt-2 overflow-y-auto flex-grow">
              {descriptionItems.length > 0 ? (
                descriptionItems.map((feature, index) => (
                  <motion.h3
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-2"
                  >
                    {feature}
                  </motion.h3>
                ))
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center mt-4 space-y-3">
            {/* <Link to="/specification" className="text-yellow-300 hover:text-white font-semibold text-lg">
                        Click link for specifications
                    </Link> */}
            <Link to={`/product/${packageDetails.id}`} className="w-max">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-max rounded-full bg-gradient-to-b from-sky-500 to-[#00D0B8] px-20 py-3 font-bold uppercase text-white transition-opacity hover:opacity-90"
              >
                Upload
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <PricingInfoModal
        packageDetails={packageDetails}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PricingCard;
