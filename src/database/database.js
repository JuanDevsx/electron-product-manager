const Database = require('better-sqlite3');
const path = require('path');
const{ app } = require('electron');
let db;
function createDatabase(){
    const dbPath = path.join(
        app.getPath('userData'),
        'products.db'
    );

    db = new Database(dbPath)
    db.exec(`
    CREATE TABLE IF NOT EXISTS categories(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS products(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        category_id INTEGER,

            FOREIGN KEY(category_id)
                REFERENCES categories(id)
    );

`);
return db;
}

function createCategory(name){
    db.prepare(`
        INSERT INTO categories(name)
        VALUES(?)
        `).run(name);
    return{
        success:true,
        code:"CATEGORY_CREATED"
    }    
}
function getCategories(){
    return db.prepare(`
        SELECT *
        FROM categories
        ORDER BY name
        `).all();
}
function createProduct(name,description,price,stock,category_id){
    db.prepare(`
        INSERT INTO products(name,description,price,stock,category_id)
        VALUES(?,?,?,?,?)
        `).run(name,description,price,stock,category_id);
        return{
            success:true,
            code:"PRODUCT_CREATED"
        }
}
function getProducts(){
    return db.prepare(`
        SELECT *
        FROM products
        ORDER BY id `).all();
}
function deleteProduct(id){
    const sql=`
    DELETE FROM products
    WHERE id = ?;
    `;
    db.prepare(sql).run(id);
    return{
        success:true,
        code:"PRODUCT_DELETED"
    }
}

function CategoryHasProducts(category_id){
    const sql =`
    SELECT *
    FROM products
    WHERE category_id =?
    LIMIT 1;
    `;

    const result = db.prepare(sql).get(category_id);

    return result !== undefined;
}

function deleteCategory(id){
    
    if(CategoryHasProducts(id)){
        return{
            success: false,
            code: "CATEGORY_IN_USE",
            };    
    }
    
    const sql=`
    DELETE FROM categories
    WHERE id = ?
    `;
     db.prepare(sql).run(id);

     return{
        success:true,
        code:'CATEGORY_DELETED'
     };
}



module.exports ={
    createDatabase,
    createCategory,
    getCategories,
    createProduct,
    deleteProduct,
    deleteCategory,
    getProducts
};