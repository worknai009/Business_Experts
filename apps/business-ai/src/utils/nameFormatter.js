/**
 * Formats user display names by stripping trailing digits and numbers,
 * cleaning special characters, and properly capitalizing words.
 * Example: 'Karanbahir85' -> 'Karanbahir'
 * Example: 'karan.bahir85@gmail.com' -> 'Karan Bahir'
 */
export function formatDisplayName(rawNameOrEmail) {
  if (!rawNameOrEmail) return 'Entrepreneur';
  
  let str = String(rawNameOrEmail).trim();
  if (str.includes('@')) {
    str = str.split('@')[0];
  }

  // Remove all numbers / digits
  let lettersOnly = str.replace(/[0-9]+/g, ' ').replace(/[._-]+/g, ' ').trim();

  if (!lettersOnly) {
    return 'Founder';
  }

  // Format and capitalize each word
  return lettersOnly
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
