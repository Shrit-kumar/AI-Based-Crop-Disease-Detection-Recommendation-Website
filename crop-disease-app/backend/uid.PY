# uid.py
# Run: python uid.py

import os
import sys
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth

# Load .env file
load_dotenv(".env")

# Build the service account dict from environment variables
service_account = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
    "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN")
}

# Check missing values
if not service_account["private_key"] or not service_account["client_email"]:
    print("❌ Missing Firebase credentials. Check FIREBASE_PRIVATE_KEY & FIREBASE_CLIENT_EMAIL in .env")
    sys.exit(1)

# Initialize Firebase Admin
try:
    cred = credentials.Certificate(service_account)
    firebase_admin.initialize_app(cred)
except Exception as e:
    print("❌ Failed to initialize Firebase Admin:", e)
    sys.exit(1)

# Default test user
email = os.getenv("TEST_USER_EMAIL", "test@example.com")
password = os.getenv("TEST_USER_PASSWORD", "TempPass#1234")

try:
    user = auth.get_user_by_email(email)
    print(f"🔎 Found existing user: {email}")
except auth.UserNotFoundError:
    print(f"ℹ️ User not found for {email} — creating temporary user...")
    user = auth.create_user(
        email=email,
        email_verified=False,
        password=password,
        display_name="Temp User"
    )
    print("✅ Temporary user created.")
    print("Temporary password:", password)

# Generate custom token
uid = user.uid
token = auth.create_custom_token(uid).decode("utf-8")

print("\n✅ Firebase UID:", uid)
print("✅ Custom Token (use in Authorization header):\n")
print(token)

# Save to token.txt
with open("token.txt", "w", encoding="utf-8") as f:
    f.write(token)

print("\n💾 Saved custom token to token.txt")
