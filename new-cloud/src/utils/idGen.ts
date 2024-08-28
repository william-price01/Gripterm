let counter = 0;

export function generateUniqueId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
