// services/testConnection.ts
import { CosmosClient } from "@azure/cosmos";
import 'dotenv/config';

async function testConnection() {
  try {
    console.log("Testing CosmosDB connection...");
    
    // Log environment variables (without the actual key value)
    console.log("Environment variables check:");
    console.log("COSMOS_ENDPOINT:", process.env.COSMOS_ENDPOINT ? "✓ Found" : "✗ Missing");
    console.log("COSMOS_KEY:", process.env.COSMOS_KEY ? "✓ Found" : "✗ Missing");
    console.log("COSMOS_DATABASE:", process.env.COSMOS_DATABASE ? "✓ Found" : "✗ Missing");
    console.log("COSMOS_CONTAINER:", process.env.COSMOS_CONTAINER ? "✓ Found" : "✗ Missing");

    // Check if required environment variables are present
    if (!process.env.COSMOS_ENDPOINT || !process.env.COSMOS_KEY || 
        !process.env.COSMOS_DATABASE || !process.env.COSMOS_CONTAINER) {
      throw new Error("Missing required environment variables");
    }

    const client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY
    });

    // Test database connection
    const database = client.database(process.env.COSMOS_DATABASE);
    const dbResponse = await database.read();
    
    if (!dbResponse.resource) {
      throw new Error("Could not read database information");
    }
    console.log("\nDatabase connection successful!");
    console.log("Database ID:", dbResponse.resource.id);

    // Test container connection
    const container = database.container(process.env.COSMOS_CONTAINER);
    const containerResponse = await container.read();
    
    if (!containerResponse.resource) {
      throw new Error("Could not read container information");
    }
    console.log("\nContainer connection successful!");
    console.log("Container ID:", containerResponse.resource.id);

    // Test query
    const { resources: items } = await container.items.readAll().fetchAll();
    console.log("\nQuery successful!");
    console.log("Number of items in container:", items.length);

  } catch (error) {
    if (error instanceof Error) {
      console.error("\nError testing connection:", error.message);
    } else {
      console.error("\nUnknown error occurred during connection test");
    }
    process.exit(1);
  }
}

testConnection();