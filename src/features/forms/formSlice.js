// formSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Utility function for syncing with localStorage
const syncToLocalStorage = (forms) => {
  localStorage.setItem('forms', JSON.stringify(forms));
};

const initialState = {
  forms: JSON.parse(localStorage.getItem('forms')) || [],
};

const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addForm: (state, action) => {
      state.forms.push(action.payload);
      syncToLocalStorage(state.forms);
    },
    deleteForm: (state, action) => {
      state.forms = state.forms.filter((form) => form.id !== action.payload);
      syncToLocalStorage(state.forms);
    },
    updateForm: (state, action) => {
      const index = state.forms.findIndex((form) => form.id === action.payload.id);
      if (index !== -1) {
        state.forms[index] = { ...state.forms[index], ...action.payload };
        syncToLocalStorage(state.forms);
      }
    },
    // Add a field to a specific form
    addFieldToForm: (state, action) => {
      const { formId, field } = action.payload;
      const formIndex = state.forms.findIndex((form) => form.id === formId);
      if (formIndex !== -1) {
        if (!state.forms[formIndex].fields) {
          state.forms[formIndex].fields = [];
        }
        state.forms[formIndex].fields.push(field);
        syncToLocalStorage(state.forms);
      }
    },
    // Remove a field from a specific form
    removeFieldFromForm: (state, action) => {
      const { formId, fieldId } = action.payload;
      const formIndex = state.forms.findIndex((form) => form.id === formId);
      if (formIndex !== -1) {
        state.forms[formIndex].fields = state.forms[formIndex].fields.filter(
          (field) => field.id !== fieldId
        );
        syncToLocalStorage(state.forms);
      }
    },
    // Reorder fields in a specific form
    reorderFieldsInForm: (state, action) => {
      const { formId, fields } = action.payload;
      const formIndex = state.forms.findIndex((form) => form.id === formId);
      if (formIndex !== -1) {
        state.forms[formIndex].fields = fields;
        syncToLocalStorage(state.forms);
      }
    },
  },
});

export const {
  addForm,
  deleteForm,
  updateForm,
  addFieldToForm,
  removeFieldFromForm,
  reorderFieldsInForm,
} = formSlice.actions;

export default formSlice.reducer;