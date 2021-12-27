import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
// import { jobs } from './fake-data';
import { loadJob } from './requests'

const JobDetail = () => {
  const [job, setJob ] = useState(null)
  const { jobId } = useParams()

  useEffect(() => {
    async function getJobDetail(jobId) {
      const resp = await loadJob(jobId)
      setJob(resp)
    }
    getJobDetail(jobId)
  }, [jobId])

    return (
      <>
      {job && <div>
        <h1 className="title">{job.title}</h1>
        <h2 className="subtitle">
          <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
        </h2>
        <div className="box">{job.description}</div>
      </div>}
      </>
    );
}

export default JobDetail