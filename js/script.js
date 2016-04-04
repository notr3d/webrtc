var webrtc = new SimpleWebRTC({
	localVideoEl: 'localVideo',
	remoteVideosVideosEl: '',
	autoRequestMedia: true
});			

webrtc.on('readyToCall', function () {
	webrtc.joinRoom('bigmsk');
});

// a peer video has been added
webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer);
    var remoteVideos = document.getElementById('remoteVideos');
    if (remoteVideos) {
        var container = document.createElement('div');
        var header = document.createElement('h6');//
		var videoId = webrtc.getDomId(peer).split('_');//
        container.className = 'videoContainer';
        container.id = 'container_' + webrtc.getDomId(peer);
		header.innerHTML = videoId[0];//
        container.appendChild(video);
		container.appendChild(header);//
		
        // suppress contextmenu
        video.oncontextmenu = function () { return false; };

        remoteVideos.appendChild(container);
    }
});

// a peer video was removed
webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    var remotes = document.getElementById('remoteVideos');
    var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
        remotes.removeChild(el);
    }
});

