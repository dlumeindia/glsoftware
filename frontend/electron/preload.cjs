const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  signup: (user) => ipcRenderer.invoke("signup-user", user),
  login: (user) => ipcRenderer.invoke("login-user", user),
  saveProfile: (data) => ipcRenderer.invoke("save-profile", data),
  getProfile: (userId) => ipcRenderer.invoke("get-profile", userId),
  saveCustomer: (data) => ipcRenderer.invoke("save-customer", data),
  getCustomers: (data) => ipcRenderer.invoke("get-customers", data),
  deleteCust: (id) => ipcRenderer.invoke("delete-customer", id),
  getCustomerById: (id) => ipcRenderer.invoke("get-customer-by-id", id),
  updateCustomer: (data) => ipcRenderer.invoke("update-customer", data),
  saveInvoice: (data) => ipcRenderer.invoke("save-invoice", data),
  getInvoices: (data) => ipcRenderer.invoke("get-invoices", data),
  deleteInvoice: (id) => ipcRenderer.invoke("delete-invoice", id),
  markInvoicePaid: (id) => ipcRenderer.invoke("mark-invoice-paid", id),
  saveEway: (payload) => ipcRenderer.invoke("save-eway", payload),

});