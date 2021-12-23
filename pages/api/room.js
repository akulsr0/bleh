import bcrypt from "bcrypt";
import { connectDB } from "../../lib";
import Room from "../../models/Room";

export default async function (req, res) {
  await connectDB();

  try {
    switch (req.method) {
      case "GET": {
        const { roomId, password } = req.query;
        const room = await Room.findOne({ roomId });
        const result = bcrypt.compareSync(password, room.password);
        if (result) {
          return res.json({ success: true });
        } else {
          return res.json({ success: false });
        }
      }
      case "POST": {
        const { roomId, password } = JSON.parse(req.body);
        const hashPassword = bcrypt.hashSync(password, 10);
        const room = await Room.create({ roomId, password: hashPassword });
        return res.json({ success: true, room });
      }
    }
  } catch (error) {
    return res.json({ success: false, error });
  }
}
