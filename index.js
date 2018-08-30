const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready',()=>{
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(`file://${__dirname}/main.html`);
	mainWindow.on('closed',() => app.quit() );

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(argument) {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add new todo'
	});
	addWindow.loadURL(`file://${__dirname}/add.html`);
	addWindow.on('closed',() => addWindow = null )
}

function clearTodos(argument) {
	mainWindow.webContents.send('clearTodos');
}

ipcMain.on('formSubmission', (event,todo)=>{
	mainWindow.webContents.send('newTodo',todo);
	addWindow.close();
});

const menuTemplate = [
	// {}, for label to appear in darwin menu
	{
		label: 'File',
		submenu: [
			{
				label: 'Add Todo',
				click(){
					createAddWindow();
				}
			},
			{
				label: 'Clear Todos',
				click(){
					clearTodos();
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform === 'darwin'? 'Command+Q':'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}
];

// node command to check OS
if(process.platform === 'darwin'){
	menuTemplate.unshift({});
}


if(process.env.NODE_ENV  !== 'production'){
	menuTemplate.push({
		label: 'View',
		submenu:[
			{
				role: 'reload'
			},
			{
				label:'Developer View',
				accelerator: process.platform === 'darwin'? 'Command+Alt+I':'Ctrl+Shift+I',
				click(item,focusedWindow){
					focusedWindow.toggleDevTools();
				}
			}
		]
	})
}