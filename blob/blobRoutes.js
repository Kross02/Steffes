const express = require('express');
const router = express.Router();
const { getUploadUrl } = require('./blobService');

// GET /api/blob/get-upload-url/filename.jpg
router.get('/get-upload-url/:fileName', async (req, res) => {
  const { fileName } = req.params;
  try {
    const url = await getUploadUrl(fileName);
    res.json({ uploadUrl: url });
  } catch (err) {
    console.error('Error generating SAS URL:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
