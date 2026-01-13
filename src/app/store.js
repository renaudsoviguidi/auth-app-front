import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './providers/authSlice';
import { persistReducer, persistStore } from 'redux-persist';

// Noop storage fallback
const createNoopStorage = () => ({
  getItem(_key) {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem(_key) {
    return Promise.resolve();
  },
});

// Storage custom safe pour le client uniquement
const storage =
  typeof window !== 'undefined' && window.localStorage
    ? {
        getItem(key) {
          const value = localStorage.getItem(key);
          return Promise.resolve(value);
        },
        setItem(key, value) {
          localStorage.setItem(key, value);
          return Promise.resolve();
        },
        removeItem(key) {
          localStorage.removeItem(key);
          return Promise.resolve();
        },
      }
    : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);