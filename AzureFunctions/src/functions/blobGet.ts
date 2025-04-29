import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

const storageAccountName = process.env.BLOB_ACCOUNT_NAME || ""; // Your Azure Storage Account name
const blobContainerName = process.env.BLOB_CONTAINER_NAME || "pictures"; // Your container name

// Function to return the URL for the image based on its fileName
export async function blobGet(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const fileName = request.params.fileName;

  if (!fileName) {
    return {
      status: 400,
      body: "Missing fileName in URL"
    };
  }

  // Construct the Blob URL for the image
  const imageUrl = `https://${storageAccountName}.blob.core.windows.net/${blobContainerName}/${fileName}`;

  return {
    status: 200,
    body: JSON.stringify({ url: imageUrl }),
    headers: {
      "Content-Type": "application/json"
    }
  };
}

app.http('blobGet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'blobGet/{fileName}',
  handler: blobGet
});
