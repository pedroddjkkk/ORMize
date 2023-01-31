declare module 'ormize' {
  import * as mysql from "mysql2/promise";

  export interface DbConnection extends mysql.Pool {}

  export interface ConnectionProps {
    host: string;
    user: string;
    port: number;
    database: string;
  }

  export class Connection {
    private sqlconnection?: DbConnection;

    public connect({host, user, port, database} : ConnectionProps): DbConnection;

    constructor({ host, user, port, database }: ConnectionProps);

    public getConnection(): DbConnection;

    protected setCurrentConnection(connection: DbConnection): void;

    public async isConnected(): Promise<boolean>;

    public closeConnection(): void;
  }
}