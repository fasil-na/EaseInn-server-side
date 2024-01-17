import nodemailer from "nodemailer";

export async function sendApproveMail(email: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "fazilfaizy4@gmail.com",
        pass: "mfihhylvcnpraswj",
      },
    });

    const mailOptions = {
      from: "fazilfaizy4@gmail.com",
      to: email,
      subject: "Your Hotel Listing Has Been Approved by EaseInn!",
      text: `
      Dear ,
      Thank you for submitting your hotel details to EaseInn. We're excited to have your establishment potentially join our platform! We're here to assist!
      Thank you for choosing EaseInn as your partner in hospitality. Together, let's offer travelers an exceptional stay experience.
        
      Warm regards,
      The EaseInn Team
        `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}
