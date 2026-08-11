using System.Threading.Tasks;
using UnityEngine;
using Unity.Services.Core;
using Unity.Services.Authentication;
using Unity.Services.Leaderboards;

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

        // 2. テスト用スコア（100点）を送信
        //await SubmitScore(leaderboard0Id, 100);

        // 3. ランキングTOP10を取得してログ表示
        //await GetTopScores();
    }

    // スコアの送信
    public async Task SubmitScore(string leaderboardId,double score)
    {
        var response = await LeaderboardsService.Instance.AddPlayerScoreAsync(leaderboardId, score);
        Debug.Log($"スコア送信完了: {response.Score}");
    }

    // ランキングの取得
    public async Task GetTopScores()
    {
        var scores = await LeaderboardsService.Instance.GetScoresAsync(leaderboard0Id, new GetScoresOptions { Limit = 10 });
        foreach (var entry in scores.Results)
        {
            Debug.Log($"Rank {entry.Rank + 1}: Player {entry.PlayerId} - Score: {entry.Score}");
        }
    }
}