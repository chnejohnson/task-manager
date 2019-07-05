import mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) return console.log("Unable to connect mongoDB server.");

    const db = client.db(databaseName);

    db.collection("users").insertOne({
      name: "Johnson",
      age: 22
    });
  }
);
