exports.removeEmptyAttributes = function removeEmpty(obj) {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}