const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vishistsd@primco.com.au',
        subject: 'Welcome to the app',
        text: `Welcome to the app ${name}.`
    }).catch(e => console.log(e))
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vishistsd@primco.com.au',
        subject: 'Goodbye',
        text: `It's sad to see you go ${name}. Reply on how we could have done better`
    }).catch(e => console.log(e))
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}