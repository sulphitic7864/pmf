import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../server/api_endpoints';
import { jwtDecode } from 'jwt-decode';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import Dropzone from 'react-dropzone';
import { CgClose } from 'react-icons/cg';
import TrackedVideoPlayer from './TrackedVideoPlayer';

const OrderContent = () => {
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [currentPackageType, setCurrentPackageType] = useState(null);
  const [filmTitle, setFilmTitle] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [videos99, setVideos99] = useState([]);
  const [videos299, setVideos299] = useState([]);

  const updateViewCount = (videoId, viewCount) => {
    const updateVideos = (videos) => videos.map((video) => (
      video.id === videoId ? { ...video, viewCount } : video
    ));
    setVideos99(updateVideos);
    setVideos299(updateVideos);
  };

  useEffect(() => {
    if (!selectedFile) {
      setVideoPreviewUrl('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setVideoPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  // Get user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUserID(decoded.UserId);
    } catch (error) {
      console.error("Unable to read user session:", error);
      setLoading(false);
    }
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
      } finally {
        setLoading(false);
      }
    };

    getVideosByUserId();
  }, [userID]);

  const handleDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const handleOpenModal = (packageType) => {
    setCurrentPackageType(packageType);
    setFilmTitle('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(undefined);
    setCurrentPackageType(null);
    setFilmTitle('');
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("❌ Please select a file!", { position: "top-right" });
      return;
    }
    if (!filmTitle.trim()) {
      toast.error("Please enter a film title.", { position: "top-right" });
      return;
    }

    setUploadLoading(true);

    try {
      // Check file size
      const maxSizeBytes = currentPackageType === "99" ? 500 * 1024 * 1024 : 3 * 1024 * 1024 * 1024;
      const maxSizeLabel = currentPackageType === "99" ? "500 MB" : "3 GB";
      if (selectedFile.size > maxSizeBytes) {
        toast.warning(`File size should be less than ${maxSizeLabel}.`, {
          position: "top-right",
        });
        setUploadLoading(false);
        return;
      }

      // Proceed with upload
      toast.info("⏳ Uploading video, please wait...", { position: "top-right" });
      
      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("user_id", userID);
      formData.append("packageType", currentPackageType);
      formData.append("title", filmTitle.trim());

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
      toast.error(error.response?.data?.message || "Error uploading file. Please try again!", {
        position: "top-right",
        autoClose: 3000,
      });
      setUploadLoading(false);
    }
  };

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

        {/* Free short-film submissions; festival entry payments happen separately. */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Short films</h2>
              <p className="text-sm text-gray-400">{videos99.length} submitted · Free submissions</p>
            </div>
            <button
              className="rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              onClick={() => handleOpenModal("99")}
            >
              Add Video
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {videos99.length > 0 ? (
              videos99.map((video) => (
                <div key={video.id} className="border p-2 rounded-md">
                  <TrackedVideoPlayer video={video} className="w-full" onViewCountChange={updateViewCount} />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No videos available.</p>
            )}
          </div>
        </div>

        {/* Free feature-film submissions; festival entry payments happen separately. */}
        <div className="pt-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Feature films</h2>
              <p className="text-sm text-gray-400">{videos299.length} submitted · Free submissions</p>
            </div>
            <button
              className="rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              onClick={() => handleOpenModal("299")}
            >
              Add Video
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {videos299.length > 0 ? (
              videos299.map((video) => (
                <div key={video.id} className="border p-2 rounded-md">
                  <TrackedVideoPlayer video={video} className="w-full" onViewCountChange={updateViewCount} />
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
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !uploadLoading) handleCloseModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-modal-title"
            className="modal-scrollbar relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1115] text-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b1115]/95 px-5 py-4 backdrop-blur sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Free film submission</p>
                <h2 id="upload-modal-title" className="mt-1 text-xl font-semibold">Upload a film</h2>
              </div>
              <button
                type="button"
                aria-label="Close upload dialog"
                onClick={handleCloseModal}
                disabled={uploadLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CgClose size={20} />
              </button>
            </header>

            <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
              <div>
                <label htmlFor="film-title" className="mb-2 block text-sm font-medium text-gray-200">Film title</label>
                <input
                  id="film-title"
                  type="text"
                  value={filmTitle}
                  onChange={(event) => setFilmTitle(event.target.value)}
                  maxLength={255}
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white placeholder:text-gray-500 focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300"
                  placeholder="Enter your film title"
                />
              </div>

              <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.04] px-4 py-3 text-sm text-gray-300">
                <p>Accepted format: MP4</p>
                <p className="mt-1">Maximum file size: {currentPackageType === "99" ? "500 MB" : "3 GB"}</p>
                <p className="mt-1 text-gray-400">No duration requirement for free submissions.</p>
              </div>

              <Dropzone
                multiple={false}
                accept={{ 'video/mp4': ['.mp4'] }}
                maxSize={currentPackageType === "99" ? 500 * 1024 * 1024 : 3 * 1024 * 1024 * 1024}
                onDropAccepted={handleDrop}
                onDropRejected={() => toast.error(`Please select an MP4 video within the ${currentPackageType === "99" ? "500 MB" : "3 GB"} size limit.`)}
              >
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps()}
                    className={`flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-colors sm:min-h-52 ${
                      isDragActive
                        ? 'border-cyan-300 bg-cyan-300/10'
                        : 'border-white/20 bg-black/20 hover:border-cyan-300/60 hover:bg-cyan-300/[0.03]'
                    }`}
                  >
                    <input {...getInputProps()} aria-label="Choose MP4 film file" />
                    {selectedFile ? (
                      <div className="w-full">
                        <video
                          src={videoPreviewUrl}
                          controls
                          className="mx-auto max-h-64 w-full max-w-lg rounded-lg bg-black"
                        />
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <p className="max-w-[80%] truncate text-sm text-cyan-200">{selectedFile.name}</p>
                          <button
                            type="button"
                            aria-label="Remove selected video"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedFile(undefined);
                            }}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-rose-400 hover:bg-rose-400/10"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="mb-3 text-4xl text-cyan-300" />
                        <p className="text-sm font-medium text-gray-200">
                          {isDragActive ? 'Drop your video here' : 'Drag and drop your MP4 here'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">or click to browse files</p>
                      </>
                    )}
                  </div>
                )}
              </Dropzone>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/10 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={uploadLoading}
                  className="min-h-11 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={uploadLoading}
                  className="min-h-11 rounded-lg bg-gradient-to-b from-sky-500 to-[#00D0B8] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#0b1115] disabled:cursor-wait disabled:opacity-60"
                >
                  {uploadLoading ? "Uploading..." : "Upload film"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default OrderContent;
