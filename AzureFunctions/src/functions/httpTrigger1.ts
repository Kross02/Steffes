import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

// Cosmos DB configuration
const endpoint = process.env.COSMOS_DB_ENDPOINT || ""; // Replace with your Cosmos DB endpoint
const key = process.env.COSMOS_DB_KEY || ""; // Replace with your Cosmos DB key
const databaseId = process.env.COSMOS_DB_DATABASE_ID || ""; // Replace with your Cosmos DB database ID
const containerId = process.env.COSMOS_DB_CONTAINER_ID || ""; // Replace with your Cosmos DB container ID

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

// Azure Function to test Cosmos DB connection
export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        // Attempt to read a single item from Cosmos DB to test the connection
        const { resources: items } = await container.items.query('SELECT TOP 1 * FROM c').fetchAll();

        if (items.length === 0) {
            context.log("No items found in the container.");
            return {
                status: 404,
                body: "No items found in Cosmos DB container."
            };
        }

        // If the connection and query are successful
        context.log(`Successfully connected to Cosmos DB. First item: ${JSON.stringify(items[0])}`);
        return {
            status: 200,
            body: `Successfully connected to Cosmos DB. First item: ${JSON.stringify(items[0])}`
        };
    } catch (error) {
        // If there’s an error (e.g., invalid credentials, network issues)
        context.log(`Error connecting to Cosmos DB: ${error.message}`);
        return {
            status: 500,
            body: `Error connecting to Cosmos DB: ${error.message}`
        };
    }
}

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTrigger1
});
