'use strict';

const {ipcRenderer} = require('electron');
const WinJS = require('winjs');
const fs = require('fs');

function showLocalImages(imagesFolder, imgsFolderFiles) {
  var imgsHTML = '';
  if (imgsFolderFiles.length>0) { // if images folder has files 
      //loop through each of the files 
      imgsFolderFiles.forEach(imageFile => {
      //make a div tag that renders the images as the div background image

      imgsHTML +=  `<div class="gallery-img" style="background-image: url('${imagesFolder}/${imageFile}'); background-size: 100% 100%;" onmouseout="hideWallpaperBtn(this)" onmouseover="showWallpaperBtn(this)">
                      <button class="btn info" onclick="setAsWallpaper('${imagesFolder}/${imageFile}')">Set as Desktop Wallpaper</button>
                    </div>` 
      });

  } else {

      imgsHTML += `<div class="center-msg" id="msg_area">
                      <p>No Windows Spotlight Images were found on your computer. </p>
                      <p>go to personalization settings and check if Spotlight is enabled under lock screen tab and <a href="#" onclick="refreshImages()">refresh</a></p>
                  </div>`
  }

  var imgsArea = document.getElementById('content-area');
  if (imgsHTML != '') { imgsArea.innerHTML = imgsHTML; }
}

function showOptions() {
  fs.readFile('parameters.html', 'utf8', function(err, data) {
    if (err) throw err;
    var imgsHTML = '';
    imgsHTML += data;

    var imgsArea = document.getElementById('content-area');
    if (imgsHTML != '') { imgsArea.innerHTML = imgsHTML; }
    // enable disable elements
  });
}

function setAsWallpaper(file) {
  console.log('will set '+file+' as wallpaper');
  ipcRenderer.send('changeDesktopWallpaper',  file);
}

function showWallpaperBtn(div) {
  var wallpaperBtn = div.querySelector('button');
  wallpaperBtn.style.opacity = '1';
  wallpaperBtn.style.height = '50px';
}

function hideWallpaperBtn(div) {
  var wallpaperBtn = div.querySelector('button');
  wallpaperBtn.style.height = '0px';
  wallpaperBtn.style.opacity= '0';
}

ipcRenderer.on('showLocalImages', (event, payload) => {
  console.log("Event Received - showLocalImages")
  //this code listens for the 'showLocalImages' event sent in the main.js
  showLocalImages(payload.imgsFolder, payload.imgsFolderFiles);
})

ipcRenderer.on('showRemoteImages', (event) => {
  console.log("Event Received - showRemoteImages")
  //this code listens for the 'showRemoteImages' event sent in the main.js
})

ipcRenderer.on('showOptions', (event) => {
  console.log("Event Received - showOptions")
  showOptions();
  //this code listens for the 'showOptions' event sent in the main.js
})

WinJS.UI.processAll().done(function () {
  var splitView = document.querySelector(".splitView").winControl;
  new WinJS.UI._WinKeyboard(splitView.paneElement); // Temporary workaround: Draw keyboard focus visuals on NavBarCommands
});

window.onload=function(){
  document.getElementById('openHomeBtn').addEventListener('click', openHomeBtnHandler);
  document.getElementById('openFavoritesBtn').addEventListener('click', openFavoritesBtnHandler);
  document.getElementById('aboutSoftwareBtn').addEventListener('click', aboutSoftwareBtnHandler);
}

function openHomeBtnHandler() {
  console.log("Sending Event - openHomeBtnHandler")
  ipcRenderer.send('showHomeBtn')
}

function openFavoritesBtnHandler() {
  console.log("Sending Event - openFavoritesBtn")
  ipcRenderer.send('showFavoritesBtn')
}

function aboutSoftwareBtnHandler() {
  console.log("Sending Event - aboutSoftwareBtn")
  ipcRenderer.send('showAboutInfo')
}