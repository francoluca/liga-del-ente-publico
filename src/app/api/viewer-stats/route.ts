import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ViewerStatRow {
  voter_key: string;
  balance: number;
  reserved: number;
  net_worth: number;
  platform: string | null;
  resolved_count: number;
  wins: number;
  losses: number;
  pushes: number;
  total_staked: number;
  total_payout: number;
  net_profit: number;
  biggest_payout: number;
}

interface ViewerStat {
  voterKey: string;
  platform: string | null;
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
  )
  SELECT
    cp.voter_key,
    cp.balance,
    cp.reserved,
    (cp.balance + cp.reserved) AS net_worth,
    COALESCE(ps.platform, cp.platform) AS platform,
    COALESCE(ps.resolved_count, 0) AS resolved_count,
    COALESCE(ps.wins, 0) AS wins,
    COALESCE(ps.losses, 0) AS losses,
    COALESCE(ps.pushes, 0) AS pushes,
    COALESCE(ps.total_staked, 0) AS total_staked,
    COALESCE(ps.total_payout, 0) AS total_payout,
    (COALESCE(ps.total_payout, 0) - COALESCE(ps.total_staked, 0)) AS net_profit,
    COALESCE(ps.biggest_payout, 0) AS biggest_payout
  FROM chatter_points cp
  LEFT JOIN pred_stats ps ON ps.voter_key = cp.voter_key
  ORDER BY net_worth DESC
`;

export async function GET() {
  try {
    const rows = await query<ViewerStatRow>(STATS_SQL);

    const leaderboard: ViewerStat[] = rows.map((r) => ({
      voterKey: r.voter_key,
      platform: r.platform,
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
