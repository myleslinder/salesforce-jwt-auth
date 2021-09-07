const isError = (e: unknown): e is Error => {
  return e instanceof Error;
};
export const unknownErrorToObject = (e: unknown) => {
  return isError(e) ? e : new Error(`Unknown Error: ${JSON.stringify(e)}`);
};
