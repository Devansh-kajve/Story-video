import { AbsoluteFill , Img, useCurrentFrame, useVideoConfig , spring } from 'remotion';
import image1 from './images/1.png';
import image2 from './images/2.png';
import image3 from './images/3.png';
export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let image = image1;
if(frame > 60){
image = image2;
}
if(frame>120){
  image = image3;
}

const scale = spring({
  from: 1,
  to: 2,
  frame,
  fps: 180,
  config: {
    mass: 2,
    damping: 50,
  },
})

// Customize the style of the caption
const captionStyle = {
  position: 'absolute',
  bottom: 20,
  left: 20,
  fontSize: 84,
  fontWeight: 'bold',
  color: 'white',
  width:"15vw",
};
    return (
    <AbsoluteFill style={{

      justifyContent:"center",
      alignItems:"center"
    }} >
    <Img src={image} alt="" style={{
      width: "70vw",
      transform: `scale(${scale})`,
    }}/>
    <div style={captionStyle}>Caption</div>
  </AbsoluteFill>
    );
  };