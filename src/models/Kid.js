  import mongoose from "mongoose";

  const GameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    played: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
  });

  const KidSchema = new mongoose.Schema(
    {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      age: { type: Number, required: true, min: 1, max: 18 },
      sabha: {
        type: String,
        required: true,
        enum: [
          "Sardarkunj",
          "Akshar Colony",
          "Vanmalivanka Ni Pole",
          "Vadikotdi Ni Pole",
          "Aambalivali Pole",
          "Gheekanta",
          "Vadigam",
          "Shivshakti",
          "None",
        ],
      },
      mobile: { type: String },
      address: { type: String, default: "" },
      pictureUrl: { type: String, required: true },
      totalScore: { type: Number, default: 0 },
      games: [GameSchema],
    },
    {
      timestamps: true,
    }
  );

  export default mongoose.models.Kid || mongoose.model("Kid", KidSchema);