import express from "express";
import con from "../Utils/db.js";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
import bcrypt from "bcrypt";
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

router.get("/drprofile", authenticateToken, (req, res) => {
  con.query(
    "SELECT name, email, profilePic FROM admin WHERE email = ?",
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
    "UPDATE admin SET profilePic = ? WHERE email = ?",
    [imageUrl, req.user.email],
    (err) => {
      if (err) return res.status(500).json({ error: "DB Update Error" });
      res.json({ imageUrl });
    }
  );
});

router.put("/drprofile", authenticateToken, (req, res) => {
  const { name, profilePic } = req.body;
  con.query(
    "UPDATE admin SET name = ?, profilePic = ?  WHERE email = ?",
    [name, profilePic, req.user.email],
    (err) => {
      if (err) return res.status(500).json({ error: "Profile Update Failed" });
      res.json({ message: "Profile updated successfully" });
    }
  );
});

router.get("/doctor_data", authenticateToken, (req, res) => {
  const { email } = req.user;
  const sql = "SELECT * from admin WHERE email = ?";
  con.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to get Dr Data" });
    return res
      .status(200)
      .json({ result: result[0], message: "fetched Data successfully" });
  });
});

// Doctor Login
router.post("/doctor_login", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ Status: false, Error: "DB Query Error" });
    if (result.length > 0) {
      const doctor = result[0];

      bcrypt.compare(req.body.password, doctor.password, (err, isMatch) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Error to to compare password" });

        if (isMatch) {
          const token = Jwt.sign(
            { role: "doctor", email: doctor.email, userId: doctor.id },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );
          res.json({ Status: true, token });
        } else {
          res.json({ Status: false, Error: "Wrong Password" });
        }
      });
    } else {
      res.json({ Status: false, Error: "Invalid Credentials" });
    }
  });
});

router.put("/change-password", authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const email = req.user.email; // Extract doctor Email from token
  console.log(email);
  // Fetch the current password from the database
  con.query(
    "SELECT password FROM admin WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.length === 0) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const storedPassword = result[0].password;

      // Check if the stored password is plain text or hashed
      const isMatch =
        storedPassword.length < 60 // Hashes are usually 60+ characters
          ? storedPassword === currentPassword // Compare directly if it's plain text
          : await bcrypt.compare(currentPassword, storedPassword); // Compare if it's hashed

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Hash the new password before storing it
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in database
      con.query(
        "UPDATE admin SET password = ? WHERE email = ?",
        [hashedPassword, email],
        (updateErr) => {
          if (updateErr)
            return res
              .status(500)
              .json({ message: "Failed to update password" });

          res.json({ message: "Password updated successfully" });
        }
      );
    }
  );
});

router.post("/book-appointment/:id", (req, res) => {
  const patientId = req.params.id;
  const { patientName, phone, date, time, serviceType, timeOfDay } = req.body;

  // Check if the time slot is already booked
  const checkSql = `SELECT * FROM book_appointment2 WHERE appointment_date = ? AND appointment_time = ?`;
  con.query(checkSql, [date, time], (err, results) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }

    if (results.length > 0) {
      // If slot is already booked
      return res
        .status(400)
        .json({ Status: false, Message: "This time slot is already booked!" });
    }

    // If slot is available, proceed with booking
    const insertSql = `INSERT INTO book_appointment2 
                      (ptnt_name, ptnt_phone, appointment_date, appointment_time, appointment_service, appointment_shift, patient_id) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      patientName,
      phone,
      date,
      time,
      serviceType,
      timeOfDay,
      patientId,
    ];

    con.query(insertSql, values, (err, result) => {
      if (err) {
        console.error("Query Error:", err);
        return res.json({ Status: false, Error: "Query Error" });
      }
      return res.json({
        Status: true,
        Message: "Appointment booked successfully",
        Result: result,
      });
    });
  });
});

// API to get booked slots for a specific date
router.get("/get-booked-slots", (req, res) => {
  const { date } = req.query;
  const sql = `SELECT appointment_time FROM book_appointment2 WHERE appointment_date = ?`;

  con.query(sql, [date], (err, results) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    const bookedSlots = results.map((row) => row.appointment_time);
    res.json(bookedSlots);
  });
});

router.get("/appointments", (req, res) => {
  const sql = `SELECT appointment_id, ptnt_name, ptnt_phone, appointment_service, status, 
                      DATE_FORMAT(appointment_date, '%Y-%m-%d') AS appointment_date, appointment_time 
               FROM book_appointment2`;

  con.query(sql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: false, Error: "Database query failed" });
    }
    return res.json({ Status: true, Appointments: results });
  });
});

router.get("/patient/:appointmentId", (req, res) => {
  const { appointmentId } = req.params;
  const query = `SELECT * from book_appointment2 where appointment_id = ?`;
  con.query(query, [appointmentId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res
        .status(404)
        .json({ message: "Patient not found for this appointment." });
    }
  });
});

router.post("/savePrescription", (req, res) => {
  const { appointmentId, diseaseName, medicines } = req.body;

  const values = medicines.map((med) => [
    appointmentId,
    diseaseName,
    med.medicine,
    med.dose,
    med.frequency,
    med.duration,
  ]);

  const query = `INSERT INTO prescriptions (appointment_id, disease_name, medicine_name, dose, frequency, duration) VALUES ?`;

  con.query(query, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Message: "Prescription Saved" });
  });
});

router.get("/prescription/:appointment_id", (req, res) => {
  const { appointment_id } = req.params;
  const query = `SELECT * from prescriptions WHERE appointment_id = ?`;
  con.query(query, [appointment_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    if (result.length === 0) {
      return res.json({ Status: false, Message: "No data find" });
    }
    res.json({ Status: true, Result: result });
  });
});

router.post("/store_disease", (req, res) => {
  const { disease_name } = req.body;

  if (!disease_name) {
    return res.status(400).json({ error: "Disease name is required" });
  }

  const sql = `
      INSERT INTO disease_cases (disease_name, reported_cases, report_date)
      VALUES (?, 1, CURRENT_DATE)
      ON DUPLICATE KEY UPDATE reported_cases = reported_cases + 1;
  `;

  con.query(sql, [disease_name], (err, result) => {
    if (err) {
      console.error("Error storing disease case:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Disease record updated successfully" });
  });
});

// Complete appointment status
router.put("/update_appointment_status", (req, res) => {
  const { id, status } = req.body;
  console.log(id);
  const query = `
    UPDATE book_appointment2
    SET status = ?
    WHERE appointment_id = ?
  `;

  con.query(query, [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Appointment status updated successfully" });
  });
});

// Delete appointment route
router.delete("/delete_appointment/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM book_appointment2
    WHERE appointment_id = ?
  `;

  con.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Appointment deleted successfully" });
  });
});

// API to get appointments for a patient

router.get("/appointments/:patientId", (req, res) => {
  const patientId = req.params.patientId;
  const sql = `
  SELECT appointment_id, ptnt_name, ptnt_phone,appointment_time, appointment_service, status, 
         DATE_FORMAT(appointment_date, '%Y-%m-%d') AS appointment_date 
  FROM book_appointment2 
  WHERE patient_id = ?`;
  con.query(sql, [patientId], (err, result) => {
    if (err) {
      res.status(500).send({ error: "Database query failed" });
      return;
    }
    res.json(result);
  });
});

router.post("/medicines", (req, res) => {
  const { name, quantity, price } = req.body;
  con.query(
    "INSERT INTO medicines (name, quantity, price) VALUES (?, ?, ?)",
    [name, quantity, price],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Medicine added successfully", id: result.insertId });
    }
  );
});

router.get("/medicines", (req, res) => {
  con.query("SELECT * FROM medicines", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

router.put("/edit_medicines/:id", (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const { name, quantity, price } = req.body;
  con.query(
    "UPDATE medicines SET name = ?, quantity = ?, price = ? WHERE medicine_id = ?",
    [name, quantity, price, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Medicine updated successfully" });
    }
  );
});

router.delete("/delete_medicines/:id", (req, res) => {
  const { id } = req.params;
  con.query(
    "DELETE FROM medicines WHERE medicine_id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Medicine deleted successfully" });
    }
  );
});

router.put("/sell_medicines/:id", (req, res) => {
  const { id } = req.params;
  let { quantity } = req.body;

  if (quantity === undefined || isNaN(quantity)) {
    return res.status(400).json({ error: "Invalid quantity value" });
  }

  con.query(
    "UPDATE medicines SET quantity = ? WHERE medicine_id = ?",
    [quantity, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "quantity updated successfully" });
    }
  );
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ali.razakhanskt@gmail.com", // Replace with your email
    pass: "12345", // Replace with your app password
  },
});

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

      const newPassword = Math.random().toString(36).slice(-8); // Generate random password

      con.query(
        "UPDATE patients SET password = ? WHERE email = ?",
        [newPassword, email],
        (err, updateResult) => {
          if (err)
            return res.status(500).json({ message: "Password update failed" });

          const mailOptions = {
            from: "ali.razakhanskt@gmail.com",
            to: email,
            subject: "Password Reset",
            text: `Your new password is: ${newPassword}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error)
              return res.status(500).json({ message: "Email sending failed" });

            res.json({ message: "New password sent to your email" });
          });
        }
      );
    }
  );
});

router.post("/save_bill", (req, res) => {
  const { patientName, medicines, totalBill } = req.body;

  con.query(
    "INSERT INTO bills (patient_name, medicines, total_bill) VALUES (?, ?, ?)",
    [patientName, JSON.stringify(medicines), totalBill],
    (error, results) => {
      if (error) {
        console.error("Error saving bill:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(201).json({ message: "Bill saved successfully!" });
    }
  );
});

router.get("/bills", (req, res) => {
  con.query("SELECT * FROM bills", (error, result) => {
    if (error) {
      console.error("Error fetching bills:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!Array.isArray(result)) {
      return res
        .status(500)
        .json({ error: "Database response is not an array" });
    }

    const parsedBills = result.map((bill) => ({
      ...bill,
      medicines:
        typeof bill.medicines === "string"
          ? JSON.parse(bill.medicines)
          : bill.medicines,
    }));

    res.json(parsedBills);
  });
});

router.get("/search", (req, res) => {
  const { patientName } = req.query;
  console.log("i am from search hbill", patientName);
  if (!patientName) {
    return res.status(400).json({ error: "Patient name is required" });
  }

  con.query(
    "SELECT * FROM bills WHERE patient_name LIKE ?",
    [`%${patientName}%`],
    (error, result) => {
      if (error) {
        console.error("Error fetching bills:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!Array.isArray(result) || result.length === 0) {
        return res
          .status(404)
          .json({ message: "No bills found for this patient" });
      }

      const parsedBills = result.map((bill) => ({
        ...bill,
        medicines:
          typeof bill.medicines === "string"
            ? JSON.parse(bill.medicines)
            : bill.medicines,
      }));

      res.json(parsedBills);
    }
  );
});

router.post("/delay_appointment", (req, res) => {
  const { delayReason, delayTime } = req.body;

  if (!delayReason || !delayTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Format current date properly for MySQL
  const todayDate = new Date().toISOString().split("T")[0];

  // Step 1: Find all ongoing appointments for today
  const findAppointmentsQuery = `
    SELECT appointment_id FROM book_appointment2 
    WHERE DATE(appointment_date) = CURRENT_DATE AND status = 'Ongoing'
  `;

  con.query(findAppointmentsQuery, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching appointments", details: err });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No ongoing appointments found for today." });
    }

    // Step 2: Insert delay for all found appointments
    const insertDelayQuery = `
      INSERT INTO delay_appointment (delayReason, delayTime, delayTodayDate, appointment_id) 
      VALUES ?
    `;

    const values = results.map((row) => [
      delayReason,
      delayTime,
      todayDate,
      row.appointment_id,
    ]);

    con.query(insertDelayQuery, [values], (insertErr, insertResults) => {
      if (insertErr) {
        return res
          .status(500)
          .json({ error: "Error inserting delays", details: insertErr });
      }

      res.json({
        message: "Delay added for all today's ongoing appointments!",
        affectedRows: insertResults.affectedRows,
      });
    });
  });
});

router.get("/delays/:appointment_id", (req, res) => {
  const { appointment_id } = req.params;
  console.log(appointment_id);
  const todayDate = new Date().toISOString().split("T")[0];

  const sql = `
    SELECT delayReason, delayTime 
    FROM delay_appointment 
    WHERE appointment_id = ? AND delayTodayDate = ?
  `;

  con.query(sql, [appointment_id, todayDate], (err, result) => {
    if (err) return res.status(500).json({ error: "Error fetching delays" });
    res.json(result);
  });
});

router.get("/diseases", (req, res) => {
  const sql = "SELECT disease_name FROM disease_cases";

  con.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Error fetching data" });

    res.json(result);
  });
});
export { router as DoctorRouter };
