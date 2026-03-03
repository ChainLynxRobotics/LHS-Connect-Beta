import http.server
import socketserver

PORT = 8248

# This creates the handler that serves files from the current directory
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server started at http://localhost:{PORT}")
    # This keeps the server running until you stop it (Ctrl+C)
    httpd.serve_forever()