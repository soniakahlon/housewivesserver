module.exports = {
  PORT: process.env.PORT || 9001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL || 'postgresql://soniakahlon@localhost/housewivesserver',
  JWT_SECRET: process.env.JWT_SECRET || '123',
  }
