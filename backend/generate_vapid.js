// Run: node generate_vapid.js
const webpush = require('web-push')
const keys = webpush.generateVAPIDKeys()
console.log('VAPID_PUBLIC_KEY=' + keys.publicKey)
console.log('VAPID_PRIVATE_KEY=' + keys.privateKey)
console.log('\nCopy these values into your .env (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT)')
