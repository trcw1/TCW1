import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDER_EMAIL || 'noreply@tcw1.org';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  async send(options: EmailOptions): Promise<boolean> {
    try {
      if (!SENDGRID_API_KEY) {
        console.warn('SendGrid API key not configured. Email not sent.');
        return false;
      }

      await sgMail.send({
        to: options.to,
        from: FROM_EMAIL,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, '')
      });

      return true;
    } catch (error: any) {
      console.error('Email send failed:', error.message);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    const html = `
      <h1>Welcome to TCW1! 🎉</h1>
      <p>Hi ${firstName},</p>
      <p>Your account has been successfully created. You can now log in and start using TCW1 for your cryptocurrency payments.</p>
      <p>
        <a href="https://www.tcw1.org/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Go to Login
        </a>
      </p>
      <p>If you have any questions, please reply to this email.</p>
      <p>Best regards,<br>TCW1 Team</p>
    `;

    return this.send({
      to: email,
      subject: 'Welcome to TCW1!',
      html
    });
  }

  async sendTransactionEmail(email: string, userName: string, type: 'sent' | 'received', amount: string, currency: string): Promise<boolean> {
    const action = type === 'sent' ? 'Sent' : 'Received';
    const html = `
      <h2>${action} ${amount} ${currency}</h2>
      <p>Hi ${userName},</p>
      <p>A transaction has been processed on your TCW1 account:</p>
      <ul>
        <li><strong>Type:</strong> ${action}</li>
        <li><strong>Amount:</strong> ${amount} ${currency}</li>
        <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>
        <a href="https://www.tcw1.org/transactions" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Transaction
        </a>
      </p>
      <p>Best regards,<br>TCW1 Team</p>
    `;

    return this.send({
      to: email,
      subject: `Transaction: ${action} ${amount} ${currency}`,
      html
    });
  }

  async send2FAEnabledEmail(email: string): Promise<boolean> {
    const html = `
      <h2>Two-Factor Authentication Enabled</h2>
      <p>Two-factor authentication has been successfully enabled on your TCW1 account.</p>
      <p>From now on, you'll need to provide a code from your authenticator app when logging in.</p>
      <p>If you didn't enable this, please change your password immediately.</p>
      <p>Best regards,<br>TCW1 Team</p>
    `;

    return this.send({
      to: email,
      subject: '2FA Enabled on Your TCW1 Account',
      html
    });
  }

  async send2FADisabledEmail(email: string): Promise<boolean> {
    const html = `
      <h2>Two-Factor Authentication Disabled</h2>
      <p>Two-factor authentication has been disabled on your TCW1 account.</p>
      <p>You will no longer need an authenticator code when logging in.</p>
      <p>If you didn't do this, please change your password immediately.</p>
      <p>Best regards,<br>TCW1 Team</p>
    `;

    return this.send({
      to: email,
      subject: '2FA Disabled on Your TCW1 Account',
      html
    });
  }

  async sendPasswordChangedEmail(email: string): Promise<boolean> {
    const html = `
      <h2>Password Changed</h2>
      <p>Your TCW1 account password has been successfully changed.</p>
      <p>If you didn't make this change, please contact us immediately.</p>
      <p>Best regards,<br>TCW1 Team</p>
    `;

    return this.send({
      to: email,
      subject: 'Password Changed on Your TCW1 Account',
      html
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetLink = `https://www.tcw1.org/reset-password?token=${resetToken}`;
    const html = `
      <h2>Reset Your Password</h2>
      <p>You've requested to reset your TCW1 password.</p>
      <p>Click the link below to reset your password (valid for 24 hours):</p>
      <p>
        <a href="${resetLink}" style="background-color: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>TCW1 Team</p>
    `;

    return this.send({
      to: email,
      subject: 'Reset Your TCW1 Password',
      html
    });
  }

  async sendLoginNotificationEmail(email: string, ipAddress: string, device: string): Promise<boolean> {
    const html = `
      <h2>New Login Detected</h2>
      <p>Your TCW1 account was just accessed from:</p>
      <ul>
        <li><strong>IP Address:</strong> ${ipAddress}</li>
        <li><strong>Device:</strong> ${device}</li>
        <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>If this wasn't you, please change your password immediately.</p>
      <p>Best regards,<br>TCW1 Team</p>
    `;

    return this.send({
      to: email,
      subject: 'New Login on Your TCW1 Account',
      html
    });
  }
}

export const EmailService = new EmailService();
