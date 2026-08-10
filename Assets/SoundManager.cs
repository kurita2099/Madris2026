using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using UnityEngine;
using System.Collections.Generic;
using System.IO; // Path.GetFileNameWithoutExtension を使用する場合

public class YourSoundManager : MonoBehaviour
{
    // BGM用のAudioSource
    public AudioSource bgmAudioSource;
    // SE用のAudioSource (複数同時再生に対応するため、PlayOneShotを使う)
    public AudioSource seAudioSource;

    // JavaScriptから指定されたサウンドをロードするためのオーディオクリップの辞書
    public AudioClip[] soundClipsArray;
    private Dictionary<string, AudioClip> soundClipsDictionary = new Dictionary<string, AudioClip>();

    void Awake()
    {
        // AudioSourceが設定されていない場合は、GameObjectに追加
        if (bgmAudioSource == null)
        {
            bgmAudioSource = gameObject.AddComponent<AudioSource>();
            bgmAudioSource.loop = true; // BGMはループ再生が一般的
        }
        if (seAudioSource == null)
        {
            seAudioSource = gameObject.AddComponent<AudioSource>();
            seAudioSource.loop = false; // SEはループしない
        }

        // 配列から辞書を初期化
        foreach (AudioClip clip in soundClipsArray)
        {
            string key = Path.GetFileNameWithoutExtension(clip.name);
            if (!soundClipsDictionary.ContainsKey(key))
            {
                soundClipsDictionary.Add(key, clip);
            }
            if (!soundClipsDictionary.ContainsKey(clip.name)) // 拡張子ありのキーも追加
            {
                soundClipsDictionary.Add(clip.name, clip);
            }
        }
    }

    // サウンドクリップを取得するヘルパーメソッド
    private AudioClip GetAudioClip(string soundName)
    {
        AudioClip clipToPlay = null;
        string keyWithoutExtension = Path.GetFileNameWithoutExtension(soundName);

        if (soundClipsDictionary.TryGetValue(keyWithoutExtension, out clipToPlay))
        {
            return clipToPlay;
        }
        else if (soundClipsDictionary.TryGetValue(soundName, out clipToPlay))
        {
            return clipToPlay;
        }
        else
        {
            Debug.LogWarning($"サウンド '{soundName}' が見つかりませんでした。サウンドクリップが正しく設定されているか確認してください。");
            return null;
        }
    }

    // JavaScriptから呼び出されるBGM再生メソッド
    // メッセージ形式例: "PlayBGM:bgm.mp3"
    public void PlayBGMFromJS(string bgmName)
    {
        Debug.Log($"JavaScriptからBGM '{bgmName}' の再生リクエストを受信しました。");
        AudioClip clip = GetAudioClip(bgmName);
        if (clip != null)
        {
            if (bgmAudioSource.isPlaying && bgmAudioSource.clip == clip)
            {
                // 同じBGMが既に再生中なら何もしない
                Debug.Log($"BGM '{bgmName}' は既に再生中です。");
                return;
            }
            bgmAudioSource.Stop(); // 現在のBGMを停止
            bgmAudioSource.clip = clip;
            bgmAudioSource.Play();
            Debug.Log($"BGM '{bgmName}' を再生しました。");
        }
    }

    // JavaScriptから呼び出されるSE再生メソッド
    // メッセージ形式例: "PlaySE:tap.mp3"
    public void PlaySEFromJS(string seName)
    {
        Debug.Log($"JavaScriptからSE '{seName}' の再生リクエストを受信しました。");
        AudioClip clip = GetAudioClip(seName);
        if (clip != null)
        {
            // PlayOneShotは現在のAudioSourceで一度だけ音を鳴らすため、他の音が鳴っていても問題なく再生できます。
            seAudioSource.PlayOneShot(clip);
            Debug.Log($"SE '{seName}' を再生しました。");
        }
    }

    // BGMを停止するメソッド
    // メッセージ形式例: "StopBGM"
    public void StopBGMFromJS()
    {
        if (bgmAudioSource.isPlaying)
        {
            bgmAudioSource.Stop();
            Debug.Log("BGMを停止しました。");
        }
    }

    // すべてのSEを停止するメソッド (PlayOneShotは停止できないが、再生中のSEがあれば停止)
    // AudioSourceが1つしかないので、PlayOneShotで鳴らされたSEは個別に停止できないことに注意。
    // その代わり、SEを鳴らすためのAudioSourceがBusyであれば停止する。
    // メッセージ形式例: "StopAllSE"
    public void StopAllSEFromJS()
    {
        if (seAudioSource.isPlaying)
        {
            seAudioSource.Stop();
            Debug.Log("すべてのSEを停止しました。");
        }
    }

    // BGMのボリュームを設定するメソッド
    // メッセージ形式例: "SetBGMVolume:0.5"
    public void SetBGMVolumeFromJS(string volumeStr)
    {
        if (float.TryParse(volumeStr, out float volume))
        {
            bgmAudioSource.volume = Mathf.Clamp01(volume); // 0.0fから1.0fにクランプ
            Debug.Log($"BGMのボリュームを {volume} に設定しました。");
        }
        else
        {
            Debug.LogWarning($"不正なBGMボリューム値: {volumeStr}");
        }
    }

    // SEのボリュームを設定するメソッド
    // メッセージ形式例: "SetSEVolume:0.8"
    public void SetSEVolumeFromJS(string volumeStr)
    {
        if (float.TryParse(volumeStr, out float volume))
        {
            seAudioSource.volume = Mathf.Clamp01(volume); // 0.0fから1.0fにクランプ
            Debug.Log($"SEのボリュームを {volume} に設定しました。");
        }
        else
        {
            Debug.LogWarning($"不正なSEボリューム値: {volumeStr}");
        }
    }
}
