import express from 'express'
import router1 from './routes/auth.js'
import router2 from './routes/fetchAllNotes.js'
import run from './db.js'
import cors from 'cors'
import dotenv from 'dotenv'


const app = express()
dotenv.config()
run()
const allowedOrigins = ['http://localhost:3000', 'https://notedrive.netlify.app'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};
app.use(express.json())
app.use(cors(corsOptions))

app.use('/auth', router1)
app.use('/notes', router2)

app.listen(process.env.PORT || 3001, () => {
  console.log(`Example app listening on port ${process.env.PORT || 3001}`)
})
