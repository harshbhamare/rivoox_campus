import express from 'express'
import { supabase } from '../db/supabaseClient.js'
import { authenticateUser, authorizeRoles  } from "../middlewares/auth.js";

const router = express.Router()

router.post(
  "/select-elective",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { subject_id, faculty_id, type } = req.body;
      const student_id = req.user.id; // from token

      if (!subject_id || !faculty_id || !type) {
        return res.status(400).json({
          success: false,
          error: "subject_id, faculty_id, and type are required.",
        });
      }

      if (!["MDM", "OE", "PE"].includes(type)) {
        return res.status(400).json({
          success: false,
          error: "Invalid type. Must be one of: MDM, OE, or PE.",
        });
      }

      // ✅ Step 1: Verify that faculty teaches this subject — this guarantees valid subject_id
      const { data: facultySubject, error: fsError } = await supabase
        .from("faculty_subjects")
        .select("subject_id, faculty_id")
        .eq("subject_id", subject_id)
        .eq("faculty_id", faculty_id)
        .maybeSingle();

      if (fsError || !facultySubject) {
        return res.status(400).json({
          success: false,
          error: "Selected faculty does not teach the given subject.",
        });
      }

      // ✅ Step 2: Check if this student already has a record
      const { data: existing, error: existingError } = await supabase
        .from("student_subject_selection")
        .select("*")
        .eq("student_id", student_id)
        .maybeSingle();

      if (existingError) throw existingError;

      // ✅ Step 3: Prepare proper update payload based on type
      let updateData = {};
      if (type === "MDM") {
        updateData = { mdm_id: subject_id, mdm_faculty_id: faculty_id };
      } else if (type === "OE") {
        updateData = { oe_id: subject_id, oe_faculty_id: faculty_id };
      } else if (type === "PE") {
        updateData = { pe_id: subject_id, pe_faculty_id: faculty_id };
      }

      // ✅ Step 4: Insert or update safely
      if (existing) {
        const { error: updateError } = await supabase
          .from("student_subject_selection")
          .update(updateData)
          .eq("student_id", student_id);
        if (updateError) throw updateError;

        return res.status(200).json({
          success: true,
          message: `${type} subject selection updated successfully.`,
        });
      } else {
        const { error: insertError } = await supabase
          .from("student_subject_selection")
          .insert([{ student_id, ...updateData }]);
        if (insertError) throw insertError;

        return res.status(201).json({
          success: true,
          message: `${type} subject selected successfully.`,
        });
      }
    } catch (err) {
      console.error("❌ Error selecting elective:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);





export default router;