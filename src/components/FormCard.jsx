import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteForm } from '../features/forms/formSlice';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const FormCard = ({ form }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handlePreview = () => navigate(`/preview/${form.id}`); // ✅ Fixed path
    const handleEdit = () => navigate(`/edit/${form.id}`);       // ✅ Fixed path

    const handleDelete = () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${form.title}"?`);
        if (confirmDelete) {
            dispatch(deleteForm(form.id));
        }
    };

    return (
        <div className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition cursor-pointer border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800">{form.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Created on {form.createdAt}</p>

            <div className="flex items-center gap-3 mt-4">
                <button
                    onClick={handlePreview}
                    className="flex items-center gap-1 px-3 py-1 text-blue-500 bg-blue-100 rounded-md hover:bg-blue-200 transition"
                >
                    <FaEye /> Preview
                </button>

                <button
                    onClick={handleEdit}
                    className="flex items-center gap-1 px-3 py-1 text-green-500 bg-green-100 rounded-md hover:bg-green-200 transition"
                >
                    <FaEdit /> Edit
                </button>

                <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 px-3 py-1 text-red-500 bg-red-100 rounded-md hover:bg-red-200 transition"
                >
                    <FaTrash /> Delete
                </button>
            </div>
        </div>
    );
};

export default FormCard;
