const { Client: PgClient } = require("pg");

const pgClient = new PgClient();
pgClient.connect();

export default pgClient;
