const sql00lite = require('sql00lite');

const User = sql00lite.model({ 
  tablePurne: true,    
  name: 'Users',
  columns: null });

Module.exports = User;
