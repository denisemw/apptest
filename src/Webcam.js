var video = document.querySelector('video');
var mimeType = 'video/webm';
var fileExtension = 'webm';
var recorder; // globally accessible
var started = 0;
var blob;


function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ audio: true, muted: true, video: true }).then(function(camera) {
        callback(camera);
    }).catch(function(error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
}


function stopRecordingCallback() {

    video.src = video.srcObject = null;
    video.muted = false;
    video.volume = 1;
    video.src = URL.createObjectURL(recorder.getBlob());
    blob = recorder.getBlob();
    
    recorder.camera.stop();
    recorder.destroy();
    recorder = null;

    document.getElementById('btn-save-recording').disabled = false;
    document.getElementById('btn-start-recording').disabled = false;
    document.getElementById("btn-save-recording").style.visibility = "visible";
    document.getElementById('btn-start-recording').style.visibility = "visible";

//     document.getElementById('btn-pause').disabled = true;
// document.getElementById('btn-pause').style.visibility = "visible";

document.getElementById('btn-stop-recording').disabled = true;
document.getElementById('btn-stop-recording').style.visibility = "hidden";

}



document.getElementById('btn-start-recording').onclick = function() {
    this.disabled = true;
    this.style.visibility = "hidden";
    document.getElementById('btn-save-recording').disabled = true;
    document.getElementById('btn-save-recording').style.visibility = "hidden";


// document.getElementById('btn-pause').disabled = false;
// document.getElementById('btn-pause').style.visibility = "visible";



	if (pause===1) {
		pause = 0;
		document.querySelector("#webvid").play();
		if (started==1) {
			document.querySelector("#myvideo").play();
			var elem = document.getElementById("myvideo"); 
	    		openFullscreen(elem);
		}
		
	}

	else {

    captureCamera(function(camera) {
        video.muted = true;
        // video.volume = 0;
        video.srcObject = camera;

        recorder = RecordRTC(camera, {
            type: 'video'
        });

        recorder.startRecording();

        // release camera on stopRecording
        recorder.camera = camera;


	document.getElementById('play').disabled = false;
  document.getElementById('play').style.visibility = "visible";
  document.getElementById('btn-stop-recording').disabled = false;
  document.getElementById('btn-stop-recording').style.visibility = "visible";
  // document.getElementById('btn-pause').disabled = false;
  // document.getElementById('btn-pause').style.visibility = "visible";
  
    });
  }

};


    
function openFullscreen(elem) {
  			if (elem.requestFullscreen) {
    				elem.requestFullscreen();
  			} else if (elem.webkitRequestFullscreen) { /* Safari */
    				elem.webkitRequestFullscreen();
  			} else if (elem.msRequestFullscreen) { /* IE11 */
    				elem.msRequestFullscreen();
  			}		
			
};

document.querySelector("#play").addEventListener("click", () => {
	    document.querySelector("#myvideo").play();
	    started = 1;
	    var elem = document.getElementById("myvideo"); 
			
	    openFullscreen(elem);
	
	    		/* When the openFullscreen() function is executed, open the video in fullscreen.
            		Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
});


document.getElementById('btn-stop-recording').onclick = function() {
    this.disabled = true;
    this.style.visibility = "hidden";
    document.getElementById('btn-save-recording').disabled = false;
    document.getElementById('btn-save-recording').style.visibility = "visible";

    // document.getElementById('btn-start-recording').disabled = false;
    // document.getElementById('btn-start-recording').style.visibility = "visible";

    // document.getElementById('btn-pause').disabled = true;
    // document.getElementById('btn-pause').style.visibility = "hidden";


document.querySelector("#myvideo").pause();
document.querySelector("#webvid").pause();


document.getElementById('play').disabled = true;
document.getElementById('play').style.visibility = "hidden";

    recorder.stopRecording(stopRecordingCallback);
};

document.getElementById('btn-save-recording').onclick = function() {
    

   invokeSaveAsDialog(blob, 'test2.mp4');
 

};
var pause = 0;


// document.getElementById('btn-pause').onclick = function() {
//     this.disabled = true;
//     this.style.visibility = "hidden";

//     document.getElementById('btn-stop-recording').disabled = false;
//     document.getElementById('btn-stop-recording').style.visibility = "visible";

//     document.getElementById('btn-start-recording').disabled = false;
//     document.getElementById('btn-start-recording').style.visibility = "visible";

// document.querySelector("#myvideo").pause();
// document.querySelector("#webvid").pause();
// pause = 1;
// };