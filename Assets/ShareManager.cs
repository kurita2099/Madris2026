using System.Collections;
using System.IO;
using UnityEngine;

public class NativeShareManager : MonoBehaviour
{
    // ボタンのOnClickイベントなどに割り当てて呼び出します
    public void OnShareButtonClicked(string message)
    {
        StartCoroutine(TakeScreenshotAndShare(message));
    }
        // JavaScriptからメッセージを受け取ったときに呼ばれるハンドラ
    private void OnWebViewMessageReceived(string message)
    {
       // UnityEngine.Debug.Log("Received message from JS: Path=" + message.Path + ", RawMessage=" + message.RawMessage);

        // 'canvasCaptured' メッセージを処理
        if (true)//message.Path == "canvasCaptured")
        {
            if (true)//message.ContainsKey("imageData"))
            {
                string base64Data = message;
                if (!string.IsNullOrEmpty(base64Data))
                {
                    // "data:image/png;base64," プレフィックスを削除
                    int prefixIndex = base64Data.IndexOf("base64,");
                    if (prefixIndex != -1)
                    {
                        base64Data = base64Data.Substring(prefixIndex + "base64,".Length);
                    }

                    try
                    {
                        byte[] bytes = System.Convert.FromBase64String(base64Data);
                        string filePath = Path.Combine(Application.temporaryCachePath, "shared_img.png");
                        File.WriteAllBytes(filePath,bytes);
/*
                        // バイト配列からTexture2Dを作成
                        // Texture2DのサイズはLoadImageが自動で調整してくれます
                        Texture2D texture = new Texture2D(2, 2); 
                        if (texture.LoadImage(bytes)) // PNGまたはJPGバイトをTexture2Dにロード
                        {
                            //SaveTextureToFile(texture);
                               // 一時フォルダに保存
                            string filePath = Path.Combine(Application.temporaryCachePath, "shared_img.png");
                            File.WriteAllBytes(filePath, texture.EncodeToPNG());

                        }
                        else
                        {
                            UnityEngine.Debug.LogError("Failed to load image bytes into Texture2D. The data might not be a valid image format.");
                        }
                        Destroy(texture); // 使用したTexture2Dはメモリを解放するために破棄
                        */
                    }
                    catch (System.Exception e)
                    {
                        UnityEngine.Debug.LogError("Error processing base64 image data: " + e.Message);
                    }
                    
                }
                else
                {
                    UnityEngine.Debug.LogError("Received empty image data from JS.");
                }
            }
           // else
           // {
           //     UnityEngine.Debug.LogError("Received 'canvasCaptured' message but 'imageData' argument is missing.");
           // }
        }
        // 他のメッセージパスをここで処理することも可能
    }


    private IEnumerator TakeScreenshotAndShare(string message)
    {
        // 描画完了まで待機
        yield return new WaitForEndOfFrame();

        // 画面のキャプチャを作成
        Texture2D ss = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
        ss.ReadPixels(new Rect(0, 0, Screen.width, Screen.height), 0, 0);
        ss.Apply();

        // 一時フォルダに保存
        string filePath = Path.Combine(Application.temporaryCachePath, "shared_img.png");
        File.WriteAllBytes(filePath, ss.EncodeToPNG());

        // メモリリーク防止のためTextureを破棄
        Destroy(ss);

        // NativeShareのインスタンスを作成して共有ダイアログを表示
        new NativeShare()
            .AddFile(filePath)                             // 共有するファイルのパス
            .SetSubject("件名（主にメール用）")            // 件名
            .SetText(message) // メッセージ本文
            .SetUrl("https://example.com")                 // 関連URL
            .SetCallback((result, shareTarget) => 
                Debug.Log($"共有結果: {result}, 選択されたアプリ: {shareTarget}"))
            .Share();
    }
}