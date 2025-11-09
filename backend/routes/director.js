import express from "express";
import { supabase } from '../db/supabaseClient.js'
import { authenticateUser, authorizeRoles  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/departments", authenticateUser, authorizeRoles("director"), async (req, res) => {
  try {
    // Get all departments
    const { data: departments, error: deptError } = await supabase
      .from("departments")
      .select("id, name, created_at")
      .order("id", { ascending: true });

    if (deptError) throw deptError;

    // Get all HODs (users with role 'hod' and their department_id)
    const { data: hods, error: hodError } = await supabase
      .from("users")
      .select("id, name, department_id, role")
      .eq("role", "hod");

    if (hodError) throw hodError;

    // Map departments with their assigned HOD
    const formatted = departments.map((dept) => {
      const assignedHod = hods.find(hod => hod.department_id === dept.id);
      return {
        id: dept.id,
        name: dept.name,
        hod: assignedHod ? assignedHod.name : null,
        hod_id: assignedHod ? assignedHod.id : null,
      };
    });

    res.json({ success: true, departments: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/hods", authenticateUser, authorizeRoles("director"), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role")
      .in("role", ["hod", "faculty"]); // Fetch HODs or faculty

    if (error) throw error;

    res.json({ success: true, hods: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/departments", authenticateUser, authorizeRoles("director"), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: "Department name is required" });
    }

    const { data, error } = await supabase
      .from("departments")
      .insert([{ name }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, department: data });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err.message || "Something went wrong" });
  }
});


router.post("/assign-hod", authenticateUser, authorizeRoles("director"), async (req, res) => {
  try {
    const { user_id, department_id } = req.body;

    if (!user_id || !department_id) {
      return res
        .status(400)
        .json({ success: false, error: "user_id and department_id are required" });
    }

    // Check if department exists
    const { data: dept, error: deptError } = await supabase
      .from("departments")
      .select("id, name")
      .eq("id", department_id)
      .single();

    if (deptError || !dept) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    // Check if user exists
    const { data: user, error: userCheckError } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("id", user_id)
      .single();

    if (userCheckError || !user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Remove department_id from any other user who was HOD of this department
    await supabase
      .from("users")
      .update({ department_id: null })
      .eq("department_id", department_id)
      .eq("role", "hod");

    // Update the selected user's role to 'hod' and assign department_id
    const { data, error } = await supabase
      .from("users")
      .update({ role: "hod", department_id })
      .eq("id", user_id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "HOD assigned successfully",
      data: data,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err.message || "Something went wrong" });
  }
});

router.delete("/departments/:id", authenticateUser, authorizeRoles("director"), async (req, res) => {
  try {
    const { id } = req.params;

    // First, remove department_id from all users in this department
    await supabase
      .from("users")
      .update({ department_id: null })
      .eq("department_id", id);

    // Then delete the department
    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ success: true, message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
