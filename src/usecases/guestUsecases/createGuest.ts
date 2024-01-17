
import { securePassword } from "../../services/bcrypt"
import { saveGuest } from "../../repositories/guestRepository"
export const createGuest=async(
    username: string,
    email: string,
    phone: string,
    password: string,
)=>{
    if(!username || !email || !phone || !password) {
        throw new Error("All fields are required");
    }
    const securedPassword = await securePassword(password);
    return await saveGuest(username, email, phone, securedPassword);
}
   