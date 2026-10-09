import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../server/api_endpoints';
import { jwtDecode } from 'jwt-decode';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import TrackedVideoPlayer from './TrackedVideoPlayer';
import { submissionCriteria, validateSubmissionFile } from './submissionCriteria';

const OrderContent = () => {
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submissionFiles, setSubmissionFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [currentPackageType, setCurrentPackageType] = useState(null);
  const [filmTitle, setFilmTitle] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
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
    if (!submissionFiles.video) {
      setVideoPreviewUrl('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(submissionFiles.video);
    setVideoPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [submissionFiles.video]);

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

  const refreshVideos = useCallback(async () => {
    const response = await axios.post(
      API_ENDPOINTS.GET_USER_VIDEOS,
      { user_id: userID },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.status || !Array.isArray(response.data.result)) {
      throw new Error(response.data.message || "Unable to refresh your film submissions.");
    }

    setVideos99(response.data.result.filter((video) => video.packageType === "99"));
    setVideos299(response.data.result.filter((video) => video.packageType === "299"));
  }, [userID]);

  // Fetch videos
  useEffect(() => {
    if (!userID) return;

    const getVideosByUserId = async () => {
      try {
          await refreshVideos();
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    getVideosByUserId();
  }, [userID, refreshVideos]);

  const handleFileChange = async (field, file) => {
    if (!file) return;
    const rejectFile = (message) => {
      setSubmissionFiles((current) => {
        const nextFiles = { ...current };
        delete nextFiles[field];
        return nextFiles;
      });
      setFileErrors((current) => ({ ...current, [field]: message }));
    };
    const validationError = await validateSubmissionFile(field, file, currentPackageType);
    if (validationError) {
      rejectFile(validationError);
      return;
    }

    setSubmissionFiles((current) => ({ ...current, [field]: file }));
    setFileErrors((current) => ({ ...current, [field]: '' }));
    setUploadSuccess(false);
  };

  const handleOpenModal = (packageType) => {
    setCurrentPackageType(packageType);
    setFilmTitle('');
    setSubmissionFiles({});
    setFileErrors({});
    setUploadSuccess(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSubmissionFiles({});
    setFileErrors({});
    setCurrentPackageType(null);
    setFilmTitle('');
    setUploadSuccess(false);
  };

  const handleSubmit = async () => {
    const missingRequirements = submissionCriteria
      .filter(({ field }) => !submissionFiles[field] || fileErrors[field])
      .map(({ label }) => label);
    if (!filmTitle.trim()) missingRequirements.push('Film Title');
    if (missingRequirements.length) {
      toast.error(`Complete these required items: ${missingRequirements.join(', ')}.`, { position: "top-right", autoClose: 7000 });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in again before submitting your film.", { position: "top-right" });
      return;
    }

    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append("packageType", currentPackageType);
      formData.append("title", filmTitle.trim());
      submissionCriteria.forEach(({ field }) => formData.append(field, submissionFiles[field]));

      const response = await axios.post(API_ENDPOINTS.UPLOAD_VIDEO, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.response_code === 200 || response.data.status === true) {
        toast.success("✅ File uploaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setUploadSuccess(true);
        try {
          await refreshVideos();
        } catch (refreshError) {
          console.error("Film uploaded, but submissions could not be refreshed:", refreshError);
          toast.warning("Your film was uploaded, but the list could not be refreshed. Reload the page to see it.", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } else {
        throw new Error(response.data.message || "The server did not confirm the video upload.");
      }
    } catch (error) {
      console.error("Error:", error);
      const responseBody = error.response?.data;
      const errorMessage = typeof responseBody === 'string' && responseBody.trimStart().startsWith('<')
        ? 'The upload endpoint returned a web page instead of API data. Check the configured backend API URL.'
        : responseBody?.message || error.message || "Error uploading file. Please try again!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
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
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                  {currentPackageType === "99" ? "Short film submission" : "Feature film submission"}
                </p>
                <h2 id="upload-modal-title" className="mt-1 text-xl font-semibold capitalize">Upload a film</h2>
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
                <label htmlFor="film-title" className="mb-2 block text-sm font-medium text-gray-200 capitalize">Film title</label>
                <input
                  id="film-title"
                  type="text"
                  value={filmTitle}
                  onChange={(event) => setFilmTitle(event.target.value)}
                  maxLength={255}
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white placeholder:text-gray-500 focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300 capitalize"
                  placeholder="Enter your film title"
                />
              </div>

              {uploadSuccess && (
                <p role="status" className="rounded-lg border border-emerald-300/20 bg-emerald-300/[0.08] px-4 py-3 text-sm font-medium text-emerald-200">
                  All required items were validated and your film was uploaded successfully.
                </p>
              )}

              <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.04] px-4 py-3 text-sm text-gray-300">
                <p>Complete all eight required items below. Artwork pixel dimensions and file formats are checked before upload.</p>
                <p className="mt-2">Video: MP4 · Maximum size: {currentPackageType === "99" ? "500 MB" : "3 GB"}</p>
                <p className="mt-1 text-gray-400">Duration must be 15 minutes minimum and 30 minutes maximum.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {submissionCriteria.map(({ field, label, accept, dimensions }) => (
                  <div key={field} className="min-w-0 rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-100">{label}</p>
                      <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide ${submissionFiles[field] ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {submissionFiles[field] ? 'Ready' : 'Required'}
                      </span>
                    </div>
                    {dimensions && (
                      <p className="mb-2 text-xs text-gray-500">Exact image size: {dimensions[0]} × {dimensions[1]} px</p>
                    )}
                    <input
                      id={`submission-${field}`}
                      type="file"
                      accept={accept}
                      disabled={uploadLoading || uploadSuccess}
                      className="peer sr-only"
                      onChange={(event) => {
                        handleFileChange(field, event.target.files?.[0]);
                        event.target.value = '';
                      }}
                    />
                    <label
                      htmlFor={`submission-${field}`}
                      className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/[0.06] px-3 py-2 text-center text-xs font-semibold text-cyan-200 transition-colors hover:border-cyan-300/60 hover:bg-cyan-300/10 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                    >
                      <FaCloudUploadAlt className="shrink-0" />
                      <span className="max-w-full truncate">{submissionFiles[field]?.name || 'Choose file'}</span>
                    </label>
                    {submissionFiles[field] && (
                      <button
                        type="button"
                        onClick={() => setSubmissionFiles((current) => {
                          const nextFiles = { ...current };
                          delete nextFiles[field];
                          return nextFiles;
                        })}
                        disabled={uploadLoading || uploadSuccess}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200 disabled:opacity-50"
                      >
                        <FaTrash size={11} /> Remove file
                      </button>
                    )}
                    {fileErrors[field] && (
                      <p role="alert" className="mt-2 text-xs text-rose-300">{fileErrors[field]}</p>
                    )}
                    {field === 'video' && submissionFiles.video && (
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="mt-3 max-h-48 w-full rounded-lg bg-black"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/10 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={uploadLoading}
                  className="min-h-11 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadSuccess ? "Done" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={uploadLoading || uploadSuccess}
                  className="min-h-11 rounded-lg bg-gradient-to-b from-sky-500 to-[#00D0B8] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#0b1115] disabled:cursor-wait disabled:opacity-60"
                >
                  {uploadLoading ? "Uploading..." : uploadSuccess ? "Uploaded" : "Upload film"}
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
