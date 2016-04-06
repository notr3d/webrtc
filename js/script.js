
var webrtc = new SimpleWebRTC({
	localVideoEl: 'localVideo',
	remoteVideosVideosEl: '',
	autoRequestMedia: true,
	nick: 'Без имени'
});		

webrtc.on('connectionReady', function () {
	
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

//------------------text-chat-----------------

var chatPanel = $('#chatPanel'),
	chatText = $('#chatText'),
	chatSend = $('#chatSend'),
	sendMessage = function(){
	var message = chatText.val();
	console.log('message sent');
	webrtc.sendToAll('chat', {message: message, nick: webrtc.config.nick});
	chatPanel.append('<div class="message message--yours"><span class="message__name">You: </span><span class="message__text">' + message + '</span></div>');
	chatPanel.animate({scrollTop: document.querySelector('#chatPanel').scrollHeight}, 300);
	chatText.val('');
	chatSend.attr('disabled', true);
	chatText.focus();
	//при добавлении 1000 сообщений первое удаляется	
	if (chatPanel.children().length > 1000) {
		chatPanel.find('div.message').first().remove();
	}
};

// Await messages from others
webrtc.connection.on('message', function(data){
	if (data.type === 'chat'){
		console.log('message received', data);
		chatPanel.append('<div class="message"><span class="message__name">' + data.payload.nick + ': </span><span class="message__text">' + data.payload.message + '</span></div>');
		chatPanel.animate({scrollTop: document.querySelector('#chatPanel').scrollHeight}, 300);
	}
});

//активация кнопки "отправить"
chatText.on('keyup', function(){
	if (chatText.val() !== '' && chatText.val().trim().length > 0) {	
		chatSend.attr('disabled', false);	
	} else {
		chatSend.attr('disabled', true);
	}
});

//отправка по нажатию ентер
chatText.keypress(function(e){
	if (e.which == 13 && !e.shiftKey){
		e.preventDefault();
		if (chatText.val() !== '' && chatText.val().trim().length > 0) {
			sendMessage();		
			chatText.val('');
			//return false; 	
		}		
	}; 
});

// Send a chat message
chatSend.click(sendMessage);

//nickname
var nameInput = $('#nameInput'),
	nameOutput = $('#nameOutput'),
	nameButton = $('#nameButton');
	
nameOutput.text(webrtc.config.nick);
nameButton.click(function(){
	webrtc.config.nick = nameInput.val();
	nameOutput.text(webrtc.config.nick);
});

console.log(webrtc);

