const mariadb = require('mariadb');


async function mariaPoolInit(){
    let params = {
        User: "amc_rds",
        Pass: "adamroth",
        Host: "amcrds.cmnrs8dxq9kf.us-east-1.rds.amazonaws.com",
        Database: "amc_rds"
    }
    const mariaDB = await new MariaDB(params);
    let success = mariaDB.createPool();
    if(success === false){
        return false;
    }
    return mariaDB;
}
module.exports.mariaPoolInit = mariaPoolInit;


class MariaDB{

    constructor (params) {
        this.params = params;
        this.pool = undefined;
    }

    /*
     * create database pool
     */
    async createPool(){
        const pool = mariadb.createPool({
             host: this.params.Host,
             user: this.params.User,
             password: this.params.Pass,
             database: this.params.Database,
             connectionLimit: 5
        });

        let success = true;
        pool.getConnection()
            .then(conn => {
                conn.end(); //release to pool
            })
            .catch(err => {
                success = false;
            });

        if(success){
            this.pool = pool;
        }

        return success;
    }

    /*
     * closes pool and cleans up resources
     */
    closePool(){
        this.pool.release();
    }


    /*
     * get new connection from pool
     */
    async getConn(){
        let self = this;
        return new Promise(async function(resolve) {
            self.pool.getConnection()
                .then(conn => {
                    resolve(conn);
                })
                .catch(err => {
                    resolve(false);
                });
        })
    }

    /*
     * release connection back to pool
     */
    releaseConn(connection){
        connection.end();
    }


    /*
     * sql query
     */
    async query(sqlStmt, sqlParams, dbConn, closeConn){
        if(this.pool === undefined){
            return null;
        }
        // if connection isn't passed as parameter, get connection from pool
        if(dbConn === undefined){
            try {
            	dbConn = await this.pool.getConnection();
                closeConn = true; // automatically close the connection
            } catch (err) {
                console.log(err)
                return false;
            }
        }
        return await query(sqlStmt, sqlParams, dbConn, closeConn);
    }


    /*
     * sql insert
     */
    async insert(sqlStmt, sqlParams, dbConn, closeConn){
        if(this.pool === undefined){
            return null;
        }
        // if connection isn't passed as parameter, get connection from pool
        if(dbConn === undefined){
            try {
            	dbConn = await this.pool.getConnection();
                closeConn = true; // automatically close the connection
            } catch (err) {
                console.log(err)
                return false;
            }
        }
        return await insert(sqlStmt, sqlParams, dbConn, closeConn);
    }
}
module.exports.MariaDB = MariaDB;


async function query(sqlStmt, sqlParams, dbConn, closeConn){
    return new Promise(async function(resolve) {
        let rows;
        try {
            rows = await dbConn.query(sqlStmt, sqlParams);
        } catch (err) {
            console.log(err)
            resolve(false);
        } finally {
            // if we should automatically close the connection
            if (closeConn) {
                dbConn.end();
            }
            resolve(rows);
        }
    })
}
module.exports.query = query;


async function insert(sqlStmt, sqlParams, dbConn, closeConn){
    return new Promise(async function(resolve) {
        let results;
        try {
            results = await dbConn.query(sqlStmt, sqlParams);
        } catch (err) {
            console.log(err)
            resolve(false);
        } finally {
            // if we should automatically close the connection
            if (closeConn) {
                dbConn.end();
            }
            resolve(results);
        }
    })
}
module.exports.insert = insert;
