/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  session,
  shell,
  ipcMain,
  WebContentsView,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const webViews = new Map<string, WebContentsView>();

// Add IPC handler to show WebContents (BrowserView)
// ipcMain.handle('show-webviews', async (event, cost: number) => {
//   if (mainWindow) {
//     const view1 = new WebContentsView();
//     const view2 = new WebContentsView();
//     const view3 = new WebContentsView();

//     // Add views to the window
//     const container = mainWindow.contentView;
//     container.addChildView(view1);
//     container.addChildView(view2);
//     // container.addChildView(view3);

//     // Set the bounds for each view (position and size)
//     view1.setBounds({ x: 0, y: 0, width: 300, height: 230 });
//     view2.setBounds({ x: 700, y: 0, width: 300, height: 230 });
//     // view3.setBounds({ x: 0, y: 400, width: 300, height: 300 });

//     view1.setBackgroundColor('#00000000');
//     view2.setBackgroundColor('#00000000');

//     view1.webContents.loadURL(
//       `http://localhost:1212/#/slowrender?cost=${cost}`,
//     );
//     view2.webContents.loadURL(
//       `http://localhost:1212/#/slowrender?cost=${cost}`,
//     );
//     view3.webContents.loadURL(
//       `http://localhost:1212/#/slowrender?cost=${cost}`,
//     );
//     console.log('Three WebContentsView instances created');
//     return 'WebContentsView instances created';
//   }
//   return 'WebContentsView already created or failed';
// });

ipcMain.handle('show-webviews', async (event, cost) => {
  if (mainWindow) {
    const ids = ['card1', 'card2'];
    ids.forEach((id) => {
      if (webViews.has(id)) return;
      const view = new WebContentsView();
      mainWindow?.contentView.addChildView(view);

      view.webContents.loadURL(`http://localhost:1212/#/widget?cost=${cost}`);

      view.setBackgroundColor('#00000000');

      view.webContents.insertCSS(
        'html, body { overflow: hidden;  background: transparent !important;}',
      );
      // view.setBounds({ x, y, width: 220, height: 220 });

      webViews.set(id, view);
      console.log(`WebContentsView instances created. ID: ${id}`);
    });
    return `WebContentsView instances created`;
  }
  return 'WebContentsView failed';
});

ipcMain.on(
  'update-webview-position',
  (event, { id, coordinates, dimensions }) => {
    const view = webViews.get(id);
    if (view) {
      view.setBounds({
        x: coordinates.x,
        y: coordinates.y,
        width: dimensions.width,
        height: dimensions.height,
      });
      // console.log(
      //   `Updated position and size of ${id} to`,
      //   coordinates,
      //   dimensions,
      // );
    } else {
      console.error(`No WebContentsView found for ID: ${id}`);
    }
  },
);

// Listen to the zoom level update from renderer
ipcMain.on('update-zoom-level', (event, { zoomLevel }) => {
  // For each WebContentsView, update the zoom level based on renderer's zoom
  const calculatedZoomLevel = Math.log(zoomLevel) / Math.log(1.2);
  webViews.forEach((view) => {
    const webContent = view.webContents;
    webContent.setZoomLevel(calculatedZoomLevel);
  });
});

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  console.log(
    'Preload script path:',
    path.join(__dirname, '../../.erb/dll/preload.js'),
  );
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open URLs in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
app.on('ready', async () => {
  try {
    await session.defaultSession.clearCache();
    console.log('Cache cleared');
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
