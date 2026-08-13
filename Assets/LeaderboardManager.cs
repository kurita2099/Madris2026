using System.Threading.Tasks;
using UnityEngine;
using Unity.Services.Core;
using Unity.Services.Authentication;
using Unity.Services.Leaderboards;
using System;

public class LeaderboardManager : MonoBehaviour
{
    // Dashboardで作成した Leaderboard ID を入力
    [SerializeField] private string leaderboard0Id = "beginner_high_score";
    [SerializeField] private string leaderboard1Id = "easy_high_score";
    [SerializeField] private string leaderboard2Id = "normal_high_score";
    [SerializeField] private string leaderboard3Id = "hard_high_score";

    async void Start()
    {
        // 1. UGSの初期化と匿名ログイン
        await UnityServices.InitializeAsync();
        
        if (!AuthenticationService.Instance.IsSignedIn)
        {
            await AuthenticationService.Instance.SignInAnonymouslyAsync();
            Debug.Log($"サインイン成功: {AuthenticationService.Instance.PlayerId}");
        }
        string username = await GetCurrentPlayerNameAsync();
        // 2. テスト用スコア（100点）を送信
        //await SubmitScore(leaderboard0Id, 100);
        
        if(await IsCustomNameSetAsync() == false){
            await SetPlayerName("testname2");
        }
        // 3. ランキングTOP10を取得してログ表示
        await GetTopScores();
    }

    // スコアの送信
    public async Task SubmitScore(string leaderboardId,double score)
    {
        var response = await LeaderboardsService.Instance.AddPlayerScoreAsync(leaderboardId, score);
        Debug.Log($"スコア送信完了: {response.Score}");
    }

    /// <summary>
    /// ユーザーが自分で名前を設定済みかどうかを判別する関数
    /// </summary>
    /// <returns>手動設定済みなら true / 初期名または未設定なら false</returns>
    public async Task<bool> IsCustomNameSetAsync()
    {
        if (!AuthenticationService.Instance.IsSignedIn) return false;

        try
        {
            // 元のフルネームを取得（例: 初期名「DecisiveSketchingQuince」、設定名「Tarou#1234」）
            string rawName = await AuthenticationService.Instance.GetPlayerNameAsync();

            if (string.IsNullOrEmpty(rawName)) return false;

            // ユーザーが手動変更した名前には必ず '#' (識別タグ) が付くため、'#' の有無で判別
            bool isCustom = rawName.Contains("#");

            return isCustom;
        }
        catch
        {
            return false;
        }
    }
     /// <summary>
    /// 登録済みのプレイヤー名を取得する関数
    /// </summary>
    /// <returns>設定済みのプレイヤー名（未設定・エラー時は null）</returns>
    public async Task<string> GetCurrentPlayerNameAsync()
    {
        // サインインしていない場合は取得できないため null を返す
        if (!AuthenticationService.Instance.IsSignedIn)
        {
            Debug.LogWarning("サインインしていないため、プレイヤー名を取得できません。");
            return null;
        }

        try
        {
            // UGSから登録済みの名前を取得（例: "Tarou#1234"）
            string fullName = await AuthenticationService.Instance.GetPlayerNameAsync();

            if (string.IsNullOrEmpty(fullName))
            {
                return null;
            }

            // "#1234" などの識別タグが付いている場合は取り除いて純粋な名前のみにする
            string cleanName = fullName.Contains("#") ? fullName.Split('#')[0] : fullName;

            return cleanName;
        }
        catch (AuthenticationException ex)
        {
            // 名前がまだ一度も設定されていない場合などもここを通ります
            Debug.Log($"プレイヤー名は未設定、または取得できませんでした: {ex.Message}");
            return null;
        }
        catch (Exception ex)
        {
            Debug.LogError($"名前取得時にエラーが発生しました: {ex.Message}");
            return null;
        }
    }
// ─── ユーザー名の設定 ───
    public async Task SetPlayerName(string newName)
    {
        try
        {
            // Unity Authentication サービスで表示名を更新
            await AuthenticationService.Instance.UpdatePlayerNameAsync(newName);
            Debug.Log($"名前を更新しました: {newName}");
        }
        catch (AuthenticationException ex)
        {
            Debug.LogError($"名前の設定に失敗しました: {ex.Message}");
        }
    }
    // ランキングの取得
    public async Task GetTopScores()
    {
        var scores = await LeaderboardsService.Instance.GetScoresAsync(leaderboard0Id, new GetScoresOptions { Limit = 10 });
      foreach (var entry in scores.Results)
        {
            // entry.PlayerName で設定された名前を取得（未設定の場合はIDの一部などが入ります）
            string playerName = string.IsNullOrEmpty(entry.PlayerName) ? "No Name" : entry.PlayerName;

            // PlayerName を切り落とす（#1234 などの識別タグが付く場合があるため分離）
            if (playerName.Contains("#"))
            {
                playerName = playerName.Split('#')[0];
            }

            Debug.Log($"Rank {entry.Rank + 1}: {playerName} - Score: {entry.Score}");
        }
    }
}