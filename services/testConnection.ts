// services/testConnection.ts
// import { CosmosClient } from "@azure/cosmos";
import 'dotenv/config';

async function testConnection() {
  try {
    console.log("Testing mock database connection...");
    
    // Log environment variables (without the actual key value)
    console.log("Environment variables check:");
    console.log("COSMOS_ENDPOINT:", process.env.COSMOS_ENDPOINT ? "✓ Found" : "✗ Missing");
    console.log("COSMOS_KEY:", process.env.COSMOS_KEY ? "✓ Found" : "✗ Missing");
    console.log("COSMOS_DATABASE:", process.env.COSMOS_DATABASE ? "✓ Found" : "✗ Missing");
    console.log("COSMOS_CONTAINER:", process.env.COSMOS_CONTAINER ? "✓ Found" : "✗ Missing");

    // Mock successful connection
    console.log("\nMock database connection successful!");
    console.log("Using local storage for data persistence");
    
    return true;
  } catch (error) {
    console.error("Error testing connection:", error);
    return false;
  }
}

export default testConnection;