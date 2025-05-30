const express = require("express");
var cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/student");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/exampleDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/students", async (req, res) => {
  try {
    let studentData = await Student.find({}).exec();
    return res.send(studentData);
  } catch (err) {
    return res.status(500).send("An error occurs when finding data.....");
  }
});

app.get("/students/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id }).exec();
    return res.send(foundStudent);
  } catch (err) {
    return res.status(500).send("An error occurs when finding data.....");
  }
});

app.post("/students", async (req, res) => {
  try {
    let { studentID, name, age, merit, other } = req.body;
    let newStudent = new Student({
      studentID,
      name,
      age,
      scholarship: {
        merit,
        other,
      },
    });
    let savedStudent = await newStudent.save();
    return res.send({
      msg: "Data saved.....",
      savedObject: savedStudent,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

app.put("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let { studentID, name, age, merit, other } = req.body;
    let newData = await Student.findOneAndUpdate(
      { _id },
      { studentID, name, age, scholarship: { merit, other } },
      {
        new: true,
        runValidators: true,
        overwrite: true, //覆蓋所有數據
        //HTTP的PUT req就是要求client提供所有數據
        //我們需要根據client提供的數據，來更新資料庫內的資料
      }
    );
    return res.send({ msg: "Data updated.....", updatedData: newData });
  } catch (err) {
    return res.status(400).send(err);
  }
});

class NewData {
  constructor() {}
  setProperty(key, value) {
    if (key !== "merit" && key !== "other") {
      this[key] = value;
    } else {
      this[`scholarship.${key}`] = value;
    }
  }
}

app.patch("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let newObject = new NewData();
    for (let property in req.body) {
      newObject.setProperty(property, req.body[property]);
    }
    let newData = await Student.findByIdAndUpdate({ _id }, newObject, {
      new: true,
      runValidators: true,
      // 不能寫overwrite: true
    });
    return res.send({ msg: "Data updated.....", updatedData: newData });
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.delete("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let deleteResult = await Student.deleteOne({ _id });
    return res.send(deleteResult);
  } catch (err) {
    return res.status(500).send("Failed to delete data.....");
  }
});

app.listen(1140, () => {
  console.log("Server is listening port 1140......");
});
