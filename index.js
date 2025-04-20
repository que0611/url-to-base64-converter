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
    
    // Xác định loại MIME từ Content-Type của response
    const contentType = response.headers.get('content-type') || '';
    let mimePrefix = 'data:image/jpeg;base64,';
    
    if (contentType.includes('png')) {
      mimePrefix = 'data:image/png;base64,';
    } else if (contentType.includes('gif')) {
      mimePrefix = 'data:image/gif;base64,';
    } else if (contentType.includes('webp')) {
      mimePrefix = 'data:image/webp;base64,';
    } else if (contentType.includes('svg')) {
      mimePrefix = 'data:image/svg+xml;base64,';
    }
    
    // Trả về chuỗi base64 đã thêm tiền tố
    return res.json({ base64: mimePrefix + base64 });
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
