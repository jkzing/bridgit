# About

Bridgit is a proxy server to forward normal http request to an authorized server.

With different authorization protocol. (support hawk now)

# Installation

```
npm install
```

# Usage

```
npm start
```

And call your rest service: http://127.0.0.1:3000/api_url

# Config

Write configurations into config.json

```javascript
// hawk configuration
{
    "origin": "http://127.0.0.1:8000", // target server
    "type": "hawk",
    "id": "abcdefg", // your hawk id
    "key": "hijklmn", // your hawk key
    "algorithm": "sha256", // hawk algorithm
    "encryptPayload": true // do you want to encrypt payload or not
}
```
