const {app, BrowserWindow} = require ('electron');
const  url = require('url');
const path = require('path');
const { Menu } = require('electron/main');

if(process.env.NODE_ENV !== 'production'){
    require ('electron-reload')(__dirname,{
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')

    })
}

let mainWindow
let newProductWindow
app.on('ready', () => {
   mainWindow = new BrowserWindow({})
   mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
   }))
   const mainMenu = Menu.buildFromTemplate(TemplateMenu)
   Menu.setApplicationMenu(mainMenu)
});
   function createNewProductWindow(){
    newProductWindow = new BrowserWindow({
            width: 400,
            height: 330,
            title: 'Add a new product'
        });
    newProductWindow.setMenu(null);
    newProductWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'views/new-product.html'),
                protocol: 'file',
                slashes: true
        }))

   }



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
            }
        ]

    }
]