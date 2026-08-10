import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { type CharacterType } from '@/lib/data/characters';

interface MatchRow {
  character_id: number;
  character_name: string;
  result: string;
  kills: number | null;
  hooks: number | null;
  escapes: number | null;
  generators: number | null;
  match_pl: number;
  division: string;
  played_at: number;
}

function computeStreaks(matchesAsc: MatchRow[]) {
  // matchesAsc: one character's matches, oldest first. Single pass: track
  // the current run of identical results, remembering the longest win AND
  // loss runs seen anywhere, and keep whatever run is still active at the
  // end (that's the "current streak" from the most recent match backwards).
  let longestWin = 0;
  let longestLoss = 0;
  let runLen = 0;
  let runType: string | null = null;

  for (const m of matchesAsc) {
    runLen = m.result === runType ? runLen + 1 : 1;
    runType = m.result;
    if (runType === 'win') longestWin = Math.max(longestWin, runLen);
    if (runType === 'loss') longestLoss = Math.max(longestLoss, runLen);
  }

  const currentRunType = runType === 'win' || runType === 'loss' ? (runType as 'win' | 'loss') : null;
  const currentRun = currentRunType ? runLen : 0;

  return { longestWin, longestLoss, currentRun, currentRunType };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as CharacterType;

  if (!type || !['killer', 'survivor'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  try {
    const allMatches = await query<MatchRow>(
      `SELECT character_id, character_name, result, kills, hooks, escapes, generators, match_pl, division, played_at
       FROM matches WHERE type = ? ORDER BY character_id, played_at ASC`,
      [type]
    );

    const byCharacter = new Map<number, MatchRow[]>();
    for (const m of allMatches) {
      if (!byCharacter.has(m.character_id)) byCharacter.set(m.character_id, []);
      byCharacter.get(m.character_id)!.push(m);
    }

    const imageRows = await query<{ id: number; image: string }>(
      `SELECT id, image FROM characters WHERE type = ?`,
      [type]
    );
    const imageById = new Map(imageRows.map((r) => [r.id, r.image]));

    let longestWinStreakEver: { characterId: number; characterName: string; image: string | null; streak: number } | null = null;
    let longestLossStreakEver: { characterId: number; characterName: string; image: string | null; streak: number } | null = null;
    const currentStreaks: { characterId: number; characterName: string; image: string | null; streak: number; streakType: 'win' | 'loss' }[] = [];

    for (const [characterId, matches] of byCharacter) {
      const { longestWin, longestLoss, currentRun, currentRunType } = computeStreaks(matches);
      const image = imageById.get(characterId) ?? null;
      if (longestWin > 0 && (!longestWinStreakEver || longestWin > longestWinStreakEver.streak)) {
        longestWinStreakEver = { characterId, characterName: matches[0].character_name, image, streak: longestWin };
      }
      if (longestLoss > 0 && (!longestLossStreakEver || longestLoss > longestLossStreakEver.streak)) {
        longestLossStreakEver = { characterId, characterName: matches[0].character_name, image, streak: longestLoss };
      }
      if (currentRunType && currentRun >= 2) {
        currentStreaks.push({
          characterId,
          characterName: matches[matches.length - 1].character_name,
          image,
          streak: currentRun,
          streakType: currentRunType,
        });
      }
    }
    currentStreaks.sort((a, b) => b.streak - a.streak);

    // Career totals already live on the character row (updated on every
    // match), no need to derive them from the match log.
    const primaryColumn = type === 'killer' ? 'kills' : 'escapes';
    const secondaryColumn = type === 'killer' ? 'hooks' : 'generators';

    const [primaryLeaderRows, secondaryLeaderRows, careerLeaders, championLeaders] = await Promise.all([
      query<{ id: number; name: string; image: string; value: number }>(
        `SELECT id, name, image, ${primaryColumn} as value FROM characters WHERE type = ? AND ${primaryColumn} > 0 ORDER BY ${primaryColumn} DESC LIMIT 1`,
        [type]
      ),
      query<{ id: number; name: string; image: string; value: number }>(
        `SELECT id, name, image, ${secondaryColumn} as value FROM characters WHERE type = ? AND ${secondaryColumn} > 0 ORDER BY ${secondaryColumn} DESC LIMIT 1`,
        [type]
      ),
      query<{ id: number; name: string; image: string; career_pl: number }>(
        `SELECT id, name, image, career_pl FROM characters WHERE type = ? AND career_pl > 0 ORDER BY career_pl DESC LIMIT 5`,
        [type]
      ),
      query<{ id: number; name: string; image: string; champion: number }>(
        `SELECT id, name, image, champion FROM characters WHERE type = ? AND champion > 0 ORDER BY champion DESC LIMIT 5`,
        [type]
      ),
    ]);

    return NextResponse.json({
      totalPrimaryLeader: primaryLeaderRows[0] ?? null,
      totalSecondaryLeader: secondaryLeaderRows[0] ?? null,
      longestWinStreakEver,
      longestLossStreakEver,
      currentStreaks: currentStreaks.slice(0, 5),
      careerLeaders,
      championLeaders,
      totalMatchesLogged: allMatches.length,
    });
  } catch (error) {
    console.error('Error computing records:', error);
    return NextResponse.json({ error: 'Failed to compute records' }, { status: 500 });
  }
}
