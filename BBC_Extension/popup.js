// document.addEventListener('DOMContentLoaded', () => {
//     const toggleSwitch = document.getElementById('toggle-switch');
//     const statusText = document.getElementById('status-text');

//     // Function to update status text
//     const updateStatusText = (isEnabled) => {
//         if (isEnabled) {
//             statusText.textContent = "ON";
//             statusText.classList.add('on');
//             statusText.classList.remove('off');
//         } else {
//             statusText.textContent = "OFF";
//             statusText.classList.add('off');
//             statusText.classList.remove('on');
//         }
//     };

//     // Load saved toggle state
//     chrome.storage.sync.get(['toggleEnabled'], (result) => {
//         toggleSwitch.checked = result.toggleEnabled || false;
//     });

//     // Listen for toggle changes
//     toggleSwitch.addEventListener('change', () => {
//         const isEnabled = toggleSwitch.checked;

//         // Show the confirmation dialog first
//         const status = isEnabled ? "enabled" : "disabled";
//         const userConfirmed = window.confirm(`The extension is now ${status}. Do you want to proceed with this change?`);

//         if (userConfirmed) {
//             // If the user confirms, update the state and save it
//             chrome.storage.sync.set({ toggleEnabled: isEnabled }, () => {
//                 if (chrome.runtime.lastError) {
//                     console.error("Error saving toggle state:", chrome.runtime.lastError);
//                 } else {
//                     console.log(`Toggle is now ${isEnabled ? 'enabled' : 'disabled'}`);
//                 }
//             });

//             // Update status text
//             updateStatusText(isEnabled);

//             // Send a message to the background script to toggle the extension
//             chrome.runtime.sendMessage({ toggleEnabled: isEnabled });

//             // Send a message to reload the relevant tabs, whether enabling or disabling
//             chrome.runtime.sendMessage({ reloadTabs: true });
//         } else {
//             // If the user cancels, revert the toggle switch state
//             toggleSwitch.checked = !isEnabled;  // Revert back to the original state
//             console.log("User canceled the toggle action.");
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggle-switch');
    const statusText = document.createElement('p'); // Create a new element for the status text
    statusText.id = "status-text"; // Set an ID for styling purposes
    const container = document.querySelector('.container');
    container.appendChild(statusText); // Append it to the container

    // Load saved toggle state and update the UI
    chrome.storage.sync.get(['toggleEnabled'], (result) => {
        const isEnabled = result.toggleEnabled || false;
        toggleSwitch.checked = isEnabled;
        updateStatusText(isEnabled);
    });

    // Listen for toggle changes
    toggleSwitch.addEventListener('change', () => {
        const isEnabled = toggleSwitch.checked;

        // Show the confirmation dialog first
        const status = isEnabled ? "enable" : "disable";
        const userConfirmed = window.confirm(`The pages will be reloaded to ${status} the extension. Do you want to proceed with this change?`);

        if (userConfirmed) {
            // If the user confirms, update the state and save it
            chrome.storage.sync.set({ toggleEnabled: isEnabled }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error saving toggle state:", chrome.runtime.lastError);
                } else {
                    console.log(`Toggle is now ${isEnabled ? 'enabled' : 'disabled'}`);
                }
            });

            // Update the UI and notify the background script
            updateStatusText(isEnabled);
            chrome.runtime.sendMessage({ toggleEnabled: isEnabled });

            // Reload relevant tabs
            chrome.runtime.sendMessage({ reloadTabs: true });
        } else {
            // Revert the toggle switch state if the user cancels
            toggleSwitch.checked = !isEnabled;
            console.log("User canceled the toggle action.");
        }
    });

    // Function to update the status text
    function updateStatusText(isEnabled) {
        statusText.textContent = isEnabled ? "ON" : "OFF";
        statusText.style.color = isEnabled ? "green" : "red";
    }
});



















