import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../server/api_endpoints';
import { jwtDecode } from 'jwt-decode';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import Dropzone from 'react-dropzone';
import { CgClose } from 'react-icons/cg';

const OrderContent = () => {
  const [userID, setUserID] = useState(null);
  const [package99Count, setPackage99Count] = useState(0);
  const [package299Count, setPackage299Count] = useState(0);
  const [usedCounts, setUsedCounts] = useState({
    package_99_count: 0,
    package_299_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [currentPackageType, setCurrentPackageType] = useState(null);
  const [videos99, setVideos99] = useState([]);
  const [videos299, setVideos299] = useState([]);

  // Get user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = jwtDecode(token);
    setUserID(decoded.UserId);
  }, []);

  // Fetch videos
  useEffect(() => {
    if (!userID) return;

    const getVideosByUserId = async () => {
      try {
        const requestBody = { user_id: userID };
        const response = await axios.post(
          API_ENDPOINTS.GET_USER_VIDEOS,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status) {
          const videos = response.data.result;
          const filtered99 = videos.filter((video) => video.packageType === "99");
          const filtered299 = videos.filter((video) => video.packageType === "299");
          setVideos99(filtered99);
          setVideos299(filtered299);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    getVideosByUserId();
  }, [userID]);

  // Fetch used and purchased video counts
  useEffect(() => {
    if (!userID) return;

    const fetchUsedCounts = async () => {
      try {
        const requestBody = { user_id: userID };
        const response = await axios.post(
          API_ENDPOINTS.GET_USED_VIDEO_COUNTS,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.response_code === 200) {
          setPackage99Count(response.data.result.count_99 || 0);
          setPackage299Count(response.data.result.count_299 || 0);
          setUsedCounts({
            package_99_count: response.data.result.package_99_count,
            package_299_count: response.data.result.package_299_count,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching used counts:", error);
        setLoading(false);
      }
    };

    fetchUsedCounts();
  }, [userID]);

  const handleDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const handleOpenModal = (packageType) => {
    setCurrentPackageType(packageType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(undefined);
    setCurrentPackageType(null);
  };

  const checkVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        const duration = video.duration / 60; // Convert to minutes
        resolve(duration);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("Error loading video metadata"));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("❌ Please select a file!", { position: "top-right" });
      return;
    }

    setUploadLoading(true);

    try {
      // Check file size
      const maxSizeMB = currentPackageType === "99" ? 500 : 3072;
      if (selectedFile.size / 3072 / 3072 > maxSizeMB) {
        toast.warning(`⚠️ File size should be less than ${maxSizeMB} MB!`, {
          position: "top-right",
        });
        setUploadLoading(false);
        return;
      }

      // Check video duration
      toast.info("⏳ Checking video duration...", { position: "top-right" });
      const duration = await checkVideoDuration(selectedFile);

      // Validate duration based on package type
      if (currentPackageType === "99") {
        if (duration < 23 || duration > 25) {
          toast.warning(
            "⚠️ For the $99 package, video must be between 23-25 minutes!", 
            { position: "top-right" }
          );
          setUploadLoading(false);
          return;
        }
      } else if (currentPackageType === "299") {
        if (duration < 75) {
          toast.warning(
            "⚠️ For the $299 package, video must be 75 minutes or longer!", 
            { position: "top-right" }
          );
          setUploadLoading(false);
          return;
        }
      }

      // Proceed with upload
      toast.info("⏳ Uploading video, please wait...", { position: "top-right" });
      
      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("user_id", userID);
      formData.append("packageType", currentPackageType);

      const response = await axios.post(API_ENDPOINTS.UPLOAD_VIDEO, formData);

      if (response.data.response_code === 200) {
        toast.success("✅ File uploaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          handleCloseModal();
        }, 2000);

        setSelectedFile(undefined);
        setUploadLoading(false);

        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("❌ Error uploading file. Please try again!", {
        position: "top-right",
        autoClose: 3000,
      });
      setUploadLoading(false);
    }
  };

  const canUpload99 = package99Count > usedCounts.package_99_count;
  const canUpload299 = package299Count > usedCounts.package_299_count;

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0b1115] px-6 py-12 text-gray-300">
        <p className="text-center">Loading submissions...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5 rounded-xl border border-white/10 bg-[#0b1115] p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-white">New Submission</h1>

        {/* $99 Package Section */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-white">$99 package</h2>
              <p className="text-sm text-gray-200">
                Videos used: {usedCounts.package_99_count} / {package99Count}
              </p>
            </div>
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                canUpload99
                  ? "bg-gradient-to-b from-sky-500 to-[#00D0B8] text-white hover:opacity-90"
                  : "cursor-not-allowed border border-cyan-300/15 bg-cyan-400/10 text-cyan-100/50"
              }`}
              disabled={!canUpload99}
              onClick={() => handleOpenModal("99")}
            >
              Add Video
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {videos99.length > 0 ? (
              videos99.map((video) => (
                <div key={video.id} className="border p-2 rounded-md">
                  <video width="100%" controls>
                    <source src={video.url} type="video/mp4" />
                  </video>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No videos available.</p>
            )}
          </div>
        </div>

        {/* $299 Package Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-white">$299 package</h2>
              <p className="text-sm text-gray-200">
                Videos used: {usedCounts.package_299_count} / {package299Count}
              </p>
            </div>
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                canUpload299
                  ? "bg-gradient-to-b from-sky-500 to-[#00D0B8] text-white hover:opacity-90"
                  : "cursor-not-allowed border border-cyan-300/15 bg-cyan-400/10 text-cyan-100/50"
              }`}
              disabled={!canUpload299}
              onClick={() => handleOpenModal("299")}
            >
              Add Video
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {videos299.length > 0 ? (
              videos299.map((video) => (
                <div key={video.id} className="border p-2 rounded-md">
                  <video width="100%" controls>
                    <source src={video.url} type="video/mp4" />
                  </video>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No videos available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full z-[100] flex items-center justify-center">
          <div
            className="absolute w-full h-full bg-black opacity-70 cursor-pointer"
            onClick={handleCloseModal}
          />
          <button
            className="absolute right-4 top-4 flex aspect-square w-10 items-center justify-center rounded-full border border-white/15 bg-[#11191d] text-xl font-bold text-white hover:bg-white/10 sm:right-6 sm:top-6"
            onClick={handleCloseModal}
          >
            <CgClose />
          </button>
          <div className="relative h-auto max-h-[90vh] w-[min(92vw,48rem)] overflow-y-auto rounded-xl border border-white/10 bg-[#0b1115] p-5 text-white shadow-2xl sm:p-8">
            <h1 className="mb-4 text-2xl font-bold">Upload Video</h1>
            <p className="text-sm text-gray-300">Allowed extension: mp4, zip.</p>
            <p className="mb-2 text-sm text-gray-300">
              Max allowed size: {currentPackageType === "99" ? "500 MB" : "3072 MB"} for ${currentPackageType} package
            </p>
            <p className="mb-4 text-sm font-medium text-gray-200">
              {currentPackageType === "99" 
                ? "Video duration must be between 23-25 minutes"
                : "Video duration must be 75 minutes or longer"}
            </p>
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div
                    {...getRootProps()}
                    className="z-[100] flex min-h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-black/20 p-5 text-center hover:border-cyan-300/60 sm:min-h-64"
                  >
                    <input {...getInputProps()} type="file" accept="video/*" />
                    <div className="items-center justify-center text-center">
                      {selectedFile ? (
                        <div className="flex items-center justify-center mx-auto mb-2">
                          <iframe
                            src={URL.createObjectURL(selectedFile)}
                            alt="profile"
                            className="w-[250px] md:w-[400px] lg:w-[500px] aspect-video"
                          />
                        </div>
                      ) : (
                        <FaCloudUploadAlt
                          className="items-center justify-center mx-auto mb-2 text-4xl"
                          color="darkblue"
                        />
                      )}
                      {!selectedFile && (
                        <p className="text-sm text-gray-500">
                          Drag &apos;n&apos; drop some files here, or click to select files
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedFile && (
                    <div className="flex items-center justify-center mx-auto gap-2 mb-2">
                      <p className="text-sm text-cyan-200">
                        {selectedFile.name}
                      </p>
                      <FaTrash
                        className="text-md text-red-500 cursor-pointer"
                        onClick={() => setSelectedFile(undefined)}
                      />
                    </div>
                  )}
                </section>
              )}
            </Dropzone>
            <button
              className="mt-4 w-full rounded-md bg-cyan-400 px-5 py-3 font-semibold text-[#031015] hover:bg-cyan-300 sm:w-auto"
              onClick={handleSubmit}
              disabled={uploadLoading}
            >
              {uploadLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderContent;
