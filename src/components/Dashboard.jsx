import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import FormList from './FormList';
import CreateFormModal from './CreateFormModal';
import { addForm, deleteForm } from '../features/forms/formSlice';
import { FaPlus, FaSort } from 'react-icons/fa';

const Dashboard = () => {
    const dispatch = useDispatch();
    const forms = useSelector((state) => state.forms.forms);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('default'); // Default, A-Z, Z-A, Date, Time

    // Filtered Forms (useMemo for performance)
    const filteredForms = useMemo(() => {
        let filtered = forms.filter((form) =>
            form?.title?.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );

        // Apply additional filters
        switch (filter) {
            case 'A-Z':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'Z-A':
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'Date':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'Time':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }

        return filtered;
    }, [forms, searchTerm, filter]);

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
                {/* Filter Options */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="default">Default</option>
                            <option value="A-Z">A-Z</option>
                            <option value="Z-A">Z-A</option>
                            <option value="Date">Date</option>
                            <option value="Time">Time</option>
                        </select>
                        <FaSort className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                    </div>
                </div>
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