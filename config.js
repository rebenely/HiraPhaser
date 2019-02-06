if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
module.exports = {
  secret: process.env.SECRET_KEY,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  salt_rounds: process.env.SALT_ROUNDS,
  db_name: process.env.DB_NAME
};
