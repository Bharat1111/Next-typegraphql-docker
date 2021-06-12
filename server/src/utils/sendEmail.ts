import nodemailer from "nodemailer"

export async function sendEmail(email: string, text: string) {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
        user: 'qbvrl7jhtrfcqas6@ethereal.email',
        pass: 'xuXsBPgPkeHbZrFzt1',
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: email, 
    subject: "Change Password", 
    html: text, 
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}