import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FormPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});

  const forms = JSON.parse(localStorage.getItem("forms")) || [];
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
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Validate field based on type
  const validateField = (field, value) => {
    if (field.required && !value) {
      return "This field is required.";
    }
    switch (field.type) {
      case "Email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address.";
        }
        break;
      case "Number":
        if (isNaN(value)) {
          return "Please enter a valid number.";
        }
        break;
      case "Password":
        if (value.length < 8) {
          return "Password must be at least 8 characters long.";
        }
        break;
      default:
        break;
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = () => {
    const errors = {};
    let isValid = true;

    form.questions.forEach((field) => {
      let value = "";

      // Handle different input types
      switch (field.type) {
        case "Text":
        case "Short Answer":
        case "Number":
        case "Paragraph":
        case "Email":
        case "Password":
        case "Date":
        case "Time":
          const input = document.querySelector(`#${CSS.escape(field.id)}`);
          value = input?.value || "";
          break;

        case "Multiple Choice":
        case "Checkboxes":
        case "Dropdown":
          const selectedInput = document.querySelector(`input[name=${CSS.escape(field.id)}]:checked`);
          value = selectedInput?.value || "";
          break;

        case "File Upload":
          const fileInput = document.querySelector(`#${CSS.escape(field.id)}`);
          value = fileInput?.files.length > 0 ? "File selected" : "";
          break;

        case "Linear Scale":
          const rangeInput = document.querySelector(`#${CSS.escape(field.id)}`);
          value = rangeInput?.value || "";
          break;

        default:
          break;
      }

      // Validate the field
      const error = validateField(field, value);
      if (error) {
        errors[field.id] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);

    if (isValid) {
      alert("Form submitted successfully!");
    } else {
      alert("Please fix the errors before submitting.");
    }
  };

  // Render input field based on type
  const renderInputField = (field) => {
    const error = validationErrors[field.id];

    switch (field.type) {
      case "Text":
      case "Short Answer":
        return (
          <div>
            <input
              type="text"
              id={field.id}
              className={`w-full p-2 border rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case "Number":
        return (
          <div>
            <input
              type="number"
              id={field.id}
              className={`w-full p-2 border rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case "Paragraph":
        return (
          <div>
            <textarea
              id={field.id}
              className={`w-full p-2 border rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
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
                  name={field.id} // Use the field ID as the name for grouping
                  value={option}
                  className="mr-2"
                />
                <span>{option}</span>
              </div>
            ))}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case "File Upload":
        return (
          <div>
            <input
              type="file"
              id={field.id}
              className={`w-full p-2 border rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case "Linear Scale":
        return (
          <div>
            <input
              type="range"
              min="1"
              max="10"
              id={field.id}
              className={`w-full ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case "Date":
        return (
          <div>
            <input
              type="date"
              id={field.id}
              className={`w-full p-2 border rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case "Time":
        return (
          <div>
            <input
              type="time"
              id={field.id}
              className={`w-full p-2 border rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case "Email":
        return (
          <div>
            <input
              type="email"
              id={field.id}
              className={`w-full p-2 border rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case "Password":
        return (
          <div>
            <input
              type="password"
              id={field.id}
              className={`w-full p-2 border rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      default:
        return null;
    }
  };

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
              <h2 className="text-lg font-medium mb-4">
                {question.label} {question.required && <span className="text-red-500">*</span>}
              </h2>
              {renderInputField(question)}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No questions available for this form.</p>
        )}

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormPreview;