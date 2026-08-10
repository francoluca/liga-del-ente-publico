import { type CharacterType } from './characters';

export function calculateLeaguePoints(
  type: CharacterType,
  stats: { kills: number; hooks: number } | { escapes: number; generators: number; died: boolean }
): number {
  if (type === 'killer') {
    const { kills, hooks } = stats as { kills: number; hooks: number };
    return kills * 2 + hooks;
  } else {
    const { escapes, generators, died } = stats as { escapes: number; generators: number; died: boolean };
    if (!died) {
      return generators * 2 + 3;
    } else {
      return generators * 2;
    }
  }
}

export function calculateDisplayedPL(character: {
  pl_t1?: number | null;
  pl_t2?: number | null;
  pl_t3?: number | null;
  pl_t4?: number | null;
  pl_t5?: number | null;
}): number {
  const last5 = [character.pl_t1, character.pl_t2, character.pl_t3, character.pl_t4, character.pl_t5]
    .filter((v): v is number => v !== null && v !== undefined);
  if (last5.length === 0) return 0;
  return last5.reduce((a, b) => a + b, 0) / last5.length;
}
