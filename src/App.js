import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import logo from './ORCA.png'
import cecile from './Cecile.mp4'
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
// } from 'firebase/storage';
// import { storage } from './firebaseConfig';

import { FiCamera, FiStopCircle, FiMic, FiVideo } from 'react-icons/fi';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvz0aN-5g--4DSKwBVgNpu79zETOgLtbM",
  authDomain: "owlet-app.firebaseapp.com",
  projectId: "owlet-app",
  storageBucket: "owlet-app.appspot.com",
  messagingSenderId: "885098344180",
  appId: "1:885098344180:web:6757502d21b5d488f5b8a1"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


export default function VideoRecording() {
  const webcamRef = useRef(null);
  const vidRef = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState('notRecording');
  const [audioBlob, setAudioBlob] = useState(null);
  const [micStream, setMicStream] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('recording');
  const [isMicOn, setIsMicOn] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [counter, setCounter] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [currentMediaRecorder, setCurrentMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    if (recordingStatus === 'recording') {
      console.log(counter)
      setTimerInterval(setInterval(() => {
        setCounter(prevCounter => prevCounter + 1);
      }, 1000));
    } else {
      clearInterval(timerInterval);
      setCounter(0);
    }
  }, [recordingStatus]);

  useEffect(() => {
    if (recordingStatus === 'recording' && counter % 60 === 0) {
      if (currentMediaRecorder) {
        currentMediaRecorder.stop();
        setCurrentMediaRecorder(null);
      }

      const recorder = new MediaRecorder(webcamRef.current.stream);
      setCurrentMediaRecorder(recorder);

      const newRecordedChunks = [...recordedChunks];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          newRecordedChunks.push(e.data);
          setRecordedChunks(newRecordedChunks);
        }
      };

      recorder.onstop = async () => {

        const videoBlob = new Blob(recordedChunks, {
            type: 'video/webm',
          });
    
          // console.log(counter)
          const videoFile = new File([videoBlob], `${new Date().toISOString()}.webm`, {
            type: 'video/webm',
          });

    
          const videoRef = ref(storage, `videos/${new Date().toISOString()}.webm`);
    
          try {
            console.log('Uploading video file...');
            await uploadBytes(videoRef, videoFile);
            console.log('Video file uploaded successfully.');
    
            const videoDownloadURL = await getDownloadURL(videoRef);
            setVideoUrl(videoDownloadURL);
    
          } catch (error) {
            console.error('Error uploading files:', error);
          }
      };

      recorder.start();
    }
  }, [counter, recordingStatus]);



  const handleStartRecording = async () => {
    if (recordingStatus === 'uploaded') {
      setRecordingStatus('notRecording');
      setVideoUrl(null);
    }

    const recorder = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    vidRef.current.play()
    if (vidRef.current.requestFullscreen) {
        vidRef.current.requestFullscreen();
      } else if (vidRef.current.webkitRequestFullscreen) { /* Safari */
      vidRef.current.webkitRequestFullscreen();
      } else if (vidRef.current.msRequestFullscreen) { /* IE11 */
      vidRef.current.msRequestFullscreen();
      }
    
    // recorder.addEventListener(
    //   "dataavailable",
    //   handleDataAvailable
    // );
    setMediaRecorder(recorder);

    // const recordedChunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks(prev => [...prev, e.data])
        recordedChunks.push(e.data);
        console.log(recordedChunks);
      }
    };

    


    recorder.onstop = async () => {

      vidRef.current.pause()
      
      const videoBlob = new Blob(recordedChunks, {
        type: 'video/webm',
      });

      const videoFile = new File([videoBlob], `${new Date().toISOString()}.webm`, {
        type: 'video/webm',
      });

      const videoRef = ref(storage, `videos/${new Date().toISOString()}.webm`);

      try {
        console.log('Uploading video file...');
        await uploadBytes(videoRef, videoFile);
        console.log('Video file uploaded successfully.');

        // console.log('Uploading audio file...');
        // await uploadBytes(audioRef, audioFile);
        // console.log('Audio file uploaded successfully.');

        const videoDownloadURL = await getDownloadURL(videoRef);
        setVideoUrl(videoDownloadURL);

        setRecordingStatus('uploaded');
        console.log('Recording uploaded successfully!');
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    };

    // Generate a unique recordId
    const newRecordId = Date.now();
    setRecordId(newRecordId);

    recorder.start();
    // recorder.addEventListener(
    //   "dataavailable",
    //   handleDataAvailable
    // );
    // audioRecorder.startRecording();
    // startMicrophone();
    setRecordingStatus('recording');
  };

  const handleStopRecording = async () => {
    setRecordingStatus('stopped');

    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const videoConstraints = {
    width: 960,
    height: 720,
    facingMode: "user",
  };

  return (
    <div className="App"
    
    style={{
      position: 'absolute', left: '50%', 
      transform: 'translate(-50%)'
  }}>

<div><img src={logo}></img></div>

    
      <div className="flex space-x-4">
        
        {/* <button
          onClick={() => handleTabChange('recording')}
          className={`flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4 ${
            activeTab === 'recording' ? 'bg-blue-700' : ''
          }`}
        >
          <FiCamera className="mr-2" /> Record
        </button> */}
        {recordingStatus === 'uploaded' && (
        <button
        style={{
          position: 'absolute', left: '50%',
          transform: 'translate(-50%)',
          backgroundColor: '#82b7ca',
          borderRadius: '8px',
          color: 'white',
          padding: '5px 10px',
          display: 'inline-block',
          fontSize: '16px',
          //margin: '4px 2px',
          borderColor: '#82b7ca',}}
          onClick={() => handleTabChange('video')}
          className={`flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4 ${
            activeTab === 'video' ? 'bg-blue-700' : ''
          }`}
        >
          <FiVideo className="mr-2" /> View Video
        </button>
        )}
      </div>

      {activeTab === 'recording' && (
        <>
        <br></br>
        <div
            style={{
              position: 'absolute', left: '50%',
              transform: 'translate(-50%)',}}>
          
          <Webcam
      
        height={400}
        width={400}
        audio={true}
        muted={true}
        mirrored={true}
        ref={webcamRef}
        videoConstraints={videoConstraints}
         />
         <video
            id="full-screenVideo"
            poster="demo.png"
            src={cecile}
            ref={vidRef}
            width="auto"
            // onLoadStart={this.onLoadStart}
            // onTimeUpdate={this.onProgress}
            style={{ width: "100%", height: "100%" }}
          />
         </div>
          {recordingStatus === 'notRecording' && (
            <button
            style={{
              position: 'absolute', left: '50%',
              transform: 'translate(-50%)',
              backgroundColor: '#82b7ca',
              borderRadius: '8px',
              color: 'white',
              padding: '5px 10px',
              display: 'inline-block',
              fontSize: '16px',
              //margin: '4px 2px',
              borderColor: '#82b7ca',}}
              onClick={handleStartRecording}
              //className="Container"
            >
          <FiCamera className="mr-2" /> Start recording

            </button>
          )}
          {recordingStatus === 'recording' && (
            <div className="mb-4">
              <br></br>
              <p className="text-2xl text-center font-semibold"
              style={{
                position: 'absolute', left: '50%',
                transform: 'translate(-50%)',}}
              >
                <br></br>
                {formatTimer(counter)}
              </p>
              <button

              style={{
                position: 'absolute', left: '50%',
                transform: 'translate(-50%)',
                backgroundColor: '#82b7ca',
                borderRadius: '8px',
                color: 'white',
                padding: '5px 10px',
                display: 'inline-block',
                fontSize: '16px',
                //margin: '4px 2px',
                borderColor: '#82b7ca',}}
              
                onClick={handleStopRecording}
              >
          <FiStopCircle className="mr-2" /> Stop recording
              </button>
              
            </div>
          )}
          {recordingStatus === 'uploaded' && videoUrl && (
            <div className="mb-4">
              <p className="text-lg font-bold text-green-600"
              style={{
                position: 'relative', left: '50%',
                transform: 'translate(-50%)',
                display: 'inline-block',
                fontSize: '16px'}}>Recording uploaded successfully!</p>
            </div>
          )}

        </>
      )}

      {activeTab === 'video' && (
        <>
          {recordingStatus === 'uploaded' && videoUrl ? (
            <div className="mb-4">
              <video controls src={videoUrl} className="border rounded" />
            </div>
          ) : (
            <div className="flex items-center justify-center border rounded p-4">
              <FiVideo className="text-blue-500 mr-2" /> No recorded video available
            </div>
          )}
        </>
      )}
    </div>
  );
}
