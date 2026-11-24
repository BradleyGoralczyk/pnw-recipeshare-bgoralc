function parseQuantity(value: string): number | undefined {
  const parts = value.trim().split(/\s+/);
  if (parts.length === 2 && /^\d+$/.test(parts[0]) && /^\d+\/\d+$/.test(parts[1])) {
    const [numerator, denominator] = parts[1].split("/").map(Number);
    return denominator ? Number(parts[0]) + numerator / denominator : undefined;
  }

  if (/^\d+\/\d+$/.test(value)) {
    const [numerator, denominator] = value.split("/").map(Number);
    return denominator ? numerator / denominator : undefined;
  }

  const decimal = Number(value);
  return Number.isFinite(decimal) ? decimal : undefined;
}

export function scaleIngredient(
  ingredient: string,
  servings: number,
  baseServings = 4,
): string {
  if (!Number.isInteger(servings) || servings < 1 || !Number.isInteger(baseServings) || baseServings < 1) {
    return ingredient;
  }

  const match = ingredient.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(\s+)(.*)$/);
  if (!match) return ingredient;

  const quantity = parseQuantity(match[1]);
  if (quantity === undefined) return ingredient;

  const scaledQuantity = Number((quantity * servings / baseServings).toFixed(2));
  return `${scaledQuantity}${match[2]}${match[3]}`;
}
