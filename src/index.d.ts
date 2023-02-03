declare module "ormize" {
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

    public connect({
      host,
      user,
      port,
      database,
    }: ConnectionProps): DbConnection;

    constructor({ host, user, port, database }: ConnectionProps);

    public getConnection(): DbConnection;

    protected setCurrentConnection(connection: DbConnection): void;

    public async isConnected(): Promise<boolean>;

    public closeConnection(): void;
  }

  interface ModelFields {
    [key: string]: {
      type: string;
      autoIncrement?: boolean;
      primaryKey?: boolean;
      allowNull?: boolean;
    };
  }
  
  export interface SelectArguments {
    where?: object;
    limit?: number;
  }

  export class Model {
    protected static connection: DbConnection;
    protected static fields: ModelFields;
    protected static tableName: string;

    /**
     * Recupera um registro a partir de seu id
     * @param id Id do registro
     * @returns Instância da classe com o registro
     */
    public static get<T extends Model>(this: { new (): T }, id: string): T;

    /**
     * Recupera todos os registros da tabela
     * @returns Array de instâncias da classe
     */
    public static getAll(
      selectArguments: SelectArguments = {}
    ): Promise<
      [
        (
          | RowDataPacket[]
          | RowDataPacket[][]
          | OkPacket
          | OkPacket[]
          | ResultSetHeader
        ),
        FieldPacket[]
      ]
    >;

    /**
     * Configura a conexão com o banco de dados, os campos da tabela e o nome da tabela
     * @param fields Campos da tabela
     * @param connection Conexão com o banco de dados
     * @param tableName Nome da tabela
     */
    public static setup(
      fields: ModelFields,
      connection: DbConnection,
      tableName: string
    ): void;

    /**
     * Sincroniza as alterações realizadas no model com o banco de dados
     * @returns Resultado da operação de sincronização
     */
    public static async sync(): Promise<Object>;
  }
}
