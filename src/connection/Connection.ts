import * as mysql from "mysql";

export interface DbConnection extends mysql.Connection {}

export class Connection {
  private sqlconnection?: DbConnection;

  public connect(
    host: string,
    user: string,
    port: number,
    database: string
  ): Promise<DbConnection> {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host,
        user,
        port,
        database,
      });

      connection.connect((err) => {
        if (err) {
          reject(err);
        } else {
          this.setCurrentConnection(connection);
          resolve(connection);
        }
      });
    });
  }

  public Connection(
    host: string,
    user: string,
    port: number,
    database: string
  ) {
    this.connect(host, user, port, database);
  }

  public getConnection(): DbConnection | undefined {
    return this.sqlconnection;
  }

  protected setCurrentConnection(connection: DbConnection): void {
    this.sqlconnection = connection;
  }

  public isConnected(): boolean {
    return this.sqlconnection?.state !== "disconnected";
  }

  public closeConnection(): void {
    if (this.sqlconnection) {
      this.sqlconnection.end();
    }
  }
  
}
