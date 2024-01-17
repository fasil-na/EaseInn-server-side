import nodemailer from "nodemailer";

export async function sendRejectMail(email: string) {
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
      subject: "Your Hotel Listing Has Been Rejected by EaseInn!",
      text: `
      Dear ,
      We regret to inform you that your submission does not meet all of our current listing criteria.
      we encourage you to resubmit your listing for another review. Thank you for your understanding.
        
      Warm regards,
      The EaseInn Team
        `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}




