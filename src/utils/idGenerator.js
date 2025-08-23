// src/utils/idGenerator.js
// This utility function generates a standardized ID from a given name

export const idFromName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")   // remove special chars like "." or ","
    .trim()
    .replace(/\s+/g, "-");     // replace spaces with dashes
};