import { Connection } from "./connection/Connection";

var connection = new Connection();

connection.connect("localhost", "root", 3306, "root", "database");

console.log(connection.isConnected());
