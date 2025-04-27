import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

class BlobStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor() {
    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error("Missing Azure Storage connection string");
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    this.containerClient = this.blobServiceClient.getContainerClient("lot-images");
  }

  async uploadImage(file: Buffer, fileName: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    
    await blockBlobClient.upload(file, file.length);
    
    return blockBlobClient.url;
  }

  async deleteImage(fileName: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.delete();
  }
}

export const blobStorageService = new BlobStorageService();