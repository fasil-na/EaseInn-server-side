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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHost = void 0;
const hostRepository_1 = require("../../repositories/hostRepository");
const bcrypt_1 = require("../../services/bcrypt");
const createHost = (username, email, phone, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existingHost = yield (0, hostRepository_1.findHostByEmail)(email);
    if (!existingHost) {
        const securedPassword = yield (0, bcrypt_1.securePassword)(password);
        return yield (0, hostRepository_1.saveHost)(username, email, phone, securedPassword);
    }
    else {
        throw new Error("Email already exists in the database");
    }
});
exports.createHost = createHost;
