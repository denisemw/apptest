import React from "react";
import Webcam from "react-webcam";
import cecile from './Cecile.mp4'


export default function WebcamVideo() {

    const webcamRef = React.useRef(null);
  const vidRef = React.useRef(null);
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
    // const vidRef = useRef();

    vidRef.current.play();
    // document.querySelector("#vidRef").play();
    // var elem = document.getElementById("myvideo"); 
//     elem.setAttribute('width', '75%')
//     elem.setAttribute('height', 'auto')
	// if (vidRef.current.requestFullscreen) {
  //   vidRef.current.requestFullscreen();
  // } else if (vidRef.current.webkitRequestFullscreen) { /* Safari */
  // vidRef.current.webkitRequestFullscreen();
  // } else if (vidRef.current.msRequestFullscreen) { /* IE11 */
  // vidRef.current.msRequestFullscreen();
  // }

  return (
    <>
        <video  ref = {vidRef}  width="500" height="300" controls >
        <source src={cecile} type="video/mp4"/>
        </video> 
        </>
  );
} , [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);


        

const handlePlayVideo = () => {
  

  setCapturing(true);
  mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
    mimeType: "video/webm",
  });
  mediaRecorderRef.current.addEventListener(
    "dataavailable",
    handleDataAvailable
  );
  mediaRecorderRef.current.start();
  // const vidRef = useRef();

  // vidRef.current.play();

  //    var elem = document.getElementById("vidRef"); 
  //   elem.setAttribute('width', '75%')
  //   elem.setAttribute('height', 'auto')
  //   elem.play();
	// if (elem.current.requestFullscreen) {
  //   elem.current.requestFullscreen();
  // } else if (elem.current.webkitRequestFullscreen) { /* Safari */
  // elem.current.webkitRequestFullscreen();
  // } else if (elem.current.msRequestFullscreen) { /* IE11 */
  // elem.current.msRequestFullscreen();
  // }

  
  // return (
  //   <>
  //       <video  ref = {vidRef}  width="500" height="300" controls >
  //       <source src={cecile} type="video/mp4"/>
  //       </video> 
  //       </>
  // );
}
  
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
  
  var screenheight = window.screen.height;

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
        <>
        {/* const vidRef = useRef(null); */}

        
        {/* {vidRef.play()}; */}
        {/* {playvideo()}  */}
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
    
        </>
      ) : (
        <button onClick={handlePlayVideo}>Start recording</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}

<video
            id="full-screenVideo"
            src={cecile}
            ref={vidRef}
            height={screenheight}
            width="auto"
            // onLoadStart={this.onLoadStart}
            // onTimeUpdate={this.onProgress}
            style={{ width: "100%", height: "100%" }}
          />
            
    </div>
  );
  
}