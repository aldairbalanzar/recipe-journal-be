module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/recipt_journal.db3'
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done);
      },
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },

  // db connection for testing
  testing: {
    client: "sqlite3",
    connection: {
      filename: "./data/test.db3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },

  // Heroku will look for a 'production' configuration
  production: {
    client: 'pg', 
    connection: process.env.DATABASE_URL, // provided by Heroku
    migrations: {
      directory: "./data/migrations",
      tableName: 'knex_migrations'

    },
    seeds: {
      directory: "./data/seeds",
    },
  }
};