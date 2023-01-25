import { Connection } from "./connection/Connection.js";

const connection = new Connection();

async function test() {
  await connection.connect("127.0.0.1", "root", 3306, "fazenda")
  console.log(connection.isConnected())
}

test()
