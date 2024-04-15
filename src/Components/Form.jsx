import React, { useState } from "react";
import "./Form.css";
import axios from "axios";

const Form = () => {
  // State to hold the value of the text area
  const [textValue, setTextValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageSrc, setImageSrc] = useState([]);

  const apiKey = process.env.REACT_APP_API_KEY;
  const imageUrls = [];

  // Function to handle changes in the text area
  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleClick = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Split the text input into an array of lines based on full stops
      const linesArray = textValue.split(".");
      // Remove any empty lines from the array
      const filteredArray = linesArray.filter((line) => line.trim() !== "");

      // Call the API for each line in the filtered array
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
          // Handle the image data, such as saving it to a file or displaying it
          console.log("Image data:", response.data);
          const base64String = arrayBufferToBase64(response.data);
          const imagesUrl = `data:image/png;base64,${base64String}`;
          imageUrls.push(imagesUrl);
          setImageSrc(imageUrls);
        }

        if (response && response.status === 400) {
          // Handle the 400 error response
          console.log("Bad request:", response.data);
        }
      });

      // Wait for all image requests to complete
      await Promise.all(imagePromises);
    } catch (error) {
      console.error("API request error:", error);
      setError("Error fetching images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to convert ArrayBuffer to base64 string
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div className="form-container">
      {/* Text area */}
      <textarea
        className="textarea-input"
        placeholder="Enter text here"
        value={textValue}
        onChange={handleTextChange}
      />

      {/* Button to trigger the onClick function */}
      <button className="button" onClick={handleClick}>
        Click me
      </button>
      {imageSrc.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Generated Image ${index + 1}`}
          style={{ marginRight: "10px" }}
        />
      ))}
    </div>
  );
};

export default Form;
