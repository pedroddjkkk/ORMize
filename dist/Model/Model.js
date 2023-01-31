export class Model {
    static connection;
    static fields;
    static tableName;
    static get(id) {
        return new this();
    }
    static getAll() {
        return [new this()];
    }
    static setup(fields, connection, tableName) {
        this.fields = fields;
        this.connection = connection;
        this.tableName = tableName;
    }
    static async sync() {
        try {
            await this.connection.query(`CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER(6) AUTO_INCREMENT PRIMARY KEY)`);
            const columns = await this.connection.query(`SHOW COLUMNS FROM ${this.tableName}`);
            for (const field in this.fields) {
                columns[0].forEach((column) => {
                    if (column.Field === field) {
                        delete this.fields[field];
                    }
                });
            }
            for (const field in this.fields) {
                const fieldConfig = this.fields[field];
                const type = fieldConfig.type;
                const autoIncrement = fieldConfig.autoIncrement ? "AUTO_INCREMENT" : "";
                const primaryKey = fieldConfig.primaryKey ? "PRIMARY KEY" : "";
                const allowNull = fieldConfig.allowNull ? "NULL" : "NOT NULL";
                await this.connection.query(`ALTER TABLE ${this.tableName} ADD COLUMN ${field} ${type} ${autoIncrement} ${primaryKey} ${allowNull}`);
            }
            return { message: "Sincronização realizada com sucesso", status: 200 };
        }
        catch (error) {
            console.log("Erro na sincronização: " + error);
            return { message: "Erro na sincronização", status: 500 };
        }
    }
}
//# sourceMappingURL=Model.js.map