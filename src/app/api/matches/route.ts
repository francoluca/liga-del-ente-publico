import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { type CharacterType } from '@/lib/data/characters';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as CharacterType;
  const characterId = searchParams.get('characterId');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

  if (!type || !['killer', 'survivor'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  try {
    const params: (string | number)[] = [type];
    let sql = `SELECT * FROM matches WHERE type = ?`;
    if (characterId) {
      sql += ` AND character_id = ?`;
      params.push(parseInt(characterId));
    }
    sql += ` ORDER BY played_at DESC LIMIT ?`;
    params.push(limit);

    const matches = await query<Record<string, unknown>>(sql, params);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
