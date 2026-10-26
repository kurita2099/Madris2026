var BannerPlugin = {
    callBannerFunction: function (success, fail, resultType) {
        return Cordova.exec( success, fail, "com.qooga.BannerPlugin", "bannerFunction", [resultType]);
        }
};

function callNativePlugin( returnSuccess ) {
    BannerPlugin.callBannerFunction( nativePluginResultHandler, nativePluginErrorHandler, returnSuccess );
}

function nativePluginResultHandler (result) {
    //alert("SUCCESS: ¥r¥n"+result );
}

function nativePluginErrorHandler (error) {
    //alert("ERROR: ¥r¥n"+error );
}