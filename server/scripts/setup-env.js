/**
 * One-time helper: creates `server/.env` from `.env.example`, generates strong
 * JWT/cookie secrets, and carries over an existing MONGO_URI or MONGODB_URI
 * found in `server/.env` or `server/src/.env`.
 *
 * Usage: npm run setup:env
 */
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const serverRoot = path.resolve(__dirname, '..')
const targetPath = path.join(serverRoot, '.env')
const examplePath = path.join(serverRoot, '.env.example')

const readMongoUri = () => {
  const candidates = [targetPath, path.join(serverRoot, 'src', '.env')]

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue
    const match = /^\s*MONGO(?:DB)?_URI\s*=\s*(.+)\s*$/m.exec(
      fs.readFileSync(file, 'utf8')
    )
    if (match && match[1].trim()) return match[1].trim()
  }

  return null
}

const secret = () => crypto.randomBytes(48).toString('hex')

const main = () => {
  const mongoUri = readMongoUri()
  let contents = fs.readFileSync(examplePath, 'utf8')

  contents = contents
    .replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret()}`)
    .replace(/^COOKIE_SECRET=.*$/m, `COOKIE_SECRET=${secret()}`)

  if (mongoUri) {
    contents = contents.replace(/^MONGO_URI=.*$/m, `MONGO_URI=${mongoUri}`)
  }

  fs.writeFileSync(targetPath, contents, 'utf8')

  console.log(`Wrote ${path.relative(serverRoot, targetPath)}`)
  console.log(`MONGO_URI: ${mongoUri ? 'carried over from existing env file' : 'left as example default — update it'}`)
  console.log('JWT_SECRET / COOKIE_SECRET: generated')
  console.log('GOOGLE_* values still need to be filled in for Google sign-in.')
}

main()
