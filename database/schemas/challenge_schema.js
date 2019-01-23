const { Schema } = require("mongoose");
const SubmissionSchema = require("./submission_schema");

const ChallengeSchema = new Schema(
  {
    user: {
      id: {
        type: String
      },
      nickname: {
        type: String
      },
      profile_image: {
        type: String
      }
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    yt_id: {
      type: String
    },
    yt_url: {
      type: String
    },
    expiry_date: {
      type: Date,
      min: Date.now,
      default: Date.now() + 31536000000 // 1 year from now
    },
    submissions: [SubmissionSchema]
  },
  { timestamps: {} }
);

module.exports = ChallengeSchema;
