import Notes from "../models/Notes"
import User from "../models/User";
User.pre('remove', function(next) {
    const userId = this._id;
    // Delete all notes associated with this user
    Notes.deleteMany({ userId: userId }, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  });
  