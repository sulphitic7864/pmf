import axios from "axios";
import { installUnauthorizedSessionHandler } from "./authSession";

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

[
  axios,
  multipartAPI,
  API,
].forEach(installUnauthorizedSessionHandler);

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/user/login`,
    REGISTER: `${API_BASE_URL}/user/register`,
    CONTACT_US: `${API_BASE_URL}/contact/contactAdd`,
    SEND_OTP: `${API_BASE_URL}/user/sendOTP`,
    CONFIRM_OTP: `${API_BASE_URL}/user/validateOtp`,
    RECOVER_PASSWORD: `${API_BASE_URL}/user/resetPasswordByUsernameOrEmail`,
    UPLOAD_VIDEO: `${API_BASE_URL}/videosUpload/upload`,
    FILM_UPLOAD_SESSIONS: `${API_BASE_URL}/film-uploads`,
    FILM_UPLOAD_SESSION: (uploadId) => `${API_BASE_URL}/film-uploads/${uploadId}`,
    FILM_UPLOAD_CHUNK: (uploadId, chunkIndex) => `${API_BASE_URL}/film-uploads/${uploadId}/chunks/${chunkIndex}`,
    GET_USER_DETAILS: (userId) => `${API_BASE_URL}/user/getUserById/${userId}`,
    UPDATE_USER_DETAILS: (userId) => `${API_BASE_URL}/user/updateUserById/${userId}`,
    GET_PACKAGE_DETAILS: `${API_BASE_URL}/payapi/getPackageById`,
    GET_ALL_BLOGS: `${API_BASE_URL}/blog/getAllBlogs`,
    GET_FILM_FESTIVAL_PAGE: `${API_BASE_URL}/payapi/film-festival-page`,
    GET_USER_VIDEOS: `${API_BASE_URL}/videosUpload/getByUserId`,
    MARK_REVIEW_NOTIFICATIONS_READ: `${API_BASE_URL}/videosUpload/review-notifications/read`,
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
    GET_USER_PAYMENT_HISTORY: `${API_BASE_URL}/payapi/payment-history`,
    PAY_STRIPE: `${API_BASE_URL}/payapi/payStripe`,
    ONBOARDING_STATUS: `${API_BASE_URL}/payapi/onboarding/status`,
    ONBOARDING_PAYMENT_INTENT: `${API_BASE_URL}/payapi/onboarding/payment-intent`,
    COMPLETE_ONBOARDING: `${API_BASE_URL}/payapi/onboarding/complete`,
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

export const getFilmFestivalPage = async () => {
  const response = await API.get(API_ENDPOINTS.GET_FILM_FESTIVAL_PAGE);
  return response.data;
};


  
 export const getPackageById = async (id) => {
  try {
    const res = await multipartAPI.get(`payapi/getPackageById/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};  


export const createpaymentLegacy = async (requestBody, token, onUploadProgress) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const res = await axios.post(`${API_BASE_URL}/payapi/store-payment-details`, requestBody, {
      timeout: 0,
      onUploadProgress,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const uploadFilmInChunks = async ({
  file,
  formData,
  finalizeUrl,
  token,
  onUploadProgress,
}) => {
  const resumeKey = `pmf-film-upload:${finalizeUrl}:${file.name}:${file.size}:${file.lastModified}`;
  let uploadId;
  let chunkSize;
  let totalChunks;
  let receivedChunks = new Set();
  try {
    uploadId = sessionStorage.getItem(resumeKey);
  } catch (error) {
    console.error("Film upload resume state could not be read:", error);
  }

  if (uploadId) {
    try {
      const progressResponse = await axios.get(API_ENDPOINTS.FILM_UPLOAD_SESSION(uploadId));
      const progress = progressResponse.data?.result;
      const manifest = progress?.manifest;
      if (
        !progressResponse.data?.status ||
        manifest?.fileSize !== file.size ||
        manifest?.fileName !== file.name ||
        !manifest?.chunkSize ||
        !manifest?.totalChunks
      ) {
        uploadId = null;
      } else {
        chunkSize = manifest.chunkSize;
        totalChunks = manifest.totalChunks;
        receivedChunks = new Set(progress.receivedChunks || []);
      }
    } catch (error) {
      if (![404, 410].includes(error.response?.status)) throw error;
      uploadId = null;
      try {
        sessionStorage.removeItem(resumeKey);
      } catch (storageError) {
        console.error("Expired film upload resume state could not be removed:", storageError);
      }
    }
  }

  if (!uploadId) {
    const sessionResponse = await axios.post(
      API_ENDPOINTS.FILM_UPLOAD_SESSIONS,
      { fileName: file.name, fileSize: file.size },
      { timeout: 30000 },
    );
    const session = sessionResponse.data?.result;
    uploadId = sessionResponse.data?.status ? session?.uploadId : null;
    chunkSize = session?.chunkSize;
    totalChunks = session?.totalChunks;
    if (!uploadId || !chunkSize || !totalChunks) {
      throw new Error(sessionResponse.data?.message || "The film upload could not be started.");
    }
    try {
      sessionStorage.setItem(resumeKey, uploadId);
    } catch (error) {
      console.error("Film upload resume state could not be saved:", error);
    }
  }

  let uploadedBytes = [...receivedChunks].reduce((total, chunkIndex) => (
    total + Math.min(chunkSize, file.size - chunkIndex * chunkSize)
  ), 0);
  onUploadProgress?.({ loaded: uploadedBytes, total: file.size });
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
    if (receivedChunks.has(chunkIndex)) continue;
    const start = chunkIndex * chunkSize;
    const chunk = file.slice(start, Math.min(start + chunkSize, file.size));
    let uploaded = false;

    for (let attempt = 0; attempt < 3 && !uploaded; attempt += 1) {
      try {
        await axios.put(
          API_ENDPOINTS.FILM_UPLOAD_CHUNK(uploadId, chunkIndex),
          chunk,
          {
            timeout: 0,
            headers: { "Content-Type": "application/octet-stream" },
            onUploadProgress: ({ loaded }) => {
              onUploadProgress?.({
                loaded: uploadedBytes + Math.min(loaded, chunk.size),
                total: file.size,
              });
            },
          },
        );
        uploaded = true;
        uploadedBytes += chunk.size;
        onUploadProgress?.({ loaded: uploadedBytes, total: file.size });
      } catch (error) {
        const canRetry = !error.response ||
          error.response.status === 408 ||
          error.response.status === 429 ||
          error.response.status >= 500;
        if (!canRetry || attempt === 2) throw error;
        await new Promise((resolve) => setTimeout(resolve, 500 * (2 ** attempt)));
      }
    }
  }

  formData.append("uploadId", uploadId);
  let response;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await axios.post(finalizeUrl, formData, {
        timeout: 0,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      break;
    } catch (error) {
      const canRetry = !error.response ||
        error.response.status === 408 ||
        error.response.status === 429 ||
        error.response.status >= 500;
      if (!canRetry || attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (2 ** attempt)));
    }
  }
  if (!response.data?.status) {
    throw new Error(response.data?.message || "The server did not confirm the film submission.");
  }
  onUploadProgress?.({ loaded: file.size, total: file.size });
  try {
    sessionStorage.removeItem(resumeKey);
  } catch (error) {
    console.error("Completed film upload resume state could not be removed:", error);
  }

  try {
    await axios.delete(`${API_ENDPOINTS.FILM_UPLOAD_SESSIONS}/${uploadId}`);
  } catch (error) {
    console.error("Film submission completed, but temporary upload chunks could not be removed:", error);
  }
  return response.data;
};

export const createpayment = async (requestBody, token, onUploadProgress) => {
  const videoFile = requestBody.get("video");
  if (!(videoFile instanceof File)) {
    throw new Error("A film video file is required to complete this submission.");
  }

  const submissionData = new FormData();
  for (const [key, value] of requestBody.entries()) {
    if (key !== "video") submissionData.append(key, value);
  }

  return uploadFilmInChunks({
    file: videoFile,
    formData: submissionData,
    finalizeUrl: `${API_BASE_URL}/payapi/store-payment-details`,
    token,
    onUploadProgress,
  });
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