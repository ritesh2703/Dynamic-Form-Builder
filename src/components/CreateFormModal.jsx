import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Utility function to fetch form title from localStorage
export const fetchFormTitle = (id) => {
  try {
    const storedForms = JSON.parse(localStorage.getItem('forms')) || [];
    const foundForm = storedForms.find(form => form.id === id);
    return foundForm ? foundForm.title : 'Untitled Form';
  } catch (error) {
    console.error('Error fetching form title:', error);
    return 'Untitled Form';
  }
};

const CreateFormModal = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!title.trim()) {
      setError('⚠️ Form title cannot be empty.');
      return;
    }

    const storedForms = JSON.parse(localStorage.getItem('forms')) || [];

    // Prevent duplicate form titles
    if (storedForms.some(form => form.title.trim().toLowerCase() === title.trim().toLowerCase())) {
      setError('⚠️ A form with this title already exists.');
      return;
    }

    const newForm = {
      id: new Date().getTime().toString(),
      title: title.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedForms = [...storedForms, newForm];
    localStorage.setItem('forms', JSON.stringify(updatedForms));

    setSuccessMessage('✅ Form created successfully!');
    setTimeout(() => {
      onCreate(newForm);
      navigate(`/edit/${newForm.id}`, { state: { formTitle: newForm.title } }); // Updated navigation
    }, 1000); // Delay navigation for better UI experience
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">🆕 Create New Form</h2>

        {/* Error & Success Messages */}
        {error && (
          <div className="bg-red-100 text-red-500 p-2 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-green-600 p-2 rounded-md mb-4 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2">Form Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
                setSuccessMessage('');
              }}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                error ? 'border-red-400 focus:ring-red-400' : 'focus:ring-blue-400'
              }`}
              placeholder="Enter form title..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFormModal;