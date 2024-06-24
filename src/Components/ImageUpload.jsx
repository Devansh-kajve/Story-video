import React, { useState } from "react";
import axios from "axios";
import "./ImageUpload.css";

const ImageUploadForm = () => {
  const [files, setFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/upload-multiple",
        formData
      );
      console.log(response.data);
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error uploading images:", error);
      setUploadSuccess(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Images</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
      {uploadSuccess && <p>Upload successful!</p>}
      <div className="file-preview">
        {Array.isArray(files) &&
          files.length > 0 &&
          files.map((file, index) => (
            <div key={index} className="file-item">
              <img src={URL.createObjectURL(file)} alt={`File ${index + 1}`} />
              <span>{file.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImageUploadForm;
