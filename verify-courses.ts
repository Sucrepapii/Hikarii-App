import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const api = axios.create({ baseURL: process.env.VITE_API_URL || "http://localhost:5005/api" });

async function runTest() {
  try {
    const testEmail = process.env.TEST_STUDENT_EMAIL || "student_test@hikarii.org";
    const testPassword = process.env.TEST_ADMIN_PASSWORD || process.env.TEST_PASSWORD || `P@ss_${Date.now()}`;

    // 1. Signup
    console.log("Signing up...");
    try {
      await api.post("/auth/signup", {
        name: "Student Tester",
        email: testEmail,
        password: testPassword,
        isStudent: true,
      });
    } catch (e: any) {
      console.log("Signup error:", e.response?.data);
      if (
        e.response?.data?.error === "User already exists with this email" ||
        e.response?.data?.error === "User already exists"
      ) {
        console.log("User already exists, proceeding to login...");
      } else {
        throw e;
      }
    }

    // 2. Login
    console.log("Logging in...");
    const loginRes = await api.post("/auth/login", {
      email: testEmail,
      password: testPassword,
    });
    const token = loginRes.data.token;
    const isStudent = loginRes.data.user?.isStudent;
    console.log("Logged in successfully. isStudent:", isStudent);

    if (!isStudent) {
      throw new Error("User is not flagged as student!");
    }

    // 3. Create Course
    console.log("Creating course...");
    const courseRes = await api.post(
      "/courses",
      {
        name: "Calculus I",
        code: "MATH101",
        color: "#3B82F6",
        location: "Room 304",
        professor: "Dr. Smith",
        schedules: [
          { dayOfWeek: 1, startTime: "09:00", endTime: "10:30" },
          { dayOfWeek: 3, startTime: "09:00", endTime: "10:30" },
        ],
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("Course created:", courseRes.data.name);

    // 4. Fetch Courses
    console.log("Fetching courses...");
    const fetchRes = await api.get("/courses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Courses fetched:", fetchRes.data.length);
    if (fetchRes.data.length > 0 && fetchRes.data[0].schedules.length > 0) {
      console.log("Course has schedules:", fetchRes.data[0].schedules.length);
      console.log("SUCCESS: Academic Planner backend verified.");
    } else {
      throw new Error("Course or schedules missing.");
    }
  } catch (error: any) {
    console.error("Test failed:", error.response?.data || error.message);
    process.exit(1);
  }
}

runTest();
