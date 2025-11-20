export type LevelInfo = {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number | null; // null = sin límite superior
};

export const LEVELS: LevelInfo[] = [
  { level: 1, name: "Principiante", minPoints: 0, maxPoints: 79 },
  { level: 2, name: "En racha", minPoints: 80, maxPoints: 199 },
  { level: 3, name: "Constante", minPoints: 200, maxPoints: 399 },
  { level: 4, name: "Avanzado", minPoints: 400, maxPoints: 699 },
  { level: 5, name: "Leyenda", minPoints: 700, maxPoints: null },
];

export function getLevelForPoints(points: number): {
  level: LevelInfo;
  progressToNext: number;
  nextLevelPoints: number | null;
} {
  // Encontrar el nivel correcto
  const level =
    LEVELS.slice()
      .reverse()
      .find((l) => points >= l.minPoints) ?? LEVELS[0];

  // Si es el último nivel → siempre 100%
  if (level.maxPoints === null) {
    return {
      level,
      progressToNext: 100,
      nextLevelPoints: null,
    };
  }

  // Progreso dentro del rango del nivel
  const range = level.maxPoints - level.minPoints;
  const progressed = Math.round(
    ((points - level.minPoints) / range) * 100
  );

  return {
    level,
    progressToNext: Math.min(Math.max(progressed, 0), 100),
    nextLevelPoints: level.maxPoints + 1,
  };
}
