"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const mongo_1 = __importDefault(require("./config/mongo"));
const express_1 = __importDefault(require("express"));
const hostRoute_1 = __importDefault(require("./interfaces/routes/hostRoute"));
const guestRoute_1 = __importDefault(require("./interfaces/routes/guestRoute"));
const adminRoute_1 = __importDefault(require("./interfaces/routes/adminRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// app.use(cookieParser())
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/", guestRoute_1.default);
app.use("/host", hostRoute_1.default);
app.use("/admin", adminRoute_1.default);
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
const port = 5000;
(0, mongo_1.default)();
app.get("/", (req, res) => {
    res.send().status(200);
});
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
