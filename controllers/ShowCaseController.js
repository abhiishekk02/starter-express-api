const db1 = require("../db/test");

const executeShowcaseOperation = async (req, res, operationType) => {
  try {
    let queryText = "";
    let queryValues = [];
    const id = req.params.id;

    switch (operationType) {
      case "create":
        const { img_name, img_url } = req.body;
        // console.log(img_name, img_url);
        queryText = "INSERT INTO showcase (img_name, img_url) VALUES(? ,?)";
        queryValues = [img_name, img_url];
        break;
      case "update":
        const { newName, newUrl } = req.body;
        // console.log(newName, newUrl);
        queryText =
          "UPDATE showcase SET img_name = ?, img_url = ? WHERE img_id = ?";
        queryValues = [newName, newUrl, id];
        break;
      case "delete":
        queryText = "DELETE FROM showcase WHERE img_id = ?";
        queryValues = [id];
        break;
      case "archive":
        queryText = "UPDATE showcase SET archived_img = TRUE WHERE img_id = ?";
        queryValues = [id];
        break;
      case "unarchive":
        queryText = "UPDATE showcase SET archived_img = FALSE WHERE img_id = ?";
        queryValues = [id];
        break;

      default:
        throw new Error("Invalid operation type");
    }
    // console.log("Executing operation:", operationType);
    // console.log("Query Text:", queryText);
    // console.log("Query Values:", queryValues);

    db1.query(queryText, queryValues, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Error ${operationType} image`);
      } else {
        console.log(`Image ${operationType}d successfully`);
        res.status(200).send(`Image ${operationType}d successfully`);
      }
    });
  } catch (error) {
    console.error(`Error ${operationType} image:`, error);
    return res.status(500).json({ error: `Failed to ${operationType} image` });
  }
};

const showcaseController = {
  async getAllImages(req, res) {
    try {
      const queryText = `
            SELECT 
                img_url, 
                img_name, 
                img_id, 
                TO_CHAR(img_created_at, 'YYYY-MM-DD') AS date, 
                TO_CHAR(img_created_at, 'HH12:MIam') AS time
            FROM showcase 
            WHERE 
                archived_img = FALSE
                AND img_url LIKE 'https%'
            ORDER BY img_id DESC`;

      db1.query(queryText, (err, result) => {
        // console.log(result.rows);
        if (err) {
          console.log(err);
          res.status(500).send(`Error fetching images`);
        } else {
          console.log(`Images fetched successfully`);
          res.status(200).json(result); // Send the fetched data in the response
        }
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAllArchiveImages(req, res) {
    try {
      const queryText = `
            SELECT 
                img_url, 
                img_name, 
                img_id, 
                TO_CHAR(img_created_at, 'YYYY-MM-DD') AS date, 
                TO_CHAR(img_created_at, 'HH12:MIam') AS time
            FROM showcase 
            WHERE 
                archived_img = TRUE
                AND img_url LIKE 'https%'
            ORDER BY img_id DESC`;

      db1.query(queryText, (err, result) => {
        console.log(result.rows);
        if (err) {
          console.log(err);
          res.status(500).send(`Error fetching images`);
        } else {
          console.log(`Images fetched successfully`);
          res.status(200).json(result); // Send the fetched data in the response
        }
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async createImage(req, res) {
    try {
      console.log("Request Body:", req.body); // Log request body for debugging
      await executeShowcaseOperation(req, res, "create");
    } catch (error) {
      console.error("Error creating image:", error);
      return res.status(500).json({ error: "Failed to create image" });
    }
  },

  async updateImage(req, res) {
    executeShowcaseOperation(req, res, "update");
  },

  async deleteImage(req, res) {
    executeShowcaseOperation(req, res, "delete");
  },

  async archiveImage(req, res) {
    executeShowcaseOperation(req, res, "archive");
  },

  async unArchiveImage(req, res) {
    executeShowcaseOperation(req, res, "unarchive");
  },
};

module.exports = showcaseController;
