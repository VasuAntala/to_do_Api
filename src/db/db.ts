
import * as mongoDB from "mongodb";

var db:mongoDB.Db;
let connectDB=async function (){
                const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb+srv://vasuantala8283:4dQ6JoPR75MalB5g@cluster0.p1ilxej.mongodb.net/");
                        
                await client.connect();
                    
                  db = client.db('list');
               
            
            
                     console.log(`Successfully connected to database: ${db.databaseName} and collection: `);
             
}
export {connectDB, db}