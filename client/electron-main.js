// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const qs = require('querystring');
const xml2js = require('xml2js');
const config = require('./config');

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

async function main() {
  const Store = await import('electron-store');
  const store = new Store.default();

  // Set default values if they don't exist
  if (!store.get('MYSQL_HOST')) {
    store.set('MYSQL_HOST', config.MYSQL_HOST);
  }
  if (!store.get('MYSQL_USER')) {
    store.set('MYSQL_USER', config.MYSQL_USER);
  }
  if (!store.get('MYSQL_PASSWORD')) {
    store.set('MYSQL_PASSWORD', config.MYSQL_PASSWORD);
  }
  if (!store.get('MYSQL_DATABASE')) {
    store.set('MYSQL_DATABASE', config.MYSQL_DATABASE);
  }
  if (!store.get('EBAY_APP_NAME')) {
    store.set('EBAY_APP_NAME', config.EBAY_APP_NAME);
  }
  if (!store.get('EBAY_DEV_NAME')) {
    store.set('EBAY_DEV_NAME', config.EBAY_DEV_NAME);
  }
  if (!store.get('EBAY_CERT_NAME')) {
    store.set('EBAY_CERT_NAME', config.EBAY_CERT_NAME);
  }
  if (!store.get('EBAY_USER_ID')) {
    store.set('EBAY_USER_ID', config.EBAY_USER_ID);
  }
  if (!store.get('EBAY_REDIRECT_URL')) {
    store.set('EBAY_REDIRECT_URL', config.EBAY_REDIRECT_URL);
  }

  function createWindow() {
    const mainWindow = new BrowserWindow({
      width: 2560,
      height: 1600,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
      },
    });

    // Load the app's entry point
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);  // Open in the system's default browser
      return { action: 'deny' }; // Prevent Electron from opening it
    });
    
    // Open the DevTools if needed
    //mainWindow.webContents.openDevTools()
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if ((input.meta && input.key === 'r') || (input.control && input.key === 'r')) {
        event.preventDefault(); // Prevent the default behavior
        console.log('Shortcut Cmd+R or Ctrl+R is disabled');
      }
    });
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
    
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
  });

  // Function to get OAuth token from eBay (keep this as is)
  async function getEbayAuthToken() {
    const authToken = Buffer.from(`${config.EBAY_APP_NAME}:${config.EBAY_CERT_NAME}`).toString('base64');
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
  ipcMain.handle('get-image-path', (event, imageName) => {
    return path.join(__dirname, 'public', imageName); // Adjust to match your public folder location
  });

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

  ipcMain.handle('mark-serials-sold', async (event, serialNumbers) => {
    try {
        return await markSerialNumbersAsSold(serialNumbers);
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

  // Replace the existing get-ebay-item handler with this fixed version
ipcMain.handle('get-ebay-item', async (event, partNumber) => {
  try {
    const accessToken = await getEbayAuthToken();
    const itemSearchHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
    }
    const storeSearchHeaders = {
      'X-EBAY-SOA-SECURITY-APPNAME': `${config.EBAY_APP_NAME}`,
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
    console.log('eBay API Response:', storeSearchText); // Log the raw response for debugging
    
    const parser = new xml2js.Parser({ explicitArray: false });
    const storeSearch = await parser.parseStringPromise(storeSearchText);
    
    console.log('Parsed eBay Response:', JSON.stringify(storeSearch, null, 2)); // Log the parsed response

    let itemIds = [];
    
    // Handle different response structures safely
    if (storeSearch.findItemsIneBayStoresResponse && 
        storeSearch.findItemsIneBayStoresResponse.searchResult) {
      
      const searchResult = storeSearch.findItemsIneBayStoresResponse.searchResult;
      
      // Check if there are items
      if (searchResult.item) {
        itemIds = Array.isArray(searchResult.item)
          ? searchResult.item.map(item => item.itemId)
          : [searchResult.item.itemId];
      }
    } else {
      console.log('No search results or unexpected response structure from eBay API');
    }

    // If no items found, return empty results
    if (itemIds.length === 0) {
      return {
        items: [],
        totalQuantity: 0
      };
    }

    const fetchItemDetails = async (itemId) => {
      try {
        const itemDetails = await fetch(`https://api.ebay.com/buy/browse/v1/item/v1|${itemId}|0`, {
          headers: itemSearchHeaders
        });
        
        if (!itemDetails.ok) {
          console.error(`Error fetching details for item ${itemId}: ${itemDetails.status} ${itemDetails.statusText}`);
          return {
            itemId: itemId,
            quantity: 0,
            error: `Failed to fetch item details: ${itemDetails.status}`
          };
        }
        
        const itemJson = await itemDetails.json();
        return {
          itemId: itemId,
          title: itemJson.title || 'No title',
          price: itemJson.price || { value: 0, currency: 'USD' },
          condition: itemJson.condition || 'Unknown',
          quantity: itemJson.estimatedAvailabilities && 
                   itemJson.estimatedAvailabilities[0] ? 
                   itemJson.estimatedAvailabilities[0].estimatedAvailableQuantity : 0,
          itemWebUrl: itemJson.itemWebUrl || '#'
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
    // Return empty results instead of throwing, which causes the UI to break
    return {
      items: [],
      totalQuantity: 0,
      error: error.message
    };
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

}

main().catch(console.error);