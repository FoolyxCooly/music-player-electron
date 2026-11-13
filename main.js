const { app, components, BrowserWindow } = require('electron');
const { verifier, challenge } = require('./auth.js');

const CLIENT_ID = "9542b2517a4642e484a435a3d1583c73";
const REDIRECT_URI = "http://127.0.0.1:8888/callback";

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
        preload: __dirname + '/preload.js'
    }
  });

  win.loadFile('index.html');
  return win;
}

function login(win) {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-modify-playback-state%20user-read-playback-state%20streaming%20user-read-email%20user-read-private&code_challenge_method=S256&code_challenge=${challenge}`;

    const authWindow = new BrowserWindow({
        width: 500,
        height: 700
    });
    authWindow.loadURL(authUrl);
    async function exchangeCodeForToken(code) {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: CLIENT_ID,
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    code_verifier: verifier
                })
            });
            const data = await response.json();
            win.webContents.send('access-token',data.access_token)
    }
    authWindow.webContents.on('will-redirect', (event, url) => {
        if (url.startsWith(REDIRECT_URI)) {
            event.preventDefault();
            const urlParams = new URL(url).searchParams;
            const code = urlParams.get('code');
            exchangeCodeForToken(code);
            authWindow.close();
        }
        
    });
    authWindow.webContents.on('will-navigate', (event, url) => {
        if (url.startsWith(REDIRECT_URI)) {
            event.preventDefault();
            const urlParams = new URL(url).searchParams;
            const code = urlParams.get('code');
            exchangeCodeForToken(code);
            authWindow.close();
        }
    });
}
app.whenReady().then(async() => {
    await components.whenReady();
    console.log('Widevine compnents ready:', components.status());

    const win = createWindow();
    login(win);
});