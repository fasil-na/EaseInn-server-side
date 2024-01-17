import nodemailer from 'nodemailer'; 

export function generateOTP(): string {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

export async function sendOtpMail(email: string, otp: string) { 
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
        subject: 'Your OTP for user verification',
        text: `Your OTP is ${otp}. Please enter this code to verify your account.`,
      };
      
        await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
}




