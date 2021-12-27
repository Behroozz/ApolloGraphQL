import React, { useEffect, useState } from 'react';
import { JobList } from './JobList';
// const { jobs } = require('./fake-data');
import { loadJobs } from './requests'

const JobBoard = () => {
  const [jobs, setJobs ] = useState([])

  useEffect(() => {
    async function getJobs() {
      const resp = await loadJobs()
      setJobs(resp)
    }
    getJobs()
  }, [])

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard