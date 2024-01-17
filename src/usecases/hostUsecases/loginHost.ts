import { findHostByEmail } from "../../repositories/hostRepository";
import { matchPassword } from "../../services/bcrypt";
import { generateHostAuthToken } from "../../middlewares/auth";
import { HostInterface } from "../../entities/hostModel";

export interface LoginResponse {
    userData: HostInterface;
    token: string;
}

export const loginHost = async (email: string, password: string): Promise<LoginResponse | { error: string }> => {
    const existingUser = await findHostByEmail(email);
    if (existingUser) {
        if (existingUser.status !== 'Active') {
            return { error: "Your account is not active." };
        }
        const isMatch = await matchPassword(password, existingUser.password);
        if (isMatch) {
            const token = generateHostAuthToken(existingUser);
            return { userData: existingUser, token };
        } else {
            return { error: "Password does not match." };
        }
    } else {
        return { error: "Host not found." };
    }
};

