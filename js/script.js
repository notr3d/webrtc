var webrtc = new SimpleWebRTC({
	localVideoEl: 'localVideo',
	remoteVideosEl: 'remotesVideos',
	autoRequestMedia: true
});			

webrtc.on('readyToCall', function () {
	webrtc.joinRoom('bigmsk');
});

$('.toggle-left-panel').click(function(){
	alert(1);
});