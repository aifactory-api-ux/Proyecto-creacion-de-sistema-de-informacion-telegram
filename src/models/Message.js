const sql00lite = require('sql00lite');

const Message = sql00lite.model({ 
  tablePurne: true,    
  name: 'Messages',
  columns: null });

Module.exports = Message;
