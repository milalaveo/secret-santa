require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  try {
    const token = event.headers.authorization?.split(" ")[1];

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Authorization token missing." }),
      };
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid token." }),
      };
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db("secret_santa");
    const user = await db
      .collection("participants")
      .findOne({ _id: new ObjectId(decoded.id) });

    await client.close();

    if (!user) {
      return {
        statusCode: 404,
      };
    }

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ user }),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: "Failed to fetch users",
        error: error.message,
      }),
    };
  }
};
