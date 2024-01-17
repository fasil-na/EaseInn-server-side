import bcrypt from 'bcrypt';

export const securePassword = async (password: string): Promise<string> => {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export const matchPassword=async(
    passwordOne:string,
    passwordTwo:string
)=>{
    return await bcrypt.compare(passwordOne,passwordTwo)
}