import * as mysql from "mysql2/promise";
export class Connection {
    sqlconnection;
    connect({ host, user, port, database, password }) {
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
    constructor({ host, user, port, database, password }) {
        this.connect({ host, user, port, database, password });
    }
    getConnection() {
        return this.sqlconnection;
    }
    setCurrentConnection(connection) {
        this.sqlconnection = connection;
    }
    async isConnected() {
        const test = await this.sqlconnection?.query("SELECT 1");
        return test ? true : false;
    }
    closeConnection() {
        if (this.sqlconnection) {
            this.sqlconnection.end();
        }
    }
}
//# sourceMappingURL=Connection.js.map