require('dotenv').config();
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;
const containerId = process.env.COSMOS_CONTAINER;

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

module.exports = { container };
