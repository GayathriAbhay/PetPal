import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('Render error', e);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div style="padding:24px;font-family:sans-serif;">An error occurred while rendering the app. Check the console for details.</div>';
  }
}
