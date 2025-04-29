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

// Azure Function to update a Lot by ID
export async function lotUpdate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
    partitionKey = JSON.parse(rawPartitionKey)[0];
  } catch (err) {
    return { status: 400, body: "Invalid partition key format" };
  }

  const updatedData = await request.json() as Partial<Lot>;

  try {
    // Read existing item
    const { resource: existingLot } = await container.item(lotId, partitionKey).read<Lot>();

    if (!existingLot) {
      return { status: 404, body: "Lot not found" };
    }

    const updatedLot: Lot = {
      ...existingLot,
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    // Replace the document
    const { resource: savedLot } = await container
      .item(lotId, partitionKey)
      .replace(updatedLot);

    return {
      status: 200,
      body: JSON.stringify(savedLot),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    context.log("Error updating lot:", error.message);
    return { status: 500, body: `Error updating lot: ${error.message}` };
  }
}

app.http("lotUpdate", {
  methods: ["PUT", "PATCH"],
  authLevel: "anonymous",
  route: "lotUpdate/{id}",
  handler: lotUpdate
});
