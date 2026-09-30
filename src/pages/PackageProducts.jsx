import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { getPackageById } from "../server/api_endpoints";
import { CartContext } from "../constants/CartContext";

const PackageProducts = () => {
  const { packageid } = useParams();

  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [packagedetail, setPackageDetails] = useState(null);

  console.log("packagedet", packageid);
  // const index = packageDetails.findIndex((pkg) => pkg.price === packagedet)

  useEffect(() => {
    const getPackageDetailsById = async () => {
      try {
        const response = await getPackageById(packageid);
        setPackageDetails(response.result);
        setLoading(false);
        console.log("yydata", response);
        // setCustomerChange(CustomerData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getPackageDetailsById();
  }, [packageid]);
  console.log("PackageID", packagedetail);
  const descriptionItems =
    packagedetail?.description.split(",").map((item) => item.trim()) || [];

  const packageDetails = {
    packageid,
    id: packagedetail?.id,
    title: packagedetail?.title,
    description: packagedetail?.description,
    amount: packagedetail?.amount,
  };

  const handleAddToCart = () => {
    addToCart(packageDetails);
    setAdded(true);
  };

  return (
    <div className='w-full min-h-screen'>
      {/* Banner section with package name */}
      <div className='w-full h-[calc(50vh-106px)] relative bg-about-banner bg-cover bg-center'>
        <div className='absolute flex items-center pl-10 md:pl-20 w-full h-full z-50 top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
          <h1 className='text-6xl md:text-7xl font-bold gradient-text h-24'>
            {packagedetail?.title ? `Package ${packagedetail.title}` : 'Package Details'}
          </h1>
        </div>
      </div>

      {/* Original content section - removed duplicate title */}
      <div className="w-full min-h-screen h-auto bg-black px-20 md:px-40 lg:px-80 pt-20 relative">
        <div className="text-white pb-5">
          Home/Uncategorized/package {packagedetail?.title}
        </div>

        <div className="flex flex-col pt-8 text-lg text-white">
          {descriptionItems.length > 0 ? (
            descriptionItems.map((feature, index) => (
              <h3 key={index} className="">
                {feature}
              </h3>
            ))
          ) : (
            <p>No description available.</p>
          )}
        </div>
        <h3 className="text-white pt-16 text-3xl">${packagedetail?.amount}</h3>
        <div className="w-full flex justify-center pt-10">
          <button
            onClick={handleAddToCart}
            disabled={added}
            className="group w-max relative px-5 text-sm py-3 border-[1px] text-white uppercase border-sky-500 bg-gradient-to-b from-[#01B7D5] to-[#00C7C1] overflow-hidden"
          >
            <div className="w-0 h-full top-0 left-0 absolute bg-blue-500 z-20 transition-all duration-300 group-hover:w-full"></div>
            <div className="relative z-30"> {added ? "Added to Cart" : "Add to Cart"}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageProducts;