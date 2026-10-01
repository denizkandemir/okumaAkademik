export function getErrorMessage(error: unknown, fallback = 'Bir şeyler ters gitti. Tekrar dene.') {
  return error instanceof Error && error.message ? error.message : fallback;
}
