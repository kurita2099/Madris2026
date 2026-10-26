using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using System;
using System.IO;
using System.Net;
using System.Threading;
using UnityEngine;

public class LocalServer : MonoBehaviour
{
    private HttpListener listener;
    private Thread serverThread;
    private bool isRunning = false;
    
    // 使用するポート（空いている適当なポートを指定）
    private int port = 8080;
    private string rootPath;

    void Awake()
    {
        // 配信元となるフォルダ（StreamingAssetsを基準にする場合）
        rootPath = Path.Combine(Application.streamingAssetsPath, "www");

        StartServer();
    }

    void OnDestroy()
    {
        StopServer();
    }

    private void StartServer()
    {
        try
        {
            listener = new HttpListener();
            // localhostの指定ポートでリクエストを受け付ける
            listener.Prefixes.Add($"http://127.0.0.1:{port}/");
            listener.Start();
            isRunning = true;

            // Unityのメインスレッドをブロックしないよう、別スレッドでリクエストを待ち受ける
            serverThread = new Thread(HandleIncomingRequests);
            serverThread.Start();

            Debug.Log($"Local HTTP Server started at http://127.0.0.1:{port}/");
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to start Local HTTP Server: {e.Message}");
        }
    }

    private void StopServer()
    {
        isRunning = false;
        if (listener != null)
        {
            listener.Stop();
            listener.Close();
            listener = null;
        }
        if (serverThread != null && serverThread.IsAlive)
        {
            serverThread.Join();
            serverThread = null;
        }
    }

    private void HandleIncomingRequests()
    {
        while (isRunning)
        {
            try
            {
                // リクエストを待機
                IAsyncResult result = listener.BeginGetContext(OnRequestProcessed, listener);
                result.AsyncWaitHandle.WaitOne();
            }
            catch (HttpListenerException)
            {
                // サーバー停止時の例外は無視
                break;
            }
            catch (Exception e)
            {
                Debug.LogError($"Error in server loop: {e.Message}");
            }
        }
    }

    private void OnRequestProcessed(IAsyncResult result)
    {
        if (!isRunning) return;

        HttpListenerContext context = null;
        try
        {
            context = listener.EndGetContext(result);
        }
        catch (Exception)
        {
            return;
        }

        HttpListenerRequest request = context.Request;
        HttpListenerResponse response = context.Response;

        // URLのパスからファイル名を取得（例: /index.html -> index.html）
        string path = request.Url.AbsolutePath;
        if (path == "/")
        {
            path = "/index.html"; // デフォルトファイル
        }

        // ローカルのファイルパスを組み立て
        string filePath = Path.Combine(rootPath, path.TrimStart('/'));

        try
        {
            if (File.Exists(filePath))
            {
                byte[] buffer = File.ReadAllBytes(filePath);
                
                // Content-Type（MIMEタイプ）の簡易判定
                response.ContentType = GetMimeType(filePath);
                response.ContentLength64 = buffer.Length;
                
                // CORSヘッダーの付与（必要に応じて）
                response.Headers.Add("Access-Control-Allow-Origin", "*");

                using (Stream output = response.OutputStream)
                {
                    output.Write(buffer, 0, buffer.Length);
                }
            }
            else
            {
                // ファイルが見つからない場合 (404)
                response.StatusCode = (int)HttpStatusCode.NotFound;
                byte[] errorBuffer = System.Text.Encoding.UTF8.GetBytes("404 Not Found");
                response.ContentLength64 = errorBuffer.Length;
                using (Stream output = response.OutputStream)
                {
                    output.Write(errorBuffer, 0, errorBuffer.Length);
                }
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"Error serving file {filePath}: {e.Message}");
            response.StatusCode = (int)HttpStatusCode.InternalServerError;
        }
        finally
        {
            try { response.Close(); } catch { }
        }
    }

    // 拡張子に応じたMIMEタイプの返却
    private string GetMimeType(string path)
    {
        string ext = Path.GetExtension(path).ToLowerInvariant();
        switch (ext)
        {
            case ".html": return "text/html";
            case ".js": return "application/javascript";
            case ".css": return "text/css";
            case ".json": return "application/json";
            case ".png": return "image/png";
            case ".jpg":
            case ".jpeg": return "image/jpeg";
            case ".svg": return "image/svg+xml";
            case ".wasm": return "application/wasm";
            default: return "application/octet-stream";
        }
    }
}