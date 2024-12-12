require("dotenv").config();
const { MongoClient } = require("mongodb");
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

    const recipient = event.queryStringParameters.recipient;
    if (!recipient) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Recipient is required." }),
      };
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("secret_santa");
    const collection = db.collection("messages");

    const messages = await collection.find({ recipient }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({ messages }),
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch messages." }),
    };
  }
};
