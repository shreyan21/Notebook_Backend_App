import mongoose, { Schema } from "mongoose";
import User from "./User";
const NotesSchema = new Schema({
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    tag: { type: String, default: "General" },
    date: { type: Date, default: Date.now }

})

export default mongoose.model('Notes', NotesSchema)

User.pre('remove', function(next) {
    const user = this;
    // Remove all notes that belong to this user
    Note.deleteMany({ user: user._id }, (err) => {
        if (err) {
            return next(err);
        }
        next();
    });
});
