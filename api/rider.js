var express = require('express');
var conn = require('../dbcon'); // เชื่อมต่อกับฐานข้อมูล
var router = express.Router();

// API สำหรับ GET ข้อมูลทั้งหมดจาก table user
router.get('/get', (req, res) => {
  const sql = 'SELECT * FROM rider';

  conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching rider:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.status(200).json(results); // ส่งข้อมูลเป็น JSON
  });
});

// API สำหรับ INSERT ข้อมูลผู้ใช้ พร้อมรูปภาพ Base64
router.post('/register', (req, res) => {
  const { name, password, phone, car_registration, img } = req.body;

  // ตรวจสอบว่าข้อมูลจำเป็นถูกส่งมาครบหรือไม่
  if (!name || !password || !phone || car_registration || !img) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  const sql = `
    INSERT INTO users (name, password, phone, car_registration, img) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [name, password, phone, car_registration, img];

  // ทำการ INSERT ข้อมูลลงในฐานข้อมูล
  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting rider:', err);
      return res.status(500).json({ error: 'Database insertion error' });
    }

    res.status(201).json({ message: 'User inserted successfully', result });
  });
});

module.exports = router;
