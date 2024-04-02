const db1 = require("../db/test");

const AnalyticsController = {
  getAnalyticsData(req, res) {
    const sqlQuery = `
      SELECT 'Clients Served' AS tablename, COUNT(*) AS count FROM clientsDataDB
      UNION ALL
      SELECT 'Certificates Issued' AS tablename, COUNT(*) AS count FROM certificatesDataDB
      UNION ALL
      SELECT 'Request Received' AS tablename, COUNT(*) AS count FROM contactFormDataDB
      UNION ALL
      SELECT 'Upcoming Re-Certifications' AS tablename, COUNT(*) AS count FROM clientsDataDB
      WHERE 
          reCertificationDate > CURDATE()
          AND reCertificationDate <= DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
    `;

    db1.query(sqlQuery, (err, result) => {
      if (err) {
        console.error("Error fetching analytics data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const analyticsData = result.map((row) => ({
        [row.tablename]: row.count,
      }));

      res.json({ analyticsData });

      console.log({ analyticsData });
    });
  },
};

module.exports = AnalyticsController;
