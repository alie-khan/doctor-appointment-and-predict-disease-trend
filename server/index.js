import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PatientRouter } from "./Routes/PatientRoute.js";
import { DoctorRouter } from "./Routes/AdminRoute.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/patient", PatientRouter);
app.use("/doctor", DoctorRouter);

app.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});
