const sgMail =require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'gaurav@engagedly.com',
    subject: 'Thanks for joining!',
    text: `Welcome to our team, ${name}. Hope you enjoy this journey!`
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'gaurav@engagedly.com',
    subject: 'Goodbye',
    text: `We regret that you want to leave us ${name}. Please tell us what can we do to make you stay?`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}