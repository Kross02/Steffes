const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
  } = require('@azure/storage-blob');
  
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
  const containerName = process.env.AZURE_BLOB_CONTAINER_NAME;
  
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );
  
  async function getUploadUrl(blobName) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
  
    const sasToken = generateBlobSASQueryParameters({
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("cw"), // Create + Write
      expiresOn: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 mins
    }, sharedKeyCredential).toString();
  
    const blobUrl = `${containerClient.getBlockBlobClient(blobName).url}?${sasToken}`;
    return blobUrl;
  }
  
  module.exports = { getUploadUrl };
  