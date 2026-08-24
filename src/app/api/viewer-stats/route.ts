import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ViewerStatRow {
  voter_key: string;
  balance: number;
  reserved: number;
  net_worth: number;
  platform: string | null;
  avatar_url: string | null;
  resolved_count: number;
  wins: number;
  losses: number;
  pushes: number;
  total_staked: number;
  total_payout: number;
  net_profit: number;
  biggest_payout: number;
  duels_won: number;
  duels_lost: number;
  duels_net: number;
  robberies_attempted: number;
  robberies_succeeded: number;
  times_robbed: number;
  robbery_net: number;
  bombs_survived: number;
  bombs_exploded_on: number;
  points_lost_to_bombs: number;
  points_gained_from_bombs: number;
  total_redemptions: number;
  total_redemption_spend: number;
  reroll_character_count: number;
  reroll_perk_count: number;
  perk_boost_count: number;
  immunity_count: number;
}

interface ViewerStat {
  voterKey: string;
  platform: string | null;
  avatarUrl: string | null;
  displayName: string;
  balance: number;
  reserved: number;
  netWorth: number;
  resolvedCount: number;
  wins: number;
  losses: number;
  pushes: number;
  totalStaked: number;
  totalPayout: number;
  netProfit: number;
  winRate: number | null;
  duelsWon: number;
  duelsLost: number;
  duelsNet: number;
  robberiesAttempted: number;
  robberiesSucceeded: number;
  timesRobbed: number;
  robberyNet: number;
  bombsSurvived: number;
  bombsExplodedOn: number;
  pointsLostToBombs: number;
  pointsGainedFromBombs: number;
  pvpNet: number;
  totalRedemptions: number;
  totalRedemptionSpend: number;
  rerollCharacterCount: number;
  rerollPerkCount: number;
  perkBoostCount: number;
  immunityCount: number;
}

const MIN_QUALIFYING = 5;

const STATS_SQL = `
  WITH resolved AS (
    SELECT p.voter_key, p.platform, p.stake, p.payout, p.predicted_result, pr.result
    FROM predictions p
    JOIN prediction_rounds pr ON pr.id = p.round_id
    WHERE p.payout IS NOT NULL
  ),
  pred_stats AS (
    SELECT
      voter_key,
      platform,
      COUNT(*) AS resolved_count,
      SUM(CASE WHEN predicted_result = result THEN 1 ELSE 0 END) AS wins,
      SUM(CASE WHEN predicted_result != result AND payout = stake THEN 1 ELSE 0 END) AS pushes,
      SUM(CASE WHEN predicted_result != result AND payout = 0 THEN 1 ELSE 0 END) AS losses,
      SUM(stake) AS total_staked,
      SUM(payout) AS total_payout,
      MAX(payout) AS biggest_payout
    FROM resolved
    GROUP BY voter_key
  ),
  duel_rows AS (
    SELECT challenger_key AS voter_key, winner_key, stake FROM duels WHERE status = 'resolved'
    UNION ALL
    SELECT opponent_key AS voter_key, winner_key, stake FROM duels WHERE status = 'resolved'
  ),
  duel_stats AS (
    SELECT voter_key,
      SUM(CASE WHEN voter_key = winner_key THEN 1 ELSE 0 END) AS duels_won,
      SUM(CASE WHEN voter_key != winner_key THEN 1 ELSE 0 END) AS duels_lost,
      SUM(CASE WHEN voter_key = winner_key THEN stake ELSE -stake END) AS duels_net
    FROM duel_rows
    GROUP BY voter_key
  ),
  robbery_rows AS (
    SELECT attacker_key AS voter_key, 1 AS attempted, success AS succeeded,
           CASE WHEN success = 1 THEN amount ELSE -amount END AS attacker_delta,
           0 AS victimized, 0 AS victim_delta
    FROM robbery_attempts
    UNION ALL
    SELECT victim_key AS voter_key, 0, 0, 0, 1,
           CASE WHEN success = 1 THEN -amount ELSE amount END
    FROM robbery_attempts
  ),
  robbery_stats AS (
    SELECT voter_key,
      SUM(attempted) AS robberies_attempted,
      SUM(succeeded) AS robberies_succeeded,
      SUM(victimized) AS times_robbed,
      SUM(attacker_delta) + SUM(victim_delta) AS robbery_net
    FROM robbery_rows
    GROUP BY voter_key
  ),
  bomb_loss AS (
    SELECT holder_key AS voter_key, COUNT(*) AS bombs_exploded_on, SUM(lost_amount) AS points_lost_to_bombs
    FROM bomb_rounds WHERE status = 'exploded'
    GROUP BY holder_key
  ),
  bomb_survive AS (
    SELECT bh.voter_key,
      COUNT(*) AS bombs_survived,
      SUM(br.lost_amount / br.recipient_count) AS points_gained_from_bombs
    FROM bomb_holders bh
    JOIN bomb_rounds br ON br.id = bh.round_id AND br.status = 'exploded'
    WHERE bh.voter_key != br.holder_key
    GROUP BY bh.voter_key
  ),
  redemption_stats AS (
    SELECT voter_key,
      COUNT(*) AS total_redemptions,
      SUM(cost) AS total_redemption_spend,
      SUM(CASE WHEN item_key = 'reroll_character' THEN 1 ELSE 0 END) AS reroll_character_count,
      SUM(CASE WHEN item_key = 'reroll_perk' THEN 1 ELSE 0 END) AS reroll_perk_count,
      SUM(CASE WHEN item_key = 'perk_boost' THEN 1 ELSE 0 END) AS perk_boost_count,
      SUM(CASE WHEN item_key = 'immunity' THEN 1 ELSE 0 END) AS immunity_count
    FROM redemptions
    GROUP BY voter_key
  )
  SELECT
    cp.voter_key,
    cp.balance,
    cp.reserved,
    (cp.balance + cp.reserved) AS net_worth,
    COALESCE(ps.platform, cp.platform) AS platform,
    cp.avatar_url AS avatar_url,
    COALESCE(ps.resolved_count, 0) AS resolved_count,
    COALESCE(ps.wins, 0) AS wins,
    COALESCE(ps.losses, 0) AS losses,
    COALESCE(ps.pushes, 0) AS pushes,
    COALESCE(ps.total_staked, 0) AS total_staked,
    COALESCE(ps.total_payout, 0) AS total_payout,
    (COALESCE(ps.total_payout, 0) - COALESCE(ps.total_staked, 0)) AS net_profit,
    COALESCE(ps.biggest_payout, 0) AS biggest_payout,
    COALESCE(ds.duels_won, 0) AS duels_won,
    COALESCE(ds.duels_lost, 0) AS duels_lost,
    COALESCE(ds.duels_net, 0) AS duels_net,
    COALESCE(rs.robberies_attempted, 0) AS robberies_attempted,
    COALESCE(rs.robberies_succeeded, 0) AS robberies_succeeded,
    COALESCE(rs.times_robbed, 0) AS times_robbed,
    COALESCE(rs.robbery_net, 0) AS robbery_net,
    COALESCE(bsv.bombs_survived, 0) AS bombs_survived,
    COALESCE(bl.bombs_exploded_on, 0) AS bombs_exploded_on,
    COALESCE(bl.points_lost_to_bombs, 0) AS points_lost_to_bombs,
    COALESCE(bsv.points_gained_from_bombs, 0) AS points_gained_from_bombs,
    COALESCE(rds.total_redemptions, 0) AS total_redemptions,
    COALESCE(rds.total_redemption_spend, 0) AS total_redemption_spend,
    COALESCE(rds.reroll_character_count, 0) AS reroll_character_count,
    COALESCE(rds.reroll_perk_count, 0) AS reroll_perk_count,
    COALESCE(rds.perk_boost_count, 0) AS perk_boost_count,
    COALESCE(rds.immunity_count, 0) AS immunity_count
  FROM chatter_points cp
  LEFT JOIN pred_stats ps ON ps.voter_key = cp.voter_key
  LEFT JOIN duel_stats ds ON ds.voter_key = cp.voter_key
  LEFT JOIN robbery_stats rs ON rs.voter_key = cp.voter_key
  LEFT JOIN bomb_loss bl ON bl.voter_key = cp.voter_key
  LEFT JOIN bomb_survive bsv ON bsv.voter_key = cp.voter_key
  LEFT JOIN redemption_stats rds ON rds.voter_key = cp.voter_key
  ORDER BY net_worth DESC
`;

export async function GET() {
  try {
    const rows = await query<ViewerStatRow>(STATS_SQL);

    const leaderboard: ViewerStat[] = rows.map((r) => ({
      voterKey: r.voter_key,
      platform: r.platform,
      avatarUrl: r.avatar_url,
      displayName: r.voter_key.includes(':') ? r.voter_key.split(':').slice(1).join(':') : r.voter_key,
      balance: r.balance,
      reserved: r.reserved,
      netWorth: r.net_worth,
      resolvedCount: r.resolved_count,
      wins: r.wins,
      losses: r.losses,
      pushes: r.pushes,
      totalStaked: r.total_staked,
      totalPayout: r.total_payout,
      netProfit: r.net_profit,
      winRate: r.resolved_count > 0 ? r.wins / r.resolved_count : null,
      duelsWon: r.duels_won,
      duelsLost: r.duels_lost,
      duelsNet: r.duels_net,
      robberiesAttempted: r.robberies_attempted,
      robberiesSucceeded: r.robberies_succeeded,
      timesRobbed: r.times_robbed,
      robberyNet: r.robbery_net,
      bombsSurvived: r.bombs_survived,
      bombsExplodedOn: r.bombs_exploded_on,
      pointsLostToBombs: r.points_lost_to_bombs,
      pointsGainedFromBombs: r.points_gained_from_bombs,
      pvpNet: r.duels_net + r.robbery_net + (r.points_gained_from_bombs - r.points_lost_to_bombs),
      totalRedemptions: r.total_redemptions,
      totalRedemptionSpend: r.total_redemption_spend,
      rerollCharacterCount: r.reroll_character_count,
      rerollPerkCount: r.reroll_perk_count,
      perkBoostCount: r.perk_boost_count,
      immunityCount: r.immunity_count,
    }));

    const topBalance = leaderboard[0] ?? null;

    const qualified = leaderboard.filter((v) => v.resolvedCount >= MIN_QUALIFYING);
    const bestWinRateMax = qualified.length > 0 ? Math.max(...qualified.map((v) => v.winRate!)) : undefined;
    const bestWinRateLeaders = bestWinRateMax !== undefined
      ? qualified.filter((v) => v.winRate === bestWinRateMax)
      : [];

    const biggestSinglePayoutMax = Math.max(0, ...rows.map((r) => r.biggest_payout));
    const biggestSinglePayoutLeaders = biggestSinglePayoutMax > 0
      ? leaderboard.filter((_, i) => rows[i].biggest_payout === biggestSinglePayoutMax)
      : [];

    return NextResponse.json({
      leaderboard,
      highlights: {
        topBalance,
        bestWinRate: { minQualifying: MIN_QUALIFYING, leaders: bestWinRateLeaders },
        biggestSinglePayout: { value: biggestSinglePayoutMax, leaders: biggestSinglePayoutLeaders },
      },
    });
  } catch (error) {
    console.error('Error computing viewer stats:', error);
    return NextResponse.json({ error: 'Failed to compute viewer stats' }, { status: 500 });
  }
}
