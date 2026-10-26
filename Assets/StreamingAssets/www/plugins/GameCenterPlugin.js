
function GameCenter() {
	//if(localStorage.getItem('GameCenterLoggedin')) {
		//cordova.exec("GameCenterPlugin.authenticateLocalPlayer");
        //　return Cordova.exec( success, fail, "gamecenterplugin", "authenticateLocalPlayer", [] ); 
    //    }
}

GameCenter.prototype.authenticate = function (success, fail){    
//cordova.exec("GameCenterPlugin.authenticateLocalPlayer");
    return cordova.exec( success, fail, "GameCenter", "authenticateLocalPlayer", [] );                              
};

GameCenter.prototype.showLeaderboard = function(success, fail, category) {
    //cordova.exec("GameCenterPlugin.showLeaderboard",category);	
    return cordova.exec( success, fail, "GameCenter", "showLeaderboard",[category]);
};

GameCenter.prototype.reportScore = function(success, fail,category,score) {
    //cordova.exec("GameCenterPlugin.reportScore",category,score);	
	//alert(category+score);
    return cordova.exec( success, fail, "GameCenter", "reportScore",[category,score]);
};

GameCenter.prototype.showAchievements = function(success,fail) {
    //cordova.exec("GameCenterPlugin.showAchievements");	
    return cordova.exec( success, fail, "GameCenter", "showAchievements",[]);                   
};

GameCenter.prototype.getAchievement = function(success,fail,category) {
	//cordova.exec("GameCenterPlugin.reportAchievementIdentifier",category,100);
    return cordova.exec( success, fail, "GameCenter", "reportAchievementIdentifier",[category,100]);
};

GameCenter._userDidLogin = function() {
	localStorage.setItem('GameCenterLoggedin', 'true');
    alert('user submitted');
};
GameCenter._userDidFailLogin = function() {
	    alert('Fail login');
};

GameCenter._userDidSubmitScore = function() {
	alert('score submitted');
};

GameCenter._userDidFailSubmitScore = function() {
	alert('score error');
};

// Plug in to Cordova
cordova.addConstructor(function() {
					   
					   /* shim to work in 1.5 and 1.6  */
                       if (!window.Cordova) {
                       window.Cordova = cordova;
                       };
                       
					   
					   if(!window.plugins) window.plugins = {};
					   window.plugins.gamecenter = new GameCenter();
					   });

