const { google } = require('googleapis');

// The column order in your Google Sheet
const SHEET_COLUMN_ORDER = [
    'timestamp', 'formName', 'name', 'email', 'phone', 'date', 'venue', 
    'heardAbout', 'package', 'services', 'requests', 'message', 
    'rating', 'review', 'songTitle', 'songArtist', 'bookingStatus'
];

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const payload = JSON.parse(event.body).payload;
        console.log("Received payload:", payload);

        // For Netlify forms submitted via standard HTML POST
        let formData = payload.data; 

        // For forms submitted via JS/AJAX (like your booking forms)
        // Check if data is a stringified JSON and parse it
        if (typeof payload.data === 'string') {
            try {
                // This will handle the case where the data is double-encoded
                 formData = JSON.parse(payload.data);
            } catch (e) {
                // If it's not a JSON string, it might be urlencoded
                // This can happen with your simpler forms if they ever get submitted via JS
                const params = new URLSearchParams(payload.data);
                formData = Object.fromEntries(params.entries());
            }
        }
        
        const formName = payload.form_name || formData.formName || 'Unknown Form';
        console.log("Processing form:", formName);
        console.log("Form data:", formData);
        
        // --- Google Sheets API Authentication ---
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        const sheetName = process.env.GOOGLE_SHEET_NAME;

        // --- Data Mapping and Formatting ---
        const timestamp = new Date().toISOString();

        const rowData = {
            timestamp: timestamp,
            formName: formName,
            name: formData.name || '',
            email: formData.email || '',
            phone: formData.phone || '',
            date: formData.date || '',
            venue: formData.venue || '',
            heardAbout: formData['heard-about'] || '',
            package: formData.package || '',
            services: Array.isArray(formData.services) ? formData.services.join(', ') : (formData.services || ''),
            requests: formData.requests || '',
            message: formData.message || '',
            rating: formData.rating || '',
            review: formData.review || '',
            songTitle: formData.songTitle || '',
            songArtist: formData.songArtist || '',
            bookingStatus: formData.bookingStatus || ''
        };
        
        // Map the data object to an array in the correct column order
        const rowValues = SHEET_COLUMN_ORDER.map(header => rowData[header] || '');

        // --- Appending Data to Sheet ---
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [rowValues],
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Sheet updated successfully!' }),
        };

    } catch (error) {
        console.error('Error processing submission:', error);
        // Log the event body to see what was received
        console.error('Received event body:', event.body);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update sheet.' }),
        };
    }
};