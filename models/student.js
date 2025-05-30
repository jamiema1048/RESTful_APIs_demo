const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
  studentID: {
    type: Number,
    required: true,
    min: 1,
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  age: {
    type: Number,
    default: 18,
    max: [50, "Maybe too old....."],
    min: [5, "U still a baby....."],
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0,
      max: [5000, "Maybe too much....."],
      default: 0,
    },
    other: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
