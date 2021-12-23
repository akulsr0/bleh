import { model, models, Schema } from "mongoose";

const RoomSchema = new Schema({
  roomId: {
    type: String,
    required: true,
    maxlength: 6,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default models.Room || model("Room", RoomSchema);
