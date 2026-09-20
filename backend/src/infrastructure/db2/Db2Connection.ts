const ibmdb = require('ibm_db');

export class Db2Connection {
    private static getConnectionString(): string {
        const connStr = process.env.DB2_CONNECTION_STRING;
        if (!connStr || connStr.trim() === '') {
            throw new Error(
                "Variable de entorno DB2_CONNECTION_STRING no configurada. Es requerida para conectar con IBM Db2."
            );
        }
        return connStr;
    }

    static async executeQuery(query: string, params: any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let connStr: string;
            try {
                connStr = this.getConnectionString();
            } catch (err) {
                return reject(err);
            }

            ibmdb.open(connStr, (err: any, conn: any) => {
                if (err) {
                    return reject(err);
                }

                conn.query(query, params, (err: any, data: any) => {
                    if (err) {
                        conn.closeSync();
                        return reject(err);
                    }

                    conn.close((err: any) => {
                        if (err) {
                            console.error("Error closing DB2 connection", err);
                        }
                    });
                    
                    resolve(data);
                });
            });
        });
    }

    static async executeTransaction(queries: { query: string, params: any[] }[]): Promise<void> {
        return new Promise((resolve, reject) => {
            let connStr: string;
            try {
                connStr = this.getConnectionString();
            } catch (err) {
                return reject(err);
            }

            ibmdb.open(connStr, (err: any, conn: any) => {
                if (err) return reject(err);
                
                conn.beginTransaction((err: any) => {
                    if (err) {
                        conn.closeSync();
                        return reject(err);
                    }
                    
                    const runQuery = (index: number) => {
                        if (index >= queries.length) {
                            return conn.commitTransaction((err: any) => {
                                if (err) {
                                    conn.rollbackTransaction(() => {
                                        conn.closeSync();
                                        reject(err);
                                    });
                                } else {
                                    conn.closeSync();
                                    resolve();
                                }
                            });
                        }
                        
                        const q = queries[index];
                        conn.query(q.query, q.params, (err: any) => {
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

    static async executeTransactionWithLogic<T>(callback: (conn: any) => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            let connStr: string;
            try {
                connStr = this.getConnectionString();
            } catch (err) {
                return reject(err);
            }

            ibmdb.open(connStr, (err: any, conn: any) => {
                if (err) return reject(err);
                
                // For SERIALIZABLE isolation level in Db2 we can set it via query
                conn.query("SET CURRENT ISOLATION TO RR", (isoErr: any) => {
                    if (isoErr) {
                        conn.closeSync();
                        return reject(isoErr);
                    }

                    conn.beginTransaction(async (err: any) => {
                        if (err) {
                            conn.closeSync();
                            return reject(err);
                        }

                        try {
                            const result = await callback(conn);
                            
                            conn.commitTransaction((err: any) => {
                                if (err) {
                                    conn.rollbackTransaction(() => {
                                        conn.closeSync();
                                        reject(err);
                                    });
                                } else {
                                    conn.closeSync();
                                    resolve(result);
                                }
                            });
                        } catch (callbackErr) {
                            conn.rollbackTransaction(() => {
                                conn.closeSync();
                                reject(callbackErr);
                            });
                        }
                    });
                });
            });
        });
    }
}
