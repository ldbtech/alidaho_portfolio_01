import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message, subject, isFreelance, projectType, projectBudget } = await request.json();

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER || process.env.NEXT_PUBLIC_GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD || process.env.NEXT_PUBLIC_GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      const errorMsg = `Email service is misconfigured. Missing environment variables: ${
        !gmailUser ? "GMAIL_USER / NEXT_PUBLIC_GMAIL_USER " : ""
      }${!gmailAppPassword ? "GMAIL_APP_PASSWORD / NEXT_PUBLIC_GMAIL_APP_PASSWORD" : ""}. Please check Vercel settings and trigger a redeploy.`;
      console.error(errorMsg);
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    // Configure the Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword, // 16-character app password (spaces ignored by Google, but typically pasted without spaces)
      },
    });

    // Theme values depending on mode
    const accentColorStart = isFreelance ? '#10B981' : '#3B82F6'; // Emerald vs Blue
    const accentColorEnd = isFreelance ? '#059669' : '#2563EB';
    const title = isFreelance ? 'New Freelance Project Inquiry 🚀' : 'New Career Contact Message 💼';
    const emailSubject = isFreelance 
      ? `Freelance Inquiry: ${projectType} (${projectBudget}) - from ${name}`
      : `Career Contact: ${subject || 'General Inquiry'} - from ${name}`;

    // Premium HTML Email Template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f4f5;
      color: #18181b;
      margin: 0;
      padding: 40px 20px;
    }
    .card {
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #e4e4e7;
      max-width: 600px;
      margin: 0 auto;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, ${accentColorStart} 0%, ${accentColorEnd} 100%);
      padding: 35px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 40px 30px;
    }
    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      font-weight: 700;
      margin-bottom: 12px;
      margin-top: 24px;
    }
    .section-title:first-child {
      margin-top: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    @media (min-width: 480px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    .field {
      background: #f4f4f5;
      padding: 14px 18px;
      border-radius: 12px;
    }
    .field-label {
      font-size: 9px;
      color: #71717a;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 4px;
      letter-spacing: 0.05em;
    }
    .field-value {
      font-size: 14px;
      font-weight: 600;
      color: #09090b;
    }
    .message-box {
      background: #fafafa;
      border-left: 4px solid ${accentColorStart};
      padding: 20px;
      border-radius: 4px 12px 12px 4px;
      font-size: 14px;
      line-height: 1.6;
      color: #27272a;
      border-top: 1px solid #f4f4f5;
      border-right: 1px solid #f4f4f5;
      border-bottom: 1px solid #f4f4f5;
      margin-top: 8px;
      white-space: pre-wrap;
    }
    .footer {
      text-align: center;
      padding: 25px;
      font-size: 11px;
      color: #a1a1aa;
      border-top: 1px solid #f4f4f5;
      background: #fafafa;
    }
    .footer a {
      color: ${accentColorStart};
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      <div class="section-title">Sender Information</div>
      <div class="grid">
        <div class="field">
          <div class="field-label">Full Name</div>
          <div class="field-value">${name}</div>
        </div>
        <div class="field">
          <div class="field-label">Email Address</div>
          <div class="field-value"><a href="mailto:${email}" style="color: ${accentColorStart}; text-decoration: none;">${email}</a></div>
        </div>
      </div>
      
      ${isFreelance ? `
      <div class="section-title">Project Details</div>
      <div class="grid">
        <div class="field">
          <div class="field-label">Project Type</div>
          <div class="field-value" style="color: ${accentColorStart};">${projectType}</div>
        </div>
        <div class="field">
          <div class="field-label">Estimated Budget</div>
          <div class="field-value" style="color: #059669;">${projectBudget}</div>
        </div>
      </div>
      ` : `
      <div class="section-title">Subject Line</div>
      <div class="field" style="margin-bottom: 24px;">
        <div class="field-value">${subject || 'General Inquiry'}</div>
      </div>
      `}
      
      <div class="section-title">Message Body</div>
      <div class="message-box">${message}</div>
    </div>
    <div class="footer">
      This inquiry was sent from the portfolio website of <a href="https://alidaho.dev">Ali Dahou</a>
    </div>
  </div>
</body>
</html>
    `;

    // Mail configurations
    const mailOptions = {
      from: `"Portfolio Contact Form" <${gmailUser}>`,
      to: gmailUser, // Sends the email to yourself
      replyTo: email, // Clicking "Reply" goes straight to the sender
      subject: emailSubject,
      text: `New Portfolio Message from ${name}\n\nEmail: ${email}\n${
        isFreelance ? `Project Type: ${projectType}\nBudget: ${projectBudget}` : `Subject: ${subject}`
      }\n\nMessage:\n${message}`,
      html: htmlContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Inquiry sent successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Nodemailer service error:", error);
    return NextResponse.json({ error: error.message || "Failed to send email message" }, { status: 500 });
  }
}
