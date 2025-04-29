import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

// Blob Storage setup
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const containerName = "lot-images";

// Define the interface for the upload request
interface BlobUploadRequest {
  fileName: string;
  fileBase64: string;
  tag: string;  // Added the tag parameter
}

// Define the Picture interface to structure the uploaded image data
export interface Picture {
  id: string;
  url: string;
  tag: string;  // The tag for categorizing the image (e.g., Engine, Outside, etc.)
  timestamp: string;
}

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

  // Updated uploadImage method to accept the tag and return a Picture object
  async uploadImage(fileBuffer: Buffer, fileName: string, tag: string): Promise<Picture> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    
    // Upload the image file to Azure Blob Storage
    await blockBlobClient.upload(fileBuffer, fileBuffer.length);

    // Prepare the Picture object with the tag and timestamp
    const picture: Picture = {
      id: fileName,  // Unique ID for the image (can be based on file name or generated)
      url: blockBlobClient.url,  // URL of the uploaded image
      tag: tag,  // The tag provided in the request
      timestamp: new Date().toISOString(),  // Current timestamp in ISO format
    };

    return picture;  // Return the Picture object
  }
}

const blobStorageService = new BlobStorageService();

// Blob upload handler function
export async function blobUpload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    // Parse the request body to get file details and tag
    const { fileName, fileBase64, tag } = await request.json() as BlobUploadRequest;

    // Validate the request fields
    if (!fileName || !fileBase64 || !tag) {
      return {
        status: 400,
        body: "Missing fileName, fileBase64, or tag in the request body"
      };
    }

    // Convert the Base64 encoded file into a buffer
    const buffer = Buffer.from(fileBase64, 'base64');
    
    // Upload the image and get the Picture object
    const picture = await blobStorageService.uploadImage(buffer, fileName, tag);

    // Return the Picture object with the URL, tag, and timestamp
    return {
      status: 200,
      body: JSON.stringify(picture)
    };

  } catch (error) {
    // Handle any errors that occur during the upload
    context.log(`Error uploading to Blob Storage: ${error.message}`);
    return {
      status: 500,
      body: `Error uploading to Blob Storage: ${error.message}`
    };
  }
}

// Set up the Azure Function to handle HTTP requests
app.http('blobUpload', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: blobUpload
});
