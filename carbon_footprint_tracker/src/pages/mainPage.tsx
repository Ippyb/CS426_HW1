import { useState, useEffect } from "react";
import ActivityForm from "../components/ActivityForm";
import DataVis from "../components/DataVis";
import Summary from "../components/Summary";
import "../styling/MainPage.css";

const MainPage = () => {
  const [activities, setActivities] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    // initialize darkMode state from localStorage
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    // save to localStorage whenever it changes
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  useEffect(() => {
    // add/remove dark-mode class to main container when darkMode changes
    const mainContainer = document.querySelector(".main-container");
    if (darkMode) {
      mainContainer?.classList.add("dark-mode");
    } else {
      mainContainer?.classList.remove("dark-mode");
    }

    const storedActivities = localStorage.getItem("activities");
    setActivities(storedActivities ? JSON.parse(storedActivities) : []);
  }, [darkMode]);

  return (
    <div className={`main-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="main-header">
        <h1>Carbon Footprint Tracker</h1>
        <button
          className="dark-mode-toggle"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </header>

      <div className="content-grid">
        <Summary activities={activities} />
        <DataVis />
        <ActivityForm />
      </div>
    </div>
  );
};

export default MainPage;
