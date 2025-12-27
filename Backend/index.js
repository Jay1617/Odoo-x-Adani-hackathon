
import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import connectDB from "./Db/index.db.js";

connectDB()
    .then(() => {
        const server = app.listen(process.env.PORT || 5500, () => {
            console.log(`⚙️ Server is running at port : 5500`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });