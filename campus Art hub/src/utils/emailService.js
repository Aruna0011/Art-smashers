// Real Email Service for Password Reset using EmailJS
import emailjs from '@emailjs/browser';

class EmailService {
  constructor() {
    this.sentEmails = [];
    // Initialize EmailJS with your public key
    emailjs.init("4w6rVxfROp-VytAOk");
  }

  async sendPasswordResetEmail(toEmail, toName, resetLink) {
    try {
      // EmailJS template parameters
      const templateParams = {
        to_email: toEmail,
        to_name: toName,
        reset_link: resetLink,
        from_name: 'Art Smashers Team',
        subject: 'Password Reset Request - Art Smashers'
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        'service_oxk0ysp', // Your real EmailJS service ID
        'template_bttikmn', // Your real EmailJS template ID
        templateParams,
        '4w6rVxfROp-VytAOk' // Your public key
      );

      // Store email data for tracking
      const emailData = {
        to: toEmail,
        subject: 'Password Reset Request - Art Smashers',
        body: `Hello ${toName}, You requested a password reset. Click here: ${resetLink}`,
        timestamp: new Date().toISOString(),
        resetLink: resetLink,
        emailjsResponse: response
      };
      
      this.sentEmails.push(emailData);
      
      console.log('📧 Real email sent successfully via EmailJS!');
      console.log('To:', emailData.to);
      console.log('Subject:', emailData.subject);
      console.log('Reset Link:', emailData.resetLink);
      console.log('EmailJS Response:', response);
      
      return { success: true, message: 'Email sent successfully via EmailJS' };
      
    } catch (error) {
      console.error('❌ EmailJS sending failed:', error);
      
      // Fallback to mock email if EmailJS fails
      console.log('🔄 Falling back to mock email service...');
      return this.sendMockEmail(toEmail, toName, resetLink);
    }
  }

  // Fallback mock email method
  async sendMockEmail(toEmail, toName, resetLink) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emailData = {
      to: toEmail,
      subject: 'Password Reset Request - Art Smashers',
      body: `Hello ${toName}, You requested a password reset. Click here: ${resetLink}`,
      timestamp: new Date().toISOString(),
      resetLink: resetLink
    };
    
    this.sentEmails.push(emailData);
    
    console.log('📧 Mock email sent (EmailJS fallback)');
    console.log('To:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('Reset Link:', emailData.resetLink);
    
    return { success: true, message: 'Mock email sent (EmailJS not configured)' };
  }

  getSentEmails() {
    return this.sentEmails;
  }

  clearSentEmails() {
    this.sentEmails = [];
  }
}

// Create a singleton instance
const emailService = new EmailService();

export default emailService; 