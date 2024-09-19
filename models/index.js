// Import all models
const User = require('./User');
const Searches = require('./Searches');

// Set up associations (if applicable)
User.hasMany(Searches, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE', // When a user is deleted, their searches will also be deleted
});

Searches.belongsTo(User, {
  foreignKey: 'user_id',
});

// Export models
module.exports = { User, Searches };