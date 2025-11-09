import express from "express";
import { supabase } from '../db/supabaseClient.js';
import { authenticateUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Get subjects assigned to the faculty
router.get('/subjects', authenticateUser, authorizeRoles("faculty"), async (req, res) => {
  try {
    const facultyId = req.user.id;

    // Fetch subjects assigned to this faculty from faculty_subjects table
    const { data: facultySubjects, error } = await supabase
      .from('faculty_subjects')
      .select(`
        subject_id,
        subjects (
          id,
          name,
          subject_code,
          type
        )
      `)
      .eq('faculty_id', facultyId);

    if (error) throw error;

    // Extract unique subjects
    const uniqueSubjects = [];
    const subjectIds = new Set();

    (facultySubjects || []).forEach(fs => {
      if (fs.subjects && !subjectIds.has(fs.subjects.id)) {
        subjectIds.add(fs.subjects.id);
        uniqueSubjects.push({
          id: fs.subjects.id,
          name: fs.subjects.name,
          code: fs.subjects.subject_code,
          type: fs.subjects.type
        });
      }
    });

    return res.json({ success: true, subjects: uniqueSubjects });
  } catch (err) {
    console.error('Error fetching faculty subjects:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get students for subjects assigned to the faculty
router.get('/students', authenticateUser, authorizeRoles("faculty"), async (req, res) => {
  try {
    const facultyId = req.user.id;

    // First, get all subject-batch assignments for this faculty
    const { data: assignments, error: assignError } = await supabase
      .from('faculty_subjects')
      .select(`
        subject_id,
        batch_id,
        class_id,
        subjects (
          id,
          name,
          subject_code,
          type
        )
      `)
      .eq('faculty_id', facultyId);

    if (assignError) throw assignError;

    if (!assignments || assignments.length === 0) {
      return res.json({ success: true, students: [] });
    }

    // Get all students from the classes where faculty teaches
    const classIds = [...new Set(assignments.map(a => a.class_id).filter(Boolean))];
    
    if (classIds.length === 0) {
      return res.json({ success: true, students: [] });
    }

    const { data: allStudents, error: studentsError } = await supabase
      .from('students')
      .select(`
        id,
        roll_no,
        name,
        email,
        mobile,
        attendance_percent,
        hall_ticket_number,
        defaulter,
        class_id,
        batch_id,
        created_at,
        batches ( name )
      `)
      .in('class_id', classIds)
      .order('roll_no', { ascending: true });

    if (studentsError) throw studentsError;

    // Map students to their subjects based on assignments
    const studentsWithSubjects = [];

    (allStudents || []).forEach(student => {
      // Find all subject assignments for this student
      assignments.forEach(assignment => {
        // Check if this assignment applies to this student
        const isApplicable = 
          assignment.class_id === student.class_id &&
          (assignment.batch_id === null || assignment.batch_id === student.batch_id);

        if (isApplicable && assignment.subjects) {
          studentsWithSubjects.push({
            ...student,
            batch_name: student.batches?.name || null,
            subject_id: assignment.subjects.id,
            subject_name: assignment.subjects.name,
            subject_code: assignment.subjects.subject_code,
            subject_type: assignment.subjects.type
          });
        }
      });
    });

    return res.json({ success: true, students: studentsWithSubjects });
  } catch (err) {
    console.error('Error fetching faculty students:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
