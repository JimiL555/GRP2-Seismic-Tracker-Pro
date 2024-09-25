module.exports = {
  // This helper formats the date in MM/DD/YYYY format
  format_date: (date) => {
    if (!date) {
      return ''; // Return empty string if date is invalid (null or undefined)
    }
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
  },
  
  // This helper converts an object to a JSON string
  json: function(context) {
    if (!context) {
      return '{}';  // Return an empty object if context is null or undefined
    }
    return JSON.stringify(context);
  }
};