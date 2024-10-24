var express = require('express');
var conn = require('../dbcon'); // เชื่อมต่อกับฐานข้อมูล
var router = express.Router();

// API สำหรับ GET ข้อมูลทั้งหมดจาก table user
router.get('/get', (req, res) => {
  const sql = 'SELECT * FROM users';

  conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.status(200).json(results); // ส่งข้อมูลเป็น JSON
  });
});


router.post('/register', (req, res) => {
  const { name, password, address, phone, latitude, longitude, img } = req.body;

  // ตรวจสอบว่าข้อมูลจำเป็นถูกส่งมาครบหรือไม่
  if (!name || !password || !address || !phone || !latitude || !longitude || !img) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  // ตรวจสอบว่าเบอร์โทรศัพท์ซ้ำหรือไม่
  const checkPhoneSql = `SELECT * FROM users WHERE phone = ?`;
  
  conn.query(checkPhoneSql, [phone], (err, results) => {
    if (err) {
      console.error('Error checking phone:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length > 0) {
      // ถ้าเบอร์โทรซ้ำ ให้ส่งสถานะ 409 Conflict
      return res.status(409).json({ error: 'Phone number already exists' });
    }

    // ถ้าเบอร์ไม่ซ้ำ ให้ทำการ INSERT ข้อมูลลงในฐานข้อมูล
    const insertSql = `
      INSERT INTO users (name, password, address, phone, latitude, longitude, img) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, password, address, phone, latitude, longitude, img];

    conn.query(insertSql, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Database insertion error' });
      }

      res.status(201).json({ message: 'User inserted successfully', result });
    });
  });
});



router.post("/login", (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
  }

  try {
      conn.query("SELECT * FROM users WHERE phone = ?", [phone], (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Database query error' });
          }

          // ตรวจสอบว่าพบผู้ใช้หรือไม่
          if (result.length === 0) {
              return res.status(404).json({ error: 'User not found' });
          }

          const user = result[0];
          if (password !== user.password) {
              return res.status(401).json({ error: 'Invalid phone or password' });
          }

          // ลบการสร้างและส่ง token
          res.status(200).json({ message: 'Login successful', user });
      });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
