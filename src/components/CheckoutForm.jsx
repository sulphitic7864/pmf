import React, { useEffect, useState } from 'react'
import { PaymentElement, useStripe, useElements,CardElement } from '@stripe/react-stripe-js'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function CheckoutForm ({paymentDetails,clientsecret}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { firstName, lastName, companyName, country, streetAddress, apartment, city, state, zipCode, phone, email, username, orderNotes } = paymentDetails;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet.");
      setIsSubmitting(false);
      return;
    }
    if (!firstName || !lastName || !country || !streetAddress || !city || !state || !zipCode || !phone || !email || !username) {
      setErrorMessage("Please fill in all the required fields on the form.");
      setIsSubmitting(false);
      return;
    }
try{
  (async () => {
    const {paymentIntent, error} = await stripe.confirmCardPayment(clientsecret);
    if (error) {
      console.log("xxxxxxxxxx",error);
      // Handle error here
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Handle successful payment here
      console.log("zzzzzzzzzzzzzzzz",paymentIntent);
    }
  })();
  
     // Step 2: Confirm Payment
    //  const cardElement = elements.getElement(CardElement);
    //  console.log("yyyyyyyyyyy",cardElement)
    //  const { paymentIntent, error } = await stripe.confirmCardPayment(clientsecret, {
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
      
      if (error) {
          setErrorMessage(error.message);
      } 
      else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        console.log('Payment details:', paymentDetails);
          }
        }catch (err) {
          console.log("xxxxxxx",err)
          setErrorMessage('Error processing payment. Please try again.',err);
        }
          setIsSubmitting(false);
        };

return (
  <form onSubmit={handleSubmit} className="space-y-4 p-6 from-[#00B7D3] to-[#00BDCD] rounded-lg bg-gradient-to-b text-white">
    <h3 className="text-2xl text-center">Your Order</h3>

    <div className="p-4 rounded flex justify-between">
      <div className="flex flex-col gap-8">
        <p className="text-lg font-semibold">Product </p>
        <p>Package $299×1 </p>
        <p>Subtotal </p>
        <p className="text-lg font-semibold">Total </p>
      </div>
      <div className="flex flex-col gap-8">
        <p className="text-lg font-semibold">Subtotal</p>
        <p>$299.00</p>
        <p>$299.00</p>
        <p className="text-lg font-semibold">$299.00</p>
      </div>
    </div>    

    {/* <LinkAuthenticationElement /> */}

    {/* <h3 className="text-lg font-semibold">Shipping</h3> */}
    {/* <AddressElement options={{ mode: "shipping", allowedCountries: ["US"] }} /> */}

    <h3 className="text-lg font-semibold">Payment</h3>
    <PaymentElement />

    <div className="flex items-center gap-2">
      <input type="checkbox" id="exclusiveEmails" name="exclusiveEmails" />
      <label htmlFor="exclusiveEmails">I would like to receive exclusive emails with discounts and product information</label>
    </div>

    <div className="flex items-center gap-2">
      <input type="checkbox" id="termsConditions" name="termsConditions" required />
      <label htmlFor="termsConditions">I have read and agree to Place My Films, LLC. terms and conditions *</label>
    </div>

    <button
      className="group w-max mt-5 relative px-5 text-sm py-3 border-[1px] text-white uppercase border-sky-500 bg-gradient-to-b from-[#01B7D5] to-[#00C7C1] overflow-hidden"
      type="submit" disabled={isSubmitting}>
      <div className="w-0 h-full top-0 left-0 absolute bg-blue-500 z-20 transition-all duration-300 group-hover:w-full"></div>
      <p className="relative z-30 ">{isSubmitting ? "Processing..." : "Submit"}</p>
    </button>

    {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
  </form>
);

  };