const nodemailer = requires("nodemailer");

exports.mailSender = async (email,title,body)=>{
    try{ 
        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
          host: 'smtp.example.com',
          auth: {
            user: 'your_email@example.com',
            pass: 'your_password'
          }
        });
        let info = await transporter.sendMail({
            from:"StudyNotion",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(info);
        return info;

    } catch(error){
        console.log(error.message);
    }
}