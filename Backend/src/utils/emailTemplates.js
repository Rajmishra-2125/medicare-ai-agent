/**
 * Factory functions to generate styled, responsive HTML emails.
 */

const baseStyles = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  color: #374151;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #F3F4F6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const headerStyles = `
  color: #4F46E5;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  border-bottom: 2px solid #E5E7EB;
  padding-bottom: 12px;
`;

const cardStyles = `
  background-color: #F9FAFB;
  padding: 20px;
  border-radius: 8px;
  margin: 24px 0;
  border: 1px solid #E5E7EB;
`;

export const appointmentConfirmationTemplate = (
  patientName,
  doctorName,
  date,
  timeSlots,
  meetingType
) => `
  <div style="${baseStyles}">
    <h2 style="${headerStyles}">Appointment Confirmed! 🎉</h2>
    <p style="font-size: 16px;">Dear <b>${patientName}</b>,</p>
    <p style="font-size: 16px;">Great news! Your booking with <strong>Dr. ${doctorName}</strong> has been officially confirmed.</p>
    
    <div style="${cardStyles}">
        <p style="margin: 8px 0; font-size: 15px;">📅 <strong>Date:</strong> ${new Date(date).toDateString()}</p>
        <p style="margin: 8px 0; font-size: 15px;">⏰ <strong>Time Slot:</strong> ${timeSlots}</p>
        <p style="margin: 8px 0; font-size: 15px;">📍 <strong>Meeting Type:</strong> ${meetingType || "IN_PERSON"}</p>
    </div>
    
    <p style="font-size: 15px; line-height: 1.6;">
      Please make sure to arrive or log on a few minutes early. If you need any assistance, reach out to the clinic directly.
    </p>
    <p style="font-size: 14px; color: #6B7280; text-align: center; margin-top: 32px;">
      Powered by MediCare Automation
    </p>
  </div>
`;

export const appointmentCancellationTemplate = (
  patientName,
  doctorName,
  date,
  reason
) => `
  <div style="${baseStyles}">
    <h2 style="${headerStyles} color: #DC2626;">Appointment Cancelled</h2>
    <p style="font-size: 16px;">Dear <b>${patientName}</b>,</p>
    <p style="font-size: 16px;">We writing to inform you that your upcoming appointment with <strong>Dr. ${doctorName}</strong> has been cancelled.</p>
    
    <div style="${cardStyles} background-color: #FEF2F2; border-color: #FCA5A5;">
        <p style="margin: 8px 0; font-size: 15px;">📅 <strong>Original Date:</strong> ${new Date(date).toDateString()}</p>
        <p style="margin: 8px 0; font-size: 15px; color: #991B1B;">⚠️ <strong>Reason:</strong> ${reason || "Not specified"}</p>
    </div>
    
    <p style="font-size: 15px; line-height: 1.6;">
      We apologize for any inconvenience. Please log in to your dashboard to reschedule a new time slot at your earliest convenience.
    </p>
    <p style="font-size: 14px; color: #6B7280; text-align: center; margin-top: 32px;">
      Powered by MediCare Automation
    </p>
  </div>
`;

export const prescriptionTemplate = (
  patientName,
  doctorName,
  clinicName,
  medsHtml,
  advice
) => `
  <div style="${baseStyles}">
    <h2 style="${headerStyles}">Medical Prescription</h2>
    <p style="font-size: 16px;">Dear <b>${patientName}</b>,</p>
    <p style="font-size: 16px;">Please find your prescription from <strong>Dr. ${doctorName}</strong> below:</p>
    
    <div style="${cardStyles}">
      <h3 style="margin-top: 0; color: #111827; font-size: 18px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px;">💊 Medications:</h3>
      <ul style="padding-left: 20px; line-height: 1.8; font-size: 15px;">
        ${medsHtml}
      </ul>
      
      ${
        advice
          ? `
        <h3 style="margin-top: 24px; color: #111827; font-size: 18px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px;">📝 Doctor's Advice:</h3>
        <p style="font-size: 15px; background-color: #EEF2FF; padding: 12px; border-radius: 6px; border-left: 4px solid #4F46E5;">
          ${advice}
        </p>
      `
          : ""
      }
    </div>
    
    <p style="color: #6B7280; font-size: 14px; text-align: center;">
      If you have any questions or experience side effects, please immediately reach out to <b>${clinicName || "our clinic"}</b>.
    </p>
    <p style="font-size: 14px; color: #6B7280; text-align: center; margin-top: 32px;">
      Powered by MediCare Automation
    </p>
  </div>
`;
