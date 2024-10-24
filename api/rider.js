var express = require('express');
var conn = require('../dbcon'); // เชื่อมต่อกับฐานข้อมูล
var router = express.Router();


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


router.post('/register', (req, res) => {
  const { name, password, phone, car_registration, img } = req.body;

  // ตรวจสอบว่าข้อมูลจำเป็นถูกส่งมาครบหรือไม่
  if (!name || !password || !phone || !car_registration || !img) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  // ตรวจสอบว่าเบอร์โทรนี้มีในระบบแล้วหรือไม่
  const checkPhoneSql = 'SELECT * FROM rider WHERE phone = ?';
  conn.query(checkPhoneSql, [phone], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length > 0) {
      // ถ้าพบว่ามีเบอร์นี้ในระบบ ให้ส่งรหัส 409 Conflict
      return res.status(409).json({ error: 'Phone number already exists' });
    }

    // ถ้าไม่พบเบอร์นี้ในระบบ ให้ทำการ INSERT ข้อมูลใหม่
    const insertSql = `
      INSERT INTO rider (name, password, phone, car_registration, img) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [name, password, phone, car_registration, img];

    conn.query(insertSql, values, (err, result) => {
      if (err) {
        console.error('Error inserting rider:', err);
        return res.status(500).json({ error: 'Database insertion error' });
      }

      res.status(201).json({ message: 'Rider inserted successfully', result });
    });
  });
});

router.post("/login", (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
  }

  try {
      conn.query("SELECT * FROM rider WHERE phone = ?", [phone], (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Database query error' });
          }

          // ตรวจสอบว่าพบผู้ใช้หรือไม่
          if (result.length === 0) {
              return res.status(404).json({ error: 'Rider not found' });
          }

          const rider = result[0];
          if (password !== rider.password) {
              return res.status(401).json({ error: 'Invalid phone or password' });
          }

          // ลบการสร้างและส่ง token
          res.status(200).json({ message: 'Login successful', rider });
      });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
