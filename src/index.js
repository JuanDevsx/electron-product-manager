const {app, BrowserWindow} = require ('electron');
const  url = require('url');
const path = require('path');
const { Menu, ipcMain } = require('electron/main');
// const createDatabase = require('./database/database')
const{
    createDatabase,
    createCategory,
    getCategories
} = require('./database/database')

// if (!app.isPackaged){
//     require('electron-reload')(__dirname,{
//         electron: path.join(__dirname,'..node_modules','bin','electron')
//         });
// }
console.log('NODE_ENV =', process.env.NODE_ENV);
if(process.env.NODE_ENV !== 'production'){
    require ('electron-reload')(__dirname,{
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')

    })
}

let mainWindow;
let newProductWindow;
let newCategoryWindow;
let db;
app.on('ready', () => {
   db = createDatabase();
   console.log(getCategories());
   mainWindow = new BrowserWindow({
    webPreferences:{
        
        nodeIntegration: true,
        contextIsolation:false
    }
   })
   mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
   }))
   const mainMenu = Menu.buildFromTemplate(TemplateMenu)
   Menu.setApplicationMenu(mainMenu)

   mainWindow.on('closed', () => {
    app.quit();
   })
});
    function createNewCategory(){
        newCategoryWindow = new BrowserWindow({
            width:400,
            height:300,
            title:'Add a new category',
            webPreferences:{
                nodeIntegration:true,
                contextIsolation:false
            }
        });
        newCategoryWindow.loadURL(url.format({
            pathname: path.join(__dirname,'views/new-category.html'),
            protocol:'file',
            slashes:true
        }))
        newCategoryWindow.on('closed',()=>{
            newCategoryWindow= null;
        });
    }

   function createNewProductWindow(){
    newProductWindow = new BrowserWindow({
            width: 400,
            height: 330,
            title: 'Add a new product',
            webPreferences:{
                nodeIntegration:true,
                contextIsolation:false
            }
        });
    // newProductWindow.setMenu(null);
    newProductWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'views/new-product.html'),
                protocol: 'file',
                slashes: true
    }))
    newProductWindow.on('closed', ()=>{
         newProductWindow = null;
    });

   }

ipcMain.on('product:new',(e, newProduct)=>{
    mainWindow.webContents.send('product:new', newProduct)
    newProductWindow.close();
});
ipcMain.handle('categories:get-all',()=>{
    return getCategories();
})
ipcMain.on('product:new',(e, newProduct)=>{
    mainWindow.webContents.send(
        'product:new',
        newProduct
    );
    newProductWindow.close();
});

ipcMain.on(
    'category:open-window',
    ()=>{
        createNewCategory();
    }
);
ipcMain.on(
    'category:new',
    (e, name)=>{
        createCategory(name);
        console.log(getCategories);

        newCategoryWindow.close();
    }
);

const TemplateMenu = [
    {
        label:'file',
        submenu:[
            {
                label: 'New Product',
                accelerator:'Ctrl+N',
                click(){
                    createNewProductWindow();
                }
            },
                    {
                label:'Remove All Products',
                click(){
                    mainWindow.webContents.send("products:remove-all")
                }
            },
            {
                label:'Exit',
                accelerator: process.platform == 'darwin'?'command+q':'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]

    },
    
];
if(process.platform === 'darwin'){
    TemplateMenu.unshift({
        label: app.getName()
    });
}

if (process.env.NODE_ENV !== 'production'){
    TemplateMenu.push({
        label: 'DevTools',
        submenu:[
            {
                label: 'Show/Hide DevTools',
                acelerator:"Ctrl+D",
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },{
               role:'reload' 
            }
        ]
    })
} 
    