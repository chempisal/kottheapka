#!/usr/bin/env python3
"""
កត់ខ្នាតធៀបការ - SQLite Database & Web Server
A standalone Python HTTP & REST API server with SQLite Database.
No external dependencies required (uses built-in http.server & sqlite3).
"""

import http.server
import socketserver
import sqlite3
import json
import os
import sys
import mimetypes
import socket
import urllib.parse
from datetime import datetime

# Enable UTF-8 console output for Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

PORT = 8080
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database.db")
STATIC_DIR = os.path.dirname(os.path.abspath(__file__))

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Orders Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        created_at TEXT,
        groom_name TEXT,
        bride_name TEXT,
        customer_phone TEXT,
        wedding_date TEXT,
        venue TEXT,
        cover_height REAL,
        cover_width REAL,
        envelope_height REAL,
        envelope_width REAL,
        inner_card_height REAL,
        inner_card_width REAL,
        card_style TEXT,
        envelope_color TEXT,
        paper_type TEXT,
        finishing TEXT,
        quantity INTEGER,
        unit_price REAL,
        total_price REAL,
        deposit REAL,
        balance_due REAL,
        status TEXT,
        delivery_date TEXT,
        notes TEXT,
        image_data TEXT
    )
    """)
    
    # Settings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )
    """)
    
    # Check if empty, insert default demo orders
    cursor.execute("SELECT COUNT(*) FROM orders")
    count = cursor.fetchone()[0]
    if count == 0:
        demo_orders = [
            ('THIEP-101', '2026-10-10T08:30:00Z', 'ជា ពិសាល', 'សុខ បុប្ផា', '012 345 678', '2026-11-28',
             'មជ្ឈមណ្ឌលសន្និបាតកោះពេជ្រ អគារ G', 18.0, 13.0, 18.8, 13.8, 17.5, 12.5,
             'បត់២ (Bi-fold)', 'ក្រហមមាស (Royal Red & Gold)', 'ក្រដាសពពាលមាស 300g', 'ស្ពាន់ទឹកមាស (Hot Foil Gold)',
             500, 0.50, 250.00, 150.00, 100.00, 'producing', '2026-11-15', 'សូមកាត់គែមរាងមូល ក្តៅស្ពាន់មាសលើឈ្មោះកូនកំលោះក្រមុំ', ''),
            
            ('THIEP-102', '2026-10-11T10:15:00Z', 'ហេង វុទ្ធី', 'ចាន់ សេរីរ័ត្ន', '098 765 432', '2026-12-05',
             'សណ្ឋាគារ ហ្គាឌិនស៊ីធី ភ្នំពេញ', 20.0, 15.0, 20.8, 15.8, 19.5, 14.5,
             'សន្លឹកទោល (Single Card)', 'ផ្កាឈូកស្រាល (Blush Pink)', 'ក្រដាសកាតុងរឹង ក្រអូប 350g', 'អក្សរផុស (Embossing)',
             350, 0.75, 262.50, 262.50, 0.00, 'ready', '2026-11-10', 'បន្ថែមស្រោមអាំងប៉ាវចំនួន 20 សន្លឹក ឥតគិតថ្លៃ', ''),

            ('THIEP-103', '2026-10-12T14:00:00Z', 'គង់ រដ្ឋា', 'លី ស្រីម៉ៅ', '077 889 900', '2026-12-18',
             'ភោជនីយដ្ឋាន ទន្លេបាសាក់ ២', 17.0, 12.0, 17.8, 12.8, 16.5, 11.5,
             'បត់៣ (Tri-fold)', 'មាសស្រាល (Champagne Gold)', 'ក្រដាសគុជខ្យង Pearl 250g', 'ចងបូសូត្រ (Silk Ribbon)',
             400, 0.45, 180.00, 80.00, 100.00, 'pending', '2026-11-20', 'រង់ចាំអតិថិជនពិនិត្យ និងយល់ព្រមលើ Proof អក្សរខ្មែរ', ''),

            ('THIEP-104', '2026-10-08T09:40:00Z', 'អ៊ុំ សុវណ្ណ', 'ទេព កល្យាណ', '010 223 344', '2026-11-02',
             'ភោជនីយដ្ឋាន ពិភពថ្មី សែនសុខ', 20.0, 10.0, 20.8, 10.8, 19.5, 9.5,
             'បត់២ (Bi-fold)', 'បៃតងត្បូង (Emerald Green)', 'ក្រដាស Textured 280g', 'បិទត្រាក្រមួន (Wax Seal)',
             600, 0.60, 360.00, 360.00, 0.00, 'delivered', '2026-10-25', 'បានប្រគល់ជូនអតិថិជន និងទូទាត់ប្រាក់គ្រប់ចំនួន', '')
        ]
        cursor.executemany("""
        INSERT INTO orders VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, demo_orders)

    # Insert default settings if not exists
    cursor.execute("SELECT COUNT(*) FROM settings")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO settings VALUES (?, ?)", 
                       ("shopSettings", json.dumps({
                           "shopName": "រោងពុម្ព ពិសាល ខ្នាតធៀបការ",
                           "shopPhone": "012 888 999 / 097 555 666",
                           "telegram": "@pisal_wedding_cards"
                       }, ensure_ascii=False)))
        
    conn.commit()
    conn.close()

def row_to_dict(row):
    return {
        "id": row["id"],
        "createdAt": row["created_at"],
        "groomName": row["groom_name"],
        "brideName": row["bride_name"],
        "customerPhone": row["customer_phone"],
        "weddingDate": row["wedding_date"],
        "venue": row["venue"],
        "coverHeight": row["cover_height"],
        "coverWidth": row["cover_width"],
        "envelopeHeight": row["envelope_height"],
        "envelopeWidth": row["envelope_width"],
        "innerCardHeight": row["inner_card_height"],
        "innerCardWidth": row["inner_card_width"],
        "cardStyle": row["card_style"],
        "envelopeColor": row["envelope_color"],
        "paperType": row["paper_type"],
        "finishing": row["finishing"],
        "quantity": row["quantity"],
        "unitPrice": row["unit_price"],
        "totalPrice": row["total_price"],
        "deposit": row["deposit"],
        "balanceDue": row["balance_due"],
        "status": row["status"],
        "deliveryDate": row["delivery_date"],
        "notes": row["notes"],
        "imageData": row["image_data"] or ""
    }

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for cross-device requests
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, status_code=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # REST API Routes
        if path == "/api/status":
            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT COUNT(*) FROM orders")
            total = c.fetchone()[0]
            conn.close()
            self.send_json({
                "status": "online",
                "database": "SQLite (database.db)",
                "totalOrders": total,
                "timestamp": datetime.now().isoformat()
            })
            return

        elif path == "/api/orders":
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
            rows = cursor.fetchall()
            orders = [row_to_dict(r) for r in rows]
            conn.close()
            self.send_json(orders)
            return

        elif path == "/api/settings":
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT value FROM settings WHERE key = 'shopSettings'")
            row = cursor.fetchone()
            conn.close()
            if row:
                self.send_json(json.loads(row[0]))
            else:
                self.send_json({})
            return

        # Static File Serving
        if path == "/" or path == "":
            path = "/index.html"

        file_path = os.path.join(STATIC_DIR, path.lstrip("/"))
        if os.path.exists(file_path) and os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            if not mime_type:
                mime_type = "application/octet-stream"
            if mime_type.startswith("text/") or mime_type in ["application/javascript", "application/json"]:
                mime_type += "; charset=utf-8"

            with open(file_path, "rb") as f:
                content = f.read()

            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        else:
            self.send_error(404, "File not found")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
        try:
            data = json.loads(body)
        except Exception:
            data = {}

        if path == "/api/orders":
            # Insert Order
            conn = get_db()
            cursor = conn.cursor()
            
            # If ID not provided, generate THIEP-XXX
            order_id = data.get("id")
            if not order_id:
                cursor.execute("SELECT COUNT(*) FROM orders")
                count = cursor.fetchone()[0]
                order_id = f"THIEP-{count + 101}"

            created_at = data.get("createdAt", datetime.now().isoformat())

            cursor.execute("""
            INSERT OR REPLACE INTO orders (
                id, created_at, groom_name, bride_name, customer_phone, wedding_date,
                venue, cover_height, cover_width, envelope_height, envelope_width,
                inner_card_height, inner_card_width, card_style, envelope_color,
                paper_type, finishing, quantity, unit_price, total_price, deposit,
                balance_due, status, delivery_date, notes, image_data
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                order_id,
                created_at,
                data.get("groomName", ""),
                data.get("brideName", ""),
                data.get("customerPhone", ""),
                data.get("weddingDate", ""),
                data.get("venue", ""),
                float(data.get("coverHeight", 0)),
                float(data.get("coverWidth", 0)),
                float(data.get("envelopeHeight", 0)),
                float(data.get("envelopeWidth", 0)),
                float(data.get("innerCardHeight", 0)),
                float(data.get("innerCardWidth", 0)),
                data.get("cardStyle", "បត់២ (Bi-fold)"),
                data.get("envelopeColor", "ក្រហមមាស (Royal Red & Gold)"),
                data.get("paperType", ""),
                data.get("finishing", "ស្ពាន់ទឹកមាស (Hot Foil Gold)"),
                int(data.get("quantity", 0)),
                float(data.get("unitPrice", 0)),
                float(data.get("totalPrice", 0)),
                float(data.get("deposit", 0)),
                float(data.get("balanceDue", 0)),
                data.get("status", "pending"),
                data.get("deliveryDate", ""),
                data.get("notes", ""),
                data.get("imageData", "")
            ))
            conn.commit()
            conn.close()
            self.send_json({"success": True, "id": order_id})
            return

        elif path == "/api/settings":
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ('shopSettings', ?)",
                           (json.dumps(data, ensure_ascii=False),))
            conn.commit()
            conn.close()
            self.send_json({"success": True})
            return

        elif path == "/api/reset-demo":
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM orders")
            conn.commit()
            conn.close()
            init_db()
            self.send_json({"success": True})
            return

        self.send_error(404, "Endpoint not found")

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path.startswith("/api/orders/"):
            order_id = path.replace("/api/orders/", "").strip()
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
            data = json.loads(body)

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("""
            UPDATE orders SET
                groom_name = ?, bride_name = ?, customer_phone = ?, wedding_date = ?,
                venue = ?, cover_height = ?, cover_width = ?, envelope_height = ?,
                envelope_width = ?, inner_card_height = ?, inner_card_width = ?,
                card_style = ?, envelope_color = ?, paper_type = ?, finishing = ?,
                quantity = ?, unit_price = ?, total_price = ?, deposit = ?,
                balance_due = ?, status = ?, delivery_date = ?, notes = ?, image_data = ?
            WHERE id = ?
            """, (
                data.get("groomName", ""),
                data.get("brideName", ""),
                data.get("customerPhone", ""),
                data.get("weddingDate", ""),
                data.get("venue", ""),
                float(data.get("coverHeight", 0)),
                float(data.get("coverWidth", 0)),
                float(data.get("envelopeHeight", 0)),
                float(data.get("envelopeWidth", 0)),
                float(data.get("innerCardHeight", 0)),
                float(data.get("innerCardWidth", 0)),
                data.get("cardStyle", "បត់២ (Bi-fold)"),
                data.get("envelopeColor", "ក្រហមមាស (Royal Red & Gold)"),
                data.get("paperType", ""),
                data.get("finishing", "ស្ពាន់ទឹកមាស (Hot Foil Gold)"),
                int(data.get("quantity", 0)),
                float(data.get("unitPrice", 0)),
                float(data.get("totalPrice", 0)),
                float(data.get("deposit", 0)),
                float(data.get("balanceDue", 0)),
                data.get("status", "pending"),
                data.get("deliveryDate", ""),
                data.get("notes", ""),
                data.get("imageData", ""),
                order_id
            ))
            conn.commit()
            conn.close()
            self.send_json({"success": True, "id": order_id})
            return

        self.send_error(404, "Endpoint not found")

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path.startswith("/api/orders/"):
            order_id = path.replace("/api/orders/", "").strip()
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM orders WHERE id = ?", (order_id,))
            conn.commit()
            conn.close()
            self.send_json({"success": True, "deleted": order_id})
            return

        self.send_error(404, "Endpoint not found")

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    init_db()
    local_ip = get_local_ip()
    print("=" * 60)
    print(" 💌 កត់ខ្នាតធៀបការ - SQLite Database & Server កំពុងដំណើរការ")
    print(f" 📂 Database File: {DB_FILE}")
    print(f" 💻 កុំព្យូទ័រ (Localhost): http://localhost:{PORT}")
    print(f" 📱 ទូរស័ព្ទដៃ (Wi-Fi IP):  http://{local_ip}:{PORT}")
    print("=" * 60)

    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    with ReusableTCPServer(("", PORT), RequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nបិទ Server រួចរាល់។")
