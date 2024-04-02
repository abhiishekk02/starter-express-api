const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const CertificateRouter = require("./routes/CertificateRoute");
const ShowCaseRouter = require("./routes/ShowCaseRoute");
const UserAuthRouter = require("./routes/UserAuthRoute");
const ContactFormRouter = require("./routes/ContactFormRoute");
const ClientRouter = require("./routes/ClientRoutes");
const AnalyticsRoute = require("./routes/AnalyticsRoute");
const TodoListRoute = require("./routes/TodoListRoute");
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mount the certificate router
app.use("/certificate", CertificateRouter);
app.use("/showcase", ShowCaseRouter);
app.use("/userAuth", UserAuthRouter);
app.use("/contactForm", ContactFormRouter);
app.use("/clientDetails", ClientRouter);
app.use("/analytics", AnalyticsRoute);
app.use("/todolist", TodoListRoute);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
