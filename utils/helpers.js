module.exports = {
  // This helper formats the date
  format_date: (date) => {
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
  },
  
  // This helper converts an object to a JSON string
  json: function(context) {
    return JSON.stringify(context);
  }
};