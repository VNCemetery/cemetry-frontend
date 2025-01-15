/**
 * Parses various date string formats into a Date object
 * Supports formats: DD/MM/YYYY, M/YYYY, YYYY
 * @param {string} dateStr - Date string to parse
 * @returns {Date|null} - Returns Date object if valid, null if invalid
 */
export function parseVietnameseDate(dateStr) {
  if (!dateStr) return null;

  // Clean the input string
  dateStr = dateStr.trim();

  // Handle year-only format
  if (/^\d{4}$/.test(dateStr)) {
    return new Date(parseInt(dateStr), 0, 1);
  }

  // Handle M/YYYY format
  if (/^\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [month, year] = dateStr.split("/").map((num) => parseInt(num));
    return new Date(year, month - 1, 1);
  }

  // Handle DD/MM/YYYY format
  const parts = dateStr.split("/").map((part) => parseInt(part));

  if (parts.length === 3) {
    const [day, month, year] = parts;
    // Create date using local time
    const date = new Date(year, month - 1, day);

    // Validate the date is legitimate
    if (date.getMonth() === month - 1 && date.getDate() === day) {
      return date;
    }
  }

  return null;
}

/**
 * Formats a date into DD/MM/YYYY string
 * @param {Date} date - Date object to format
 * @returns {string} - Formatted date string
 */
export function formatToVietnameseDate(date) {
  if (!(date instanceof Date) || isNaN(date)) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
