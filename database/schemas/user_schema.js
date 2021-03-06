const { Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

//  @email: string - from passport-local-mongoose
//  @password: string - from passport-local-mongoose, salted and hashed
const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    profile_image: {
      type: String
    },
    gender: {
      type: String,
      default: "gender-neutral",
      enum: ["male", "female", "gender-neutral"]
    },
    age: {
      type: Number,
      min: 0,
      max: 150
    },
    location: {
      type: String
    },
    is_verified: {
      type: Boolean,
      default: false
    },
    is_admin: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
    submissions: [
      {
        challengeId: {
          type: String
          // required: true
        },
        challengeTitle: {
          type: String
          // required: true
        },
        challengeDescription: {
          type: String
        },
        video_url: {
          type: String
        },
        createdAt: {
          type: Date,
          default: Date.now()
        }
      }
    ]
  },
  { timestamps: {} }
);

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = UserSchema;
