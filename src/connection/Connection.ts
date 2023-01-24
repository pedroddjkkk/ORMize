import * as mysql from "mysql";

interface DbConnection extends mysql.Connection {}

export class Connection {
  private sqlconnection: DbConnection | undefined;

  public connect(
    host: string,
    user: string,
    port: number,
    password: string,
    database: string
  ): DbConnection {
    if (!this.sqlconnection) {
      this.sqlconnection = mysql.createConnection({
        host: host,
        user: user,
        port: port,
        password: password,
        database: database,
      });
    }
    return this.sqlconnection;
  }

  public Connection(
    host: string,
    user: string,
    port: number,
    password: string,
    database: string
  ) {
    this.connect(host, user, port, password, database);
  }

}