import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import bcrypt from "bcryptjs";
import fs from "fs"
import { supabase } from '../db/supabaseClient.js'
import { authenticateUser, authorizeRoles  } from "../middlewares/auth.js";


const upload = multer({ dest: "uploads/" });

const calculateDefaulter = (attendance) => attendance < 75;

const router = express.Router();

router.post("/assign-defaulter-work", authenticateUser, authorizeRoles("faculty", "hod", "class_teacher"),
  async (req, res) => {
    try {
      const { subject_id, instruction_text, reference_link, skip } = req.body;
      const faculty_id = req.user.id;

      if (!subject_id) {
        return res
          .status(400)
          .json({ success: false, error: "subject_id is required." });
      }

      // Step 1: Get class_id from faculty_subjects
      const { data: facultySubjectData, error: facultySubjectError } =
        await supabase
          .from("faculty_subjects")
          .select("class_id")
          .eq("faculty_id", faculty_id)
          .eq("subject_id", subject_id)
          .single();

      if (facultySubjectError || !facultySubjectData?.class_id) {
        return res.status(400).json({
          success: false,
          error: "No class found for this faculty and subject.",
        });
      }

      const class_id = facultySubjectData.class_id;

      // Step 2: Get all defaulter students for that class
      const { data: defaulterStudents, error: defaulterError } = await supabase
        .from("students")
        .select("id")
        .eq("class_id", class_id)
        .eq("defaulter", true);

      if (defaulterError) throw defaulterError;

      if (!defaulterStudents?.length) {
        return res.status(200).json({
          success: true,
          message: "No defaulter students found for this class.",
        });
      }

      // Step 3: Insert instruction for all defaulter students
      const insertPayload = defaulterStudents.map((s) => ({
        student_id: s.id,
        subject_id,
        faculty_id,
        submission_text: skip
          ? "Skipped by faculty"
          : instruction_text || "No instructions provided.",
        reference_link: reference_link || null,
        created_at: new Date(),
        skip: !!skip,
      }));

      const { error: insertError } = await supabase
        .from("defaulter_submissions")
        .insert(insertPayload);

      if (insertError) throw insertError;

      return res.status(201).json({
        success: true,
        message: skip
          ? "Marked as skipped for all defaulter students."
          : "Defaulter work assigned successfully.",
        total_assigned: insertPayload.length,
      });
    } catch (err) {
      console.error("Error assigning defaulter work:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);





export default router;
