const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema({
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
      date: {
        type: Date,
      },
      collaborators: [
        {
          id: {
            type: Schema.Types.ObjectId,
            ref: "users",
          },
          firstname: {
            type: String,
          },
          lastname: {
            type: String,
          },
        },
      ],
    },
  ],
});

module.exports = List = mongoose.model("list", ListSchema);
