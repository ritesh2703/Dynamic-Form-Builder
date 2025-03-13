import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";

const FormBuilder = ({ formId }) => {
  const location = useLocation();
  const formTitleFromState = location.state?.formTitle || "Untitled Form";
  const [formTitle, setFormTitle] = useState(formTitleFromState);
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Add a new field
  const addField = (type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: `Field ${fields.length + 1}`,
      question: "",
      required: false,
      options: [], // Initialize options as an empty array for all field types
    };

    // Add default options for specific field types
    if (type === "Multiple Choice" || type === "Checkboxes" || type === "Dropdown") {
      newField.options = ["Option 1", "Option 2"];
    }

    setFields([...fields, newField]);
    setSelectedField(newField.id);
  };

  // Remove a field
  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  // Reorder fields
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFields = Array.from(fields);
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);
    setFields(reorderedFields);
  };

  // Move field up
  const moveFieldUp = (index) => {
    if (index === 0) return;
    const newFields = [...fields];
    [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    setFields(newFields);
  };

  // Move field down
  const moveFieldDown = (index) => {
    if (index === fields.length - 1) return;
    const newFields = [...fields];
    [newFields[index + 1], newFields[index]] = [newFields[index], newFields[index + 1]];
    setFields(newFields);
  };

  // Toggle required field
  const toggleRequired = (id) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, required: !field.required } : field
      )
    );
  };

  // Save form to localStorage
  const saveForm = () => {
    const formData = {
      id: formId,
      title: formTitle,
      description: formDescription,
      questions: fields,
    };
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    const updatedForms = [...storedForms, formData];
    localStorage.setItem("forms", JSON.stringify(updatedForms));

    // Log the form data in a readable format
    console.log("Form Saved:", JSON.stringify(formData, null, 2));
    alert("Form saved successfully!");
  };

  // Publish form
  const publishForm = () => {
    const shareableLink = `${window.location.origin}/form/${formId}`;
    console.log("Shareable Link:", shareableLink);
    alert(`Form published! Shareable link: ${shareableLink}`);
  };

  // Toggle preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Update field question
  const updateFieldQuestion = (id, question) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, question } : field
      )
    );
  };

  // Update field label
  const updateFieldLabel = (id, label) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, label } : field
      )
    );
  };

  // Update field type
  const updateFieldType = (id, type) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, type } : field
      )
    );
  };

  // Add option to field
  const addOption = (id) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, options: [...field.options, `Option ${field.options.length + 1}`] } : field
      )
    );
  };

  // Remove option from field
  const removeOption = (id, optionIndex) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, options: field.options.filter((_, i) => i !== optionIndex) } : field
      )
    );
  };

  // Update option in field
  const updateOption = (id, optionIndex, value) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, options: field.options.map((opt, i) => i === optionIndex ? value : opt) } : field
      )
    );
  };

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

    fields.forEach((field) => {
      const escapedId = CSS.escape(field.id);
      const input = document.querySelector(`#${escapedId}`);
      const value = input?.value || "";
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
    <div className="p-6 bg-gray-50 min-h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-md">
        <h2 className="text-lg font-bold mb-4">Fields</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-2 mb-2 cursor-pointer ${
                          selectedField === field.id ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedField(field.id)}
                      >
                        {field.label}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => moveFieldUp(index)}
                            className="px-2 py-1 bg-gray-200 rounded-md"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveFieldDown(index)}
                            className="px-2 py-1 bg-gray-200 rounded-md"
                          >
                            ↓
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <button
          onClick={() => addField("Text")}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
        >
          Add Field
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-6">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">Form Builder</h1>
            <div className="flex gap-4">
              <button
                onClick={saveForm}
                className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={publishForm}
                className="px-4 py-2 bg-white text-green-500 rounded-md hover:bg-green-600"
              >
                Publish
              </button>
              <button
                onClick={togglePreview}
                className="px-4 py-2 bg-white text-purple-500 rounded-md hover:bg-purple-600"
              >
                {showPreview ? "Back to Editor" : "Preview"}
              </button>
            </div>
          </div>
        </nav>

        {/* Form Editor or Preview */}
        {showPreview ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">{formTitle}</h1>
            <p className="text-gray-600 mb-6">{formDescription}</p>
            {fields.map((field, index) => (
              <div key={field.id} className="mb-6">
                <h3 className="font-semibold mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </h3>
                {renderInputField(field)}
              </div>
            ))}
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        ) : (
          <div>
            {/* Form Title and Description */}
            <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Form Title"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
              />
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Form Description"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Selected Field Editor */}
            {selectedField && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                <h3 className="font-semibold mb-4">Edit Field</h3>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2">Label</label>
                  <input
                    type="text"
                    value={fields.find((field) => field.id === selectedField).label}
                    onChange={(e) => updateFieldLabel(selectedField, e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2">Input Type</label>
                  <select
                    value={fields.find((field) => field.id === selectedField).type}
                    onChange={(e) => updateFieldType(selectedField, e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Short Answer">Short Answer</option>
                    <option value="Paragraph">Paragraph</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Checkboxes">Checkboxes</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="File Upload">File Upload</option>
                    <option value="Linear Scale">Linear Scale</option>
                    <option value="Date">Date</option>
                    <option value="Time">Time</option>
                    <option value="Email">Email</option>
                    <option value="Password">Password</option>
                  </select>
                </div>
                {(fields.find((field) => field.id === selectedField).type === "Multiple Choice" ||
                  fields.find((field) => field.id === selectedField).type === "Checkboxes" ||
                  fields.find((field) => field.id === selectedField).type === "Dropdown") && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-2">Options</label>
                    {fields.find((field) => field.id === selectedField).options?.map((option, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(selectedField, i, e.target.value)}
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                          onClick={() => removeOption(selectedField, i)}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(selectedField)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Add Option
                    </button>
                  </div>
                )}
                <div className="mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={fields.find((field) => field.id === selectedField).required}
                      onChange={() => toggleRequired(selectedField)}
                      className="mr-2"
                    />
                    Required
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;