// src/App.jsx

import { useState, useEffect } from 'react';
import JobList from './components/JobList';
import AddJobForm from './components/AddJobForm';

function App() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h1>AutoFlow App</h1>
      <AddJobForm onJobAdded={fetchJobs} />
      <hr />
      {/* ASEGÚRATE DE QUE ESTA LÍNEA PASE LA FUNCIÓN 'fetchJobs' */}
      <JobList jobs={jobs} onJobDeleted={fetchJobs} />
    </div>
  );
}

export default App;