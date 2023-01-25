import { Connection } from "./connection/Connection.js";

const connection = new Connection();

connection.connect("127.0.0.1", "root", 3306, "fazenda");

async function test() {
  connection.getConnection()?.connect()
  console.log(connection.isConnected())
}

test()
