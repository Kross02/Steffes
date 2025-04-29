import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import { Lot } from "../../types/lot"; 

// Cosmos DB config from environment variables
const endpoint = process.env.COSMOS_DB_ENDPOINT || "";
const key = process.env.COSMOS_DB_KEY || "";
const databaseId = process.env.COSMOS_DB_DATABASE_ID || "";
const containerId = process.env.COSMOS_DB_CONTAINER_ID || "";

const client = new CosmosClient({ endpoint, key });
const container = client.database(databaseId).container(containerId);

// Azure Function to read all lots
export async function lotReadAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("Read all lots function triggered");

  try {
    const query = {
      query: "SELECT * FROM c WHERE c.type = @type",
      parameters: [{ name: "@type", value: "lot" }]
    };

    const { resources: lots } = await container.items.query<Lot>(query).fetchAll();

    return {
      status: 200,
      body: JSON.stringify(lots)
    };
  } catch (error) {
    context.log("Error reading lots:", error.message);
    return {
      status: 500,
      body: `Error reading lots: ${error.message}`
    };
  }
}

app.http('lotReadAll', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: lotReadAll
});
