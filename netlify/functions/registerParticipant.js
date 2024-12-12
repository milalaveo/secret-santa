require("dotenv").config();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

exports.handler = async (event) => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db("secret_santa");
    const participants = db.collection("participants");

    const { name, password } = JSON.parse(event.body);

    if (!name || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Name and password are required." }),
      };
    }

    const existingUser = await participants.findOne({ name });
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Participant already exists." }),
      };
    }

    // Хеширование пароля
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const participant = { 
      name, 
      password: hashedPassword,
      createdAt: new Date() 
    };

    await participants.insertOne(participant);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Participant registered successfully!" }),
    };
  } catch (error) {
    console.error("Error registering participant:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error registering participant." }),
    };
  }
};