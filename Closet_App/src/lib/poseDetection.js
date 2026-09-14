import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

// Landmark indices in MediaPipe's 33-point pose model.
const L_SHOULDER = 11, R_SHOULDER = 12, L_HIP = 23, R_HIP = 24, L_KNEE = 25, R_KNEE = 26;

let landmarkerPromise = null;

// Loads the pose model once (from Google's public CDN — free, no API key,
// runs entirely in-browser afterward) and reuses it for every call.
function getLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    ).then((filesetResolver) =>
      PoseLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        },
        runningMode: "IMAGE",
      })
    );
  }
  return landmarkerPromise;
}

/**
 * Runs pose detection on an already-loaded <img> element and returns
 * CSS-ready percentage regions for a top and bottom garment, based on
 * detected shoulder/hip/knee positions. Returns null if no person was
 * detected in the image.
 */
export async function detectBodyRegions(imageEl) {
  const landmarker = await getLandmarker();
  const result = landmarker.detect(imageEl);
  const landmarks = result.landmarks?.[0];
  if (!landmarks) return null;

  const avgX = (a, b) => (landmarks[a].x + landmarks[b].x) / 2;
  const avgY = (a, b) => (landmarks[a].y + landmarks[b].y) / 2;

  const shoulderWidth = Math.abs(landmarks[L_SHOULDER].x - landmarks[R_SHOULDER].x);
  const hipWidth = Math.abs(landmarks[L_HIP].x - landmarks[R_HIP].x);
  const shoulderY = avgY(L_SHOULDER, R_SHOULDER);
  const hipY = avgY(L_HIP, R_HIP);
  const kneeY = avgY(L_KNEE, R_KNEE);
  const shoulderCenterX = avgX(L_SHOULDER, R_SHOULDER);
  const hipCenterX = avgX(L_HIP, R_HIP);

  // Garments are wider than the raw joint-to-joint distance (a shirt
  // extends past the shoulder joints), so pad the detected width out.
  const topWidth = shoulderWidth * 1.6;
  const bottomWidth = hipWidth * 1.8;

  const pct = (n) => `${(n * 100).toFixed(2)}%`;

  return {
    top: {
      left: pct(shoulderCenterX - topWidth / 2),
      top: pct(shoulderY - 0.03),
      width: pct(topWidth),
      height: pct(hipY - shoulderY + 0.05),
    },
    bottom: {
      left: pct(hipCenterX - bottomWidth / 2),
      top: pct(hipY - 0.02),
      width: pct(bottomWidth),
      height: pct(kneeY - hipY + 0.35),
    },
  };
}