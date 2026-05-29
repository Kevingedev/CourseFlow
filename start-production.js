/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path')

// Start static server for frontend
console.log('Starting frontend server...')
console.log('Backend API configured to: https://courseflow-backend-zcpi.onrender.com/api')
const http = require('http')
const fs = require('fs')

const port = Number(process.env.PORT) || 3000
const distPath = path.join(__dirname, 'dist')

// Simple MIME types map
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
}

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase()
  return mimeTypes[ext] || 'application/octet-stream'
}

const server = http.createServer((req, res) => {
  // Note: API calls are handled by frontend pointing directly to backend URL
  // This server only serves static frontend files

  // Static files and SPA fallback
  let filePath = req.url === '/' ? 'index.html' : req.url
  // Remove query params
  filePath = filePath.split('?')[0]
  filePath = path.join(distPath, filePath)

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA
      fs.readFile(path.join(distPath, 'index.html'), (err, content) => {
        if (err) {
          res.writeHead(404)
          res.end('Not Found')
          return
        }
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(content)
      })
      return
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500)
        res.end('Internal Server Error')
        return
      }

      const contentType = getMimeType(filePath)
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content)
    })
  })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Frontend server running on http://0.0.0.0:${port}`)
})

process.on('SIGINT', () => {
  console.log('Shutting down servers...')
  apiProcess.kill('SIGTERM')
  server.close()
  process.exit(0)
})