const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { shell } = require("electron");
const db = require("./database/db.cjs");
const isDev = !app.isPackaged;
const os = require("os");

const safe = (val) => {
  if (val === undefined || val === null) return "";
  if (typeof val === "object") return JSON.stringify(val); // OR extract value
  return String(val);
};


function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true
    }
  });

  Menu.setApplicationMenu(null);

 if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(app.getAppPath(), "dist", "index.html"));
  }

  // win.webContents.openDevTools(); 
}

app.whenReady().then(createWindow);

ipcMain.handle("signup-user", async (event, user) => {


  try {

    const stmt = db.prepare(
      "INSERT INTO users (name,email,password) VALUES (?,?,?)"
    );

    stmt.run(user.name, user.email, user.password);

    return { success: true };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      message: error.message
    };

  }

});

ipcMain.handle("login-user", async (event, user) => {
  try {
    const stmt = db.prepare(
      "SELECT * FROM users WHERE email = ? AND password = ?"
    );

    const foundUser = stmt.get(user.email, user.password);

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    return {
      success: true,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      },
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
});

ipcMain.handle("save-profile", async (event, { userId, profile }) => {

  const existing = db.prepare(
    "SELECT id FROM business_profile WHERE user_id = ?"
  ).get(userId);

  if (existing) {

    db.prepare(`
      UPDATE business_profile SET
      business_name=?,
      customer_name=?,
      business_type=?,
      pan=?,
      gstin=?,
      address_line1=?,
      address_line2=?,
      city=?,
      state=?,
      state_code=?,
      pincode=?,
      phone=?,
      email=?,
      website=?,
      bank_name=?,
      branch=?,
      account_no=?,
      ifsc=?,
      account_type=?,
      invoice_prefix=?,
      invoice_series=?,
      terms=?,
      header_image=?
      WHERE user_id=?
    `).run(
      profile.business_name,
      profile.customer_name,
      profile.business_type,
      profile.pan,
      profile.gstin,
      profile.address_line1,
      profile.address_line2,
      profile.city,
      profile.state,
      profile.state_code,
      profile.pincode,
      profile.phone,
      profile.email,
      profile.website,
      profile.bank_name,
      profile.branch,
      profile.account_no,
      profile.ifsc,
      profile.account_type,
      profile.invoice_prefix,
      profile.invoice_series,
      profile.terms,
      profile.header_image,
      userId
    );

  } else {

    db.prepare(`
      INSERT INTO business_profile (
        user_id,business_name, customer_name, business_type,pan,gstin,
        address_line1,address_line2,city,state,state_code,pincode,
        phone,email,website,
        bank_name,branch,account_no,ifsc,account_type,
        invoice_prefix,invoice_series,terms, header_image
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(
      userId,
      profile.business_name,
      profile.customer_name,
      profile.business_type,
      profile.pan,
      profile.gstin,
      profile.address_line1,
      profile.address_line2,
      profile.city,
      profile.state,
      profile.state_code,
      profile.pincode,
      profile.phone,
      profile.email,
      profile.website,
      profile.bank_name,
      profile.branch,
      profile.account_no,
      profile.ifsc,
      profile.account_type,
      profile.invoice_prefix,
      profile.invoice_series,
      profile.terms,
      profile.header_image
    );

  }

  return { success: true };
});


ipcMain.handle("get-profile", async (event, userId) => {

  const profile = db.prepare(
    "SELECT * FROM business_profile WHERE user_id=?"
  ).get(userId);

  return profile || null;

});

ipcMain.handle("save-customer", async (event, customer) => {
  return new Promise((resolve, reject) => {


   const stmt = db.prepare(`
    INSERT INTO customers (
      customer_name,
      company_name,
      customer_type,
      business_type,
      customer_gstin,
      customer_pan,
      customer_phone,
      customer_alt_phone,
      customer_email,
      customer_website,
      customer_address_line1,
      customer_address_line2,
      customer_city,
      customer_state,
      customer_state_code,
      customer_pincode,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_state_code,
      shipping_pincode,
      same_as_billing
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  

   const result = stmt.run(
        safe(customer.customer_name),
        safe(customer.company_name),
        safe(customer.customer_type),
        safe(customer.business_type),
        safe(customer.customer_gstin),
        safe(customer.customer_pan),
        safe(customer.customer_phone),
        safe(customer.customer_alt_phone),
        safe(customer.customer_email),
        safe(customer.customer_website),
        safe(customer.customer_address_line1),
        safe(customer.customer_address_line2),
        safe(customer.customer_city),
        safe(customer.customer_state),
        safe(customer.customer_state_code),
        safe(customer.customer_pincode),
        safe(customer.shipping_address_line1),
        safe(customer.shipping_address_line2),
        safe(customer.shipping_city),
        safe(customer.shipping_state),
        safe(customer.shipping_state_code),
        safe(customer.shipping_pincode),
        safe(customer.same_as_billing)
     
    );

    resolve({
      success: true,
      id: result.lastInsertRowid,
    });


  });
});

ipcMain.handle("get-customers", async () => {
  try {
    const stmt = db.prepare(`SELECT * FROM customers ORDER BY id DESC`);
    const rows = stmt.all();

    return {
      success: true,
      data: rows,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err.message,
    };
  }
});

ipcMain.handle("get-customer-by-id", async (_, id) => {
  try {
    const stmt = db.prepare(`SELECT * FROM customers WHERE id = ?`);
    const row = stmt.get(id);

    return {
      success: true,
      data: row,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err.message,
    };
  }
});

ipcMain.handle("delete-customer", async (event, id) => {
  try {
    const stmt = db.prepare(`DELETE FROM customers WHERE id = ?`);
    const result = stmt.run(id);

    return {
      success: true,
      changes: result.changes, // number of rows deleted
    };
  } catch (err) {
    console.error("Delete error:", err);
    return {
      success: false,
      error: err.message,
    };
  }
});

ipcMain.handle("update-customer", async (event, data) => {
  try {
    const query = `
      UPDATE customers SET
        customer_name = ?,
        company_name = ?,
        customer_type = ?,
        business_type = ?,
        customer_gstin = ?,
        customer_pan = ?,
        customer_phone = ?,
        customer_alt_phone = ?,
        customer_email = ?,
        customer_website = ?,
        customer_address_line1 = ?,
        customer_address_line2 = ?,
        customer_city = ?,
        customer_state = ?,
        customer_state_code = ?,
        customer_pincode = ?,
        shipping_address_line1 = ?,
        shipping_address_line2 = ?,
        shipping_city = ?,
        shipping_state = ?,
        shipping_state_code = ?,
        shipping_pincode = ?,
        same_as_billing = ?
      WHERE id = ?
    `;

    const values = [
      data.customer_name,
      data.company_name,
      data.customer_type,
      data.business_type,
      data.customer_gstin,
      data.customer_pan,
      data.customer_phone,
      data.customer_alt_phone,
      data.customer_email,
      data.customer_website,
      data.customer_address_line1,
      data.customer_address_line2,
      data.customer_city,
      data.customer_state,
      data.customer_state_code,
      data.customer_pincode,
      data.shipping_address_line1,
      data.shipping_address_line2,
      data.shipping_city,
      data.shipping_state,
      data.shipping_state_code,
      data.shipping_pincode,
      data.same_as_billing ? 1 : 0,
      data.id,
    ];

    const result = db.prepare(query).run(values);

    return { success: true, changes: result.changes };
  } catch (err) {
    console.error("Update error:", err);
    return { success: false, error: err.message };
  }
});


ipcMain.handle("get-invoiceNo", async () => {
  try {
    let finalInvoiceNo = 'INV-0001';

      const lastInvoice = db
      .prepare("SELECT invoice_no FROM invoices ORDER BY id DESC LIMIT 1")
      .get();

    if (lastInvoice && lastInvoice.invoice_no) {
      const lastNumber = parseInt(lastInvoice.invoice_no.split("-")[1]) || 0;
      const nextNumber = lastNumber + 1;

      finalInvoiceNo = `INV-${String(nextNumber).padStart(4, "0")}`;
    } else {
      finalInvoiceNo = "INV-0001";
    }

    return {
      success: true,
      data: finalInvoiceNo,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err.message,
    };
  }
});

ipcMain.handle("save-invoice", async (event, data) => {
  return new Promise((resolve, reject) => {

    try {
      
      const {
        invoiceNo,
        invoiceDate,
        paymentTerms,
        supplyType,
        subSupplyType,
        revCharge,
        customerType,
        billForm,
        shipForm,
        sameAsBilling,
        subtotal,
        totalDiscount,
        taxableAmount,
        cgst,
        sgst,
        igst,
        items,
        roundOff,
        grandTotal,
        ewayEnabled,
        docType,
        approximateDistance,
        transporterName,
        transporterDocNo,
        vehicleNo,
        deliveryMode,
        from,
        customerID,
      } = data;



      

      // ==========================
      // SAFE FUNCTION
      // ==========================
      const safe = (val) => val ?? "";

      // ==========================
      // INSERT INVOICE
      // ==========================
      const stmt = db.prepare(`
        INSERT INTO invoices (
          invoice_no, invoice_date, invoice_type,
          supply_type, sub_supply_type, reverse_charge,customer_type,
           bill_company_name, bill_gstin, bill_pan, bill_email, bill_phone,
          bill_address1, bill_address2, bill_city, bill_state, bill_state_code, bill_pincode,
           ship_company_name, ship_address1, ship_address2, ship_city,
            ship_state, ship_state_code, ship_pincode, same_as_billing,
              subtotal, discount, taxable,
          cgst, sgst, igst, total_tax,
          round_off, grand_total,
          eway_enabled, doc_type, distance,
           transporter_name, transporter_doc,
          vehicle_no, transport_mode, from_place, customer_id
          
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `);

      const result = stmt.run(
        safe(invoiceNo),
        safe(invoiceDate),
        safe(paymentTerms),

        safe(supplyType),
        safe(subSupplyType),
        safe(revCharge),
        safe(customerType),

        safe(billForm.company_name),
        safe(billForm.customer_gstin),
        safe(billForm.customer_pan),
        safe(billForm.customer_email),
        safe(billForm.customer_phone),
        safe(billForm.customer_address_line1),
        safe(billForm.customer_address_line2),
        safe(billForm.customer_city),
        safe(billForm.customer_state),
        safe(billForm.customer_state_code),
        safe(billForm.customer_pincode),

        safe(shipForm.company_name),
        safe(shipForm.customer_address_line1),
        safe(shipForm.customer_address_line2),
        safe(shipForm.customer_city),
        safe(shipForm.customer_state),
        safe(shipForm.customer_state_code),
        safe(shipForm.customer_pincode),
        sameAsBilling ? 1 : 0,

         safe(subtotal),
        safe(totalDiscount),
        safe(taxableAmount),
          safe(cgst),
        safe(sgst),
        safe(igst),
        safe(cgst + sgst + igst),

        safe(roundOff),
        safe(grandTotal),

         ewayEnabled ? 1 : 0,
        safe(docType),
        safe(approximateDistance),
         safe(transporterName),
        safe(transporterDocNo),
        safe(vehicleNo),
        safe(deliveryMode),
        safe(from),
        safe(customerID)
        
      );

      const invoiceId = result.lastInsertRowid;

     
      const itemStmt = db.prepare(`
        INSERT INTO invoice_items (
          invoice_id, description, item_code, hsn, unit,
          qty, rate, discount, taxable,
          gst_rate, tax, total
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      items.forEach((item) => {
        const gross = item.qty * item.rate;
        const disc = (gross * item.discount) / 100;
        const taxable = gross - disc;
        const tax = (taxable * item.gstRate) / 100;
        const total = taxable + tax;

        itemStmt.run(
          invoiceId,
          safe(item.description),
          safe(item.itemCode),
          safe(item.hsn),
          safe(item.unit),
          safe(item.qty),
          safe(item.rate),
          safe(item.discount),
          safe(taxable),
          safe(item.gstRate),
          safe(tax),
          safe(total)
        );
      });


       const invoice = db
    .prepare("SELECT invoice_no FROM invoices WHERE id = ?")
    .get(invoiceId);

      resolve({
        success: true,
        data: invoice,
      });

    } catch (error) {
      console.error("❌ Save Invoice Error:", error);
      reject(error);
    }

  });
});

ipcMain.handle("update-invoice", async (event, data) => {
  try {
    const {
      invoice, 
      invoiceDate,
      invoiceType,
      supplyType,
      subSupplyType,
      revCharge,
      billForm,
      shipForm,
      sameAsBilling,
      subtotal,
      totalDiscount,
      taxableAmount,
      cgst,
      sgst,
      igst,
      itemsState,
      roundOff,
      grandTotal,
      ewayEnabled,
      docType,
      approximateDistance,
      transporterName,
      transporterDocNo,
      vehicleNo,
      deliveryMode,
      from,
      customerID,
    } = data;

    console.log(billForm);
    console.log(shipForm);

    const safe = (val) => val ?? "";

    // ==========================
    // UPDATE INVOICE
    // ==========================
    const stmt = db.prepare(`
      UPDATE invoices SET
        invoice_date = ?, invoice_type = ?,
        supply_type = ?, sub_supply_type = ?, reverse_charge = ?, 

        bill_company_name = ?, bill_gstin = ?, bill_pan = ?, bill_email = ?, bill_phone = ?,
        bill_address1 = ?, bill_address2 = ?, bill_city = ?, bill_state = ?, bill_state_code = ?, bill_pincode = ?,

        ship_company_name = ?, ship_address1 = ?, ship_address2 = ?, ship_city = ?, 
        ship_state = ?, ship_state_code = ?, ship_pincode = ?, same_as_billing = ?,

        subtotal = ?, discount = ?, taxable = ?,
        cgst = ?, sgst = ?, igst = ?, total_tax = ?,
        round_off = ?, grand_total = ?, 

        eway_enabled = ?, doc_type = ?, distance = ?, 
        transporter_name = ?, transporter_doc = ?, 
        vehicle_no = ?, transport_mode = ?, from_place = ?

      WHERE id = ?
    `);

    stmt.run(
      safe(invoiceDate),
      safe(invoiceType),

      safe(supplyType),
      safe(subSupplyType),
      safe(revCharge),

      safe(billForm.company_name),
      safe(billForm.gstin),
      safe(billForm.pan),
      safe(billForm.email),
      safe(billForm.phone),
      safe(billForm.address_line1),
      safe(billForm.address_line2),
      safe(billForm.city),
      safe(billForm.state),
      safe(billForm.state_code),
      safe(billForm.pincode),

      safe(shipForm.name),
      safe(shipForm.address_line1),
      safe(shipForm.address_line2),
      safe(shipForm.city),
      safe(shipForm.state),
      safe(shipForm.state_code),
      safe(shipForm.pincode),
      sameAsBilling ? 1 : 0,

      safe(subtotal),
      safe(totalDiscount),
      safe(taxableAmount),
      safe(cgst),
      safe(sgst),
      safe(igst),
      safe(cgst + sgst + igst),

      safe(roundOff),
      safe(grandTotal),

      ewayEnabled ? 1 : 0,
      safe(docType),
      safe(approximateDistance),
      safe(transporterName),
      safe(transporterDocNo),
      safe(vehicleNo),
      safe(deliveryMode),
      safe(from),

      invoice.id // ✅ WHERE id
    );

    // ==========================
    // DELETE OLD ITEMS
    // ==========================
    db.prepare(`DELETE FROM invoice_items WHERE invoice_id = ?`).run(invoice.id);

    // ==========================
    // INSERT UPDATED ITEMS
    // ==========================
    const itemStmt = db.prepare(`
      INSERT INTO invoice_items (
        invoice_id, description, item_code, hsn, unit,
        qty, rate, discount, taxable,
        gst_rate, tax, total
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    itemsState.forEach((item) => {
      const gross = item.qty * item.rate;
      const disc = (gross * item.discount) / 100;
      const taxable = gross - disc;
      const tax = (taxable * item.gst_rate) / 100;
      const total = taxable + tax;

      itemStmt.run(
        invoice.id,
        safe(item.description),
        safe(item.item_code), // ✅ fix key
        safe(item.hsn),
        safe(item.unit),
        safe(item.qty),
        safe(item.rate),
        safe(item.discount),
        safe(taxable),
        safe(item.gst_rate),
        safe(tax),
        safe(total)
      );
    });

    return { success: true, invoice_no: invoice.invoice_no };

  } catch (error) {
    console.error("❌ Update Invoice Error:", error);
    return { success: false };
  }
});

ipcMain.handle("get-invoices", async () => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`
        SELECT 
          i.id,
          i.invoice_no,
          i.invoice_date,
          i.bill_company_name,
          i.customer_type,
          c.customer_name as customer_name,
          i.grand_total,
          i.eway_enabled,
          i.status
        FROM invoices i
        LEFT JOIN customers c ON i.customer_id = c.id
        ORDER BY i.id DESC
      `);

      const rows = stmt.all();

      resolve({
        success: true,
        data: rows,
      });

    } catch (error) {
      console.error("❌ Get Invoices Error:", error);
      reject(error);
    }
  });
});

ipcMain.handle("get-invoice-by-id", async (event, id) => {
  const invoice = db
    .prepare("SELECT * FROM invoices WHERE id = ?")
    .get(id);


    const customer = db
    .prepare("SELECT * FROM customers WHERE id = ?")
    .get(invoice.customer_id);

     const delivery = db
    .prepare("SELECT * FROM delivery_challan WHERE invoice_id = ?")
    .get(id);

    const items = db
      .prepare("SELECT * FROM invoice_items WHERE invoice_id = ?")
      .all(id); 
   return {
      success: true,
      data: {
        ...invoice,
        customer,
        items,
        delivery,
      },
    };
});

ipcMain.handle("delete-invoice", async (event, id) => {
  try {
    db.prepare(`DELETE FROM invoices WHERE id = ?`).run(id);
    db.prepare(`DELETE FROM invoice_items WHERE invoice_id = ?`).run(id);

    return { success: true };
  } catch (err) {
    return { success: false };
  }
});

ipcMain.handle("mark-invoice-paid", async (event, id) => {
  try {
    db.prepare(`
      UPDATE invoices SET status = 'Paid' WHERE id = ?
    `).run(id);

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("save-eway", async (event, { id, data }) => {
  try {
    console.log(data);
    db.prepare(`
      UPDATE invoices
      SET eway_bill_no = ?, vehicle_no = ?, transporter_name = ?, 
      eway_enabled = ?, transport_mode = ?, eway_bill_date = ?, eway_valid_upto = ?
      WHERE id = ?
    `).run(
      data.ewayBillNo,
      data.vehicleNo,
      data.transporterName,
      1,
      data.transportMode,
      data.ewayBillDate,
      data.ewayValidUpto,
      id
    );

    return { success: true };
  } catch (err) {
    return { success: false };
  }
});

ipcMain.handle("generate-pdf", async (event, { fileext, html }) => {
  try {
    // Hidden window
    const pdfWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        sandbox: false,
      },
    });

    // Load your HTML
    await pdfWindow.loadURL(
      "data:text/html;charset=utf-8," + encodeURIComponent(html)
    );

    // Wait for render
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: `${fileext}-${Date.now()}.pdf`,
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });

    if (canceled) {
      pdfWindow.close();
      return;
    }

    // Generate PDF
    const pdfBuffer = await pdfWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4",
    });

    fs.writeFileSync(filePath, pdfBuffer);

    pdfWindow.close();

    return { success: true, filePath };
  } catch (err) {
    console.error("PDF Error:", err);
    return { success: false };
  }
});

ipcMain.handle("download-pdf", async (event) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);

    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      defaultPath: `Invoice-${Date.now()}.pdf`,
      filters: [{ name: "PDF Files", extensions: ["pdf"] }],
    });

    if (canceled) return { success: false };

    // Generate PDF (THIS LINE YOU ASKED)
    const pdfBuffer = await win.webContents.printToPDF({
      printBackground: true, // ✅ VERY IMPORTANT (colors + logo)
      pageSize: "A4",
      landscape: false,
      marginsType: 0,
    });

    fs.writeFileSync(filePath, pdfBuffer);

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
});

ipcMain.handle("share-pdf", async (event, filePath) => {
  try {
    await shell.openPath(filePath); 
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
});

ipcMain.handle("generate-pdf-auto", async (event,  { fileext, html }) => {
  try {
    const pdfWindow = new BrowserWindow({
      show: false,
      webPreferences: { sandbox: false },
    });

    await pdfWindow.loadURL(
      "data:text/html;charset=utf-8," + encodeURIComponent(html)
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Auto path (no dialog)
    const filePath = path.join(
      os.tmpdir(),
      `${fileext}-${Date.now()}.pdf`
    );

    const pdfBuffer = await pdfWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4",
    });

    fs.writeFileSync(filePath, pdfBuffer);

    pdfWindow.close();

    return { success: true, filePath };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
});

  let printWindow = null; // ✅ global reference (VERY IMPORTANT)

ipcMain.handle("print-pdf", async (event, html) => {
  try {
    const { BrowserWindow } = require("electron");

    const win = new BrowserWindow({
      show: false,
    });

    await win.loadURL(
      "data:text/html;charset=utf-8," + encodeURIComponent(html)
    );

    // wait for render
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 🔥 generate PDF buffer
    const pdfBuffer = await win.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4",
    });

    // save temp file
    const fs = require("fs");
    const path = require("path");
    const { app } = require("electron");

    const filePath = path.join(app.getPath("temp"), "challan-print.pdf");

    fs.writeFileSync(filePath, pdfBuffer);

    // 🔥 open PDF in default viewer (this gives preview)
    require("electron").shell.openPath(filePath);

    return { success: true };

  } catch (err) {
    console.error(err);
    return { success: false };
  }
});

ipcMain.handle("dashboard:get-stats", async () => {
  const totalInvoices = db
    .prepare("SELECT COUNT(*) as count FROM invoices")
    .get();

  const totalPaid = db
    .prepare("SELECT SUM(grand_total) as total FROM invoices WHERE status = 'Paid'")
    .get();

  const totalUnpaid = db
    .prepare("SELECT SUM(grand_total) as total FROM invoices WHERE status = 'Unpaid'")
    .get();

  return {
    totalInvoices: totalInvoices.count || 0,
    totalPaid: totalPaid.total || 0,
    totalUnpaid: totalUnpaid.total || 0,
  };
});

// ipcMain.handle("dashboard:get-recent-invoices", async () => {
//   const invoices = db
//     .prepare(`
//       SELECT 
//         id,
//         invoice_no as number,
//         bill_company_name as client,
//         bill_company_name as company_name,
//         grand_total as amount,
//         status
//       FROM invoices
//       ORDER BY id DESC
//       LIMIT 5
//     `)
//     .all();

//   return invoices;
// });

ipcMain.handle("dashboard:get-recent-invoices", async () => {
  const invoices = db
    .prepare(`
      SELECT 
        i.id,
        i.invoice_no as number,
        c.customer_name as client,
        c.company_name as company_name,
        i.grand_total as amount,
        i.status
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      ORDER BY i.id DESC
      LIMIT 5
    `)
    .all();

  return invoices;
});

ipcMain.handle("delivery-challan:create", async (event, data) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO delivery_challan (
        invoice_id,
        challan_no,
        challan_date,
        against_invoice_no,
        transport_mode,
        vehicle_no,
        place_of_supply,
        place_of_supply_code,
        terms_and_conditions
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.invoice_id,
      data.challanNo,
      data.challanDate,
      data.againstInvoiceNo,
      data.transportMode,
      data.vehicleNo,
      data.placeOfSupply,
      data.placeOfSupplyCode,
      data.termsAndConditions
    );
    
    db.prepare(`
      UPDATE invoices SET challan = 1 WHERE id = ?
    `).run(data.invoice_id);    

    


    return { success: true, id: data.invoice_id };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
});


