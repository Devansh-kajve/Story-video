import React, { useState, useEffect } from "react";
import "./Form.css";
import axios from "axios";
import Loader from "./../loader.svg";

const Form = () => {
  const [textValue, setTextValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageSrc, setImageSrc] = useState([]);
  const [frames, setFrames] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [apiKey, setApiKey] = useState("");

  // const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/config.json");
        const config = await response.json();
        setApiKey(config.apiKey);
      } catch (error) {
        console.error("Error fetching configuration:", error);
      }
    };

    fetchConfig();
  }, []);

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleClick = async () => {
    setIsLoading(true);
    setError("");
    try {
      const linesArray = textValue.split(".");
      const filteredArray = linesArray.filter((line) => line.trim() !== "");

      const imagePromises = filteredArray.map(async (line) => {
        const formData = new FormData();
        formData.append("prompt", line);
        formData.append("output_format", "webp");

        const response = await axios.post(
          "https://api.stability.ai/v2beta/stable-image/generate/core",
          formData,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              Accept: "image/*",
            },
            responseType: "arraybuffer",
          }
        );

        if (response.status === 200) {
          const base64String = arrayBufferToBase64(response.data);
          const imageUrl = `data:image/png;base64,${base64String}`;
          return imageUrl;
        } else if (response.status === 400) {
          console.log("Bad request:", response.data);
          throw new Error("Bad request");
        } else {
          throw new Error("Unexpected response status");
        }
      });

      const generatedImages = await Promise.all(imagePromises);
      setImageSrc((prevImages) => [...prevImages, ...generatedImages]);
    } catch (error) {
      console.error("API request error:", error);
      setError("Error fetching images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleThumbnailClick = (src) => {
    setSelectedImage(src);
  };

  const handleUseClick = () => {
    if (selectedImage) {
      setFrames((prevFrames) => [...prevFrames, selectedImage]);
      console.log("Frames:", frames);
    }
  };

  const sendFramesToServer = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3001/trigger-render",
        { frames }
      );
      console.log("Render triggered:", response.data.message);
      setIsLoading(false);
    } catch (error) {
      console.error("Error triggering render:", error);
      setError("Failed to trigger video render. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="input-container">
        <input
          type="text"
          className="input-field"
          placeholder="Enter text here"
          value={textValue}
          onChange={handleTextChange}
        />
        <button className="button" onClick={handleClick}>
          Generate
        </button>
      </div>
      {isLoading && <img src={Loader} />}

      {error && <p className="error">{error}</p>}
      <h1>Image preview:</h1>
      <div className="image-preview-container">
        {selectedImage && (
          <div className="selected-image-container">
            <img
              src={selectedImage}
              alt="Selected"
              className="selected-image"
            />
            <button className="use-button" onClick={handleUseClick}>
              Use
            </button>
          </div>
        )}
        <div className="thumbnail-container">
          {imageSrc.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Generated Image ${index + 1}`}
              className="thumbnail"
              onClick={() => handleThumbnailClick(src)}
            />
          ))}
        </div>
      </div>
      <h1>Frames preview:</h1>
      <div className="thumbnail-container">
        {frames.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Generated Image ${index + 1}`}
            className="thumbnail"
          />
        ))}
      </div>
      <button onClick={sendFramesToServer} disabled={frames.length === 0}>
        Render Video
      </button>
    </div>
  );
};

export default Form;
