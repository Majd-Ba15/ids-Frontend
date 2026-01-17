export function asArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.$values)) return data.$values;
  return [];
}
