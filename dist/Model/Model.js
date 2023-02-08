export class Model {
    static connection;
    static fields;
    static tableName;
    static get(id) {
        return new this();
    }
    static find(selectArguments = {}) {
        return new Promise(async (resolve, reject) => {
            const { where = {}, limit } = selectArguments;
            let whereClause = "";
            if (Object.keys(where).length > 0) {
                whereClause =
                    "WHERE " +
                        Object.entries(where)
                            .map(([key, value]) => `${key} = '${value}'`)
                            .join(" AND ");
            }
            const limitClause = limit ? "LIMIT " + limit : "";
            const result = await this.connection.query(`SELECT * FROM ${this.tableName} ${whereClause} ${limitClause}`);
            resolve(result);
        });
    }
    async save() {
        try {
            const fields = Object.keys(Model.fields);
            const values = fields.map((field) => Model.fields[field]);
            const query = `INSERT INTO ${Model.tableName} (${fields.join(",")}) VALUES (${values
                .map((value) => `'${value}'`)
                .join(",")})`;
            console.log(query);
            const result = await Model.connection.query(`INSERT INTO ${Model.tableName} (${fields.join(",")}) VALUES (${values
                .map((value) => `'${value}'`)
                .join(",")})`);
            return { message: "Registro salvo com sucesso", status: 200 };
        }
        catch (error) {
            console.log("Erro ao salvar registro: " + error);
            return { message: "Erro ao salvar registro", status: 500 };
        }
    }
    static setup(fields, connection, tableName) {
        this.fields = fields;
        this.connection = connection;
        this.tableName = tableName;
    }
    static async sync() {
        try {
            await this.connection.query(`CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER(6) AUTO_INCREMENT PRIMARY KEY)`);
            let columns = await this.connection.query(`SHOW COLUMNS FROM ${this.tableName}`);
            let rcolumns = columns[0];
            for (const field in this.fields) {
                const fieldConfig = this.fields[field];
                let exists = false;
                for (let i = 0; i < rcolumns.length; i++) {
                    const column = rcolumns[i];
                    if (!(column.Field in this.fields)) {
                        await this.connection.query(`ALTER TABLE ${this.tableName} DROP COLUMN ${column.Field}`);
                    }
                    if (column.Field === field) {
                        exists = true;
                        if (column.Type !== fieldConfig.type ||
                            column.Null !== (fieldConfig.allowNull ? "YES" : "NO")) {
                            await this.connection.query(`ALTER TABLE ${this.tableName} MODIFY COLUMN ${field} ${fieldConfig.type} ${fieldConfig.allowNull ? "NULL" : "NOT NULL"}`);
                        }
                        if (column.Extra !==
                            (fieldConfig.autoIncrement ? "auto_increment" : "")) {
                            await this.connection.query(`ALTER TABLE ${this.tableName} MODIFY COLUMN ${field} ${fieldConfig.type} ${fieldConfig.allowNull ? "NULL" : "NOT NULL"} ${fieldConfig.autoIncrement ? "AUTO_INCREMENT" : ""}`);
                        }
                        break;
                    }
                }
                if (!exists) {
                    const autoIncrement = fieldConfig.autoIncrement
                        ? "AUTO_INCREMENT"
                        : "";
                    const primaryKey = fieldConfig.primaryKey ? "PRIMARY KEY" : "";
                    const allowNull = fieldConfig.allowNull ? "NULL" : "NOT NULL";
                    await this.connection.query(`ALTER TABLE ${this.tableName} ADD COLUMN ${field} ${fieldConfig.type} ${autoIncrement} ${primaryKey} ${allowNull}`);
                }
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