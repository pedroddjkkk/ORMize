import * as mysql from "mysql2/promise";

export interface DbConnection extends mysql.Pool {}

export interface ConnectionProps {
  host: string;
  user: string;
  port: number;
  database: string;
  password?: string;
}

export class Connection {
  private sqlconnection?: DbConnection;

  public connect({host, user, port, database, password} : ConnectionProps): DbConnection {
    const connection = mysql.createPool({
      host,
      user,
      port,
      database,
      password,
    });
    this.setCurrentConnection(connection.pool.promise());
    return connection.pool.promise();
  }

  constructor({ host, user, port, database }: ConnectionProps) {
    this.connect({host, user, port, database});
  }

  public getConnection(): DbConnection {
    return this.sqlconnection as DbConnection;
  }

  protected setCurrentConnection(connection: DbConnection): void {
    this.sqlconnection = connection;
  }

  public async isConnected(): Promise<boolean> {
    const test = await this.sqlconnection?.query("SELECT 1");
    return test ? true : false;
  }

  public closeConnection(): void {
    if (this.sqlconnection) {
      this.sqlconnection.end();
    }
  }
}
