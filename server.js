const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

require('dotenv').config()
const SENDER_EMAIL_ADDRESS = process.env.SENDER_EMAIL_ADDRESS
const SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD
const RECEIVER_EMAIL_ADDRESS = process.env.RECEIVER_EMAIL_ADDRESS

const app = express()

// Enable CORS for all routes
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/send', (req, res) => {
    const { name, email, message } = req.body

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: SENDER_EMAIL_ADDRESS,
            pass: SENDER_EMAIL_PASSWORD,
        },
    })

    const mailOptions = {
        from: email,
        to: RECEIVER_EMAIL_ADDRESS,
        subject: 'New message from your website',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            res.status(500).send('Error sending email.')
        } else {
            console.log(`Email sent: ${info.response}`)
            res.send('Email sent successfully!')
        }
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
