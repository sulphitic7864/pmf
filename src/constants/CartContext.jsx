// // CartContext.js
// import React, { createContext, useState, useContext, useEffect } from "react";
// import { getCouponById } from "../server/api_endpoints";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0); // Total after discount
//   const [subtotal, setSubtotal] = useState(0); // Total before discount
//   const [discount, setDiscount] = useState(0); // Discount amount
//   const [prodcutid, setProductId] = useState("");
//   const [selectedFile, setSelectedFile] = useState(undefined);

//   const addToCart = (packageItem) => {
//     console.log("eeeeeeeeeeee",packageItem)
//     const itemExists = cart.some((item) => item.id === packageItem.id);

//     if (!itemExists) {
//       // If the item does not exist, add it to the cart
//       setCart((prevCart) => [...prevCart, packageItem]);
//     } else {
//       console.log("Item already exists in the cart.");
//     }
//     // setCart((prev) => [...prev, packageItem]);
//   };

//     // Recalculate subtotal and total whenever the cart changes
//     useEffect(() => {
//       const newSubtotal = cart.reduce((acc, item) => acc + parseFloat(item.amount), 0);
//       setSubtotal(parseFloat(newSubtotal.toFixed(2)));

  
//       // Apply discount to calculate total
//       const newTotal = newSubtotal - discount;
//       setTotalAmount(parseFloat(newTotal.toFixed(2)));
//     }, [cart, discount]);

//   const applyCoupon = async (couponCode) => {
//     try {
//       const response = await getCouponById(couponCode);
//       console.log(response.result)
//       // const result = await response.json();
//       if (response.result.status === "Active") {
//         setDiscount(response.result.amount);
//       } else {
//         setDiscount(0);
//       }
//     } catch (error) {
//       console.error("Error applying coupon:", error);
//       setDiscount(0);
//     }
//   };


//   return (
//     <CartContext.Provider value={{ cart, subtotal, totalAmount,discount,selectedFile, addToCart, applyCoupon, setSelectedFile }}>
//       {children}
//     </CartContext.Provider>
//   );
// };


import React, { createContext, useState, useContext, useEffect } from "react";
import { getCouponById } from "../server/api_endpoints";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [prodcutid, setProductId] = useState("");
  const [selectedFile, setSelectedFile] = useState(undefined);

  const addToCart = (packageItem) => {
    const itemExists = cart.some((item) => item.id === packageItem.id);

    if (!itemExists) {
      setCart((prevCart) => [...prevCart, packageItem]);
    } else {
      console.log("Item already exists in the cart.");
    }
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
  };

  useEffect(() => {
    const newSubtotal = cart.reduce((acc, item) => acc + parseFloat(item.amount), 0);
    setSubtotal(parseFloat(newSubtotal.toFixed(2)));

    const newTotal = newSubtotal - discount;
    setTotalAmount(parseFloat(newTotal.toFixed(2)));
  }, [cart, discount]);

  const applyCoupon = async (couponCode) => {
    try {
      const response = await getCouponById(couponCode);
      if (response.result.status === "Active") {
        setDiscount(parseFloat(response.result.amount).toFixed(2));
      } else {
        setDiscount(0);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setDiscount(0);
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        subtotal, 
        totalAmount, 
        discount, 
        selectedFile, 
        addToCart, 
        removeFromCart, 
        applyCoupon, 
        setSelectedFile 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};