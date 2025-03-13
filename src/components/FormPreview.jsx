import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FormPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const forms = JSON.parse(localStorage.getItem('forms')) || [];
  const form = forms.find((form) => form.id === id);

  // Handle missing form
  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-md shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-500">Form not found!</h1>
          <p className="text-gray-500 mt-2">The requested form does not exist.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
        <p className="text-gray-600 mb-6">{form.description}</p>

        {form.questions && form.questions.length > 0 ? (
          form.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 mb-6"
            >
              <h2 className="text-lg font-medium mb-4">{question.question || `Question ${index + 1}`}</h2>

              {question.type === 'short-answer' && (
                <input
                  type="text"
                  placeholder="Your answer"
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 p-2"
                />
              )}

              {question.type === 'paragraph' && (
                <textarea
                  placeholder="Your answer"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {/* Add additional input types as needed */}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No questions available for this form.</p>
        )}
      </div>
    </div>
  );
};

export default FormPreview;
