import React, { createRef, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import Dropzone from "react-dropzone";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { API_ENDPOINTS } from "../../server/api_endpoints";
import axios from "axios";
import { jwtDecode } from 'jwt-decode'
import { toast } from "react-toastify";

const VideoModal = ({ setShowModal,selectedFile, setSelectedFile }) => {
  const token = localStorage.getItem("token");
  const [loading,setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null);
  const handleDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    if(token === null) return
    const decoded = jwtDecode(token)
    setUserID(decoded.UserId)
  }, []);


  const handleSubmit = async() => {
    console.log("clicked")
    setLoading(true)
    console.log("selectedFile",selectedFile.size/1024/1024)
    if(selectedFile.size/1024/1024 > 1024){
      toast.error("File size should be less than 1024 MB")
      setLoading(false)
      return
    }
    try {
      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("user_id", userID);
      formData.append("packageType", "299");
      const response = await axios.post(API_ENDPOINTS.UPLOAD_VIDEO, formData);
      if(response.data.response_code === 200){
        setSuccessMessage("File uploaded successfully")
        setLoading(false)
        setSelectedFile(undefined)
        setTimeout(() => {
          setShowModal(false)
        }, 2000);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
      setLoading(false)
      setSuccessMessage("Error uploading file")
    }
  }
  return (
    <>
    <div>
      <div className="fixed top-0 left-0 w-full h-full z-[100] flex items-center justify-center">
        <div className="absolute  w-full h-full bg-black opacity-70 cursor-pointer" onClick={() => setShowModal(false)}/>
        <button
          className="absolute text-xl w-10 font-bold flex items-center justify-center aspect-square bg-white rounded-full top-10 right-10 text-black"
          onClick={() => setShowModal(false)}
          >
          <CgClose />
        </button>
        <div className="w-[80%] lg:w-[55%] h-auto p-10 rounded-md bg-white relative">
          <h1 className="text-3xl font-bold mb-4">Upload Video</h1>
          <p className="text-sm">Allowed extension: mp4, mp3, zip.</p>
          <p className="text-sm pb-2">Max allowed size: 1024 MB.</p>
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div
                  {...getRootProps()}
                  className="w-full h-auto min-h-[300px] z-[100] flex-col border-dashed border-4 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
                  >
                  <input {...getInputProps()} type="file" 
                  accept="video/*"
                  />    
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
                        Drag 'n' drop some files here, or click to select files
                      </p>
                    )}
                  </div>
                </div>
                {selectedFile && (
                  <div className="flex items-center justify-center mx-auto gap-2 mb-2">
                    <p className="text-sm text-blue-900">{selectedFile.name}</p>
                    <FaTrash
                      className="text-md text-red-500 cursor-pointer"
                      onClick={() => setSelectedFile(undefined)}
                      />
                  </div>
                )}
              </section>
            )}
          </Dropzone>
            <button className="w-max px-5 rounded-md py-2 mt-4 bg-blue-500 text-white font-semibold"
            onClick={handleSubmit}
            >
                {
                  loading ? "Uploading...":"Upload"
                }
            </button>
        </div>
        {
          successMessage && (
            <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-md">
              {successMessage}
            </div>
          )
        }
      </div>
    </div>
    </>
  );
};

export default VideoModal;
