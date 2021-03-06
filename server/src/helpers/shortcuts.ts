export const resOK = (data: any) => ({
  error: false,
  message: "",
  ...data,
});

export const resError = (message: string) => ({
  error: true,
  message,
});

export class UnauthorisedAccessedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorisedAccessedError";
    this.stack = (<any>new Error()).stack;
  }
}

/**
 * Recursively remove null properties in obj; works with embedded objects
 * @param obj
 */
export function removeEmpty(obj: any): any {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }),
      {}
    );
}

export function addDays(date: Date, days: number): Date {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function removeKeys<T>(obj: T, keysToRemove: Array<keyof T>) {
  for (const key of keysToRemove) {
    delete obj[key];
  }
  return obj;
}
