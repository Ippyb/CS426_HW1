import React, { useState, useEffect } from "react";

type ActivityCategory =
  | "Transportation"
  | "Food and Diet"
  | "Energy Usage"
  | "Shopping and Consumption"
  | "Waste & Sustainability Actions";

interface ActivityFormData {
  name: string;
  category: ActivityCategory | "";
  carbonValue: string;
}

// either loads saved form data from localStorage or resets to empty fields
const ActivityForm = () => {
  const [formData, setFormData] = useState<ActivityFormData>(() => {
    const savedData = localStorage.getItem("activityFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          name: "",
          category: "",
          carbonValue: "",
        };
  });

  // save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activityFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validate form
    if (!formData.name || !formData.category || !formData.carbonValue) {
      alert("Please fill in all fields");
      return;
    }

    // get existing activities from localStorage or initialize empty array
    const activities = JSON.parse(localStorage.getItem("activities") || "[]");

    // add new activity
    const newActivity = {
      ...formData,
      carbonValue: parseFloat(formData.carbonValue),
      date: new Date().toISOString(),
    };

    const updatedActivities = [...activities, newActivity];
    localStorage.setItem("activities", JSON.stringify(updatedActivities));

    // clear form
    setFormData({
      name: "",
      category: "",
      carbonValue: "",
    });

    // clear the saved form data from localStorage
    localStorage.removeItem("activityFormData");

    // custom event to notify dataVis so that graphs/charts get dynamically updated
    window.dispatchEvent(new Event("activityUpdated"));

    alert("Activity saved successfully!");
  };

  return (
    <div className="activity-form-container">
      <h2>Add New Activity</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Activity Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Daily commute"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Transportation">Transportation</option>
            <option value="Food and Diet">Food and Diet</option>
            <option value="Energy Usage">Energy Usage</option>
            <option value="Shopping and Consumption">
              Shopping and Consumption
            </option>
            <option value="Waste & Sustainability Actions">
              Waste & Sustainability Actions
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="carbonValue">Carbon Value (kg CO₂):</label>
          <input
            type="number"
            id="carbonValue"
            name="carbonValue"
            value={formData.carbonValue}
            onChange={handleChange}
            placeholder="e.g. 2.5"
            min="0"
            step="0.1"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Save Activity
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;
