"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db2Connection = void 0;
const ibm_db_1 = __importDefault(require("ibm_db"));
class Db2Connection {
    static connectionString = process.env.DB2_CONNECTION_STRING || "DATABASE=testdb;HOSTNAME=localhost;UID=db2inst1;PWD=password;PORT=50000;PROTOCOL=TCPIP";
    static async executeQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            ibm_db_1.default.open(this.connectionString, (err, conn) => {
                if (err) {
                    return reject(err);
                }
                conn.query(query, params, (err, data) => {
                    if (err) {
                        conn.closeSync();
                        return reject(err);
                    }
                    conn.close((err) => {
                        if (err) {
                            console.error("Error closing DB2 connection", err);
                        }
                    });
                    resolve(data);
                });
            });
        });
    }
    // Método para ejecutar transacciones (útil para Reservaciones)
    static async executeTransaction(queries) {
        return new Promise((resolve, reject) => {
            ibm_db_1.default.open(this.connectionString, (err, conn) => {
                if (err)
                    return reject(err);
                conn.beginTransaction((err) => {
                    if (err) {
                        conn.closeSync();
                        return reject(err);
                    }
                    const runQuery = (index) => {
                        if (index >= queries.length) {
                            return conn.commitTransaction((err) => {
                                if (err) {
                                    conn.rollbackTransaction(() => {
                                        conn.closeSync();
                                        reject(err);
                                    });
                                }
                                else {
                                    conn.closeSync();
                                    resolve();
                                }
                            });
                        }
                        const q = queries[index];
                        conn.query(q.query, q.params, (err) => {
                            if (err) {
                                return conn.rollbackTransaction(() => {
                                    conn.closeSync();
                                    reject(err);
                                });
                            }
                            runQuery(index + 1);
                        });
                    };
                    runQuery(0);
                });
            });
        });
    }
}
exports.Db2Connection = Db2Connection;
//# sourceMappingURL=Db2Connection.js.map