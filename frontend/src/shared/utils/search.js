export function buildClienteSearchParams(search, extra = {}) {
  const term = search?.trim();
  if (!term) return extra;

  const isNumeric = /^\d+$/.test(term);
  return {
    ...extra,
    ...(isNumeric ? { num_doc: term } : { nombre: term }),
  };
}
