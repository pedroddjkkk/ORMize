import * as mysql from "mysql";

export class Connection {
  private static sqlconnection: mysql.Connection | undefined;

  public static connect(
    host: string,
    user: string,
    port: number,
    password: string,
    database: string
  ): mysql.Connection {
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
}
