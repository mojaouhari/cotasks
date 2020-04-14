const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  tasks: [
    {
      done: {
        type: Boolean,
        default: false,
      },
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      creator: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      date: {
        type: Date,
      },
      collaborators: [
        {
          collaborator: {
            type: Schema.Types.ObjectId,
            ref: "users",
          },
        },
      ],
    },
  ],
});

module.exports = List = mongoose.model("list", ListSchema);
