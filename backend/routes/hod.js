import express from "express";
import { supabase } from '../db/supabaseClient.js'
import { authenticateUser, authorizeRoles  } from "../middlewares/auth.js";

const router = express.Router();

// Get all classes for HOD's department
router.get("/classes", authenticateUser, authorizeRoles("hod"), async (req, res) => {
  try {
    const department_id = req.user.department_id;

    if (!department_id) {
      return res.status(403).json({
        success: false,
        error: "Department ID missing in token.",
      });
    }

    const { data: classes, error } = await supabase
      .from("classes")
      .select(`
        id,
        name,
        year,
        total_students,
        created_at,
        class_teacher:class_teacher_id (
          id,
          name
        )
      `)
      .eq("department_id", department_id)
      .order("year", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    const formatted = classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      year: cls.year,
      total_students: cls.total_students || 0,
      teacher: cls.class_teacher?.name || 'Not Assigned',
      teacher_id: cls.class_teacher?.id || null,
      created_at: cls.created_at
    }));

    res.json({ success: true, classes: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all faculties in HOD's department
router.get("/faculties", authenticateUser, authorizeRoles("hod"), async (req, res) => {
  try {
    const department_id = req.user.department_id;

    if (!department_id) {
      return res.status(403).json({
        success: false,
        error: "Department ID missing in token.",
      });
    }

    const { data: faculties, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .eq("department_id", department_id)
      .in("role", ["class_teacher", "faculty", "hod"])
      .order("name", { ascending: true });

    if (error) throw error;

    res.json({ success: true, faculties });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get available class teachers for HOD's department
router.get("/class-teachers", authenticateUser, authorizeRoles("hod"), async (req, res) => {
  try {
    const department_id = req.user.department_id;

    if (!department_id) {
      return res.status(403).json({
        success: false,
        error: "Department ID missing in token.",
      });
    }

    // Fetch all users with role 'class_teacher' or 'faculty'
    // Filter by department_id OR users without department_id (available to assign)
    const { data: teachers, error } = await supabase
      .from("users")
      .select("id, name, email, role, department_id")
      .in("role", ["class_teacher", "faculty"])
      .order("name", { ascending: true });

    if (error) throw error;

    // Filter to show only teachers from same department or unassigned teachers
    const availableTeachers = teachers.filter(teacher => 
      !teacher.department_id || teacher.department_id === department_id
    );

    console.log(`Found ${teachers.length} total teachers, ${availableTeachers.length} available for department ${department_id}`);

    res.json({ success: true, teachers: availableTeachers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/classes", authenticateUser, authorizeRoles("hod"), async (req, res) => {
  try {
    const { name, class_teacher_id, year } = req.body;

    if (!name || !class_teacher_id || !year) {
      return res.status(400).json({
        success: false,
        error: "Name, year, and class_teacher_id are required",
      });
    }

    // Get HOD's department_id
    const { data: hodData, error: hodError } = await supabase
      .from("users")
      .select("department_id")
      .eq("id", req.user.id)
      .single();

    if (hodError || !hodData)
      return res
        .status(400)
        .json({ success: false, error: "HOD department not found" });

    const department_id = hodData.department_id;

    // ✅ Check if a class with same name & year already has a class teacher
    const { data: existingClass, error: classError } = await supabase
      .from("classes")
      .select("id, class_teacher_id")
      .eq("name", name)
      .eq("year", year)
      .eq("department_id", department_id)
      .single();

    if (existingClass && existingClass.class_teacher_id) {
      return res.status(400).json({
        success: false,
        error: "A class teacher is already assigned to this class.",
      });
    }

    // Update class teacher's department_id
    const { error: updateTeacherError } = await supabase
      .from("users")
      .update({ department_id: department_id })
      .eq("id", class_teacher_id);

    if (updateTeacherError) {
      console.error("Error updating teacher's department:", updateTeacherError);
      // Continue anyway, don't fail the class creation
    }

    // Insert class
    const { data, error } = await supabase
      .from("classes")
      .insert([
        {
          name,
          department_id,
          class_teacher_id,
          year,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update class
router.put("/classes/:id", authenticateUser, authorizeRoles("hod"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, class_teacher_id, year } = req.body;
    const department_id = req.user.department_id;

    if (!department_id) {
      return res.status(403).json({
        success: false,
        error: "Department ID missing in token.",
      });
    }

    if (!name || !class_teacher_id || !year) {
      return res.status(400).json({
        success: false,
        error: "Name, year, and class_teacher_id are required",
      });
    }

    // Verify the class belongs to HOD's department
    const { data: existingClass, error: checkError } = await supabase
      .from("classes")
      .select("id")
      .eq("id", id)
      .eq("department_id", department_id)
      .single();

    if (checkError || !existingClass) {
      return res.status(404).json({
        success: false,
        error: "Class not found or access denied",
      });
    }

    // Update class teacher's department_id
    const { error: updateTeacherError } = await supabase
      .from("users")
      .update({ department_id: department_id })
      .eq("id", class_teacher_id);

    if (updateTeacherError) {
      console.error("Error updating teacher's department:", updateTeacherError);
      // Continue anyway, don't fail the class update
    }

    // Update the class
    const { data, error } = await supabase
      .from("classes")
      .update({
        name,
        class_teacher_id,
        year,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: "Class updated successfully",
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete class
router.delete("/classes/:id", authenticateUser, authorizeRoles("hod"), async (req, res) => {
  try {
    const { id } = req.params;
    const department_id = req.user.department_id;

    if (!department_id) {
      return res.status(403).json({
        success: false,
        error: "Department ID missing in token.",
      });
    }

    // Verify the class belongs to HOD's department
    const { data: existingClass, error: checkError } = await supabase
      .from("classes")
      .select("id")
      .eq("id", id)
      .eq("department_id", department_id)
      .single();

    if (checkError || !existingClass) {
      return res.status(404).json({
        success: false,
        error: "Class not found or access denied",
      });
    }

    // Delete the class
    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all offered subjects for HOD's department
router.get("/offered-subjects", authenticateUser, authorizeRoles("hod"), async (req, res) => {
  try {
    const department_id = req.user.department_id;

    if (!department_id) {
      return res.status(403).json({
        success: false,
        error: "Department ID missing in token.",
      });
    }

    const { data: subjects, error } = await supabase
      .from("department_offered_subjects")
      .select(`
        id,
        semester,
        year,
        faculty_ids,
        created_at,
        subject:subject_id (
          id,
          name,
          subject_code,
          type
        )
      `)
      .eq("department_id", department_id)
      .order("year", { ascending: true })
      .order("semester", { ascending: true });

    if (error) throw error;

    // Fetch faculty names for each subject
    const formattedSubjects = await Promise.all(
      subjects.map(async (sub) => {
        const facultyNames = [];
        if (sub.faculty_ids && sub.faculty_ids.length > 0) {
          const { data: faculties } = await supabase
            .from("users")
            .select("id, name")
            .in("id", sub.faculty_ids);
          
          if (faculties) {
            facultyNames.push(...faculties.map(f => f.name));
          }
        }

        return {
          id: sub.id,
          subject_code: sub.subject?.subject_code || 'N/A',
          subject_name: sub.subject?.name || 'N/A',
          type: sub.subject?.type || 'N/A',
          faculties: facultyNames,
          semester: sub.semester,
          year: sub.year,
          created_at: sub.created_at
        };
      })
    );

    res.json({ success: true, subjects: formattedSubjects });
  } catch (err) {
    console.error('Error fetching offered subjects:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete offered subject
router.delete("/offered-subjects/:id", authenticateUser, authorizeRoles("hod"), async (req, res) => {
  try {
    const { id } = req.params;
    const department_id = req.user.department_id;

    if (!department_id) {
      return res.status(403).json({
        success: false,
        error: "Department ID missing in token.",
      });
    }

    // Verify the subject belongs to HOD's department
    const { data: existingSubject, error: checkError } = await supabase
      .from("department_offered_subjects")
      .select("id, subject_id")
      .eq("id", id)
      .eq("department_id", department_id)
      .single();

    if (checkError || !existingSubject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found or access denied",
      });
    }

    // Delete from department_offered_subjects
    const { error: deleteError } = await supabase
      .from("department_offered_subjects")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    res.json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/add-offered-subject", authenticateUser, authorizeRoles("hod"),
  async (req, res) => {
    try {
      const { name, subject_code, type, faculty_ids, semester, year } = req.body;
      const department_id = req.user.department_id;

      if (!department_id) {
        return res.status(403).json({
          success: false,
          error: "Department ID missing in token.",
        });
      }

      if (!name || !type || !faculty_ids?.length) {
        return res.status(400).json({
          success: false,
          error: "Name, type, and faculty_ids (array) are required.",
        });
      }

      // ✅ Step 1: Prevent duplicate subject entry
      const { data: existingSubject, error: subjectCheckError } = await supabase
        .from("subjects")
        .select("id")
        .eq("subject_code", subject_code)
        .eq("department_id", department_id)
        .maybeSingle();

      if (subjectCheckError) throw subjectCheckError;

      if (existingSubject) {
        return res.status(400).json({
          success: false,
          error: "A subject with this code already exists in your department.",
        });
      }

      // ✅ Step 2: Insert into subjects
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .insert([
          {
            name,
            subject_code,
            type,
            department_id,
            class_id: null,
          },
        ])
        .select()
        .single();

      if (subjectError) throw subjectError;

      const subject_id = subjectData.id;

      // ✅ Step 3: Prevent duplicate department offered subject
      const { data: existingDeptSub, error: deptSubCheckError } = await supabase
        .from("department_offered_subjects")
        .select("id")
        .eq("subject_id", subject_id)
        .eq("department_id", department_id)
        .eq("semester", semester)
        .eq("year", year)
        .maybeSingle();

      if (deptSubCheckError) throw deptSubCheckError;

      if (existingDeptSub) {
        return res.status(400).json({
          success: false,
          error: "This subject is already offered by your department for this semester/year.",
        });
      }

      // ✅ Step 4: Insert into department_offered_subjects
      const { data: deptSubjectData, error: deptInsertError } = await supabase
        .from("department_offered_subjects")
        .insert([
          {
            subject_id,
            department_id,
            faculty_ids,
            semester,
            year,
          },
        ])
        .select()
        .single();

      if (deptInsertError) throw deptInsertError;

      // ✅ Step 5: Avoid duplicate faculty-subject mapping
      const facultyMappings = [];
      for (const faculty_id of faculty_ids) {
        const { data: existingMap } = await supabase
          .from("faculty_subjects")
          .select("id")
          .eq("faculty_id", faculty_id)
          .eq("subject_id", subject_id)
          .maybeSingle();

        if (!existingMap) {
          facultyMappings.push({
            faculty_id,
            subject_id,
            class_id: null,
            batch_id: null,
          });
        }
      }

      if (facultyMappings.length > 0) {
        const { error: facultyMapError } = await supabase
          .from("faculty_subjects")
          .insert(facultyMappings);
        if (facultyMapError) throw facultyMapError;
      }

      return res.status(201).json({
        success: true,
        message: `${type} subject "${name}" added successfully with ${facultyMappings.length} faculty assigned.`,
        data: {
          subject: subjectData,
          department_offered_subject: deptSubjectData,
          faculty_subjects: facultyMappings,
        },
      });
    } catch (err) {
      console.error("Error adding offered subject:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);


export default router;
