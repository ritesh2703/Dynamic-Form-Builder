import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PublishedForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Fetch the published form data from localStorage
    const publishedForms = JSON.parse(localStorage.getItem("publishedForms")) || {};
    const form = publishedForms[formId];
    if (form) {
      setFormData(form);
    } else {
      alert("Form not found!");
    }
  }, [formId]);

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{formData.title}</h1>
        <p className="text-gray-600 mb-6">{formData.description}</p>
        {formData.questions.map((field, index) => (
          <div key={field.id} className="mb-6">
            <h3 className="font-semibold mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </h3>
            {renderInputField(field)}
          </div>
        ))}
        <button
          onClick={() => alert("Form submitted successfully!")}
          className="px-4 py-2 bg-blue-500 text-amber-500 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// Helper function to render input fields
const renderInputField = (field) => {
  switch (field.type) {
    case "Text":
    case "Short Answer":
      return (
        <input
          type="text"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    case "Number":
      return (
        <input
          type="number"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    case "Paragraph":
      return (
        <textarea
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    case "Multiple Choice":
    case "Checkboxes":
    case "Dropdown":
      return (
        <div>
          {field.options?.map((option, i) => (
            <div key={i} className="flex items-center mb-2">
              <input
                type={field.type === "Checkboxes" ? "checkbox" : "radio"}
                className="mr-2"
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      );
    case "File Upload":
      return (
        <input
          type="file"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    case "Linear Scale":
      return (
        <input
          type="range"
          min="1"
          max="10"
          className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    case "Date":
      return (
        <input
          type="date"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    case "Time":
      return (
        <input
          type="time"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    case "Email":
      return (
        <input
          type="email"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    case "Password":
      return (
        <input
          type="password"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    default:
      return null;
  }
};

export default PublishedForm;