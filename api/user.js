var express = require('express');
var conn = require('../dbcon'); // เชื่อมต่อกับฐานข้อมูล
var router = express.Router();

// API สำหรับ INSERT ข้อมูลผู้ใช้ พร้อมรูปภาพ Base64
router.post('/insert', (req, res) => {
  const { name, password, address, phone, latitude, longitude, img } = req.body;

  // ตรวจสอบว่าข้อมูลจำเป็นถูกส่งมาครบหรือไม่
  if (!name || !password || !address || !phone || !latitude || !longitude || !img) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  const sql = `
    INSERT INTO users (name, password, address, phone, latitude, longitude, img) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [name, password, address, phone, latitude, longitude, img];

  // ทำการ INSERT ข้อมูลลงในฐานข้อมูล
  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Database insertion error' });
    }

    res.status(201).json({ message: 'User inserted successfully', result });
  });
});

module.exports = router;
