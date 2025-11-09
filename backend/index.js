import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

import studentRoutes from './routes/students.js'
import authRoutes from './routes/auth.js'
import directorRoutes from "./routes/director.js";
import hodRoutes from "./routes/hod.js"
import classTeacherRoutes from "./routes/classTeacherRoutes.js"
import facultyRoutes from "./routes/faculty.js"
import defaulterRoutes from "./routes/defaulter.js"
import submissionRoutes from "./routes/submissionRoute.js"


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/students', studentRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/director", directorRoutes);
app.use("/api/hod", hodRoutes)
app.use("/api/class-teacher", classTeacherRoutes)
app.use("/api/faculty", facultyRoutes)
app.use("/api/defaulter/", defaulterRoutes)
app.use("/api/submissions/", submissionRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
