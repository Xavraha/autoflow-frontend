import { useState, useEffect } from 'react';
import JobList from './components/JobList';
import AddJobForm from './components/AddJobForm';

function App() {
  const [jobs, setJobs] = useState([]);

  // This function will fetch the jobs from the API
  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // useEffect will run fetchJobs once when the component loads
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h1>AutoFlow App</h1>
      {/* We pass the fetchJobs function to the form */}
      <AddJobForm onJobAdded={fetchJobs} />
      <hr />
      {/* We pass the list of jobs to the JobList component */}
      <JobList jobs={jobs} />
    </div>
  );
}

export default App;