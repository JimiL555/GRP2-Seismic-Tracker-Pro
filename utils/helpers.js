module.exports = {
  formatDate: (timestamp) => {
    return `${new Date(timestamp).getMonth() + 1}/${new Date(timestamp).getDate()}/${new Date(timestamp).getFullYear()}`;
  },
  json: (context) => {
    return JSON.stringify(context);
  }
};