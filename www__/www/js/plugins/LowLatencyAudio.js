var PGLowLatencyAudio = {
_sounds:Array(),  
preloadFX: function ( id, assetPath, success, fail) {
    //return cordova.exec(success, fail, "LowLatencyAudio", "preloadFX", [id, assetPath]);
    return this.preloadAudio( id, assetPath, assetPath, success, fail) 
},    
    
preloadAudio: function ( id, assetPath, voices, success, fail) {
    //return cordova.exec(success, fail, "LowLatencyAudio", "preloadAudio", [id, assetPath, voices]);
var pa = this;
const sound = new Howl({
  src: ['assets/'+assetPath],
  loop: voices == 0,
  preload: true, // デフォルトでtrueなので書かなくてもOK
  onload: function() {
    pa._sounds[id] = sound;
    console.log('読み込み完了！いつでも再生できます。');
  }
});
},
    
play: function (id, success, fail) {
    //return cordova.exec(success, fail, "LowLatencyAudio", "play", [id]);
    this._sounds[id]?.play();
     
},
    
stop: function (id, success, fail) {
    //return cordova.exec(success, fail, "LowLatencyAudio", "stop", [id]);
    this._sounds[id]?.stop();
},
    
loop: function (id, success, fail) {
    //return cordova.exec(success, fail, "LowLatencyAudio", "loop", [id]);
    this._sounds[id]?.play();
},
    
unload: function (id, success, fail) {
    //return cordova.exec(success, fail, "LowLatencyAudio", "unload", [id]);
}
    
    
};