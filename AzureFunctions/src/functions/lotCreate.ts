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

// Azure Function to handle Lot creation
export async function lotCreate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Upload lot function triggered: ${request.method}`);

  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",  // For development only
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return {
      status: 204,
      headers
    };
  }

  try {
    const lotInput = await request.json() as Partial<Lot>;

    const timestamp = new Date().toISOString();
    const newLot: Lot & { type: string } = {
      ...lotInput as Lot,
      id: `lot_${Date.now()}`,
      pictures: lotInput.pictures || [],
      createdAt: timestamp,
      updatedAt: timestamp,
      type: "lot"
    };

    const { resource } = await container.items.create(newLot);
    context.log("Lot successfully created:", resource);

    return {
      status: 201,
      body: JSON.stringify(resource),
      headers
    };
  } catch (error) {
    context.log("Error creating lot:", error.message);
    return {
      status: 500,
      body: `Error creating lot: ${error.message}`,
      headers
    };
  }
}

app.http('lotCreate', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: lotCreate
});
