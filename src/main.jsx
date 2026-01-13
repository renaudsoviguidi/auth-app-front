import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import Webroute from "./routes/webroute"                     
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';



const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Webroute />
      </PersistGate>
    </Provider>
  </StrictMode>
);

const popup = document.getElementById('custom-popup');
if (popup) {
  popup.style.display = 'none';
}
