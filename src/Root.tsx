import React from 'react';
import { Composition } from 'remotion';
import { VideoComposition} from './Components/MyVideoComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StorysFrames"
        component={VideoComposition as any} // Temporarily cast to any
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ images: [] }} // Ensure to pass default props if needed
      />
    </>
  );
};
