import { findGuestByEmail } from "../../repositories/guestRepository";
import { matchPassword } from "../../services/bcrypt";
import { generateAuthToken } from "../../middlewares/auth";
import { GuestInterface } from "../../entities/guestModel";

export interface LoginResponse {
    userData: GuestInterface;
    token: string;
}

export const loginGuest = async (email: string, password: string): Promise<LoginResponse | { error: string }> => {
    const existingUser = await findGuestByEmail(email);
    if (existingUser) {
      if (existingUser.status !== 'Active') {
        return { error: "Your account is not active." };
      }
      const isMatch = await matchPassword(password, existingUser.password);
      if (isMatch) {
        const token = generateAuthToken(existingUser);
        return { userData: existingUser, token };
      } else {
        return { error: "Password does not match." };
      }
    } else {
      return { error: "User not found." };
    }
};

  
