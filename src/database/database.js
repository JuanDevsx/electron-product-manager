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
    return db.prepare(`
        INSERT INTO categories(name)
        VALUES(?)
        `).run(name);
}
function getCategories(){
    return db.prepare(`
        SELECT *
        FROM categories
        ORDER BY name
        `).all();
}
function createProduct(name,description,price,stock,category_id){
    return db.prepare(`
        INSERT INTO products(name,description,price,stock,category_id)
        VALUES(?,?,?,?,?)
        `).run(name,description,price,stock,category_id);
}
function getProducts(){
    return db.prepare(`
        SELECT *
        FROM products
        ORDER BY id `).all();
}
module.exports ={
    createDatabase,
    createCategory,
    getCategories,
    createProduct,
    getProducts
};