# Bigsofa Admin Frontend

React 19 + Vite application that provides an admin console for managing furniture items in the Bigsofa catalogue.

## Requirements
- Node.js 20+

## Run locally
```bash
cd admin_frontend
npm install
npm run dev
```
The dev server defaults to `http://localhost:5174`. Configure the API base URL via a `.env` file if needed:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Features
- Admin login backed by `/api/admin/login`. Token is stored in local storage and sent through the `X-Admin-Token` header on secured requests.
- Upload new furniture entries with name, description, price (in Tanzanian shilling cents), category, and an image (multipart).
- Edit existing entries and optionally replace the stored image.
- Delete items, including their associated image bytes.
- Paginated table with image previews, prices, and quick actions.

Log out at any time using the button in the dashboard header to clear the stored token.
