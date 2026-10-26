# Alpine Ascents — HTML5, CSS, Bootstrap and JavaScript

## Files
- `index.html` — page structure and content
- `css/styles.css` — styling and responsive layout
- `js/app.js` — live clock, local visitor counter, demo login/register, interactive map and browser geolocation

## Run it
Open `index.html` in a modern browser. An internet connection is needed for Bootstrap, Leaflet, OpenStreetMap tiles, Google Fonts, and the remote photos. Geolocation works on `localhost` or HTTPS in most browsers; browsers may block it when opening the file directly, so use VS Code Live Server if needed.

## Important limitations
- Visitor count uses `localStorage`; it counts page loads in this browser only, not all site visitors.
- Login/register is a front-end demo and stores the demo password locally in the browser. Do not use real credentials. It is not secure authentication and is not suitable for a public website.
- The map uses Leaflet with OpenStreetMap tiles and sample club markers. Geolocation requires the visitor's permission. Coordinates are displayed locally and are not sent to a server by this code.
- Stories are illustrative examples, not verified expedition reports.
