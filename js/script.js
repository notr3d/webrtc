var webrtc = new SimpleWebRTC({
	localVideoEl: 'localVideo',
	remoteVideosVideosEl: '',
	autoRequestMedia: true
});			

webrtc.on('readyToCall', function () { //connectionReady here
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
	  // show the ice connection state
    if (peer && peer.pc) {
        var connstate = document.createElement('div');
        connstate.className = 'connectionstate';
        container.appendChild(connstate);
        peer.pc.on('iceConnectionStateChange', function (event) {
            switch (peer.pc.iceConnectionState) {
            case 'checking':
                connstate.innerText = 'Connecting to peer...';
                break;
            case 'connected':
            case 'completed': // on caller side
                connstate.innerText = 'Connection established.';
                break;
            case 'disconnected':
                connstate.innerText = 'Disconnected.';
                break;
            case 'failed':
                break;
            case 'closed':
                connstate.innerText = 'Connection closed.';
                break;
            }
        });
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

/*
// local p2p/ice failure
webrtc.on('iceFailed', function (peer) {
    var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
    console.log('local fail', connstate);
    if (connstate) {
        connstate.innerText = 'Connection failed.';
        fileinput.disabled = 'disabled';
    }
});

// remote p2p/ice failure
webrtc.on('connectivityError', function (peer) {
    var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
    console.log('remote fail', connstate);
    if (connstate) {
        connstate.innerText = 'Connection failed.';
        fileinput.disabled = 'disabled';
    }
});
*/


//------------------text-chat-----------------

 // Await messages from others
var chatPanel = $('#chatPanel'),
	chatText = $('#chatText'),
	chatSend = $('#chatSend');

webrtc.connection.on('message', function(data){
	if (data.type === 'chat'){
		console.log('message received', data);
		chatPanel.append('<div class="message"><span class="message__name">' + data.payload.nick + ': </span><span class="message__text">' + data.payload.message + '</span></div>');
	}
});

chatText.on('keyup', function(){
	if (chatText.val() !== '') {	
		chatSend.attr('disabled', false);	
	} else {
		chatSend.attr('disabled', true);
	}
});

// Send a chat message
chatSend.click(function(){
	var message = chatText.val();
	console.log('message sent');
	webrtc.sendToAll('chat', {message: message, nick: webrtc.config.nick});
	chatPanel.append('<div class="message message--yours"><span class="message__name">You: </span><span class="message__text">' + message + '</span></div>');
	chatText.val('');
	chatSend.attr('disabled', true);
});




