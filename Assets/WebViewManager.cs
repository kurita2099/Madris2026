using System.Collections;
using System.IO;
using UnityEngine;
using UnityEngine.Networking; // UnityWebRequest を使用するために必要

public class YourFileLoader : MonoBehaviour
{
    WebViewObject webViewObject;
    public YourSoundManager soundManager;
    private NativeShareManager nativeShareManager;
    
    private const string ZipFileName = "www.zip";
    private const string ExtractedFolderName = "www_extracted"; // 解凍先のフォルダ名
    private const string IndexFileName = "www/index.html"; // 解凍後のHTMLファイル名

    // ここにWebViewのインスタンスを保持するフィールドを想定
    // 例: public UniWebView webView; あるいは public MyWebViewComponent webView;
    // ユーザーの使っているWebViewプラグインによって型が変わります
    // 今回は仮に LoadWebViewUrl(string url) メソッドを持つコンポーネントを想定します。
    // もしWebViewコンポーネントがMonoBehaviourなら、
    // [SerializeField] private WebViewComponent _webViewComponent; // Inspectorで設定できるようにする
    // public void LoadWebViewUrl(string url) { _webViewComponent.Load(url); }
    // のようにラップするか、直接WebViewのLoadメソッドを呼び出す形になるでしょう。

    // ... existing code ...
 // このコルーチンを呼び出す例
     void Start()
     {
        if (soundManager == null)
        {
            Debug.LogError("YourSoundManagerが割り当てられていません！インスペクターで設定してください。");
            soundManager = FindObjectOfType<YourSoundManager>();
            if (soundManager == null)
            {
                Debug.LogError("シーン内にYourSoundManagerが見つかりませんでした。");
                return;
            }
        }
        if(nativeShareManager ==null)
        {
            Debug.LogError("NativeManagerが割り当てられていません！インスペクターで設定してください。");
            nativeShareManager = FindObjectOfType<NativeShareManager>();
            if (nativeShareManager == null)
            {
                Debug.LogError("シーン内にYourSoundManagerが見つかりませんでした。");
                return;
            }
        }
          InitializeWebView();
          StartCoroutine(LoadAndProcessZipFromStreamingAssets());
     }
 private void InitializeWebView()
    {
        if (webViewObject == null)
        {
            // 新しいGameObjectを作成し、WebViewObjectコンポーネントを追加します
            //webViewObject = new GameObject("WebViewObject").AddComponent<WebViewObject>();
       
            webViewObject = (new GameObject("WebViewObject")).AddComponent<WebViewObject>();

            // WebViewを初期化します
            webViewObject.Init(
                cb: (msg) =>
                {
                     if (soundManager != null)
                    {
                    Debug.Log($"CallFromJS[{msg}]");
                      if (msg == "getDataFromWeb") {
                        // "Return" data back by evaluating JS in the webview          
                        webViewObject.EvaluateJS("receiveDataFromUnity('Hello from C#');");
                         }
                        else if (msg.StartsWith("Raking:"))
                        {
                            
                            //Ranking:レベル(0-4):スコア 
                        string ranking = msg.Substring("Ranking:".Length);
                        string []scoredata = ranking.Split(":");
                        naichilab.RankingLoader.Instance.SendScoreAndShowRanking (scoredata[0],scoredata[1]);
                            
                        }
                        else if (msg.StartsWith("Share:"))
                        {
                            string shareMess = msg.Substring("Share:".Length);
                            string capdata = webViewObject.CaptureScreenshot();
  
                            nativeShareManager.OnShareButtonClicked(shareMess,capdata);
                        }else if (msg.StartsWith("PlayBGM:"))
                        {
                            string bgmName = msg.Substring("PlayBGM:".Length);
                            
                            soundManager.PlayBGMFromJS(bgmName);
                        }
                        else if (msg.StartsWith("PlaySE:"))
                        {
                            string seName = msg.Substring("PlaySE:".Length);
                            soundManager.PlaySEFromJS(seName);
                        }
                        else if (msg == "StopBGM")
                        {
                            soundManager.StopBGMFromJS();
                        }
                        else if (msg == "StopAllSE")
                        {
                            soundManager.StopAllSEFromJS();
                        }
                        else if (msg.StartsWith("SetBGMVolume:"))
                        {
                            string volumeStr = msg.Substring("SetBGMVolume:".Length);
                            soundManager.SetBGMVolumeFromJS(volumeStr);
                        }
                        else if (msg.StartsWith("SetSEVolume:"))
                        {
                            string volumeStr = msg.Substring("SetSEVolume:".Length);
                            soundManager.SetSEVolumeFromJS(volumeStr);
                        }
                        // 他のUnityメッセージがある場合はここに追加
                        // 例: "YourSoundManager/PlaySoundFromJS/bgm.mp3" 形式をサポートする場合
                        else 
                        {
                            string[] parts = msg.Split('/');
                            if (parts.Length == 3 && parts[0] == "YourSoundManager" && parts[1] == "PlaySoundFromJS")
                            {
                                // 旧来のPlaySoundFromJSを使う場合は、BGMかSEかをここで判断するか、
                                // 新しいPlayBGMFromJS/PlaySEFromJSを使用するようにJS側を変更することを推奨
                                // 例: soundManager.PlaySEFromJS(parts[2]); // デフォルトでSEとして扱う
                                Debug.LogWarning($"旧形式のPlaySoundFromJSメッセージを受信しましたが、新しいBGM/SE分離APIを使用してください: {msg}");
                            }
                        }
                    }
                },
                err: (msg) =>
                {
                    Debug.LogError($"CallOnError[{msg}]");
                },
                started: (msg) =>
                {
                    Debug.Log($"CallOnStarted[{msg}]");
                },
                ld: (msg) =>
                {
                    Debug.Log($"CallOnLoaded[{msg}]");
                    webViewObject.SetVisibility(true); // ロード後に表示
                }
            );

            // WebViewの表示マージンを設定します (例: 全画面表示)
            webViewObject.SetMargins(0, 0, 0, 0);
            webViewObject.SetVisibility(false); // ロードが完了するまで非表示
        }
    }
    public IEnumerator LoadAndProcessZipFromStreamingAssets()
    {
        const string ExtractedVersionPlayerPrefsKey = "ExtractedAppVersion";
   
        string persistentDataPath = Application.persistentDataPath;
        string extractedFolderPath = Path.Combine(persistentDataPath, ExtractedFolderName);
        string extractedIndexFilePath = Path.Combine(extractedFolderPath, IndexFileName);
        string currentAppVersion = Application.version;
        string lastExtractedVersion = PlayerPrefs.GetString(ExtractedVersionPlayerPrefsKey, string.Empty);

        Debug.Log($"ZIPファイルのコピーを開始します... パス: {Path.Combine(Application.streamingAssetsPath, ZipFileName)}");

        // 1. 解凍済みかどうかのチェック
        if (File.Exists(extractedIndexFilePath) && lastExtractedVersion == currentAppVersion)
        {
            Debug.Log($"既に {IndexFileName} が解凍済みです: {extractedIndexFilePath}");
            // 解凍済みなら直接WebViewを読み込む
            LoadWebViewFromPath(extractedIndexFilePath);
            yield break; // コルーチンを終了
        }

        // 2. StreamingAssetsからZIPを読み込む (前回のコード)
        string streamingAssetsZipPath = Path.Combine(Application.streamingAssetsPath, ZipFileName);
        using (UnityWebRequest www = UnityWebRequest.Get(streamingAssetsZipPath))
        {
            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.ConnectionError || www.result == UnityWebRequest.Result.ProtocolError)
            {
                Debug.LogError($"エラーが発生しました: StreamingAssetsからの読み込みに失敗: {www.error}");
                yield break;
            }
            else
            {
                byte[] zipBytes = www.downloadHandler.data;
                Debug.Log($"ZIPファイルを正常に読み込みました。サイズ: {zipBytes.Length} バイト");

                // 3. 永続データパスにZIPを保存 (前回のコード)
                string targetZipPath = Path.Combine(persistentDataPath, ZipFileName);
                try
                {
                    File.WriteAllBytes(targetZipPath, zipBytes);
                    Debug.Log($"ZIPファイルを永続データパスに保存しました: {targetZipPath}");
                }
                catch (System.Exception e)
                {
                    Debug.LogError($"ZIPファイルの保存中にエラーが発生しました: {e.Message}");
                    yield break;
                }

                // 4. 保存したZIPファイルを解凍
                yield return ExtractZipFile(targetZipPath, extractedFolderPath);
                 // 解凍が成功したら、現在のアプリケーションバージョンを保存
                PlayerPrefs.SetString(ExtractedVersionPlayerPrefsKey, currentAppVersion);
                PlayerPrefs.Save(); // 確実にディスクに書き込む
                Debug.Log($"現在のアプリケーションバージョン '{currentAppVersion}' を保存しました。");


                // 5. 解凍後のindex.htmlをWebViewで読み込む
                if (File.Exists(extractedIndexFilePath))
                {
                    LoadWebViewFromPath(extractedIndexFilePath);
                }
                else
                {
                    Debug.LogError($"解凍されたフォルダに {IndexFileName} が見つかりません: {extractedIndexFilePath}");
                }
            }
        }
    }

    // ZIPファイルを解凍するコルーチン
    private IEnumerator ExtractZipFile(string zipPath, string extractPath)
    {
        Debug.Log($"ZIPファイルを解凍中... {zipPath} -> {extractPath}");
        try
        {
            // 既存の解凍先フォルダがあれば削除
            if (Directory.Exists(extractPath))
            {
                Directory.Delete(extractPath, true);
                Debug.Log($"既存の解凍先フォルダを削除しました: {extractPath}");
            }
            Directory.CreateDirectory(extractPath); // 新しくフォルダを作成

            // System.IO.Compression を使用するために、Assembly Definition ファイルに参照を追加するか、
            // 互換性レベルを .NET Standard 2.0 に設定する必要がある場合があります。
            // (通常はデフォルトで利用可能です)
            System.IO.Compression.ZipFile.ExtractToDirectory(zipPath, extractPath);
            Debug.Log($"ZIPファイルの解凍が完了しました。");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"ZIPファイルの解凍中にエラーが発生しました: {e.Message}");
        }
        yield return null; // コルーチンとして実行するため
    }

    // WebViewにURLを読み込ませるメソッド (ユーザーのWebViewプラグインに合わせて調整が必要)
    private void LoadWebViewFromPath(string filePath)
    {
        // Androidでは "file://" スキームでローカルファイルにアクセス
    string url = "file://" + filePath;
     // webViewObjectが初期化されていることを確認します
        if (webViewObject != null)
        {
            Debug.Log($"WebViewにURLを読み込みます: {url}");
            webViewObject.LoadURL(url);
        }
        else
        {
            Debug.LogError("WebViewObjectが初期化されていません！");
        }
    
    }

   
    // ... rest of code ...
}