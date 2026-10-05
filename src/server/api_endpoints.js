import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');


export const multipartAPI = axios.create({
    baseURL: API_BASE_URL,
    timeout: 400000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
      
    },
  });

  export const API = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/user/login`,
    REGISTER: `${API_BASE_URL}/user/register`,
    CONTACT_US: `${API_BASE_URL}/contact/contactAdd`,
    SEND_OTP: `${API_BASE_URL}/user/sendOTP`,
    CONFIRM_OTP: `${API_BASE_URL}/user/validateOtp`,
    RECOVER_PASSWORD: `${API_BASE_URL}/user/resetPasswordByUsernameOrEmail`,
    UPLOAD_VIDEO: `${API_BASE_URL}/videosUpload/upload`,
    GET_USER_DETAILS: (userId) => `${API_BASE_URL}/user/getUserById/${userId}`,
    UPDATE_USER_DETAILS: (userId) => `${API_BASE_URL}/user/updateUserById/${userId}`,
    GET_PACKAGE_DETAILS: `${API_BASE_URL}/payapi/getPackageById`,
    GET_ALL_BLOGS: `${API_BASE_URL}/blog/getAllBlogs`,
    GET_USER_VIDEOS: `${API_BASE_URL}/videosUpload/getByUserId`,
    RECORD_VIDEO_VIEW: (videoId) => `${API_BASE_URL}/videosUpload/${videoId}/view`,
    GET_USED_VIDEO_COUNTS: `${API_BASE_URL}/videosCount/getAllUsedVideoCountByUserId`,
    GET_BLOG_LIKE_COUNTS: `${API_BASE_URL}/blogReaction/getAllBlogLikeCounts`,
    GET_BLOG_READ_COUNTS: `${API_BASE_URL}/blogRead/getAllBlogReadCounts`,
    GET_BLOG_LIKES_BY_USER: (userId) => `${API_BASE_URL}/blogReaction/getByUser_id/${userId}`,
    GET_BLOG_READS_BY_USER: (userId) => `${API_BASE_URL}/blogRead/getByUser_id/${userId}`,
    UPDATE_BLOG_REACTION: `${API_BASE_URL}/blogReaction/updateStatus`,
    UPDATE_BLOG_READ: `${API_BASE_URL}/blogRead/updateStatus`,
    GET_BILLING_DETAILS_BY_USER: (userId) => `${API_BASE_URL}/payapi/billing-detailsbyuserid/${userId}`,
    UPDATE_BILLING_BY_USER: (userId) => `${API_BASE_URL}/payapi/updateBillingByUserID/${userId}`,
    CREATE_BILLING: `${API_BASE_URL}/payapi/createBilling`,
    GET_PAYMENT_DETAILS_BY_USER: (userId) => `${API_BASE_URL}/payapi/payment-detailsbyuserid/${userId}`,
    PAY_STRIPE: `${API_BASE_URL}/payapi/payStripe`,
}





 export const getAllPackage = async () => {
    try {
      const res = await multipartAPI.get(`payapi/getAllPackage`);
      console.log("getAllPackage",res)
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


export const createpayment = async (requestBody, token) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const res = await axios.post(`${API_BASE_URL}/payapi/store-payment-details`, requestBody, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const getCouponById = async (id) => {
  try {
    const res = await multipartAPI.get(`payapi/applycoupon/${id}`);
    console.log("getCouponById",res)
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
    console.log("getBlogById",res)
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
    console.log("getBillingDetailsbyuserId",res)
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
    console.log("getcheckusername",res)
    return res.data;
  } catch (error) {
    return error;
  }
}; 