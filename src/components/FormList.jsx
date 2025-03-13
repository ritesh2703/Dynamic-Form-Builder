import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteForm } from '../features/forms/formSlice';
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const FormList = ({ forms, onDeleteForm }) => {
    const navigate = useNavigate();
    const [dropdownId, setDropdownId] = useState(null);

    // Toggle dropdown visibility
    const handleDropdownToggle = (id) => {
        setDropdownId(dropdownId === id ? null : id);
    };

    // Close dropdown when clicking outside
    const handleOutsideClick = (e) => {
        if (!e.target.closest('.dropdown-menu')) {
            setDropdownId(null);
        }
    };

    // Effect for handling outside clicks
    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {forms.length > 0 ? (
                forms.map((form) => (
                    <div
                        key={form.id}
                        className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:bg-blue-50 transition cursor-pointer flex items-center justify-between"
                    >
                        <div
                            onClick={() => navigate(`/preview/${form.id}`)}
                            className="w-full"
                        >
                            <h3 className="text-lg font-bold">{form.title}</h3>
                            <p className="text-sm text-gray-500">Created on: {form.createdAt}</p>
                        </div>

                        {/* Dropdown Menu Button */}
                        <div className="relative">
                            <button
                                className="text-gray-500 hover:text-blue-500"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    handleDropdownToggle(form.id);
                                }}
                            >
                                <FaEllipsisV size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownId === form.id && (
                                <div
                                    className="dropdown-menu absolute top-8 right-0 bg-white shadow-md border border-gray-200 rounded-md w-36 z-10"
                                    onClick={(e) => e.stopPropagation()} // Prevent dropdown closing when clicking inside
                                >
                                    <button
                                        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-blue-100"
                                        onClick={() => navigate(`/preview/${form.id}`)}
                                    >
                                        <FaEye /> Preview
                                    </button>
                                    <button
                                        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-blue-100"
                                        onClick={() => navigate(`/edit/${form.id}`)}
                                    >
                                        <FaEdit /> Edit Form
                                    </button>
                                    <button
                                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-500 hover:bg-red-100"
                                        onClick={() => onDeleteForm(form.id)}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center col-span-full">
                    No forms found. Try creating one!
                </p>
            )}
        </div>
    );
};

export default FormList;