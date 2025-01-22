import { createRoot } from 'react-dom/client';
import App from './App';
// import SlowRenderComponent from './SlowRenderComponent';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(<App />);

// const isWebview = window.location.href.includes('slowrender');

// if (isWebview) {
//   root.render(<SlowRenderComponent cost={10000000000000} />);
// } else {
//   root.render(<App />);
// }

// // calling IPC exposed from preload script
// window.electron.ipcRenderer.once('ipc-example', (arg) => {
//   // eslint-disable-next-line no-console
//   console.log(arg);
// });
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
