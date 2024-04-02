const db1 = require("../db/test");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginAuthController = {
  async signUp(req, res) {
    const { username, password } = req.body;
    const lowercaseUsername = username.toLowerCase();

    try {
      db1.query(
        "SELECT * FROM vrglobal_users_info WHERE user_name = ?",
        [lowercaseUsername],
        async (err, existingUser) => {
          if (err) {
            console.error("Error checking existing user:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
          }

          try {
            const hashedPassword = await bcrypt.hash(password, 10);

            db1.query(
              `
              INSERT INTO vrglobal_users_info (user_name, user_password_hash)
              VALUES (?, ?)
              `,
              [lowercaseUsername, hashedPassword],
              (err, newUserResult) => {
                if (err) {
                  console.error("Error inserting new user:", err);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }

                res.status(201).json({
                  success: true,
                  message: "User registered successfully",
                  user_id: newUserResult.insertId,
                  redirect_url: "/admin",
                });
              }
            );
          } catch (error) {
            console.error("Error hashing password:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        }
      );
    } catch (error) {
      console.error("Error checking existing user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async verifyLogin(req, res) {
    const { username, password } = req.body;

    try {
      console.log(username, password);
      db1.query(
        `SELECT * FROM vrglobal_users_info WHERE user_name = ? `,
        [username],
        async (err, rows) => {
          if (err) {
            console.error("Error verifying login:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          if (rows.length === 0) {
            return res
              .status(401)
              .json({ message: "Invalid username or password" });
          }

          const isPasswordCorrect = await bcrypt.compare(
            password,
            rows[0].user_password_hash
          );

          if (!isPasswordCorrect) {
            return res
              .status(401)
              .json({ message: "Invalid username or password" });
          }

          const token = jwt.sign({ username: username }, "your_secret_key", {
            expiresIn: "4d",
          });

          res.json({
            success: true,
            message: "Login successful",
            token,
            user_id: rows[0].user_id,
            redirect_url: "/dashboard/Home",
          });
        }
      );
    } catch (error) {
      console.error("Error verifying login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateUserDetails(req, res) {
    const { firstName, lastName, email, country, profile_picture, userID } =
      req.body;
    console.log(profile_picture);

    try {
      db1.query(
        `
          UPDATE vrglobal_users_info
          SET first_name = ?,
              last_name = ?,
              user_email = ?,
              country = ?,
              profile_picture = ?
          WHERE user_id = ?;
          `,
        [firstName, lastName, email, country, profile_picture, userID],
        (err, result) => {
          if (err) {
            console.error("Error updating user details:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
          }

          res.status(200).json({
            success: true,
            message: "User details updated successfully",
          });
        }
      );
    } catch (error) {
      console.error("Error updating user details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getUserInfoByID(req, res) {
    const user_id = req.params.id;

    db1.query(
      "SELECT * FROM vrglobal_users_info WHERE user_id = ?",
      [user_id],
      (err, userDetails) => {
        if (err) {
          console.log(err.message, err);
          return res.status(500).json({ message: "Internal server error" });
        }

        if (userDetails.length > 0) {
          const response = userDetails[0];
          res.status(200).json(response);
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      }
    );
  },

  async resetPassword(req, res) {
    const { userID, currentPassword, newPassword } = req.body;

    try {
      db1.query(
        "SELECT * FROM vrglobal_users_info WHERE user_id = ?",
        [userID],
        async (err, rows) => {
          if (err) {
            console.error("Error verifying user:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid user" });
          }

          const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            rows[0].user_password_hash
          );

          console.log(isPasswordCorrect);

          if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);

          db1.query(
            "UPDATE vrglobal_users_info SET user_password_hash = ? WHERE user_id = ?",
            [hashedPassword, userID],
            (err) => {
              if (err) {
                console.error("Error updating password:", err);
                return res.status(500).json({ error: "Internal server error" });
              }

              res.json({ success: true, message: "Password reset successful" });
            }
          );
        }
      );
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = loginAuthController;
