import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FormEditor from './components/FormEditor';
import FormPreview from './components/FormPreview';
import CreateFormModal from './components/CreateFormModal';
import './App.css';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [forms, setForms] = useState([]);

    // Load forms from localStorage on initial render
    useEffect(() => {
        const storedForms = JSON.parse(localStorage.getItem('forms')) || [];
        setForms(storedForms);
    }, []);

    // Save forms to localStorage whenever `forms` changes
    useEffect(() => {
        localStorage.setItem('forms', JSON.stringify(forms));
    }, [forms]);

    // Handle form creation
    const handleCreateForm = (newForm) => {
        const formWithId = { ...newForm, id: Date.now().toString() }; // Add unique ID
        setForms((prevForms) => [...prevForms, formWithId]); // Update state
        setIsModalOpen(false); // Close modal
    };

    // Handle form deletion
    const handleDeleteForm = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this form?');
        if (confirmDelete) {
            const updatedForms = forms.filter((form) => form.id !== id); // Remove form
            setForms(updatedForms); // Update state
        }
    };

    return (
        <Router>
            <div className="font-sans min-h-screen w-screen bg-gray-50 text-gray-800 scroll-smooth">
                <Routes>
                    {/* Dashboard Route */}
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                forms={forms}
                                onOpenModal={() => setIsModalOpen(true)}
                                onDeleteForm={handleDeleteForm}
                            />
                        }
                    />

                    {/* Form Editor Route */}
                    <Route path="/edit/:id" element={<FormEditor forms={forms} />} />

                    {/* Form Preview Route */}
                    <Route path="/preview/:id" element={<FormPreview forms={forms} />} />

                    {/* Fallback Route for Unmatched Paths */}
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>

                {/* Modal for Creating Forms */}
                {isModalOpen && (
                    <CreateFormModal
                        onClose={() => setIsModalOpen(false)}
                        onCreate={handleCreateForm}
                    />
                )}
            </div>
        </Router>
    );
}

export default App;