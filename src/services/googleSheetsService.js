// services/googleSheetsService.js
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export const exportToGoogleSheets = async (users) => {
  try {
    const values = users.map(user => [
      user.fullName,
      user.phone,
      user.email,
      user.age,
      user.yeardate,
      user.conditions,
      user.checkbox,
      user.documents,
      user.payment_status,
      user.slot_number,
      user.purchased_numbers,
      user.created_at
    ]);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Users!A:L',
      valueInputOption: 'RAW',
      resource: { values }
    });

    console.log('✅ Data exported to Google Sheets');
    return true;
  } catch (error) {
    console.error('❌ Google Sheets error:', error);
    return false;
  }
};