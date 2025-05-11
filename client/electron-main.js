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

  ipcMain.handle('get-ebay-item', async (event, partNumber) => {
    try {
      const accessToken = await getEbayAuthToken();
      
      // Use the Browse API's search endpoint
      const searchResponse = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(partNumber)}&filter=sellers:{4YourBusiness}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'Content-Type': 'application/json'
        }
      });
  
      if (!searchResponse.ok) {
        console.error(`eBay search error: ${searchResponse.status} ${searchResponse.statusText}`);
        return { items: [], totalQuantity: 0, error: 'Search failed' };
      }
  
      const searchData = await searchResponse.json();
      console.log('eBay API Search Response:', JSON.stringify(searchData, null, 2));
  
      if (!searchData.itemSummaries || searchData.itemSummaries.length === 0) {
        return { items: [], totalQuantity: 0 };
      }
  
      // For debugging - log the first item's complete structure
      if (searchData.itemSummaries[0]) {
        console.log('First item complete structure:', JSON.stringify(searchData.itemSummaries[0], null, 2));
      }
  
      // Map the results with improved quantity extraction
      const items = searchData.itemSummaries.map(item => {
        let quantity = 1; // Default to 1 for any active listing
        
        // Log availability info for debugging
        if (item.estimatedAvailabilities) {
          console.log('Availability info:', JSON.stringify(item.estimatedAvailabilities, null, 2));
        }
        
        // Try multiple approaches to get the correct quantity
        if (item.estimatedAvailabilities && item.estimatedAvailabilities.length > 0) {
          const availInfo = item.estimatedAvailabilities[0];
          
          // Check for estimatedAvailableQuantity
          if (availInfo.estimatedAvailableQuantity) {
            quantity = parseInt(availInfo.estimatedAvailableQuantity) || 1;
          }
          
          // Also check for availabilityThreshold which might contain the "10 available" info
          if (availInfo.availabilityThreshold) {
            quantity = parseInt(availInfo.availabilityThreshold) || quantity;
          }
          
          // Check for estimatedSoldQuantity and totalQuantity if available
          if (item.estimatedSoldQuantity && item.totalQuantity) {
            const totalQty = parseInt(item.totalQuantity);
            const soldQty = parseInt(item.estimatedSoldQuantity);
            if (!isNaN(totalQty) && !isNaN(soldQty)) {
              quantity = totalQty - soldQty;
            }
          }
        }
        
        // For multi-variation listings
        if (item.availableQuantity) {
          quantity = parseInt(item.availableQuantity) || quantity;
        }
        
        // Directly try to get the quantity
        if (item.quantity) {
          quantity = parseInt(item.quantity) || quantity;
        }
        
        // If we have an item web URL, also fetch the full item details to get more accurate quantity
        const itemDetails = {
          itemId: item.itemId,
          title: item.title || 'No title',
          price: item.price || { value: 0, currency: 'USD' },
          condition: item.condition || 'Unknown',
          quantity: quantity,
          itemWebUrl: item.itemWebUrl || '#'
        };
        
        return itemDetails;
      });
  
      // After getting initial details, now get full item details for each item
      const enhancedItems = await Promise.all(items.map(async (item) => {
        if (item.itemId) {
          try {
            // Get full item details from the item endpoint
            const itemResponse = await fetch(`https://api.ebay.com/buy/browse/v1/item/${item.itemId}`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
              }
            });
            
            if (itemResponse.ok) {
              const fullItemData = await itemResponse.json();
              console.log('Full item data:', JSON.stringify(fullItemData, null, 2));
              
              // Try to extract the quantity from the full item data
              if (fullItemData.estimatedAvailabilities && fullItemData.estimatedAvailabilities.length > 0) {
                const fullAvailInfo = fullItemData.estimatedAvailabilities[0];
                
                if (fullAvailInfo.estimatedAvailableQuantity) {
                  item.quantity = parseInt(fullAvailInfo.estimatedAvailableQuantity) || item.quantity;
                }
                
                // Check for more availability info
                if (fullAvailInfo.availabilityThreshold) {
                  item.quantity = parseInt(fullAvailInfo.availabilityThreshold) || item.quantity;
                }
              }
            }
          } catch (error) {
            console.error(`Error getting full item details for ${item.itemId}:`, error);
          }
        }
        return item;
      }));
  
      // Calculate the total quantity from all listings
      const totalQuantity = enhancedItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
  
      return {
        items: enhancedItems,
        totalQuantity: totalQuantity
      };
    } catch (error) {
      console.error('Error in get-ebay-item:', error);
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