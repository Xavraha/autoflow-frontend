// This component now just receives the list of jobs as a "prop"
function JobList({ jobs }) {
  return (
    <div>
      <h2>Lista de Trabajos</h2>
      <ul>
        {jobs.map(job => (
          <li key={job._id}>
            <strong>{job.vehicle}</strong>: {job.issue}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobList;