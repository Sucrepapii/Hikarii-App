export const debugEnv = () => {
  const dbUrl = process.env.DATABASE_URL;
  console.log("--- DEBUG ENV START ---");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  if (!dbUrl) {
    console.error("❌ DATABASE_URL is undefined or empty!");
  } else {
    // Mask the password for security
    const masked = dbUrl.replace(/:([^:@]+)@/, ":****@");
    console.log("✅ DATABASE_URL found:", masked);
    try {
      const url = new URL(dbUrl);
      console.log("Protocol:", url.protocol); // Should be postgresql:
    } catch (e) {
      console.error("❌ DATABASE_URL is not a valid URL format");
    }
  }
  console.log("--- DEBUG ENV END ---");
};

debugEnv();
