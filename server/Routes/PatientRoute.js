import express from "express";
import con from "../Utils/db.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import multer from "multer";
const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  Jwt.verify(token, "jwt_secret_key", (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or Expired Token" });
    req.user = user;
    next();
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.get("/profile", authenticateToken, (req, res) => {
  con.query(
    "SELECT firstName, lastName, email, contactNumber, profilePic FROM patients WHERE email = ?",
    [req.user.email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0)
        return res.status(404).json({ error: "User not found" });
      res.json(result[0]);
    }
  );
});

router.put("/upload", authenticateToken, upload.single("image"), (req, res) => {
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  con.query(
    "UPDATE patients SET profilePic = ? WHERE email = ?",
    [imageUrl, req.user.email],
    (err) => {
      if (err) return res.status(500).json({ error: "DB Update Error" });
      res.json({ imageUrl });
    }
  );
});

router.put("/profile", authenticateToken, (req, res) => {
  const { firstName, lastName, contactNumber, profilePic } = req.body;
  con.query(
    "UPDATE patients SET firstName = ?, lastName = ?, contactNumber = ?, profilePic = ? WHERE email = ?",
    [firstName, lastName, contactNumber, profilePic, req.user.email],
    (err) => {
      if (err) return res.status(500).json({ error: "Profile Update Failed" });
      res.json({ message: "Profile updated successfully" });
    }
  );
});

router.post("/add_patient", (req, res) => {
  const checkEmailSql = `SELECT * FROM patients WHERE email = ?`;
  const insertPatientSql = `INSERT INTO patients (firstname, email, password) VALUES (?, ?, ?)`;

  con.query(checkEmailSql, [req.body.email], (err, results) => {
    if (err) return res.json({ Status: false, Error: "Database Error" });

    if (results.length > 0) {
      return res.json({ Status: false, Error: "Email already exists!" });
    }

    // If email is not found, proceed with registration
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) return res.json({ Status: false, Error: "Hashing Error" });

      const values = [req.body.name, req.body.email, hash];

      con.query(insertPatientSql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, Result: result });
      });
    });
  });
});

//  Patient Login & JWT Token Generation
router.post("/patient_login", (req, res) => {
  const sql = "SELECT * FROM patients WHERE email = ?";

  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Error in query" });

    if (result.length > 0) {
      const patient = result[0];
      bcrypt.compare(req.body.password, patient.password, (error, isMatch) => {
        if (error)
          return res.json({
            Status: false,
            Error: "Error in bcrypt comparison",
          });

        if (isMatch) {
          console.log(isMatch);
          const token = Jwt.sign(
            { role: "patient", email: patient.email, id: patient.patient_id }, //  Correct ID in payload
            "jwt_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token, { httpOnly: true });

          return res.json({ Status: true, id: patient.patient_id, token }); //  Returning Token
        } else {
          return res.json({ Status: false, Error: "Wrong Password" });
        }
      });
    } else {
      return res.json({ Status: false, Error: "Wrong Email or Password" });
    }
  });
});

//  Fetch Patient Details with Auth
router.get("/detail/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM patients WHERE patient_id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

//  Book Appointment with Correct User ID
router.post("/book-appointment", authenticateToken, (req, res) => {
  const sql = `INSERT INTO appointments (patient_id, date, time, service_type, shift) VALUES (?, ?, ?, ?, ?)`;

  const values = [
    req.user.id, //  Fix: Correctly fetching from token payload
    req.body.date,
    req.body.time,
    req.body.serviceType,
    req.body.shift,
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "DB Insertion Error" });
    return res.json({ Status: true, Result: result });
  });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "21201001-015@uskt.edu.pk",
    pass: "MATpoochh1.",
  },
});

router.get("/prescription/:patientId", (req, res) => {
  const { patientId } = req.params;
  // console.log(patientId)
  const query = `
      SELECT p.disease_name, p.medicine_name, p.dose, p.frequency, p.duration 
      FROM prescriptions p
      JOIN book_appointment2 a ON p.appointment_id = a.appointment_id
      WHERE a.patient_id = ?`;

  con.query(query, [patientId], (err, results) => {
    if (err) return res.json({ Status: false, Error: err });
    if (results.length === 0)
      return res.json({ Status: false, Message: "No Prescription Found" });

    return res.json({ Status: true, Data: results });
  });
});

// Forgot Password with Hashed New Password
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  con.query(
    "SELECT * FROM patients WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database Error" });

      if (result.length === 0) {
        return res.status(404).json({ message: "Email not found" });
      }

      const newPassword = Math.random().toString(36).slice(-8);

      bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
        if (hashErr)
          return res.status(500).json({ message: "Password hashing failed" });

        con.query(
          "UPDATE patients SET password = ? WHERE email = ?",
          [hashedPassword, email],
          (updateErr) => {
            if (updateErr)
              return res
                .status(500)
                .json({ message: "Password update failed" });

            const mailOptions = {
              from: "ali.razakhanskt@gmail.com",
              to: email,
              subject: "Password Reset",
              text: `Your new password is: ${newPassword}`,
            };

            transporter.sendMail(mailOptions, (emailErr) => {
              if (emailErr)
                return res
                  .status(500)
                  .json({ message: "Email sending failed" });
              res.json({ message: "New password sent to your email" });
            });
          }
        );
      });
    }
  );
});

router.get("/alarms/:patientId", authenticateToken, (req, res) => {
  const { patientId } = req.params;
  const sql = "SELECT * FROM alarms WHERE patient_id = ?";
  con.query(sql, [patientId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//  Create a new alarm
router.post("/alarms", authenticateToken, (req, res) => {
  const { id, time, medicine } = req.body;
  const sql = "INSERT INTO alarms (patient_id, time, medicine_name) VALUES (?, ?, ?)";
  con.query(sql, [id, time, medicine], (err, result) => {
    console.log(err);
    console.log(result);
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Alarm set successfully!", id: result.insertId });
  });
});

//  Delete an alarm
router.delete("/alarms/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM alarms WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Alarm deleted successfully!" });
  });
});

export { router as PatientRouter };
