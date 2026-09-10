import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";


export default function FaceExpression({ onClick = () => { } }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [ expression, setExpression ] = useState("Detecting...");

    useEffect(() => {
        init({ landmarkerRef, videoRef, streamRef });

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    async function handleClick() {
        const expression = detect({ landmarkerRef, videoRef, setExpression })
        console.log(expression)
        onClick(expression)
    }


    return (
        <div style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                style={{ width: "400px", borderRadius: "12px" }}
                playsInline
            />
            {/* <h2>{expression}</h2> */}
            {/* <button onClick={handleClick} >Detect expression</button> */}

        <h2
  style={{
    margin: "20px auto",
    padding: "12px 28px",
    width: "fit-content",
    background: "linear-gradient(135deg, #10b981, #06b6d4, #6366f1)",
    color: "white",
    borderRadius: "12px",
    fontSize: "24px",
    fontWeight: "700",
    textAlign: "center",
    boxShadow: "0 6px 15px rgba(16, 185, 129, 0.25)",
  }}
>
  {expression}
</h2>

            <button
  onClick={handleClick}
  style={{
    margin: "20px",
    padding: "12px 24px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
  }}
>
  Detect Expression
</button>
        </div>
    );
}