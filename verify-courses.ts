import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

async function runTest() {
  try {
    // 1. Signup
    console.log("Signing up...");
    try {
      await api.post("/auth/signup", {
        name: "Student Tester",
        email: "student@test.com",
        password: "Password123!",
        isStudent: true,
      });
    } catch (e: any) {
      // Log the actual error to debug if mismatch
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
      email: "student@test.com",
      password: "Password123!",
    });
    const token = loginRes.data.token;
    const isStudent = loginRes.data.user.isStudent;
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
