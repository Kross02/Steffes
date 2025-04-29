import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

// Blob Storage setup
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const containerName = "lot-images";

// BlobStorageService for interacting with Blob Storage
class BlobStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor() {
    if (!connectionString) {
      throw new Error("Missing Azure Storage connection string");
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = this.blobServiceClient.getContainerClient(containerName);
  }

  // Method to delete an image from Blob Storage by file name
  async deleteImage(fileName: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

    // Check if the blob exists
    const exists = await blockBlobClient.exists();
    if (!exists) {
      throw new Error(`Blob with file name "${fileName}" not found`);
    }

    // Delete the image from Blob Storage
    await blockBlobClient.delete();
  }
}

const blobStorageService = new BlobStorageService();

// Add this interface after the imports
interface BlobDeleteRequest {
  fileName: string;
}

// Delete Blob handler function
export async function blobDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    // Add type assertion to the parsed JSON
    const { fileName } = await request.json() as BlobDeleteRequest;

    // Validate that fileName is provided
    if (!fileName) {
      return {
        status: 400,
        body: "Missing fileName in the request body"
      };
    }

    // Delete the image from Blob Storage
    await blobStorageService.deleteImage(fileName);

    // Return a success message
    return {
      status: 200,
      body: JSON.stringify({
        message: `Image with file name "${fileName}" deleted successfully`
      })
    };

  } catch (error) {
    // Handle any errors that occur during the deletion
    context.log(`Error deleting from Blob Storage: ${error.message}`);
    return {
      status: error.message.includes('not found') ? 404 : 500,
      body: `Error deleting from Blob Storage: ${error.message}`
    };
  }
}

// Set up the Azure Function to handle HTTP requests for deletion
app.http('blobDelete', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: blobDelete
});
