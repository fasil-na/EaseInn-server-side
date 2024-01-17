import { generateadminToken } from "../../middlewares/auth"

export const adminLogin = async(email:string,password:string)=>{
    const adminData = {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: process.env.ADMIN_ROLE,
      };
    if(adminData?.password === password && adminData?.email===email){
        
        const adminToken = generateadminToken()
        return {adminData,adminToken}
    }else{
        return ({message:"Incorrect Email or Password"})
    }
}