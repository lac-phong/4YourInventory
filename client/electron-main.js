// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const dotenv = require('dotenv');
const qs = require('querystring');
const xml2js = require('xml2js');

const {
  getAllParts,
  getItemByPartNumberWithSerials,
  getItemBySerialNumber,
  insertPart,
  updatePart,
  updateSerial,
  markSerialNumbersAsSold,
  getPartsByManufacturer,
  getPartsByCategory,
  getAllCategories,
  insertCategory,
  deleteCategory,
  getAllManufacturers,
  insertManufacturer,
  deleteManufacturer
} = require('./database.js');

dotenv.config();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  // Load the index.html file directly
  mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  
  // Open the DevTools if needed
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// Function to get OAuth token from eBay (keep this as is)
async function getEbayAuthToken() {
  const authToken = Buffer.from(`${process.env.EBAY_APP_NAME}:${process.env.EBAY_CERT_NAME}`).toString('base64');
  const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authToken}`,
      },
      body: qs.stringify({
          grant_type: 'client_credentials',
          scope: 'https://api.ebay.com/oauth/api_scope'
      })
  });

  if (!tokenResponse.ok) {
      throw new Error('Failed to get OAuth token');
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

// Set up IPC handlers
ipcMain.handle('get-all-parts', async () => {
  try {
      return await getAllParts();
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('get-part-by-number', async (event, partNumber) => {
  try {
      return await getItemByPartNumberWithSerials(partNumber);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('get-serial', async (event, serialNumber) => {
  try {
      return await getItemBySerialNumber(serialNumber);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('insert-part', async (event, partData) => {
  try {
      const { partNumber, location, serialNumbers, item_description, category, manufacturer, item_condition } = partData;
      return await insertPart(partNumber, location, serialNumbers, item_description, category, manufacturer, item_condition);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('update-part', async (event, partNumber, updates) => {
  try {
      return await updatePart(partNumber, updates);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('update-serial', async (event, serialNumber, updates) => {
  try {
      return await updateSerial(serialNumber, updates);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('mark-serials-sold', async (event, partNumber, serialNumbers) => {
  try {
      return await markSerialNumbersAsSold(partNumber, serialNumbers);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('get-parts-by-manufacturer', async (event, manufacturer) => {
  try {
      return await getPartsByManufacturer(manufacturer);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('get-parts-by-category', async (event, category) => {
  try {
      return await getPartsByCategory(category);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('get-ebay-item', async (event, partNumber) => {
  try {
    const accessToken = await getEbayAuthToken();
    const itemSearchHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
    }
    const storeSearchHeaders = {
        'X-EBAY-SOA-SECURITY-APPNAME': `${process.env.EBAY_APP_NAME}`,
        'X-EBAY-SOA-OPERATION-NAME': 'findItemsIneBayStores',
        'Content-Type': 'text/xml'
    };
    
    const storeSearchBody = `<?xml version="1.0" encoding="UTF-8"?>
    <findItemsIneBayStoresRequest xmlns="http://www.ebay.com/marketplace/search/v1/services">
      <keywords>${partNumber}</keywords>
      <storeName>4YourBusiness</storeName>
      <outputSelector>StoreInfo</outputSelector>
    </findItemsIneBayStoresRequest>`;
    
    const response = await fetch(`https://svcs.ebay.com/services/search/FindingService/v1`, {
        method: 'POST',
        headers: storeSearchHeaders,
        body: storeSearchBody
    });

    const storeSearchText = await response.text();
    const parser = new xml2js.Parser({ explicitArray: false });
    const storeSearch = await parser.parseStringPromise(storeSearchText);

    let itemIds = [];
    if (storeSearch.findItemsIneBayStoresResponse.searchResult.item) {
        itemIds = Array.isArray(storeSearch.findItemsIneBayStoresResponse.searchResult.item)
            ? storeSearch.findItemsIneBayStoresResponse.searchResult.item.map(item => item.itemId)
            : [storeSearch.findItemsIneBayStoresResponse.searchResult.item.itemId];
    }

    const fetchItemDetails = async (itemId) => {
        try {
            const itemDetails = await fetch(`https://api.ebay.com/buy/browse/v1/item/v1|${itemId}|0`, {
                headers: itemSearchHeaders
            });
            const itemJson = await itemDetails.json();
            return {
                itemId: itemId,
                title: itemJson.title,
                price: itemJson.price,
                condition: itemJson.condition,
                quantity: itemJson.estimatedAvailabilities[0].estimatedAvailableQuantity,
                itemWebUrl: itemJson.itemWebUrl
            };
        } catch (error) {
            console.error(`Error fetching details for item ${itemId}:`, error);
            return {
                itemId: itemId,
                quantity: 0,
                error: 'Failed to fetch item details'
            };
        }
    };

    const results = await Promise.all(itemIds.map(fetchItemDetails));

    const totalQuantity = results.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return {
        items: results,
        totalQuantity: totalQuantity
    };
  } catch (error) {
      console.error('Error in get-ebay-item:', error);
      throw error;  // This will be caught by the IPC handler
  }
});

ipcMain.handle('get-all-categories', async () => {
  try {
      return await getAllCategories();
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('insert-category', async (event, category) => {
  try {
      return await insertCategory(category);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('delete-category', async (event, category) => {
  try {
      return await deleteCategory(category);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('get-all-manufacturers', async () => {
  try {
      return await getAllManufacturers();
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('insert-manufacturer', async (event, manufacturer) => {
  try {
      return await insertManufacturer(manufacturer);
  } catch (error) {
      throw error;
  }
});

ipcMain.handle('delete-manufacturer', async (event, manufacturer) => {
  try {
      return await deleteManufacturer(manufacturer);
  } catch (error) {
      throw error;
  }
});