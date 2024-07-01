import { Router, json } from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import verifyToken from '../middleware/middle.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import Notes from '../models/Notes.js'
import multer from 'multer'
import path from 'path'
import { log } from 'console'
import fs from 'fs'

const router = Router()

dotenv.config()
<<<<<<< HEAD
const validateInputs = [
    body('name', 'Name is required').notEmpty().isString(),
    body('email', 'Invalid email address').isEmail(),
    body('password', 'Password must be atleast 8 characters long').isLength({ min: 8 }),
];
router.post('/create', validateInputs, async (req, res) => {
=======

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images')
    }, filename: (req, file, cb) => {
        cb(null,file.fieldname+"_"+ Date.now() + '-' + path.extname(file.originalname))
    }
}
)

const upload = multer({ storage })



router.post('/create', upload.single('image'), async (req, res) => {
>>>>>>> 2d54a69 (modified functions)
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)

    const x = await User.findOne({ email: req.body.email })
    if (x) {
        return res.status(409).json({ message: "email already exists" })
    } 



    let code;
    let message;
    try {
        await User.create({ name: req.body.name, email: req.body.email, password: secPass, image: req.file.filename })

        code = 201
        message = "Created"

    }
    catch (e) {
        code = 500
        message = "Server error"
        return res.json(message)

    }
    return res.json({ message: "User created successfully" })



})

router.post('/resetPassword', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)
    await User.updateOne({ email: req.body.email }, { $set: { password: secPass } }, { upsert: true })
    return res.send('Succesfully updated password')


})

router.post('/login', async (req, res) => {



    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist" })
        }
        const password1 = await bcrypt.compare(req.body.password, user.password)

        if (password1) {
            // const x=parseInt(user.image) 
            const data = {
                user: {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                    email: req.body.email

                }
            }
            const authtoken = jwt.sign(data, process.env.JWT_SECRET)
         return res.status(200).json({ 'authtoken': authtoken })
        }
        else {

            return res.status(401).json({ message: "Invalid credentials" })
        }
    } catch (e) {
        return res.status(400).json({ error: e })
    }


})

router.put('/imgupdate',[verifyToken,upload.single('image')],async(req,res)=>{
  
    try{
    const userId=req.userid
    const user = await User.findById(userId);


    if (user.image) {
        const oldImagePath = path.join('D:/NoteBook - Copy/backend/uploads', 'images', user.image);
        console.log(oldImagePath);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error(`Failed to delete old image: ${err}`);
        });
      }
          user.image=req.file.filename
          await user.save()
        return res.status(200).json({message:'Profile image updated successfully',image:user.image})
    }
    catch(e){
        res.status(500).json({message:'Server error'})
    }
    
})
router.delete('/remove', verifyToken, async (req, res) => {
    // const options = { notFound: 'Document not found' }
    try {




        const user = await User.findById(req.body.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Notes.deleteMany({ user: user._id });

        const result = await user.deleteOne()
        return res.status(500).json(result)


    }
    catch (err) {
        return res.status(500).json(result)
    }
})

router.get('/view', async (req, res) => {
    let a = await User.find({}).select()
    return res.send(a)

})

export default router