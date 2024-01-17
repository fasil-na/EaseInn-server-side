
import { securePassword } from "../../services/bcrypt"
import { saveHost } from "../../repositories/hostRepository"
export const createHost=async(
    username: string,
    email: string,
    phone: string,
    password: string,
)=>{
    if(!username || !email || !phone || !password) {
        throw new Error("All fields are required");
    }
    const securedPassword = await securePassword(password);
    return await saveHost(username, email, phone, securedPassword);
}
   