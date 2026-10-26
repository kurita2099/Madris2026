 // Unity WebViewにメッセージを送信する汎用関数
        function sendUnityMessage(message) {
            //console.log(message);
            if(typeof Unity !== 'undefined'){
                Unity.call(message);
            }
            /*
            if (window.location.protocol === "file:") {
                if (typeof Unity !== 'undefined' && Unity.call) {
                    // Unity.call("GameObject名", "メソッド名", "引数"); は、この場合は使わないことを推奨
                    // C#側で `YourSoundManager` コンポーネントが直接メッセージを解釈する
                    // ので、メッセージ形式をシンプルに保つために webviewObject.sendMessage を優先する
                    if (typeof webviewObject !== 'undefined' && webviewObject.sendMessage) {
                        //webviewObject.sendMessage(message);
                        Unity.call(message);
                    } else {
                        console.warn("Unity.callは使えますが、webviewObject.sendMessageが見つかりません。");
                    }
                } else if (typeof Android !== 'undefined' && Android.call) {
                    if (typeof webviewObject !== 'undefined' && webviewObject.sendMessage) {
                        webviewObject.sendMessage(message);
                    } else {
                        console.warn("Android.callは使えますが、webviewObject.sendMessageが見つかりません。");
                    }
                } else if (typeof webviewObject !== 'undefined' && webviewObject.sendMessage) {
                    webviewObject.sendMessage(message);
                } else {
                    console.warn("UnityWebViewブリッジが見つかりません。");
                }
            } else if (typeof webviewObject !== 'undefined' && webviewObject.sendMessage) {
                 webviewObject.sendMessage(message);
            }
             else {
                console.warn("UnityWebViewブリッジが見つかりません。メッセージ: " + message);
                // new Audio().play() などのデバッグ用フォールバック
            }
                */
        }
