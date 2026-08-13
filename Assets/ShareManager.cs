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