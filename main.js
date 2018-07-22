const {app, Menu, Tray, BrowserWindow} = require('electron')
var fs = require('fs');
var path = require('path')
  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  
  function createWindow () {

    var icon = path.join(__dirname, 'assets/icons/icon.png')
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      {label: 'Item1', type: 'radio'},
      {label: 'Item2', type: 'radio'},
      {label: 'Item3', type: 'radio', checked: true},
      {label: 'Item4', type: 'radio'}
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)

    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      iheight: 600,
      icon: icon
    })
    

    //console.log(appIcon, win)
  
    // and load the index.html of the app.
    win.loadFile('./index.html')
  
    // Open the DevTools.
    //  win.webContents.openDevTools()
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })

    win.webContents.on("devtools-opened", () => { 
    	win.webContents.closeDevTools(); 
    });
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
  app.on('ready', createWindow)
  
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
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
 
  // var array = fs.readFileSync('README.md').toString().split("\n");
  // console.log("Reading Direectory...");
  // for(i in array) {
  //     console.log(array[i]);
  // }
  

  var fullpath = path.join(app.getPath("home"), '/appdata/local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets');
  StartWatcher(fullpath);

 
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
    .on('add', function(fullpath) {
          console.log('File', fullpath, 'has been added');
    })
    .on('addDir', function(fullpath) {
          console.log('Directory', fullpath, 'has been added');
    })
    .on('change', function(fullpath) {
         console.log('File', fullpath, 'has been changed');
    })
    .on('unlink', function(fullpath) {
         console.log('File', fullpath, 'has been removed');
    })
    .on('unlinkDir', function(fullpath) {
         console.log('Directory', fullpath, 'has been removed');
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
