"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findHostByEmail = exports.saveHost = void 0;
const hostModel_1 = __importDefault(require("../entities/hostModel"));
const saveHost = (username, email, phone, password) => __awaiter(void 0, void 0, void 0, function* () {
    const host = new hostModel_1.default({ username, email, phone, password });
    return yield host.save();
});
exports.saveHost = saveHost;
const findHostByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const hostData = yield hostModel_1.default.findOne({ email });
    return hostData;
});
exports.findHostByEmail = findHostByEmail;
