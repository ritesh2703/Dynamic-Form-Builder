import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import FormList from './FormList';
import CreateFormModal from './CreateFormModal';
import { addForm, deleteForm } from '../features/forms/formSlice';
import { FaPlus } from 'react-icons/fa';

const Dashboard = () => {
    const dispatch = useDispatch();
    const forms = useSelector((state) => state.forms.forms);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Filtered Forms (useMemo for performance)
    const filteredForms = useMemo(() => {
        return forms.filter((form) =>
            form?.title?.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
    }, [forms, searchTerm]);

    // Create New Form (useCallback for optimization)
    const handleCreateForm = useCallback((newForm) => {
        dispatch(addForm({
            ...newForm,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split('T')[0]
        }));
        setShowModal(false);
    }, [dispatch]);

    // Delete Form (useCallback for optimization)
    const handleDeleteForm = useCallback((id) => {
        if (window.confirm('Are you sure you want to delete this form?')) {
            dispatch(deleteForm(id));
        }
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar with Search */}
            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="p-6">
                {/* Start New Form Section */}
                <div
                    className="flex items-center justify-center gap-4 mb-6 cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    <div className="bg-gradient-to-br from-orange-400 via-yellow-400 to-pink-500 
                                   text-white p-6 rounded-lg shadow-md hover:opacity-90 
                                   transition w-40 h-40 flex flex-col items-center justify-center"
                    >
                        <FaPlus size={30} />
                        <p className="text-sm mt-2">Create New Form</p>
                    </div>
                </div>

                {/* Recent Forms Section */}
                <h2 className="text-lg font-semibold mb-4">📝 Recent Forms</h2>

                {filteredForms.length > 0 ? (
                    <FormList forms={filteredForms} onDeleteForm={handleDeleteForm} />
                ) : (
                    <p className="text-center text-gray-500">No forms found. Try creating one!</p>
                )}

                {/* Modal for Creating Forms */}
                {showModal && (
                    <CreateFormModal
                        onClose={() => setShowModal(false)}
                        onCreate={handleCreateForm}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
