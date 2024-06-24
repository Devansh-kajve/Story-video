import React, { useState } from "react";
import { Player } from "@remotion/player";
import { VideoComposition } from "./MyVideoComposition.tsx";

const Video = () => {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const images = files.map((file) => URL.createObjectURL(file));
    setUploadedImages(images);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleImageUpload} />
      {uploadedImages.length > 0 && (
        <Player
          component={VideoComposition}
          compositionWidth={1920}
          compositionHeight={1080}
          durationInFrames={180}
          fps={30}
          inputProps={{ images: uploadedImages }}
        />
      )}
    </div>
  );
};

export default Video;
