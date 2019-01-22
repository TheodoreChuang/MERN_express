const ChallengeModel = require("./../database/models/challenge_model");
const UserModel = require("./../database/models/user_model");

// API to get lists of submissions
// @return submission: array [{ submission }]
// Stretch: filtering, search, pagination
async function index(req, res, next) {
  try {
    const submissions = await ChallengeModel.aggregate([
      { $match: { "submissions.0": { $exists: true } } },
      { $unwind: "$submissions" },
      { $sort: { "submissions.createdAt": -1 } }, // most recent first
      { $limit: 50 },
      {
        $project: {
          title: 1,
          submission_id: "$submissions._id",
          submission_title: "$submissions.title",
          submission_description: "$submissions.description",
          submission_video: "$submissions.video",
          submission_createdAt: "$submissions.createdAt",
          submission_user_id: "$submissions.user.id",
          submission_user_nickname: "$submissions.user.nickname",
          submission_user_profile_image: "$submissions.user.profile_image"
        }
      }
    ]);
    return res.json(submissions);
  } catch (error) {
    return next(error);
  }
}

// API to create a new Submission for a Challenge
// @params id: string - challenge ID from middleware
// @params title: string
// @params description: string
// @params video:string - YouTube URL ID
// @return challenge: object
async function create(req, res, next) {
  try {
    // Save new submission to challenge object
    const { id } = req.params;
    const { title, description, video } = req.body;
    const { _id, nickname, profile_image } = req.user;

    const challenge = await ChallengeModel.findById(id);
    challenge.submissions.push({
      title,
      description,
      video,
      user: { id: _id, nickname, profile_image }
    });
    await challenge.save();

    // Save challenge details to user
    const user = await UserModel.findById(_id);
    user.submissions.push({
      challengeId: challenge.id,
      challengeTitle: challenge.title
    });
    await user.save();

    return res.json(challenge);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  index,
  create
};
