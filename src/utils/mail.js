import nodemailer from "nodemailer";
import { ApiError } from "./api-error.js";

class EmailService {
  constructor() {
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Log environment variables in development (without sensitive data)
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email Service Configuration:');
      console.log('Host:', process.env.MAILTRAP_SMTP_HOST);
      console.log('Port:', process.env.MAILTRAP_SMTP_PORT);
      console.log('User configured:', !!process.env.MAILTRAP_SMTP_USER);
    }

    // Check if we're in test environment
    if (process.env.NODE_ENV === 'test') {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'test@ethereal.email',
          pass: 'testpass'
        }
      });
      return;
    }

    const host = process.env.MAILTRAP_SMTP_HOST;
    const port = parseInt(process.env.MAILTRAP_SMTP_PORT);
    const user = process.env.MAILTRAP_SMTP_USER;
    const pass = process.env.MAILTRAP_SMTP_PASS;

    // Check if we're missing any required email configuration
    const missingVars = [];
    if (!host) missingVars.push('MAILTRAP_SMTP_HOST');
    if (!port) missingVars.push('MAILTRAP_SMTP_PORT');
    if (!user) missingVars.push('MAILTRAP_SMTP_USER');
    if (!pass) missingVars.push('MAILTRAP_SMTP_PASS');

    // If we're missing any config vars, use development mode transport
    if (missingVars?.length > 0) {
      console.warn("⚠️ Email service configuration missing:", missingVars.join(', '));
      console.log('ℹ️ Using development mode email transport');
      
      this.transporter = {
        sendMail: (mailOptions) => {
          console.log('📧 Email would be sent in production:');
          console.log('To:', mailOptions.to);
          console.log('Subject:', mailOptions.subject);
          return Promise.resolve({ messageId: 'dev-mode' });
        }
      };
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        auth: { user, pass },
        secure: false,
        debug: process.env.NODE_ENV === "development",
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
      });

      // Verify the connection
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email service connection failed:', error.message);
        } else {
          console.log('✅ Email service connected successfully');
        }
      });

    } catch (error) {
      console.error('❌ Failed to initialize email transport:', error);
      throw new ApiError(500, 'Failed to initialize email service');
    }
  }

  async sendVerificationEmail(user, verificationUrl) {
    if (!user?.email || !verificationUrl) {
      throw new ApiError(400, "Email and verification URL are required");
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔵 Sending verification email to:', user.email);
        console.log('🔗 Verification URL:', verificationUrl);
      }

      const mailOptions = {
        from: {
          name: "Project Management",
          address: process.env.SMTP_FROM_EMAIL || "no-reply@projectmgmt.com"
        },
        to: user.email,
        subject: "Verify Your Email",
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Hi ${user.username},</p>
            <p>Welcome to Project Management! Please verify your email by clicking the button below:</p>
            <div style="margin: 20px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">This link will expire in 30 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
          </body>
          </html>
        `,
        text: `Hi ${user.username},\n\nPlease verify your email by clicking the following link:\n${verificationUrl}\n\nThis link will expire in 30 minutes.`
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new ApiError(
        500, 
        `Failed to send verification email: ${error.message || "Unknown error"}`
      );
    }
  }

  async sendPasswordResetEmail(user, resetUrl) {
    try {
      const mailOptions = {
        from: '"Project Management" <no-reply@projectmgmt.com>',
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <h1>Password Reset</h1>
          <p>Hi ${user.username},</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 10 minutes.</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new ApiError(500, "Failed to send password reset email");
    }
  }
}

export const emailService = new EmailService();
