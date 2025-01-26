import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CVEDetail() {
  const { cveId } = useParams();
  const [cveDetails, setCveDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cves/${cveId}`);
        setCveDetails(response.data);
      } catch (error) {
        console.error('Error fetching CVE details:', error);
      }
    };

    fetchData();
  }, [cveId]);

  if (!cveDetails) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>{cveDetails.cve_id}</h1>
      
      <div className="section">
        <h2>Description</h2>
        <p>{cveDetails.description}</p>
      </div>

      <div className="section">
        <h2>CVSS Metrics</h2>
        <div className="metrics">
          <div>
            <h3>CVSS V2</h3>
            <p>Base Score: {cveDetails.base_score_v2}</p>
          </div>
          <div>
            <h3>CVSS V3</h3>
            <p>Base Score: {cveDetails.base_score_v3}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>CPE Information</h2>
        <table className="cpe-table">
          <thead>
            <tr>
              <th>Criteria</th>
              <th>Match Criteria ID</th>
              <th>Vulnerable</th>
            </tr>
          </thead>
          <tbody>
            {cveDetails.cpes?.map((cpe, index) => (
              <tr key={index}>
                <td>{cpe.criteria}</td>
                <td>{cpe.matchCriteriaId}</td>
                <td>{cpe.vulnerable ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}