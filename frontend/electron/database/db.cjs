const Database = require("better-sqlite3");

const db = new Database("gls.db");

// Create users table
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
)
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS business_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,

  business_name TEXT,
  business_type TEXT,
  pan TEXT,
  gstin TEXT,

  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  state_code TEXT,
  pincode TEXT,

  phone TEXT,
  email TEXT,
  website TEXT,

  bank_name TEXT,
  branch TEXT,
  account_no TEXT,
  ifsc TEXT,
  account_type TEXT,

  invoice_prefix TEXT,
  invoice_series TEXT,
  terms TEXT,

  header_image TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id)
)`).run();

db.prepare(`
 CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      company_name TEXT,
      customer_type TEXT,
      business_type TEXT,
      customer_gstin TEXT,
      customer_pan TEXT,
      customer_phone TEXT,
      customer_alt_phone TEXT,
      customer_email TEXT,
      customer_website TEXT,
      customer_address_line1 TEXT,
      customer_address_line2 TEXT,
      customer_city TEXT,
      customer_state TEXT,
      customer_state_code TEXT,
      customer_pincode TEXT,
      shipping_address_line1 TEXT,
      shipping_address_line2 TEXT,
      shipping_city TEXT,
      shipping_state TEXT,
      shipping_state_code TEXT,
      shipping_pincode TEXT
    )`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      invoice_no TEXT UNIQUE,
      invoice_date TEXT,
      invoice_type TEXT,

      supply_type TEXT,
      sub_supply_type TEXT,
      reverse_charge TEXT,

      customer_type TEXT,

      -- Billing
      bill_company_name TEXT,
      bill_gstin TEXT,
      bill_pan TEXT,
      bill_email TEXT,
      bill_phone TEXT,
      bill_address1 TEXT,
      bill_address2 TEXT,
      bill_city TEXT,
      bill_state TEXT,
      bill_state_code TEXT,
      bill_pincode TEXT,

      -- Shipping
      ship_company_name TEXT,
      ship_address1 TEXT,
      ship_address2 TEXT,
      ship_city TEXT,
      ship_state TEXT,
      ship_state_code TEXT,
      ship_pincode TEXT,

      same_as_billing INTEGER DEFAULT 0,

      -- Tax & Totals
      subtotal REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      taxable REAL DEFAULT 0,

      cgst REAL DEFAULT 0,
      sgst REAL DEFAULT 0,
      igst REAL DEFAULT 0,
      total_tax REAL DEFAULT 0,

      round_off REAL DEFAULT 0,
      grand_total REAL DEFAULT 0,

      -- E-Way
      eway_enabled INTEGER DEFAULT 0,
      doc_type TEXT,
      distance TEXT,
      transporter_name TEXT,
      transporter_doc TEXT,
      vehicle_no TEXT,
      transport_mode TEXT,
      from_place TEXT,
      status,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

 
db.prepare(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,

      description TEXT,
      item_code TEXT,
      hsn TEXT,
      unit TEXT,

      qty REAL DEFAULT 0,
      rate REAL DEFAULT 0,
      discount REAL DEFAULT 0,

      taxable REAL DEFAULT 0,
      gst_rate REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL DEFAULT 0,

      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS delivery_challan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,

      challan_no TEXT,
      challan_date TEXT,
      against_invoice_no TEXT,
      invoice_date TEXT,
      transport_mode TEXT,
      vehicle_no TEXT,
      place_of_supply TEXT,
      place_of_supply_code TEXT,
      terms_and_conditions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  

// db.prepare(`
//   ALTER TABLE invoices ADD COLUMN customer_id TEXT
// `).run();

// db.prepare(`
//   ALTER TABLE invoices ADD COLUMN eway_bill_date DATETIME 
// `).run();

// db.prepare(`
//   ALTER TABLE invoices ADD COLUMN eway_valid_upto DATETIME 
// `).run();







module.exports = db;