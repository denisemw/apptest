import React from "react";
import Webcam from "react-webcam";
// import cecile from './Cecile.mp4'


export default function WebcamVideo() {
  const webcamRef = React.useRef(null);
  const cecileRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = React.useCallback(() => {
    
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
//     document.querySelector("#myvideo").play();
//     var elem = document.getElementById("myvideo"); 
//     elem.setAttribute('width', '75%')
//     elem.setAttribute('height', 'auto')
// 	if (elem.requestFullscreen) {
//         elem.requestFullscreen();
//   } else if (elem.webkitRequestFullscreen) { /* Safari */
//         elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) { /* IE11 */
//         elem.msRequestFullscreen();
//   }
        
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  
  const handleStopCaptureClick = React.useCallback(() => {
    // document.querySelector("#myvideo").pause();
    mediaRecorderRef.current.stop();
    
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const videoConstraints = {
    width: 960,
    height: 720,
    facingMode: "user",
  };

  return (
    <div className="Container">
      <Webcam
        height={400}
        width={400}
        audio={true}
        muted={true}
        mirrored={true}
        ref={webcamRef}
        videoConstraints={videoConstraints}
      />
      {/* <video id = "myvideo" preload="auto" width="0" height="0" controls >
      <source src={cecile} type="video/mp4"/>
        </video>       */}

      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
            
    </div>
  );
}