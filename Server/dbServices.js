const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
let instance = null;

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.db,
    db_port : process.env.db_port,
});

connection.connect((err)=>{
    if(err){
        console.log(err.message);
    }
    else{
        console.log('connected');
    }
})

class Dbservices{
    static createDbInstance(){
        return instance ? instance : new Dbservices();
    }
   async getAllData(){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = 'select * from names;';
                connection.query(query, (error,results)=>{
                    if(error) reject(new Error(error.message));
                    resolve(results);
                })
                
            });
            // console.log(response);
            return response;
        }catch(err){
            console.log(err);
        }
    }
    async insertData(name){
        try{
            const dateAdded = new Date();
            const insertId = await new Promise((resolve,reject)=>{
                const query = 'insert into names (name,dateAdded) values (?,?);';
                connection.query(query, [name , dateAdded],(error,result)=>{
                    if(error) reject(new Error(error.message));
                    resolve(result.insertId);
                })
                
            });
            // console.log(insertId);
             return {
                id : insertId,
                name: name,
                dateAdded: dateAdded
            };
        }catch(err){
            console.log(err);
        }
    }    

    async deleteElement(id){
        try{
            id = parseInt(id,10);
            const response = await new Promise((resolve,reject)=>{
                const query = 'delete from names where id = ?;';
                connection.query(query, [id], (error,result)=>{
                    if(error) reject(new Error(error.message));
                    resolve(result.affectedRows);
                })
                
            });
            // console.log(response);
            return response === 1 ? true : false;

        }catch(err){
            console.log(err);
            return false;
        }
    }
    async updateName(id,name){
        try{
            id = parseInt(id,10);
            const response = await new Promise((resolve,reject)=>{
                const query = 'update names set name = ? where id = ?;';
                connection.query(query, [name,id], (error,result)=>{
                    if(error) reject(new Error(error.message));
                    resolve(result.affectedRows);
                })
                
            });
            // console.log(response);
            return response === 1 ? true : false;

        }catch(err){
            console.log(err);
            return false;
        }
    }
    async searchName(name){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = 'select * from names where name = ?;';
                connection.query(query, [name], (error,result)=>{
                    if(error) reject(new Error(error.message));
                    resolve(result);
                })
                
            });
            return response;

        }catch(err){
            console.log(err);
            return false;
        }
    }

}

module.exports = Dbservices;