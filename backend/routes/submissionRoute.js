import express from 'express'
import { supabase } from '../db/supabaseClient.js'
import { authenticateUser, authorizeRoles  } from "../middlewares/auth.js";

const router = express.Router()


router.post(
  "/mark-submission",
  authenticateUser,
  authorizeRoles("faculty", "class_teacher", "hod"),
  async (req, res) => {
    try {
      const { student_id, subject_id, submission_type, status } = req.body;
      const marked_by = req.user.id;

      // 🧩 1️⃣ Basic validation
      if (!student_id || !subject_id || !submission_type || !status) {
        return res.status(400).json({
          success: false,
          error: "student_id, subject_id, submission_type, and status are required.",
        });
      }

      if (!["pending", "completed"].includes(status.toLowerCase())) {
        return res.status(400).json({
          success: false,
          error: "Status must be 'pending' or 'completed'.",
        });
      }

      // 🧩 2️⃣ Verify faculty can actually mark this subject
      const { data: allowedSubject, error: allowedError } = await supabase
        .from("faculty_subjects")
        .select("id")
        .eq("faculty_id", marked_by)
        .eq("subject_id", subject_id)
        .maybeSingle();

      if (allowedError) throw allowedError;
      if (!allowedSubject) {
        return res.status(403).json({
          success: false,
          error: "You are not authorized to mark submissions for this subject.",
        });
      }

      // 🧩 3️⃣ Validate student belongs to same class/batch as faculty
      // (Optional strictness)
      // const { data: studentData } = await supabase
      //   .from("students")
      //   .select("class_id, batch_id")
      //   .eq("id", student_id)
      //   .single();

      // TODO: add logic if you want to ensure class alignment for batch-based subjects

      // 🧩 4️⃣ Fetch submission type ID
      const { data: subType, error: subTypeErr } = await supabase
        .from("submission_types")
        .select("id")
        .eq("name", submission_type)
        .maybeSingle();

      if (subTypeErr) throw subTypeErr;
      if (!subType) {
        return res.status(400).json({
          success: false,
          error: `Invalid submission_type: ${submission_type}.`,
        });
      }

      const submission_type_id = subType.id;

      // 🧩 5️⃣ Check if a record already exists
      const { data: existing, error: existingErr } = await supabase
        .from("student_submissions")
        .select("id")
        .eq("student_id", student_id)
        .eq("subject_id", subject_id)
        .eq("submission_type_id", submission_type_id)
        .maybeSingle();

      if (existingErr) throw existingErr;

      // 🧩 6️⃣ Insert or update accordingly
      if (existing) {
        const { error: updateErr } = await supabase
          .from("student_submissions")
          .update({
            status,
            marked_by,
            marked_at: new Date(),
          })
          .eq("id", existing.id);

        if (updateErr) throw updateErr;

        return res.status(200).json({
          success: true,
          message: `${submission_type} submission updated to ${status} successfully.`,
        });
      } else {
        const { error: insertErr } = await supabase.from("student_submissions").insert([
          {
            student_id,
            subject_id,
            submission_type_id,
            status,
            marked_by,
            marked_at: new Date(),
          },
        ]);

        if (insertErr) throw insertErr;

        return res.status(201).json({
          success: true,
          message: `${submission_type} submission marked as ${status} successfully.`,
        });
      }
    } catch (err) {
      console.error("❌ Error marking submission:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);





export default router;