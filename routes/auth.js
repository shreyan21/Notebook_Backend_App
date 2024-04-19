import { Router, json } from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import verifyToken from '../middleware/middle.js'
import { validationResult, body } from 'express-validator'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import Notes from '../models/Notes.js'
const router = Router()
dotenv.config()
const validateInputs = [
    body('name', 'Name is required').notEmpty().isString(),
    body('email', 'Invalid email address').isEmail(),
    body('password', 'Password must be atleast 6 characters long').isLength({ min: 6 }),
];
router.post('/create', validateInputs, async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const x = await User.findOne({ email: req.body.email })
    if (x) {
        return res.status(409).json({ message: "email already exists" })
    }
    // const user = new User(req.body)  
    const user = await User.create({ name: req.body.name, email: req.body.email, password: secPass })
    let code;
    let message;
    try {
        await user.save()

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
    const errors = validationResult(req);
    await User.updateOne({ email: req.body.email }, { $set: { password: secPass } }, { upsert: true })
    return res.send('Succesfully updated password')


})

router.post('/login', [body('email', 'Enter valid email').isEmail()

    , body('password', 'Password cannot be blank').exists()], async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.json({ error: errors.array() })
        }
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).json({ message: "User with this email does not exist" })
            }
            const password1 = await bcrypt.compare(req.body.password, user.password)
            if (password1) {
                const data = {
                    user: {
                        id: user.id,
                        name: user.name,
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

router.delete('/remove', verifyToken, async (req, res) => {
    // const options = { notFound: 'Document not found' }
    try {
           
           
           
        // const result = await User.findByIdAndDelete(req.body.id, options)
        // if (result === null) {
        //     return res.status(401).json(options.notFound)
        // }
        // else {
        //     return res.status(200).json(result)
        // }
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