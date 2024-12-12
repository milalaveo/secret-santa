require("dotenv").config();
const { MongoClient } = require("mongodb");

exports.handler = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db("secret_santa");
    const users = await db.collection("participants").find().toArray();

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ users }),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch users", error: error.message }),
    };
  }
};
