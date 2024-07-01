import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

async function run() {
const password=encodeURIComponent(process.env.PASSWORD)
 
// const MONGO_URI=`mongodb://localhost:27017/ibook`
const MONGO_URI=`mongodb+srv://utkarsh:${password}@cluster0.o6fzdhp.mongodb.net/ibook?retryWrites=true&w=majority&appName=Cluster0`


    try {
        await mongoose.connect(MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connection successful");
    }
    catch (error) {
        console.log("Connection unsuccessful");
    }
}

export default run