var PGLowLatencyAudio = {
  
preloadFX: function ( id, assetPath, success, fail) {
    //return cordova.exec(success, fail, "LowLatencyAudio", "preloadFX", [id, assetPath]);
},    
    
preloadAudio: function ( id, assetPath, voices, success, fail) {
    //return cordova.exec(success, fail, "LowLatencyAudio", "preloadAudio", [id, assetPath, voices]);
},
    
play: function (sePath, success, fail) {
     var seFileName = sePath.split('/').pop();
     sendUnityMessage("PlaySE:" + seFileName);
    //return cordova.exec(success, fail, "LowLatencyAudio", "play", [id]);
},
    
stop: function (id, success, fail) {
    //return cordova.exec(success, fail, "LowLatencyAudio", "stop", [id]);
    sendUnityMessage("StopBGM");
},
    
loop: function (id, success, fail) {
    sendUnityMessage("PlayBGM:" + id);
    //return cordova.exec(success, fail, "LowLatencyAudio", "loop", [id]);
},
    
unload: function (id, success, fail) {
   // return cordova.exec(success, fail, "LowLatencyAudio", "unload", [id]);
}
    
    
};