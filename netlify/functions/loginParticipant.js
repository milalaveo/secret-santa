require("dotenv").config();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, password } = body;

    if (!name || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Name and password are required" }),
      };
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("secret_santa");
    const participants = db.collection("participants");

    const user = await participants.findOne({ name });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid password" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Login successful", user }),
    };
  } catch (error) {
    console.error("Error in loginParticipant:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", error: error.message }),
    };
  }
};