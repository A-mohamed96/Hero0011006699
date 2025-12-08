Supply Company Web Front-End (Static Prototype)
=============================================

What's included
- Front-end project built with HTML / CSS / JS (Bootstrap 5 via CDN).
- Pages: login, dashboard, farms, receivings, trucks, shipments, empty (packaging), pallets, suppliers, users, reports.
- Uses `localStorage` to simulate data storage so you can test add/edit operations locally.
- ZIP is ready to upload to any static hosting (cPanel, Netlify, GitHub Pages, etc).

How to use
1. Unzip the project and upload the folder contents to your hosting root (public_html).
2. Open `index.html` (Login page). For demo, any username/password will let you in.
3. All data is stored locally in your browser's localStorage. To reset demo data, open browser console and run:
   localStorage.clear();

Files
- index.html (Login)
- dashboard.html
- farms.html
- receivings.html
- trucks.html
- shipments.html
- empty.html
- pallets.html
- suppliers.html
- users.html
- reports.html
- assets/css/styles.css
- assets/js/app.js

Notes
- This is a front-end prototype ready for initial deployment. Backend/API integration is required for real multi-user, secure, persistent usage.
- To connect a backend later, make the forms and JS send/receive JSON via fetch() to your API endpoints.

Enjoy — if you want I can now:
- Add export-to-Excel/PDF buttons,
- Generate printable invoices,
- Create a minimal Node/PHP backend scaffold.

