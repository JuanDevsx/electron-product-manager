const {app, BrowserWindow } = require ('electron');
const  url = require('url');
const path = require('path');
const { Menu, ipcMain } = require('electron/main');
// const createDatabase = require('./database/database')
const{
    createDatabase,
    createCategory,
    createProduct,
    getCategories,
    getProducts
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
   //Pantalla inicio
mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file',
    slashes:true
}))
const mainMenu = Menu.buildFromTemplate(TemplateMenu)
Menu.setApplicationMenu(mainMenu)
  
});
app.on('ready', ()=>{
     ({
     webPreferences:{
        nodeIntegration: true,
        contextIsolation:false
     }   
    })
});


   
   
ipcMain.handle('categories:get-all',()=>{
    return getCategories();
})

ipcMain.handle('products:get-all',()=>{
    return getProducts();
})

ipcMain.on(
    'category:new',(e, name)=>{
        createCategory(name);
        mainWindow.webContents.send(
            'category:created'
        );
    }
);

const TemplateMenu = [
    {
        label:'file',
        submenu:[
                    {
                label: 'Show/Hide DevTools',
                acelerator:"Ctrl+D",               
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
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
            },
            
            
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
    