const axios = require('axios');
const db = require('../models/database');

const syncCVEs = async () => {
  try {
    let startIndex = 0;
    const resultsPerPage = 100;
    let totalResults = 100;

    while (startIndex < totalResults) {
      const response = await axios.get(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?startIndex=${startIndex}`
      );

      const { vulnerabilities, totalResults: total } = response.data;
      totalResults = total;

      for (const _cve of vulnerabilities) {
        let cve = _cve['cve']

        await db.run(
          `INSERT OR REPLACE INTO cves (
            cve_id, published_date, last_modified_date, 
            status, description, base_score_v2, base_score_v3
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            cve.id,
            cve.published,
            cve.lastModified,
            cve.vulnStatus,
            cve.descriptions[0].value,
            cve.metrics?.cvssMetricV2?.[0]?.cvssData.baseScore,
            cve.metrics?.cvssMetricV3?.[0]?.cvssData.baseScore
          ]
        );
        console.log("Insert Done")
        // Insert CPEs
        if (cve.configurations) {
          for (const config of cve.configurations) {
            for (const node of config.nodes) {
              for (const cpeMatch of node.cpeMatch) {
                await db.run(
                  `INSERT OR REPLACE INTO cpes (
                    cve_id, criteria, match_criteria_id, vulnerable
                  ) VALUES (?, ?, ?, ?)`,
                  [cve.id, cpeMatch.criteria, cpeMatch.matchCriteriaId, cpeMatch.vulnerable]
                );
              }
            }
          }
        }
      }

      startIndex += resultsPerPage;
    }
    console.log('CVE data sync completed successfully');
  } catch (error) {
    console.error('Error syncing CVE data:', error.message);
  }
};

module.exports = { syncCVEs };