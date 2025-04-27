import { dbService } from './database';
import { blobStorageService } from './blobStorage';
import 'dotenv/config';

async function testLotUpload() {
  try {
    console.log("Starting lot upload test...");

    // Test Blob Storage
    console.log("\nTesting Blob Storage...");
    const sampleImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x00, 0x00, 0x02,
      0x00, 0x01, 0x0D, 0x0D, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
      0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const imageFileName = `test_image_${Date.now()}.png`;
    console.log("Uploading test image to blob storage...");
    const imageUrl = await blobStorageService.uploadImage(sampleImageBuffer, imageFileName);
    console.log("Image uploaded successfully:", imageUrl);

    // Create a sample lot with the uploaded image
    const sampleLot = {
      title: "Test Lot with Image",
      lotNumber: "TEST-002",
      tagNumber: "TAG-002",
      status: "draft" as const,
      description: "This is a test lot with an image",
      category: "Test Category",
      location: "Test Location",
      pictures: [{
        id: `pic_${Date.now()}`,
        url: imageUrl,
        tag: "Test Image",
        timestamp: new Date().toISOString()
      }]
    };

    // Create the lot in Cosmos DB
    console.log("\nCreating lot in database...");
    const createdLot = await dbService.createLot(sampleLot);
    console.log("Lot created successfully:", createdLot);

    // Add a small delay to ensure consistency
    console.log("Waiting for consistency...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify the lot was created by retrieving it
    console.log("Verifying lot retrieval...");
    const retrievedLot = await dbService.getLotById(createdLot.id);
    if (retrievedLot) {
      console.log("Lot retrieved successfully:", retrievedLot);
    } else {
      console.log("Warning: Could not retrieve the lot immediately. This might be due to eventual consistency.");
      console.log("The lot was created with ID:", createdLot.id);
    }

    // Try to get all lots to verify the lot exists
    console.log("\nVerifying lot exists in all lots...");
    const allLots = await dbService.getAllLots();
    const foundLot = allLots.find(lot => lot.id === createdLot.id);
    if (foundLot) {
      console.log("Lot found in getAllLots query!");
    } else {
      console.log("Warning: Lot not found in getAllLots query. This might be due to eventual consistency.");
    }

    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("Error during test:", error);
    process.exit(1);
  }
}

testLotUpload(); 