import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./db.js"

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

function authenticateTokenCheck(req, res, next) {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    try {
        const [user] = await db("users")
            .insert({
                email,
                password_hash: hashed,
            })
            .returning(["id", "email"]);

        res.json(user);
    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user =  await db("users").where({ email }).first();

    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });


    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    res.json({ message: "Logged in" });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});


export {router as default, authenticateTokenCheck}