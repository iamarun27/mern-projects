import { useEffect, useRef, useState } from "react";

import {detect,init} from '../utils/utils'

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  
  const streamRef = useRef(null);
  const lastTimestampRef = useRef(0);

 

  const [expression, setExpression] = useState("Loading...");
 

  useEffect(() => {
    init({landmarkerRef,videoRef,streamRef});

    return () => {
      mounted = false;

      // Stop animation
      // if (animationRef.current) {
      //   cancelAnimationFrame(animationRef.current);

      //   animationRef.current = null;
      // }

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }

      // Remove video stream
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }

      // Close MediaPipe
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch (error) {
          console.error("Landmarker cleanup error:", error);
        }

        landmarkerRef.current = null;
      }

      lastTimestampRef.current = 0;
    };
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "400px",
          maxWidth: "100%",
          borderRadius: "12px",
          transform: "scaleX(-1)",
        }}
      />

      <h2>{expression}</h2>
      <button onClick={()=>{detect({landmarkerRef,videoRef,streamRef})}}>Detect Expression</button>
    </div>
  );
}
