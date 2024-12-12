require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

exports.handler = async (event) => {
  try {
    const { recipientId, senderName } = JSON.parse(event.body);

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("secret_santa");
    const participants = db.collection("participants");

    // Update the recipient's assignedTo field
    await participants.updateOne(
      { _id: new ObjectId(recipientId) },
      { $set: { assignedTo: senderName } }
    );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Recipient status updated successfully!" }),
    };
  } catch (error) {
    console.error("Error updating recipient status:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating recipient status" }),
    };
  }
};
