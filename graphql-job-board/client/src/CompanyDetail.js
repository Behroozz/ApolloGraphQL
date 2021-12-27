import React, { useState, useEffect } from 'react';
// import { companies } from './fake-data';
import { useParams } from 'react-router-dom';
import { loadCompany } from './requests'
import { JobList } from './JobList';

const CompanyDetail = () => {
    const [company, setCompany ] = useState(null)
    const { companyId } = useParams()

    useEffect(() => {
      async function getCompany(companyId) {
        const resp = await loadCompany(companyId)
        setCompany(resp)
      }
      getCompany(companyId)
    }, [companyId])

    return (
     <>
      {  
        company && <div>
          <h1 className="title">{company.name}</h1>
          <div className="box">{company.description}</div>
          <h5 className="title is-5">Jobs at {company.name}</h5>
            <JobList jobs={company.jobs} />
        </div>
      }
     </>
    );
}

export default CompanyDetail
