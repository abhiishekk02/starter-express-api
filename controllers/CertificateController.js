const db1 = require("../db/test");

const executeCertificateOperation = async (req, res, operationType) => {
  try {
    let queryText = "";
    let queryValues = [];
    const id = req.params.id;
    const { name, email, standard, status } = req.body;

    switch (operationType) {
      case "create":
        queryText =
          "INSERT INTO certificatesDataDB(name, email, standard, status) VALUES(?, ?, ?, ?)";
        queryValues = [name, email, standard, status];
        break;
      case "update":
        queryText =
          "UPDATE certificatesDataDB SET name = ?, email = ?, standard = ?, status = ? WHERE certificate_id = ?";
        queryValues = [name, email, standard, status, id];
        break;
      case "delete":
        queryText = "DELETE FROM certificatesDataDB WHERE certificate_id = ?";
        queryValues = [id];
        break;

      default:
        throw new Error("Invalid operation type");
    }

    db1.query(queryText, queryValues, (err, result) => {
      if (err) {
        console.error(`Error ${operationType} certificate:`, err);
        return res
          .status(500)
          .json({ error: `Failed to ${operationType} certificate` });
      } else {
        const successMessage = {
          create: "Certificate created successfully",
          update: "Certificate updated successfully",
          delete: "Certificate deleted successfully",
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

const certificateController = {
  async getAllCertificates(req, res) {
    try {
      const queryText =
        "SELECT certificate_id, name, certificate_number, standard, status, TO_CHAR(created_at, 'DD-MM-YYYY') AS date FROM certificatesDataDB ORDER BY certificate_id DESC";
      db1.query(queryText, (err, result) => {
        if (err) {
          console.error(`Error fetching certificate:`, err);
          return res
            .status(500)
            .json({ error: `Failed to fetching certificate` });
        } else {
          return res.status(200).json(result);
        }
      });
    } catch (error) {
      console.error("Error fetching certificates:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async createCertificate(req, res) {
    executeCertificateOperation(req, res, "create");
  },

  async updateCertificate(req, res) {
    executeCertificateOperation(req, res, "update");
  },

  async deleteCertificate(req, res) {
    executeCertificateOperation(req, res, "delete");
  },
  async getCertificateByUID(req, res) {
    const id = req.params.id;
    console.log("Received GET request for certificate verification", id);

    db1.query(
      "SELECT * FROM certificatesDataDB WHERE certificate_number = ?",
      [id],
      (err, result) => {
        if (err) {
          console.error("Error verify certificate:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        console.log(result);

        if (result && result.length > 0) {
          const certificate = result[0];
          return res.json({ certificate });
        } else {
          res.status(404).json({ error: "Certificate not found" });
        }
      }
    );
  },
};

module.exports = certificateController;
