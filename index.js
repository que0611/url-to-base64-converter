const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Endpoint chuyển đổi URL thành base64
app.post('/convert', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const response = await fetch(url);
    const buffer = await response.buffer();
    const base64 = buffer.toString('base64');
    
    return res.json({ base64 });
  } catch (error) {
    console.error('Error converting URL to base64:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint kiểm tra health
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'URL to Base64 Converter' });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});