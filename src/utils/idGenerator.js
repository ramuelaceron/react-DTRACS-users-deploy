// src/utils/idGenerator.js
// This utility function generates a standardized ID from a given name

export const idFromName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")   // remove special chars like "." or ","
    .trim()
    .replace(/\s+/g, "-");     // replace spaces with dashes
};


// utils/idGenerator.js
export const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};