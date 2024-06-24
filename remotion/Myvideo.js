import React from "react";
import { Composition, useVideoConfig } from "remotion";

const MyVideo = ({ images }) => {
  const { fps, width, height } = useVideoConfig();
  return (
    <div style={{ flex: 1, backgroundColor: "white", position: "relative" }}>
      {images.map((src, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1 - index / images.length,
          }}
        />
      ))}
    </div>
  );
};

const VideoComposition = ({ images }) => {
  const duration = images.length * 30; // 30 frames per image
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={duration}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ images }}
    />
  );
};

export default VideoComposition;
