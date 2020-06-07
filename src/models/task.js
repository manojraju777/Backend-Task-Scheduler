const mongoose = require("mongoose")
const Schema = mongoose.Schema

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true,
      immutable: true
    },
    createdBy: {
      type: String,
      default: ""
    },
    updatedAt: {
      type: Date,
      required: true
    },
    updatedBy: {
      type: String,
      default: ""
    }
  },
  {
    strict: true,
    strictQuery: true,
    timestamps: false
  }
)

taskSchema.pre("validate", function () {
  this.set({
    createdAt: new Date(),
    updatedAt: new Date()
  })
})

taskSchema.pre('findOneAndUpdate', function (next) {
  const docToUpdate = this._update

  if (!docToUpdate.createdAt) {
    docToUpdate.createdAt = new Date()
  }

  docToUpdate.updatedAt = new Date()

  next()
})

module.exports = mongoose.model("tasks",
  taskSchema, "tasks")
