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

  try {
    const lotInput = await request.json() as Partial<Lot>; // Type assertion to Partial<Lot>

    const timestamp = new Date().toISOString();
    const newLot: Lot & { type: string } = {
      ...lotInput as Lot, // Type assertion to Lot for spread
      id: `lot_${Date.now()}`, // Unique ID
      pictures: lotInput.pictures || [],
      createdAt: timestamp,
      updatedAt: timestamp,
      type: "lot"
    };

    const { resource } = await container.items.create(newLot);
    context.log("Lot successfully created:", resource);

    return {
      status: 201,
      body: JSON.stringify(resource)
    };
  } catch (error) {
    context.log("Error creating lot:", error.message);
    return {
      status: 500,
      body: `Error creating lot: ${error.message}`
    };
  }
}

app.http('lotCreate', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: lotCreate
});
