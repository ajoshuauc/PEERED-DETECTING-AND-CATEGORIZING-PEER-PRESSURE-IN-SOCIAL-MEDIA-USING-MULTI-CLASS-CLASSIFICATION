// const textApiEndpoint = "";
// const imageApiEndpoint = "";

// async function sendDataToAPIText(data) {
//     console.log("Sending text to API:", data);
//     try {
//         const response = await fetch(textApiEndpoint, {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ text: data }),
//         });

//         if (!response.ok) throw new Error(`Text API Error: ${response.status}`);
//         const result = await response.json();
//         console.log("Text data sent successfully:", result);

//         // Forward API response to content script
//         return result;
//     } catch (error) {
//         console.error("Failed to send text data to API:", error);
//         throw error;
//     }
// }

// // Function to send image data to API
// async function sendDataToAPIImage(data) {
//     console.log("Sending image to API:", data);
//     try {
//         const response = await fetch(imageApiEndpoint, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ image_url: data }),
//         });

//         if (!response.ok) throw new Error(`Image API Error: ${response.status}`);
//         const result = await response.json();
//         console.log("Image data sent successfully:", result);

//         // Forward API response to content script
//         return result;
//     } catch (error) {
//         console.error("Failed to send image data to API:", error);
//         throw error;
//     }
// }

// Listener for incoming messages for API
// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//     try {
//         if (message.type === "SEND_DATA_TEXT") {
//             const result = await sendDataToAPIText(message.payload);
//             sendResponse({ success: true, result });
//             // console.log("Handling SEND_DATA_TEXT...");
//             // sendResponse({ success: true, result: "Text Working" });
//         } else if (message.type === "SEND_DATA_IMAGE") {
//             const result = await sendDataToAPIImage(message.payload);
//             sendResponse({ success: true, result });
//             //console.log("Handling SEND_DATA_TEXT...");
//             //sendResponse({ success: true, result: "Image Working" });
//         }
//     } catch (error) {
//         sendResponse({ success: false, error: error.message });
//     }

//     // Indicate async response
//     return true;
// });

// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//     console.log("Received message:", message);
//     try {
//         if (message.type === "SEND_DATA_TEXT") {
//             const result = await sendDataToAPIText(message.payload.text);
//             console.log("Sending response back:", { success: true, result });
//             sendResponse({ success: true, result });
//         } else if (message.type === "SEND_DATA_IMAGE") {
//             const result = await sendDataToAPIImage(message.payload.image);
//             console.log("Sending response back:", { success: true, result });
//             sendResponse({ success: true, result });
//         } else {
//             sendResponse({ success: false, error: "Unknown message type" });
//         }
//     } catch (error) {
//         console.error("Error handling message:", error);
//         sendResponse({ success: false, error: error.message });
//     }
//     return true; // Keeps the message port open for async responses
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log("[BG SCRIPT] Message received:", message);
//     setTimeout(async () => { // Simulate delay for testing
//         try {
//             const result = { text_label: "NEGATIVE", text: "blablabla"}; // Mock response for debugging
//             console.log("[BG SCRIPT] Sending response:", result);
//             sendResponse({ success: true, result });
//         } catch (error) {
//             console.error("[BG SCRIPT] Error:", error);
//             sendResponse({ success: false, error: error.message });
//         }
//     }, 1000);
//     return true;
// });

//Reloading logic
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.reloadTabs) {
        // Query all open tabs
        chrome.tabs.query({}, (tabs) => {
            const relevantTabs = tabs.filter(tab =>
                tab.url.includes("facebook.com") || tab.url.includes("x.com")
            );

            if (relevantTabs.length > 0) {
                // Reload all relevant tabs
                relevantTabs.forEach(tab => {
                    chrome.tabs.reload(tab.id);
                    console.log(`Reloading tab: ${tab.id}`);
                });
            } else {
                console.log("No Facebook or X tabs are currently open.");
            }
        });
    }
});


//First time installation logic
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['isFirstUse'], (result) => {
        if (!result.isFirstUse) {
            // Log to ensure this block is reached
            console.log('First-time use detected. Showing notification...');

            // Show the notification
            chrome.notifications.create('firstUseNotification', {
                type: 'basic',
                iconUrl: 'Peered_Icon.png', // Ensure this path is correct
                title: 'Welcome to the Extension!',
                message: 'Thank you for installing the extension. Click the toggle to get started!',
                requireInteraction: true, // Persistent notification banner
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Notification error:', chrome.runtime.lastError);
                }
            });

            // Set the flag to indicate the extension has been used
            chrome.storage.sync.set({ isFirstUse: true });
        }
    });
});



// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.toggleEnabled !== undefined) {
//         const toggleEnabled = message.toggleEnabled;

//         // Query all open tabs
//         chrome.tabs.query({}, (tabs) => {
//             tabs.forEach((tab) => {
//                 // Check if the tab URL matches Facebook or X
//                 if (tab.url.includes("facebook.com") || tab.url.includes("x.com")) {
//                     console.log(`Reloading tab with URL: ${tab.url}`);

//                     // Send a message to content scripts (optional)
//                     chrome.tabs.sendMessage(tab.id, { toggleEnabled });

//                     // Reload the tab     
//                     chrome.tabs.reload(tab.id);
//                 }
//             });
//         });
//     }
// });









  



  