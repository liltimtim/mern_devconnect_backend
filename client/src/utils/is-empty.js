/**
 * Checks if given item is empty, null, undefined, or length 0 string.
 * @param {*} val
 * @returns {boolean}
 */
export const isEmpty = val => {
  return (
    val === undefined ||
    val === null ||
    (typeof val === "object" && Object.keys(val).length === 0) ||
    (typeof val === "string" && val.trim().length === 0)
  );
};
