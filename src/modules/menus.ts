import { BrowserWindow, MenuItemConstructorOptions, shell } from 'electron';

// isMac = process.platform === 'darwin';
export function createMenu(mainWindow: BrowserWindow) {
  const BK_MENU_ITEMS: MenuItemConstructorOptions[] = [
    {
      id: 'file',
      label: 'File',
      submenu: [
        {
          label: 'New Chat',
          click: () => {
            mainWindow.webContents.send('navigate', 'chat/new');
          },
          accelerator: 'CmdOrCtrl+O',
        },
        {
          type: 'separator',
        },
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
        },
        {
          role: 'reload',
          accelerator: 'CmdOrCtrl+R',
        },
        {
          type: 'separator',
        },
        {
          role: 'toggleDevTools',
        },
        {
          role: 'close',
        },
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
