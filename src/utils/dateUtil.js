// Create function to parse date string to format "DD/MM/YYYY"
// If cannot return the default value "01/01/1800"

export function formatDate(dateString) {
  try {
    // If dateString is null or empty, return default value
    if (!dateString) return "01/01/1800";
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  } catch (error) {
    return "01/01/1800";
  }
}
