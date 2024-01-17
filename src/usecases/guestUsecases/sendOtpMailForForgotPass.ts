import nodemailer from 'nodemailer'; 

export async function sendOtpMailForForgotPass(email: string, otp: string) { 
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'fazilfaizy4@gmail.com',
          pass: 'mfihhylvcnpraswj',
        },
      });
      
      const mailOptions = {
        from: 'fazilfaizy4@gmail.com',
        to: email,
        subject: 'Your OTP if you forgot password',
        text: `Your OTP is ${otp}. Please enter this code to Update your password.`,
      };
      
        await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
}




