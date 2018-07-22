const {ipcRenderer, electron} = require('electron');
const WinJS = require('winjs')

WinJS.UI.processAll().done(function () {
  var splitView = document.querySelector(".splitView").winControl;
  new WinJS.UI._WinKeyboard(splitView.paneElement); // Temporary workaround: Draw keyboard focus visuals on NavBarCommands
});