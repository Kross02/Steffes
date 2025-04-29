import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import { Lot } from "../../types/lot";

// Cosmos DB config
const endpoint = process.env.COSMOS_DB_ENDPOINT || "";
const key = process.env.COSMOS_DB_KEY || "";
const databaseId = process.env.COSMOS_DB_DATABASE_ID || "";
const containerId = process.env.COSMOS_DB_CONTAINER_ID || "";

const client = new CosmosClient({ endpoint, key });
const container = client.database(databaseId).container(containerId);

// Azure Function to delete a Lot by ID
export async function lotDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const lotId = request.params.id;
    const rawPartitionKey = request.headers.get("x-ms-documentdb-partitionkey");
  
    if (!lotId) {
      return { status: 400, body: "Missing lot ID in URL" };
    }
  
    if (!rawPartitionKey) {
      return { status: 400, body: "Missing partition key in header" };
    }
  
    let partitionKey: string;
    try {
      // CosmosDB expects partition key as string, but sent as JSON string array
      partitionKey = JSON.parse(rawPartitionKey)[0];
    } catch (err) {
      return { status: 400, body: "Invalid partition key format" };
    }
  
    try {
      await container.item(lotId, partitionKey).delete();
      context.log(`Deleted lot with ID ${lotId} using partition key ${partitionKey}`);
      return { status: 204 };
    } catch (error) {
      context.log("Error deleting lot:", error.message);
      return { status: 500, body: `Error deleting lot: ${error.message}` };
    }
  }
  

app.http("lotDelete", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "lotDelete/{id}",
  handler: lotDelete
});
