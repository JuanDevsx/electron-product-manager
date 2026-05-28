const {app, BrowserWindow} = require ('electron');
const  url = require('url');
const path = require('path');
const { Menu, ipcMain } = require('electron/main');

if(process.env.NODE_ENV !== 'production'){
    require ('electron-reload')(__dirname,{
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')

    })
}

let mainWindow
let newProductWindow
app.on('ready', () => {
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
    console.log(newProduct);
})

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
                    
                }
            },
            {
                label:'Exit',
                accelerator: process.plataform == 'darwin'?'command+q':'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]

    },
    
];
if(process.plataform === 'darwin'){
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
    