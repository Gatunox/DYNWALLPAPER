'use strict';

const {app, Menu, Tray, ipcMain, BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')
const sizeOf = require('image-size');
const AutoLaunch = require('auto-launch');
const wallpaper = require('wallpaper');
const pageIndex = 'index.html';


// var appAutoLauncher = new AutoLaunch({
//   name: 'spotlight-saver',
//   path: app.getPath('exe'),
//   isHidden: true,
// });

// appAutoLauncher.isEnabled()
// .then(function(isEnabled){
//   if(isEnabled){
//       return;
//   }
//   appAutoLauncher.enable();
// })
// .catch(function(err){
//   console.log(err)
// });

  
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let icon;
let pageName;
let tray;

function createWindow () {

  icon = path.join(__dirname, 'assets/icons/icon.png')

  tray = new Tray(icon)
  tray.setTitle('hello world')
  // const tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {role: 'quit', label: 'Quit', type: 'normal'},
    {role: 'minimize', label: 'Minimize', type: 'normal'},
    {role: 'reload', label: 'Show', type: 'normal'}
  ])
  tray.setToolTip('DynWallpaper')
  tray.setContextMenu(contextMenu)

  // Create the browser window.
  win = new BrowserWindow({
    width: 400,
    height: 600,
    icon: icon,
    resizable: false,
    backgroundColor: "#000000",
    show: false,
    frame: false
  })

  win.setMaximizable(false);

  console.log("app.getPath(home) = " + app.getPath("home"));
  let fullpath = path.join(app.getPath("home"), '/appdata/local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets');
  StartWatcher(fullpath);

  let child = new BrowserWindow({
    width: 200,
    height: 100,
    parent: win, 
    modal: true, 
    transparent: true,
    show: false,
    frame: false
  })
  child.loadFile('./loading.html')
  child.once('ready-to-show', () => {
    child.show()
  })

  win.on('show', () => {
    console.log('show - ' + pageName);
  })


  win.once('ready-to-show', () => {
    console.log('ready-to-show - ' + pageName);
    child.close()
    win.show()
  })

  //console.log(appIcon, win)

  // and load the index.html of the app.
  pageName = pageIndex;
  win.loadFile('./' + pageIndex);

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // win.webContents.on("devtools-opened", () => { 
  // 	win.webContents.closeDevTools(); 
  // });

  //removes default main menu for the app
  Menu.setApplicationMenu(null);

  win.webContents.on('did-finish-load', () => {
    console.log('did-finish-load - ' + pageName);

    if (pageName === pageIndex){
      //fetch filenames in the images folder after it has been updated
      var imgsFolderFiles =  fs.readdirSync(appImgsFolder);
      
      //payload defines the message we send to the ui window
      var payload = {
          imgsFolder : appImgsFolder, 
          imgsFolderFiles : imgsFolderFiles }
          
      //msg sent as an event called 'showLocalImagess' with the payload
      win.webContents.send('showLocalImages', payload );
    }
  })

  
  
}


var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

if (shouldQuit) {
  app.quit();
  return;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  wallpaper.get().then(imagePath => {
    console.log('Current wallpaper = ' + imagePath);
  });
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('ping', 'whoooooooh!')
  })

  
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})


app.on('quit', () => {
  // Emitted when the application is quitting.
  // Note: On Windows, this event will not be emitted if the app is closed due 
  // to a shutdown/restart of the system or a user logout
  // tray.destroy()
  console.log('quit - ' + pageName);
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// var array = fs.readFileSync('README.md').toString().split("\n");
// console.log("Reading Direectory...");
// for(i in array) {
//     console.log(array[i]);
// }


var appImgsFolder = createImagesFolder();
function createImagesFolder() {
  let defaultImagesFolderPath = (app.getPath('pictures')+'/SpotlightWallpapers').replace(/\\/g, '/'); 
                                          //replaces "frontlaces" with backslashes ^^^                           
  //check if default folder already exists
  if(!fs.existsSync(defaultImagesFolderPath)) { 
    //make images folder if it does not exist
    fs.mkdirSync(defaultImagesFolderPath, '0o765') 
    return defaultImagesFolderPath;
  } else { 
    //return default folder if it already exists
    return defaultImagesFolderPath; 
  }
}


function StartWatcher(fullpath){
  var chokidar = require("chokidar");

  console.log("Wathing changes on " + fullpath);

  var watcher = chokidar.watch(fullpath, {
    ignored: /[\/\\]\./,
    persistent: true
  });

  function onWatcherReady(){
    console.info('From here can you check for real changes, the initial scan has been completed.');
  }
        
  // Declare the listeners of the watcher
  watcher
  .on('add', function(fullPathFileName) {
    //console.log('File', fullPathFileName, 'has been added');
    updateImagesFolder(fullPathFileName, appImgsFolder)
  })
  .on('addDir', function(fullPathFileName) {
    console.log('Directory', fullPathFileName, 'has been added');
  })
  .on('change', function(fullPathFileName) {
    console.log('File', fullPathFileName, 'has been changed');
  })
  .on('unlink', function(fullPathFileName) {
    console.log('File', fullPathFileName, 'has been removed');
  })
  .on('unlinkDir', function(fullPathFileName) {
    console.log('Directory', fullPathFileName, 'has been removed');
  })
  .on('error', function(error) {
    console.log('Error happened', error);
  })
  .on('ready', onWatcherReady)
  .on('raw', function(event, fullpath, details) {
    // This event should be triggered everytime something happens.
    console.log('Raw event info:', event, path, details);
  });
} 

function updateImagesFolder(srcImgesFolder, destImgesFolder) {
  fs.readFile(srcImgesFolder, (err, buf) => {
    if (err) throw err;
    let dimensions = sizeOf(buf);
    let filename = srcImgesFolder.split('\\').pop().split('/').pop();
    console.log('Image', filename, 'info, width:',dimensions.width, ', height:', dimensions.height);

    //check if image is rectangular and width is big enuf to be wallpaper && is not already in the imgs folder
    if (dimensions.height<dimensions.width && 
      dimensions.width>1000 && !fsExistsSync(path.join(destImgesFolder,`${filename}.jpg`))) { 
      console.log('Copying file', filename);
      fs.copyFile(srcImgesFolder, path.join(destImgesFolder,`${filename}.jpg`), err => {
        if (err) throw err;
        console.log('success');
      });
    } 
  });
}


function fsExistsSync(filepath) {
  try {
    fs.accessSync(filepath);
    return true;
  } catch (e) {
    return false;
  }
}

ipcMain.on('changeDesktopWallpaper',(event, imgPath) => {
  console.log("changeDesktopWallpaper event");
  wallpaper.set(imgPath)
})

ipcMain.on('closeBtn', event => {
  win.minimize();
})

ipcMain.on('showHomeBtn', event => {

  if (pageName === pageIndex){
    //fetch filenames in the images folder after it has been updated
    var imgsFolderFiles =  fs.readdirSync(appImgsFolder);
    
    //payload defines the message we send to the ui window
    var payload = {
        imgsFolder : appImgsFolder, 
        imgsFolderFiles : imgsFolderFiles }
        
    //msg sent as an event called 'showLocalImagess' with the payload
    win.webContents.send('showLocalImages', payload );
  }
})

ipcMain.on('showFavoritesBtn', event => {
  //msg sent as an event called 'showRemoteImages' 
  win.webContents.send('showRemoteImages');
})

ipcMain.on('showAboutInfo', event => {
//   const options = {
//     type: 'info',
//     title: 'Windows Lockscreen Image Saver',
//     message: 'About Software',
//     detail: 
// `
// App Version   :   1.0.0
// Developed by  :   James Kimani
//                 https://github.com/JamzyKimani
//                 https://twitter.com/JamzyKimani
// `   ,
//     buttons: ['OK']
//   }
//   dialog.showMessageBox(options);

  //msg sent as an event called 'showOptions' 
  win.webContents.send('showOptions');
})

// process.on('uncaughtException', (err) => {
//   console.log('whoops! there was an error');
// });