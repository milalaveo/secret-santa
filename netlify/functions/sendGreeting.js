const { MongoClient } = require("mongodb");
require("dotenv").config();

exports.handler = async (event) => {
  try {
    const { sender, recipient, greeting } = JSON.parse(event.body);

    if (!sender || !recipient || !greeting) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields." }),
      };
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("secret_santa");

    await db.collection("greetings").insertOne({
      sender,
      recipient,
      greeting,
      createdAt: new Date(),
    });

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Greeting sent successfully!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send greeting", error }),
    };
  }
};
