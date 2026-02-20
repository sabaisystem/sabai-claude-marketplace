import { google } from "googleapis";
import fs from "fs";
import path from "path";
import http from "http";
import { URL } from "url";

const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS || path.join(process.cwd(), "config", "credentials.json");
const TOKEN_PATH = process.env.GOOGLE_TOKEN || path.join(process.cwd(), "config", "token.json");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.labels",
];

async function authenticate() {
  // Ensure config directory exists
  const configDir = path.dirname(CREDENTIALS_PATH);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Check for credentials file
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.log("\n========================================");
    console.log("Google OAuth Setup for Sabai Gmail");
    console.log("========================================\n");
    console.log("1. Go to https://console.cloud.google.com/");
    console.log("2. Create or select a project");
    console.log("3. Enable the Gmail API");
    console.log("4. Go to Credentials > Create Credentials > OAuth client ID");
    console.log("5. Choose 'Desktop app' as the application type");
    console.log("6. Download the JSON file");
    console.log(`7. Save it as: ${CREDENTIALS_PATH}`);
    console.log("\nThen run this script again.");
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  // Use localhost for OAuth callback (matches Google credentials)
  const redirectUri = "http://localhost:3000";
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\n========================================");
  console.log("Authorize Sabai Gmail Plugin");
  console.log("========================================\n");
  console.log("Opening browser for authorization...\n");
  console.log("If browser doesn't open, visit this URL:\n");
  console.log(authUrl);
  console.log("\n");

  // Open browser
  const open = (await import("open")).default;
  await open(authUrl);

  // Start local server to receive callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, "http://localhost:3000");
        if (url.pathname === "/" || url.pathname === "/oauth2callback") {
          const code = url.searchParams.get("code");
          if (code) {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            // Save tokens
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
              <html>
                <body style="font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5;">
                  <div style="text-align: center; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h1 style="color: #f26a2c;">Sabai Gmail</h1>
                    <p style="color: #333; font-size: 18px;">Authorization successful!</p>
                    <p style="color: #666;">You can close this window.</p>
                  </div>
                </body>
              </html>
            `);

            console.log("Authorization successful!");
            console.log(`Token saved to: ${TOKEN_PATH}`);
            server.close();
            resolve(tokens);
          } else {
            res.writeHead(400);
            res.end("No authorization code received");
            reject(new Error("No authorization code"));
          }
        }
      } catch (err) {
        res.writeHead(500);
        res.end("Error during authorization");
        reject(err);
      }
    });

    server.listen(3000, () => {
      console.log("Waiting for authorization...");
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error("Authorization timeout"));
    }, 300000);
  });
}

authenticate()
  .then(() => {
    console.log("\nSetup complete! The plugin is ready to use.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Authentication failed:", err.message);
    process.exit(1);
  });
