import { BrowserWindow, MenuItemConstructorOptions, shell } from 'electron';

// isMac = process.platform === 'darwin';
export function createMenu(mainWindow: BrowserWindow) {
  const BK_MENU_ITEMS: MenuItemConstructorOptions[] = [
    {
      id: 'file',
      label: 'File',
      submenu: [
        {
          role: 'quit',
        },
      ],
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'togglefullscreen',
          accelerator: 'F11',
        }
      ],
    },
    {
      id: 'views',
      label: 'Views',
      submenu: [
        {
          label: 'Model Incubator',
          click: () => {
            mainWindow.webContents.send('navigate', 'models');
          },
          accelerator: 'CmdOrCtrl+M',
        },
        {
          label: 'Settings',
          click: () => {
            mainWindow.webContents.send('navigate', 'settings');
          },
          accelerator: 'CmdOrCtrl+S',
        }
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'About',
          click: () => shell.openExternal('https://www.buddhilive.com'),
          accelerator: 'Alt+F1',
        },
      ],
    },
  ];

  return BK_MENU_ITEMS;
}
