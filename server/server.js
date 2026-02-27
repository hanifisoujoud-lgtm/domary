const express = require("express");
const cors = require("cors");
const authrouter = require("./routes/authroutes");
const productRouter = require("./routes/productroutes");
const reservationRouter = require("./routes/reservationroutes")
const blogsroutes = require("./routes/blogroutes")
const reclamationRoutes = require("./routes/reclamationroutes.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json());

app.use("/", authrouter);
app.use("/", productRouter);
app.use("/",reservationRouter);
app.use('/',blogsroutes) ;
app.use("/", reclamationRoutes); 


const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT} !!!`));
