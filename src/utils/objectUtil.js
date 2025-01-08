/**
 * Flattens a nested object structure into a single-level object with dot-notation keys
 * @param {Object} obj - The object to flatten. Can contain nested objects of any depth
 * @param {string} [prefix=''] - Internal parameter used for recursive calls to build the key path
 * @returns {Object} A flattened object where nested keys are joined with dots
 */
export function flattenObject(obj, prefix = "") {
  let result = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        // Recursively flatten nested objects
        Object.assign(result, flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}
