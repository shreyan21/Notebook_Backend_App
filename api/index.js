import express from 'express'
import router1 from '../routes/auth.js'
import router2 from '../routes/fetchAllNotes.js'
import run from '../db.js'
import cors from 'cors'


const app = express()
run()



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('uploads'))
app.use(cors())

app.use('/auth', router1)
app.use('/notes', router2)

app.listen(process.env.PORT || 3001, () => {
  console.log(`Example app listening on port ${process.env.PORT || 3001}`)
})
