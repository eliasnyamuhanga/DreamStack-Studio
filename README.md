# DreamStack Studio — React + Vite website

A responsive digital-studio website with a dark cyan/violet design, services, process, about section, contact form, rule-based StackBot FAQ assistant, and a demo profile/account interface.

## Included features

- Responsive landing page for desktop and mobile
- Services, process, about, and contact sections
- Project request form that prepares a WhatsApp message
- Optional EmailJS email notification
- Browser-local demo accounts, profile image, and request backup
- Rule-based FAQ chatbot (not connected to a live AI model)
- Form validation and toast feedback

## 1. Requirements

Install Node.js LTS. Vite's current documentation lists supported Node.js versions and setup instructions: https://vite.dev/guide/

## 2. Run on Windows

1. Download and extract `DreamStack-Studio.zip`.
2. Open the extracted `DreamStack-Studio` folder in VS Code. Make sure you open the folder containing `package.json`.
3. In VS Code, open **Terminal → New Terminal**.
4. Run:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

5. Open the local URL Vite prints in the terminal, usually `http://localhost:5173`.

If PowerShell says the file already exists when copying `.env.example`, that is fine; edit the existing `.env` instead.

## 3. Configure WhatsApp requests

Open `.env` in the project root. Set `VITE_WHATSAPP_NUMBER` to your real WhatsApp Business or contact number in international format using digits only. For example, a Tanzanian number would start with `255`; remove the leading `0`, plus sign, spaces, and dashes.

Example format only:

```env
VITE_WHATSAPP_NUMBER=2557XXXXXXXX
```

Replace the X characters with your actual number. Save the file and restart Vite after changing environment variables (`Ctrl+C`, then `npm run dev`). When a visitor submits the form, WhatsApp opens with the request prefilled. The visitor must still press **Send** in WhatsApp.

## 4. Optional EmailJS notifications

EmailJS can send an email notification from the contact form without you running your own backend. Create an EmailJS account, connect an email service, create an email template, and copy the service ID, template ID, and public key into `.env`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Configure the template variables to match these names:

- `customer_name`
- `customer_email`
- `service_type`
- `project_details`
- `submitted_at`

The EmailJS public key is intended for client-side use, but configure EmailJS allowed origins/security settings and quotas. Never put a private API key, email password, or other secret in a `VITE_` variable. Any `VITE_` value is bundled into client-side code.

## 5. Build for deployment

```powershell
npm run build
npm run preview
```

The production website files are generated in `dist/`. You can deploy this static frontend to a compatible hosting service. Configure the same environment variables in the hosting provider's project settings before building.

## Important limitations before public launch

This is a front-end starter, not a complete secure backend system. Demo account/profile information and project request backups are stored in the current browser's `localStorage`; they are not shared with you and can be cleared by the browser. The demo login is not secure authentication and must not be used for real customer accounts. Do not ask customers to enter sensitive information.

For a production business site, connect a backend/database or CRM to receive requests reliably, implement real authentication if needed, add privacy/terms pages, and replace demo contact/social information with your official details. Test the WhatsApp and EmailJS workflows before publishing.
