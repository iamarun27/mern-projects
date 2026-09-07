 import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

  let mounted = true;
 export const init = async ({landmarkerRef,videoRef,streamRef,setExpression}) => {
    try {
      // console.log("Loading MediaPipe...");

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
      );

      if (!mounted) return;

      //  console.log("WASM loaded");

      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },

        runningMode: "VIDEO",

        numFaces: 1,

        outputFaceBlendshapes: true,
      });

      if (!mounted) {
        landmarker.close();
        return;
      }

      landmarkerRef.current = landmarker;

      //console.log("FaceLandmarker ready");

      // ==============================
      // CAMERA
      // ==============================
      setExpression("Starting Camera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            ideal: 640,
          },

          height: {
            ideal: 480,
          },

          facingMode: "user",
        },

        audio: false,
      });

      if (!mounted) {
        stream.getTracks().forEach((track) => track.stop());

        landmarker.close();

        return;
      }

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        throw new Error("Video element not found");
      }

      video.srcObject = stream;

      // Wait until video metadata loads
      await new Promise((resolve) => {
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.onloadeddata = resolve;
        }
      });

      await video.play();

      if (!mounted) return;

      // console.log("Camera started");

      setExpression("No Face Detected");

      detect();
    } catch (error) {
      console.error("========== FACE DETECTION ERROR ==========");

      console.error(error);

      console.error("==========================================");

      if (!mounted) return;

      if (error?.name === "NotAllowedError") {
        setExpression("Camera Permission Denied");
      } else if (error?.name === "NotFoundError") {
        setExpression("Camera Not Found");
      } else {
        setExpression("Face Detection Error");
      }
    }
  };

export const detect = ({landmarkerRef,videoRef,setExpression}) => {
    if (!mounted) return;

    const video = videoRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !landmarker) {
      animationRef.current = requestAnimationFrame(detect);
      return;
    }

    // Video ready nahi hai
    if (video.readyState < 2) {
      animationRef.current = requestAnimationFrame(detect);
      return;
    }

    try {
      // MediaPipe ko increasing timestamp chahiye
      const timestamp = Math.max(
        performance.now(),
        lastTimestampRef.current + 1,
      );

      lastTimestampRef.current = timestamp;

      const results = landmarker.detectForVideo(video, timestamp);

      // ==============================
      // FACE NOT FOUND
      // ==============================
      if (!results.faceBlendshapes || results.faceBlendshapes.length === 0) {
        if (mounted) {
          setExpression("No Face Detected");
        }

        animationRef.current = requestAnimationFrame(detect);

        return;
      }

      // ==============================
      // GET BLENDSHAPES
      // ==============================
      const blendshapes = results.faceBlendshapes[0].categories;

      const getScore = (name) => {
        const item = blendshapes.find(
          (blendshape) => blendshape.categoryName === name,
        );

        return item?.score ?? 0;
      };

      // Smile
      const smileLeft = getScore("mouthSmileLeft");

      const smileRight = getScore("mouthSmileRight");

      // Surprise
      const jawOpen = getScore("jawOpen");

      const browUp = getScore("browInnerUp");

      // Sad
      const frownLeft = getScore("mouthFrownLeft");

      const frownRight = getScore("mouthFrownRight");

      let currentExpression = "😐 Neutral";

      if (smileLeft > 0.5 && smileRight > 0.5) {
        currentExpression = "😊 Happy";
      } else if (jawOpen > 0.2 && browUp > 0.2) {
        currentExpression = "😮 Surprised";
      } else if (frownLeft > 0.0001 && frownRight > 0.0001) {
        currentExpression = "😢 Sad";
      }

      if (mounted) {
        setExpression(currentExpression);
      }
    } catch (error) {
      console.error("Detection failed:", error);
    }

    if (mounted) {
      animationRef.current = requestAnimationFrame(detect);
    }
  };

 