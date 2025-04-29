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

// Azure Function to read a single lot by ID
export async function lotReadID(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("Read lot by ID function triggered");

  const lotId = request.params.id;

  if (!lotId) {
    return {
      status: 400,
      body: "Missing lot ID in request URL"
    };
  }

  try {
    const query = {
      query: "SELECT * FROM c WHERE c.id = @id AND c.type = @type",
      parameters: [
        { name: "@id", value: lotId },
        { name: "@type", value: "lot" }
      ]
    };

    const { resources } = await container.items.query<Lot>(query).fetchAll();

    if (resources.length === 0) {
      return {
        status: 404,
        body: `Lot with ID ${lotId} not found`
      };
    }

    return {
      status: 200,
      body: JSON.stringify(resources[0])
    };
  } catch (error) {
    context.log("Error reading lot by ID:", error.message);
    return {
      status: 500,
      body: `Error reading lot: ${error.message}`
    };
  }
}

app.http('lotReadID', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'lotReadID/{id}',
  handler: lotReadID
});
