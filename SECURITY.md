# Security Policy for CommuniMart

CommuniMart is designed for gated communities where physical and digital privacy are paramount.

## 1. Unit & Flat Door Privacy
- Residents have the option to mask their exact door number publicly.
- Door numbers are only revealed after an order is formally confirmed between neighbors.

## 2. Authentication & Credential Storage
- Passwords are encrypted using Argon2 / Bcrypt.
- Session tokens are stored in secure HttpOnly cookies to mitigate XSS attacks.
- Sensitive payment identifiers (UPI VPAs) are stored securely.

## 3. Reporting a Vulnerability
If you discover a security issue or vulnerability within CommuniMart, please contact the Committee Administration at:
`security@communimart.local`
