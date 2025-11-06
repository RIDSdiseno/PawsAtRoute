"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// src/app.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_js_1 = __importDefault(require("./routes.js"));
const error_middleware_js_1 = require("./middlewares/error.middleware.js");
exports.app = (0, express_1.default)();
const UPLOAD_DIR = path_1.default.resolve(process.cwd(), "uploads");
if (!fs_1.default.existsSync(UPLOAD_DIR))
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
exports.app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
exports.app.use("/uploads", express_1.default.static(UPLOAD_DIR));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use('/api', routes_js_1.default);
// debug opcional de cookies:
exports.app.get('/debug/cookies', (req, res) => res.json({ cookies: req.cookies }));
exports.app.use(error_middleware_js_1.errorHandler);
