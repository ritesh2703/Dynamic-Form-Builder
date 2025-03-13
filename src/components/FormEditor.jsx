import React from 'react';
import { useParams } from 'react-router-dom';
import FormBuilder from './FormBuilder';

const FormEditor = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <FormBuilder formId={id} />
    </div>
  );
};

export default FormEditor;