import { hash } from "bcryptjs";
import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  //   only post method is accepted
  if (req.method === "POST") {
    if (!req.body)
      return res.status(404).json({ error: "Don't have form data...!" });
    const { email, password } = req.body;

    // check duplicate users
    const checkexisting = await Users.findOne({ email });
    if (checkexisting)
      return res.status(422).json({ message: "User Already Exists...!" });

    //hash and create data in mongodb
    //hash and create data in mongodb
    try {
      const user = await Users.create({
        email,
        password: await hash(password, 12),
      });
      res.status(201).json({ status: true, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to create user." });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid, Only POST Accepted" });
  }
}
