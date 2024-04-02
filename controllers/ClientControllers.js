// const db1 = require("../db/test");
const db1 = require("../db/test");

const executeClientOperation = async (req, res, operationType) => {
  try {
    let queryText = "";
    let queryValues = [];
    const id = req.params.id;
    const {
      companyName,
      accreditationBoard,
      certificateIssueDate,
      firstSurveillanceDate,
      secondSurveillanceDate,
      reCertificationDate,
      status,
    } = req.body;

    switch (operationType) {
      case "create":
        const isEmpty = (value) => {
          return value === undefined || value === null || value === "";
        };
        queryText =
          "INSERT INTO clientsDataDB(companyName, accreditationBoard, certificateIssueDate, firstSurveillanceDate, secondSurveillanceDate, reCertificationDate) VALUES(?, ?, ?, ?, ?, ?)";
        queryValues = [
          companyName,
          accreditationBoard,
          isEmpty(certificateIssueDate) ? null : certificateIssueDate,
          isEmpty(firstSurveillanceDate) ? null : firstSurveillanceDate,
          isEmpty(secondSurveillanceDate) ? null : secondSurveillanceDate,
          isEmpty(reCertificationDate) ? null : reCertificationDate,
        ];
        break;
      case "delete":
        queryText = "DELETE FROM clientsDataDB WHERE client_id = ?";
        queryValues = [id];
        break;
      case "update":
        queryText =
          "UPDATE clientsDataDB SET companyName = ?, accreditationBoard = ?, status = ? WHERE client_id = ?";
        queryValues = [companyName, accreditationBoard, status, id];
        break;

      default:
        throw new Error("Invalid operation type");
    }

    db1.query(queryText, queryValues, (err, result) => {
      console.log(queryValues);
      if (err) {
        console.error(`Error ${operationType} certificate:`, err);
        return res
          .status(500)
          .json({ error: `Failed to ${operationType} certificate` });
      } else {
        const successMessage = {
          create: "Client details created successfully",
          update: "Client details updated successfully",
          delete: "Client details deleted successfully",
        };
        return res.status(200).json({ message: successMessage[operationType] });
      }
    });
  } catch (error) {
    console.error(`Error ${operationType} certificate:`, error);
    return res
      .status(500)
      .json({ error: `Failed to ${operationType} certificate` });
  }
};

const ClientController = {
  async getAllClientDetails(req, res) {
    try {
      const queryText = `SELECT 
        client_id,
        companyName, 
        accreditationBoard, 
        TO_CHAR(certificateIssueDate, 'DD/MM/YYYY') AS certificateIssueDate, 
        TO_CHAR(firstSurveillanceDate, 'DD/MM/YYYY') AS firstSurveillanceDate, 
        TO_CHAR(secondSurveillanceDate, 'DD/MM/YYYY') AS secondSurveillanceDate, 
        TO_CHAR(reCertificationDate, 'DD/MM/YYYY') AS reCertificationDate,
        status
      FROM 
        clientsDataDB`;
      db1.query(queryText, (err, result) => {
        if (err) {
          console.error("Error fetching clients:", err);
          return res.status(500).json({ error: "Internal server error" });
        } else {
          return res.status(200).json(result);
        }
      });
    } catch (error) {
      console.error("Error fetching clients:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAllReClientDetails(req, res) {
    try {
      const queryText = `SELECT 
      client_id,
      companyName,
      accreditationBoard,
      DATE_FORMAT(reCertificationDate, '%d/%m/%Y') AS reCertificationDate
  FROM 
      clientsDataDB
  WHERE 
      reCertificationDate > CURDATE()
      AND reCertificationDate <= DATE_ADD(CURDATE(), INTERVAL 1 MONTH);
  `;

      db1.query(queryText, (err, result) => {
        if (err) {
          console.error("Error fetching clients:", err);
          return res.status(500).json({ error: "Internal server error" });
        } else {
          return res.status(200).json(result);
        }
      });
    } catch (error) {
      console.error("Error fetching clients:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async getFirstSurveillance(req, res) {
    try {
      const queryText = `SELECT 
      client_id,
      companyName,
      accreditationBoard,
      DATE_FORMAT(firstsurveillancedate, '%d/%m/%Y') AS firstsurveillancedate
  FROM 
      clientsDataDB
  WHERE 
      firstsurveillancedate > CURDATE()
      AND firstsurveillancedate <= DATE_ADD(CURDATE(), INTERVAL 1 MONTH);
  `;

      db1.query(queryText, (err, result) => {
        if (err) {
          console.error("Error fetching clients:", err);
          return res.status(500).json({ error: "Internal server error" });
        } else {
          return res.status(200).json(result);
        }
      });
    } catch (error) {
      console.error("Error fetching clients:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async getSecondSurveillance(req, res) {
    try {
      const queryText = `SELECT 
      client_id,
      companyName,
      accreditationBoard,
      DATE_FORMAT(secondsurveillancedate, '%d/%m/%Y') AS secondsurveillancedate
  FROM 
      clientsDataDB
  WHERE 
      secondsurveillancedate > CURDATE()
      AND secondsurveillancedate <= DATE_ADD(CURDATE(), INTERVAL 1 MONTH);
  `;

      db1.query(queryText, (err, result) => {
        if (err) {
          console.error("Error fetching clients:", err);
          return res.status(500).json({ error: "Internal server error" });
        } else {
          return res.status(200).json(result);
        }
      });
    } catch (error) {
      console.error("Error fetching clients:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async postClientDetails(req, res) {
    await executeClientOperation(req, res, "create");
  },

  async deleteClientDetails(req, res) {
    await executeClientOperation(req, res, "delete");
  },

  async updateClientDetails(req, res) {
    await executeClientOperation(req, res, "update");
  },
};

module.exports = ClientController;
