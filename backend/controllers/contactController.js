const nodemailer = require('nodemailer')
const Contact = require('../models/Contact')

const createTransport = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

// POST /api/contact
exports.send = async (req, res) => {
  try {
    const { name, email, message } = req.body

    // 1. Save to DB
    const contact = await Contact.create({ name, email, message })

    // 2. Send notification email to admin
    if (process.env.EMAIL_USER) {
      const transporter = createTransport()

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New message from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px">
            <h2 style="color:#00d4ff">New Contact Message</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Message:</strong></p>
            <blockquote style="border-left:3px solid #00d4ff;padding-left:12px;color:#555">${message}</blockquote>
            <p style="color:#999;font-size:12px">Received at ${new Date().toUTCString()}</p>
          </div>
        `,
      })

      // 3. Send confirmation to sender
      await transporter.sendMail({
        from: `"Your Name" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Got your message!',
        html: `
          <div style="font-family:sans-serif;max-width:480px">
            <h2>Hi ${name}! 👋</h2>
            <p>Thanks for reaching out. I've received your message and will get back to you within 24–48 hours.</p>
            <p style="color:#999;font-size:12px">This is an automated confirmation. Please don't reply to this email.</p>
          </div>
        `,
      })
    }

    res.status(201).json({ message: 'Message sent successfully', id: contact._id })
  } catch (err) {
    console.error('Contact error:', err)
    res.status(500).json({ message: 'Failed to send message' })
  }
}
