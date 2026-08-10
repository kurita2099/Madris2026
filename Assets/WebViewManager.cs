using System.Collections;
using System.IO;
using UnityEngine;
using UnityEngine.Networking; // UnityWebRequest を使用するために必要

public class YourFileLoader : MonoBehaviour
{
    WebViewObject webViewObject;
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
                    Debug.Log($"CallFromJS[{msg}]");
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
       
        string persistentDataPath = Application.persistentDataPath;
        string extractedFolderPath = Path.Combine(persistentDataPath, ExtractedFolderName);
        string extractedIndexFilePath = Path.Combine(extractedFolderPath, IndexFileName);

        Debug.Log($"ZIPファイルのコピーを開始します... パス: {Path.Combine(Application.streamingAssetsPath, ZipFileName)}");

        // 1. 解凍済みかどうかのチェック
        if (File.Exists(extractedIndexFilePath))
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