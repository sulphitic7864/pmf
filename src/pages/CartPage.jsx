import React, { useState, useEffect, useContext } from "react";
import VideoModal from "../components/Modal/VideoModal";
import { CartContext } from "../constants/CartContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { 
    cart, 
    subtotal, 
    totalAmount, 
    discount, 
    applyCoupon, 
    selectedFile, 
    setSelectedFile,
    removeFromCart 
  } = useContext(CartContext);
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { packageid } = useParams();

  const handleApplyCoupon = async () => {
    const result = await applyCoupon(couponCode);
    if (result) {
      setMessage(`Coupon applied! Discount: $${result}`);
    } else {
      setMessage('Invalid coupon code.');
    }
  };

  const proceedCheckout = () => {
    if (cart.length === 0) {
      toast.error('Please add items to cart to proceed to checkout.');
      return;
    }
    navigate('/checkout');
  }

  const handleDelete = (itemId) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  return (
    <>
    <div className="w-full min-h-screen bg-black text-white">
      <div className="w-full h-[calc(50vh-106px)] relative bg-contact-banner bg-cover bg-center">
        <div className="absolute flex items-center pl-8 md:pl-24 w-full h-full z-50 top-0 left-0">
          <h1 className="text-[3.5rem] font-bold gradient-text">Cart</h1>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-36 pt-16">
        {/* <h1 className="text-2xl md:text-4xl lg:text-5xl scale-y-[0.8] gradient-text">
          Have A Promotional Code
        </h1> */}
        <div className="mt-2 flex items-center space-x-4">
          {/* <p className="text-3xl">Upload your video/movie:</p> */}
          {/* <button 
            className="bg-cyan-500 text-white hover:underline py-2 px-4 mt-2"
            onClick={() => navigate('/my-account/orders')}
          >
            Upload
          </button> */}
          {/* <button className="bg-cyan-500 text-white hover:underline py-2 px-4 mt-2"
          onClick={() => setShowModal(true)}
          >
            Upload 1/1 file
          </button> */}
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-36 mt-8">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="py-4">Product</th>
              <th className="py-4 text-center">Price</th>
              <th className="py-4 text-right">Subtotal</th>
              <th className="py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} className="border-b border-gray-800">
                <td className="py-4">{item.title}</td>
                <td className="py-4 text-center">{`$${Number(item.amount).toFixed(2)}`}</td>
                <td className="py-4 text-right">{`$${(Number(item.amount) * 1).toFixed(2)}`}</td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-36 mt-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="COUPON CODE"
            className="bg-gray-800 text-white border border-gray-600 rounded py-2 px-4"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button onClick={handleApplyCoupon} className="bg-cyan-500 text-white font-semibold py-2 px-4 rounded">
            Apply coupon
          </button>
        </div>
        <h3>Discount: ${discount}</h3>
      </div>

      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-36 mt-8">
        <div className="pt-4">
          <h2 className="text-3xl font-semibold text-center">Cart totals</h2>
          <div className="flex justify-between py-4">
            <span>Subtotal</span>
            <span>{`$${subtotal}`}</span>
          </div>
          <div className="flex justify-between py-4 font-bold text-lg border-t border-gray-800">
            <span>Total</span>
            <span>{`$${totalAmount}`}</span>
          </div>
        </div>
        <div onClick={proceedCheckout}>
          <button className="group w-full bg-gradient-to-r from-[#01B7D5] to-[#00C7C1] text-white font-bold py-3 mt-6 rounded relative overflow-hidden">
            <div className="w-0 h-full top-0 left-0 absolute bg-blue-500 z-20 transition-all duration-300 group-hover:w-full"></div>
            <p className="relative z-30">Proceed to checkout</p>
          </button>
        </div>
      </div>
    </div>
    {showModal && 
      <VideoModal setShowModal={setShowModal} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
    }
    </>
  );
};

export default CartPage;