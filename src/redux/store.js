import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage as default storage
import formReducer from '../features/forms/formSlice'; // Correct import statement

// Persist config for forms
const persistConfig = {
  key: 'forms',
  storage,
};

const persistedFormReducer = persistReducer(persistConfig, formReducer);

export const store = configureStore({
  reducer: {
    forms: persistedFormReducer,  // Use persisted reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Create the persistor
export const persistor = persistStore(store);
