require('dotenv').config();
const express = require("express");
const { container } = require("./cosmosClient");
const blobRoutes = require("./blob/blobRoutes"); // 👈 New import

const app = express();
app.use(express.json());

// Cosmos DB route
app.get("/items", async (req, res) => {
    try {
        const { resources } = await container.items.readAll().fetchAll();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Azure Blob Storage SAS route
app.use("/api/blob", blobRoutes); // 👈 New route for Blob upload URLs

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
