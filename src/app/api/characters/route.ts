import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { calculateDisplayedPL } from '@/lib/data/leaguePoints';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'killer' | 'survivor' | null;
  const division = searchParams.get('division');
  
  try {
    let sql = 'SELECT * FROM characters WHERE 1=1';
    const params: string[] = [];
    
    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }
    
    if (division) {
      sql += ' AND division = ?';
      params.push(division);
    }
    
    sql += ` ORDER BY
      CASE WHEN pl_t1 IS NOT NULL THEN
        ROUND(CAST(COALESCE(pl_t1,0)+COALESCE(pl_t2,0)+COALESCE(pl_t3,0)+COALESCE(pl_t4,0)+COALESCE(pl_t5,0) AS REAL) /
        (CASE WHEN pl_t1 IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN pl_t2 IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN pl_t3 IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN pl_t4 IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN pl_t5 IS NOT NULL THEN 1 ELSE 0 END)) END DESC,
      COALESCE(pl_t1,0)+COALESCE(pl_t2,0)+COALESCE(pl_t3,0)+COALESCE(pl_t4,0)+COALESCE(pl_t5,0) DESC,
      MAX(COALESCE(pl_t1,0),COALESCE(pl_t2,0),COALESCE(pl_t3,0),COALESCE(pl_t4,0),COALESCE(pl_t5,0)) DESC,
      career_pl DESC,
      seasons_played DESC,
      id ASC`;
    
    const rows = await query<Record<string, unknown>>(sql, params);
    
    const characters = rows.map((row) => ({
      ...row,
      leaguePoints: calculateDisplayedPL(row as any),
      expertPerks: JSON.parse(row.expert_perks as string),
      metaBuild: JSON.parse(row.meta_build as string),
    }));
    
    return NextResponse.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
  }
}