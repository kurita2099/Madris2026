using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WebViewManager : MonoBehaviour
{
   WebViewObject webViewObject;
void Start()
    {
    webViewObject = new GameObject("WebViewObject").AddComponent<WebViewObject>();
    // 初期化
    webViewObject.Init(
        // NOTE: iOSでUIWebViewではなくWKWebViewを利用する(現在はほぼ必須な設定項目だと思ってもらえれば)
        enableWKWebView: true,
        // エラーの時はログを出力するようにしておく
        err: x => Debug.LogError($"ERR: {x}"),
        httpErr: x => Debug.LogError("HTTPERR: {x}")
    );
     // 表示範囲を画面全体に設定
    webViewObject.SetMargins(0, 0, 0, 0);
    // URLを読み込みWebViewを表示する
    webViewObject.SetVisibility(true);
    webViewObject.LoadURL("https://kk-pollyanna.com/madris/www/");
    }
}
