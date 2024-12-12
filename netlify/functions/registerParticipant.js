require("dotenv").config();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    // Генерация ключевых слов
    const keywords = ["joy", "holiday", "gift", "smile", "cheer"];

    const participant = {
      name,
      password: hashedPassword,
      score: 0, // Начальные очки
      keywords, // Ключевые слова для проверки поздравлений
      createdAt: new Date(),
    };

    const result = await participants.insertOne(participant);

    // Создаём JWT токен
    const token = jwt.sign(
      { id: result.insertedId, name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Participant registered successfully!",
        token,
        user: { name, score: 0, keywords },
      }),
    };
  } catch (error) {
    console.error("Error registering participant:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error registering participant." }),
    };
  }
};
