export type TraitVector = {
  bravery: number;
  logic: number;
  charm: number;
  loyalty: number;
  comfort: number;
  curiosity: number;
};

export const TRAIT_KEYS: (keyof TraitVector)[] = [
  "bravery",
  "logic",
  "charm",
  "loyalty",
  "comfort",
  "curiosity",
];

export function zeroVector(): TraitVector {
  return { bravery: 0, logic: 0, charm: 0, loyalty: 0, comfort: 0, curiosity: 0 };
}

export function addVector(a: TraitVector, b: Partial<TraitVector>): TraitVector {
  const result = { ...a };
  for (const key of TRAIT_KEYS) {
    result[key] += b[key] ?? 0;
  }
  return result;
}

export function euclideanDistance(a: TraitVector, b: TraitVector): number {
  let sum = 0;
  for (const key of TRAIT_KEYS) {
    const diff = a[key] - b[key];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export function characterVector(char: {
  trait_bravery: number;
  trait_logic: number;
  trait_charm: number;
  trait_loyalty: number;
  trait_comfort: number;
  trait_curiosity: number;
}): TraitVector {
  return {
    bravery: char.trait_bravery,
    logic: char.trait_logic,
    charm: char.trait_charm,
    loyalty: char.trait_loyalty,
    comfort: char.trait_comfort,
    curiosity: char.trait_curiosity,
  };
}
