# Dynwallpaper
Dynamic Wallpepers

The Idea:
Windows has a INCREADIBLE collection of images for the user lock screen, let's say that arrond 80% or 85% are so beatifull that I would like to have them as my desktop wallpaper, of couse this is NOT possible, the GENIOUS on Microsoft that propposed the idea dind't realize that people may want to have this to the desktop as well (How difficult should it be for that pearson to arrive to that BASIC conclusion?). Since this is not comming in the near future and I REALLY want to have the images on sync. The plan is to create an App the does this automatically.

in summary the App will:
- Gather the images windows download for use on the lock scrren
- Copy those images to a local directory
- display those images on the app for quick access
- Allow the user to set the background iamge using on the the images displayed
- Keep images on Sync with the lock screen
- Track and show iamges that are sused more often

Application will be contruced using electron, First because of it's simplicity, sencond and more important to learn to use electron (wich seems to be a very powerfull framework)

Current Status:

- Basic application skeleton: Done

- Fond folder where images are donwloaded: Done

- Copying of images to local directory: Done

- Creation of seetings panel to allow user configure the desired behaviour of the App: Done

- Change the Wallpaper Background Image: Done, Not working properly due to windows 10, rework in progress, this means, stop using the https://www.npmjs.com/package/wallpaper, Issue has been open on githup, if solution is not provided I will writte my own code to change the desktop background.

- Creat a tray icon to access the app: Done

- Make sure app keeps runing on the background, even when all windows are closed: Done

- Enable user to CLOSE the app using a contextual menu from the tray icon: Done

- Application should autostart if option is selecte to do so: Pending

- Attempt to detect current image used on the lock screen: Pending

---- If sussessfull, Application should change the image automatically if option is selected to do so: Pending

- Send information of image set as desktop wallpeper (this will be used to track favorites): Pending

- Doenload and show favorites images: Pending

- Allow user to install the app: Pending

- Provide seeamless (withing the app) updates: Pending


In order to execute the program please execute: npm start from the console
i.e. PS C:\dev\dynwallpaper> npm start

i need to continue

