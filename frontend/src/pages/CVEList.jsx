import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CVEList() {
  const [cves, setCves] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cves`, {
          params: {
            page: currentPage,
            limit: resultsPerPage
          }
        });
        
        setCves(response.data.cves);
        setTotalRecords(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, resultsPerPage]);

  const handleRowClick = (cveId) => {
    navigate(`/cves/${cveId}`);
  };

  return (
    <div className="container">
      <h1>CVE List</h1>
      <div className="total-records">Total Records: {totalRecords}</div>
      
      <table className="cve-table">
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>Published Date</th>
            <th>Last Modified Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cves.map((cve) => (
            <tr key={cve.cve_id} onClick={() => handleRowClick(cve.cve_id)}>
              <td>{cve.cve_id}</td>
              <td>{new Date(cve.published_date).toLocaleDateString()}</td>
              <td>{new Date(cve.last_modified_date).toLocaleDateString()}</td>
              <td>{cve.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>
        
        <span>Page {currentPage}</span>
        
        <button
          disabled={currentPage * resultsPerPage >= totalRecords}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>

      <div className="results-per-page">
        Results per page:
        <select 
          value={resultsPerPage} 
          onChange={(e) => {
            setResultsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
}