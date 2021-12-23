import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const dbname = process.env.NEXT_DB_NAME;
    const username = process.env.NEXT_DB_USERNAME;
    const password = process.env.NEXT_DB_PASSWORD;
    const url = `mongodb+srv://${username}:${password}@cluster0.ym2nv.mongodb.net/${dbname}?retryWrites=true&w=majority`;

    cached.promise = mongoose.connect(url).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
