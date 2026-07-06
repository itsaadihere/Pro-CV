import nodemailer from 'nodemailer'
import { isBetaActive } from './beta'

interface SendEmailParams {
  userEmail: string
  userName: string
  jobId: string
  pdfBuffer: Buffer
}

export async function sendCVEmail({
  userEmail,
  userName,
  jobId,
  pdfBuffer,
}: SendEmailParams): Promise<boolean> {
  const host = process.env.TITAN_SMTP_HOST || 'smtp.titan.email'
  const port = parseInt(process.env.TITAN_SMTP_PORT || '465')
  const user = process.env.TITAN_EMAIL_USER
  const pass = process.env.TITAN_EMAIL_PASSWORD

  const isPlaceholder = !user || !pass || 
    user === 'your_titan_email' || 
    pass === 'your_titan_password' || 
    user.includes('placeholder')

  if (isPlaceholder) {
    console.warn('⚠️ TITAN MAIL BYPASS: Email credentials are not configured. Simulating successful email dispatch for testing.')
    return true
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const isBeta = isBetaActive()
  
  const fromEmail = `Sophi <${user}>`
  const subject = isBeta
    ? '🚀 Your Free Beta CV is Ready — Sophi'
    : '✅ Your AI-Optimized CV is Ready — Sophi'

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb; margin-bottom: 16px;">Your CV Transformation is Complete!</h2>
      <p>Hi ${userName || 'there'},</p>
      ${isBeta ? `
        <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:12px 16px;margin:16px 0;font-size:14px;color:#065f46;">
          <strong>🙏 Thank you for being a beta tester!</strong><br/>
          Your feedback helps us build a better product. 
          Reply to this email with any suggestions.
        </div>
      ` : ''}

      <p>Your new ATS-optimized CV is attached to this email as a PDF (ATS-Safe layout).</p>
      <p>You can also access it anytime, download other professional layouts, or copy your LinkedIn optimizer profile directly from your dashboard:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${appUrl}/result/${jobId}" 
           style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: bold;">
          View My CV Dashboard
        </a>
      </div>
      <h3 style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Your CV Package Includes:</h3>
      <ul style="padding-left: 20px; color: #475569;">
        <li style="margin-bottom: 8px;"><strong>ATS Score Report:</strong> Full grading across 5 dimensions (keyword match, formatting, achievements).</li>
        <li style="margin-bottom: 8px;"><strong>Fully Rewritten CV:</strong> Clean, keyword-optimized content tailored for recruiters.</li>
        <li style="margin-bottom: 8px;"><strong>LinkedIn Profile Optimizer:</strong> Custom headline, hook-focused summary, and top skill suggestions.</li>
        <li style="margin-bottom: 8px;"><strong>AI Cover Letter:</strong> Tailored specifically to your industry or job posting.</li>
        <li style="margin-bottom: 8px;"><strong>Gap Analysis:</strong> Actionable suggestions, missing keywords, and certification checklist.</li>
      </ul>
      <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
        Need help? Contact our WhatsApp support at +92-XXX-XXXXXXX.
      </p>
      <p style="margin-top: 16px; font-weight: bold; color: #475569;">— Team Sophi</p>
    </div>
  `

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    })

    await transporter.sendMail({
      from: fromEmail,
      to: userEmail,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: 'My-Sophi-Optimized.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    return true
  } catch (error) {
    console.error('Error sending email via Titan Mail:', error)
    return false
  }
}
