import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';

interface VideoCompositionProps {
  images: string[];
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ images }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Calculate the current image index based on the frame number
  const imageIndex = Math.floor((frame / durationInFrames) * images.length);

  // Ensure the index is within the bounds of the images array
  const currentImage = images[imageIndex % images.length];

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Img src={currentImage} style={{ width: '70vw' }} />
      <div style={{ position: 'absolute', bottom: 20, left: 20, fontSize: 84, fontWeight: 'bold', color: 'white' }}>
        Caption
      </div>
    </AbsoluteFill>
  );
};
