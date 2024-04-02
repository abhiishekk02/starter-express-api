const db = require("../db/test");

const contactFormController = {
  async postContactFormDetails(req, res) {
    const { contact_name, contact_email, contact_phone } = req.body;
    console.log(contact_name);

    try {
      const response = await db.query(
        "INSERT INTO contactFormDataDB(contact_name, contact_email, contact_phone ) VALUES(?,?,?)",
        [contact_name, contact_email, contact_phone]
      );
      res.status(200).send("successfully submitted");
    } catch (error) {
      console.error("Failed to submit contact form details");
    }
  },

  async getAllNotifications(req, res) {
    try {
      const queryText = `
          SELECT 
        contact_id, 
        contact_name, 
        contact_email, 
        contact_phone, 
        mark_read,
        DATE_FORMAT(upload_time, '%d/%m') AS upload_date,
        DATE_FORMAT(upload_time, '%h:%i %p') AS upload_time 
      FROM 
        contactFormDataDB
     
      ORDER BY 
        contact_id DESC;
          `;
      db.query(queryText, (err, result) => {
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
  async updateNotification(req, res) {
    const { id } = req.body;
    console.log("IDs to update:", id);

    try {
      for (const i of id) {
        console.log("Updating notification with ID:", i);
        db.query(
          `UPDATE contactFormDataDB SET mark_read = TRUE WHERE contact_id = ?`,
          [i],
          (err, response) => {
            if (err) {
              console.error("Error updating notification:", err);
            } else {
              if (response.affectedRows === 0) {
                console.warn(`Notification with ID ${i} not found.`);
              } else {
                console.log(`Notification with ID ${i} updated successfully.`);
              }
            }
          }
        );
      }

      res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
      console.error("Error updating notifications:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
module.exports = contactFormController;
