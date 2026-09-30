import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_URL}`;


export const multipartAPI = axios.create({
    baseURL: baseURL,
    timeout: 400000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
      
    },
  });

  export const API = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });

export const API_ENDPOINTS = {
    LOGIN: `${baseURL}/user/login`,
    REGISTER: `${baseURL}/user/register`,
    CONTACT_US: `${baseURL}/contact/contactAdd`,
    SEND_OTP: `${baseURL}/user/sendOTP`,
    CONFIRM_OTP: `${baseURL}/user/validateOtp`,
    RECOVER_PASSWORD: `${baseURL}/user/resetPasswordByUsernameOrEmail`,
    UPLOAD_VIDEO: `${baseURL}/videosUpload/upload`,
    GET_USER_DETAILS: `${baseURL}/user/getUserById`,
    UPDATE_USER_DETAILS: `${baseURL}/user/updateUserById`,
    GET_PACKAGE_DETAILS: `${baseURL}/payapi/getPackageById`,
    GET_ALL_BLOGS: `${baseURL}/blog/getAllBlogs`,
    // GET_VIDEO:`${baseURL}/videosUpload/getByUserId`,
   
}





 export const getAllPackage = async () => {
    try {
      const res = await multipartAPI.get(`payapi/getAllPackage`);
      console.log("yyyyyyyyyyyyyyyy",res)
      return res.data;
    } catch (error) {
      return error;
    }
  };  


  
 export const getPackageById = async (id) => {
  try {
    const res = await multipartAPI.get(`payapi/getPackageById/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};  


export const createpayment = async (requestBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    console.log("paymentDatax", requestBody);
    const res = await API.post(`payapi/store-payment-details`, requestBody);
    // 
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const getCouponById = async (id) => {
  try {
    const res = await multipartAPI.get(`payapi/applycoupon/${id}`);
    console.log("yyyyyyyyyyyyyyyy",res)
    return res.data;
  } catch (error) {
    return error;
  }
};  

export const getAllBlogs = async () => {
  try {
    const res = await multipartAPI.get(`blog/getAllBlogs`);
    console.log("getAllBlogs response:", res);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getBlogById = async (id) => {
  try {
    const res = await multipartAPI.get(`blog/getBlogById/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

// export const getVideoByUserId = async (id) = {
//   try {
//     const res = await
//   }
// }


export const getBillingDetailsbyuserId = async (userid) => {
  try {
    const res = await API.get(`payapi/billing-detailsbyuserid/${userid}`);
    console.log("yyyyyyyyyyyyyyyy",res)
    return res.data;
  } catch (error) {
    return error;
  }
}; 


export const getcheckemailadd = async (email) => {
  try {
    const res = await API.get(`user/getUserByEmail/${email}`);
    return res.data;
  } catch (error) {
    return error;
  }
}; 

export const getcheckusername = async (user_name) => {
  try {
    const res = await API.get(`user/getUserByUserName/${user_name}`);
    console.log("REEE",res)
    return res.data;
  } catch (error) {
    return error;
  }
}; 