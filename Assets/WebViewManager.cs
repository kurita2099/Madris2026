using System.Collections;
using System.IO;
using UnityEngine;
using UnityEngine.Networking;

public class WebViewManager : MonoBehaviour
{
    private WebViewObject webViewObject;
    public YourSoundManager soundManager;
    private const string ZipFileName = "www.zip";
    private const string ExtractedFolderName = "www_extracted";
    private const string IndexFileName = "www/index.html";

    private void Start()
    {
        if (soundManager == null)
        {
            soundManager = FindObjectOfType<YourSoundManager>();
            if (soundManager == null)
            {
                Debug.LogError("YourSoundManagerが割り当てられていません！インスペクターで設定してください。");
                Debug.LogError("シーン内にYourSoundManagerが見つかりませんでした。");
                return;
            }
        }

        //StartCoroutine(LoadAndProcessZipFromStreamingAssets());
        InitializeWebView();
        string url = "http://127.0.0.1:8080/index.html";
        webViewObject.LoadURL(url);

    }


    private void InitializeWebView()
    {
        if (webViewObject == null)
        {
            webViewObject = (new GameObject("WebViewObject")).AddComponent<WebViewObject>();

            webViewObject.Init(
                #if UNITY_EDITOR
                separated: true,
                #endif
                cb: (msg) =>
                {
                    if (soundManager != null)
                    {
                        Debug.Log($"CallFromJS[{msg}]");
                        if (msg.StartsWith("PlayBGM:"))
                        {
                            string bgmName = msg.Substring("PlayBGM:".Length);
                            Debug.Log($"CallFromJS2[{msg}]");
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
                        else
                        {
                            string[] parts = msg.Split('/');
                            if (parts.Length == 3 && parts[0] == "YourSoundManager" && parts[1] == "PlaySoundFromJS")
                            {
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
                    webViewObject.SetVisibility(true);
                },
                enableWKWebView: true

            );

            webViewObject.SetMargins(0, 0, 0, 0);
            webViewObject.SetVisibility(false);
        }
    }

    public IEnumerator LoadAndProcessZipFromStreamingAssets()
    {
        string persistentDataPath = Application.persistentDataPath;
        string extractedFolderPath = Path.Combine(persistentDataPath, ExtractedFolderName);
        string extractedIndexFilePath = Path.Combine(extractedFolderPath, IndexFileName);

        Debug.Log($"ZIPファイルの読み込み準備中...");

        // 1. 解凍済みかどうかのチェック
        if (File.Exists(extractedIndexFilePath))
        {
            Debug.Log($"既に {IndexFileName} が解凍済みです: {extractedIndexFilePath}");
            LoadWebViewFromPath(extractedIndexFilePath);
            yield break;
        }

        byte[] zipBytes = null;
        string streamingAssetsZipPath = Path.Combine(Application.streamingAssetsPath, ZipFileName);

        // 2. StreamingAssetsからZIPを読み込む
        // Android以外（エディタなど）では直接ファイルとして読み込む方が安全な場合がある
        if (Application.platform != RuntimePlatform.Android)
        {
            Debug.Log($"非Androidプラットフォーム: 直接ファイルアクセスを試みます: {streamingAssetsZipPath}");
            if (File.Exists(streamingAssetsZipPath))
            {
                zipBytes = File.ReadAllBytes(streamingAssetsZipPath);
            }
            else
            {
                Debug.LogWarning($"直接アクセスに失敗しました。UnityWebRequestを試行します。");
            }
        }

        // 直接読み込めなかった場合、またはAndroidの場合
        if (zipBytes == null)
        {
            // パスをURL形式に調整
            string url = streamingAssetsZipPath;
            if (!url.Contains("://"))
            {
                url = "file://" + url.Replace("\\", "/");
            }

            Debug.Log($"UnityWebRequestで読み込みを開始します: {url}");
            using (UnityWebRequest www = UnityWebRequest.Get(url))
            {
                yield return www.SendWebRequest();

                if (www.result != UnityWebRequest.Result.Success)
                {
                    Debug.LogError($"StreamingAssetsからの読み込みに失敗しました。\nURL: {url}\nError: {www.error}");
                    yield break;
                }
                zipBytes = www.downloadHandler.data;
            }
        }

        if (zipBytes != null && zipBytes.Length > 0)
        {
            Debug.Log($"ZIPファイルを正常に読み込みました。サイズ: {zipBytes.Length} バイト");

            // 3. 永続データパスにZIPを保存
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

    private IEnumerator ExtractZipFile(string zipPath, string extractPath)
    {
        Debug.Log($"ZIPファイルを解凍中... {zipPath} -> {extractPath}");
        try
        {
            if (Directory.Exists(extractPath))
            {
                Directory.Delete(extractPath, true);
                Debug.Log($"既存の解凍先フォルダを削除しました: {extractPath}");
            }

            Directory.CreateDirectory(extractPath);
            System.IO.Compression.ZipFile.ExtractToDirectory(zipPath, extractPath);
            Debug.Log("ZIPファイルの解凍が完了しました。");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"ZIPファイルの解凍中にエラーが発生しました: {e.Message}");
        }

        yield return null;
    }

    private void LoadWebViewFromPath(string filePath)
    {
        InitializeWebView();

        string url = "file://" + filePath;
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
}