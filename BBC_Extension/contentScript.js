(() => {
    const processedElements = new WeakSet(); // Tracks processed text elements
    const processedImages = new WeakSet(); // Tracks processed image elements

    const messagesText = "This text exhibits indirect, negative, and verbal peer pressure."

    const messagesImage = "This image exhibits indirect, negative, and non-verbal peer pressure."

    let currentTheme = null; // Track current theme
    
    function injectCSStoX() {
        if (!document.getElementById('custom-style')) {
            const style = document.createElement('style');
            style.id = 'custom-style';
            style.innerHTML = `
                .spoiler {
                    background-color: #333 !important; /* Ensure background is applied */
                    color: transparent !important; /* Completely hide the text */
                    cursor: pointer;
                    border-radius: 4px;
                    padding: 2px 5px;
                    position: relative;
                    transition: color 0.3s ease, background-color 0.3s ease;
                    overflow: hidden; /* Prevent content overflow */
                    user-select: none; /* Prevent text selection */
                    }

                    /* Tooltip style using data-tooltip attribute */
                    .spoiler::after {
                    content: attr(data-tooltip); /* Tooltip content */
                    position: absolute;
                    bottom: 100%; /* Position tooltip above element */
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #000; /* Tooltip background */
                    color: #fff; /* Tooltip text color */
                    padding: 5px;
                    border-radius: 3px;
                    white-space: nowrap;
                    font-size: 12px;
                    opacity: 0; /* Initially hidden */
                    transition: opacity 0.3s ease; /* Smooth transition */
                    pointer-events: none; /* Prevent interaction */
                    z-index: 10; /* Ensure tooltip is on top */
                    }

                    /* Reveal tooltip on hover */
                    .spoiler:hover::after {
                    opacity: 1; /* Show tooltip */
                    }

                    /* Revealed state to display text */
                    .spoiler.revealed {
                    color: inherit; /* Restore text visibility */
                    background-color: transparent !important; /* Remove background */
                    transition: color 0.3s ease, background-color 0.3s ease; /* Smooth transition */
                    }
    
                /* Blur effect for images */
                .blurred {
                    filter: blur(8px) !important;
                    transition: filter 0.3s ease 3s !important;
                    position: relative !important;
                }
    
                .blurred:hover {
                    filter: none !important;
                    transition-delay: 3s !important;
                }   
    
                /* Centered tooltip message on blurred images */
                .blurred::before {
                    content: attr(data-tooltip);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: rgba(0, 0, 0, 0.7);
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    text-align: center;
                    opacity: 1;
                    white-space: nowrap;
                }
    
                .blurred:hover::before {
                    display: none;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function detectThemeChanges(callback) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = () => {
            const newTheme = mediaQuery.matches ? 'dark' : 'light';
            if (newTheme !== currentTheme) {
                currentTheme = newTheme;
                callback(newTheme);
            }
        };

        // Initial detection
        updateTheme();

        // Listen for theme changes
        mediaQuery.addEventListener('change', updateTheme);
    }

    function setTooltipText(el) {
        const tooltipMessage = messagesText;
        el.title = tooltipMessage
    }

    function setTooltipImage(image, condition) {
        const tooltipMessage = messagesImage;
        image.title = tooltipMessage;
    }

    // function getBrightnessFromColor(color) {
    //     // Extract RGB values from "rgb(r, g, b)" or "rgba(r, g, b, a)"
    //     const rgbMatch = color.match(/\d+/g);
    //     if (!rgbMatch) return null;
    
    //     const r = parseInt(rgbMatch[0], 10);
    //     const g = parseInt(rgbMatch[1], 10);
    //     const b = parseInt(rgbMatch[2], 10);
    
    //     // Calculate relative luminance (brightness)
    //     // Formula: (0.299 * R + 0.587 * G + 0.114 * B) / 255
    //     const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    //     return brightness;
    // }
    
    // function detectThemeByBrightness() {
    //     const bodyStyle = getComputedStyle(document.body);
    //     const backgroundColor = bodyStyle.backgroundColor;
    
    //     const brightness = getBrightnessFromColor(backgroundColor);
    
    //     if (brightness === null) {
    //         console.log("Could not detect brightness. Defaulting to light mode.");
    //         return "light";
    //     }
    
    //     console.log("Background brightness:", brightness);
    //     return brightness < 0.5 ? "dark" : "light";
    // }

    function throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    // async function sendDataToBackground(type, data) {
    //     // return new Promise((resolve, reject) => {
    //     //     chrome.runtime.sendMessage({ type, payload: data }, (response) => {
    //     //         if (response && response.success) {
    //     //             console.log(`${type} response:`, response.result);
    //     //             resolve(response.result);
    //     //         } else {
    //     //             console.error(`${type} error:`, response.error);
    //     //             reject(response.error);
    //     //         }
    //     //     });
    //     // });
        
    //     return new Promise((resolve, reject) => {
    //         //console.log(`Sending message to background script: Type=${type}, Data=`, data); // Debug log
    //         chrome.runtime.sendMessage({ type, payload: data }, (response) => {
    //             if (chrome.runtime.lastError) {
    //                 console.error(`Runtime error: ${chrome.runtime.lastError.message}`);
    //                 reject(chrome.runtime.lastError.message);
    //             } else if (response && response.success) {
    //                 //console.log(`${type} response:`, response.result);
    //                 resolve(response.result);
    //             } else {
    //                 console.error(`${type} error:`, response?.error || "No response from background script");
    //                 reject(response?.error || "No response from background script");
    //             }
    //         });
    //     });
        
    // }

   // const throttledSendDataToBackground = throttle(sendDataToBackground, 1000); // 1 second limit

   async function censorFacebookText() {
    try {
        const elements = document.querySelectorAll(
            'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h:not(.processed)'
        );

        for (const el of elements) {
            if (processedElements.has(el)) continue; // Skip if already processed

            processedElements.add(el); // Mark as processed
            el.classList.add("processed");
            const text = el.innerText;
            console.log(text);

            try {
                // Call the API directly
                const response = await fetch("https://peeredfast.ngrok.app/text/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ text })
                });

                if (!response.ok) throw new Error(`API Error: ${response.status}`);
                const result = await response.json();

                // Process response
                console.log("API Response:", result);
                if (result.text_label === "NEGATIVE") {
                    if (currentTheme === "dark") {
                        el.classList.add("spoiler");
                        setTooltipText(el, "Sensitive content");
                        el.addEventListener("click", () => el.classList.toggle("revealed2"));
                    } else {
                        el.classList.add("spoiler");
                        setTooltipText(el, "Sensitive content");
                        el.addEventListener("click", () => el.classList.toggle("revealed"));
                    }
                }
            } catch (error) {
                console.error("Error censoring text:", error);
            }
        }
    } catch (error) {
        console.error("Error in censorFacebookText:", error);
    }
}

    async function censorFacebookImage() {
        try {
            const divElements = document.querySelectorAll(
                'div[style*="height:"][style*="left:"][style*="width:"]:not(.processed)'
            );

            for (const div of divElements) {
                const image = div.querySelector("img");

                if (!image || processedElements.has(image)) continue; // Skip if already processed or no image

                processedElements.add(image); // Mark as processed
                image.classList.add("processed");

                if (image.width > 20 && image.height > 20) {
                    try {
                        // Call the API directly
                        const response = await fetch("https://peeredfast.ngrok.app/image/", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ image_url: image.src })
                        });

                        if (!response.ok) throw new Error(`API Error: ${response.status}`);
                        const result = await response.json();

                        // Process response
                        console.log("API Response:", result);
                        if (result.image_label === "NEGATIVE") {
                            image.classList.add("blurred");
                            setTooltipImage(image, "Sensitive content");
                            image.addEventListener("click", () => image.classList.toggle("revealed"));
                        }
                    } catch (error) {
                        console.error("Error censoring image:", error);
                    }
                }
            }
        } catch (error) {
            console.error("Error in censorFacebookImage:", error);
        }
    }


    // async function censorXText() {
    //     const elements = document.querySelectorAll('div.css-146c3p1.r-8akbws.r-krxsd3.r-dnmrzs.r-1udh08x.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-16dba41.r-bnwqim[data-testid="tweetText"]');
    
    //     for (const el of elements) {
    //         if (processedElements.has(el)) continue; // Skip if already processed
    
    //         processedElements.add(el); // Mark as processed
    //         el.classList.add('processed');
    
    //         const text = el.innerText;
            
    //         try {
    //             //console.log(text)
    //             // Example: Sending data to background script
    //                 //const result = await sendDataToBackground("SEND_DATA_TEXT", { text });
    //                 //const result = await throttledSendDataToBackground("SEND_DATA_TEXT", { test: "Hello from content script for image" });
    //             //console.log("Sending message...");
    //             await sendDataToBackground("SEND_DATA_TEXT", { text })
    //                 .then((response) => {
    //                     console.log(`Response:  ${response.text_label}`)
    //                     if (response.text_label === "NEGATIVE") {
    //                         el.classList.add("spoiler");
    //                         setTooltipText(el, "message1");
    //                         el.addEventListener("click", () => el.classList.toggle("revealed"));
    //                     }
    //                 })
    //                 .catch((error) => console.error("Error received:", error));
    //                 //console.log(result)

    //             // Add spoiler class to hide text
    //             // el.classList.add('spoiler');
    //             // setTooltipText(el, 'message1');
    
    //             // // On click, toggle the 'revealed' class
    //             // el.addEventListener('click', () => {
    //             //     el.classList.toggle('revealed');
    //             // });
    //         } catch (error) {
    //             console.error('Error censoring text:', error);
    //         }
    //     }
    // }

    async function censorXText() {
        const elements = document.querySelectorAll('div[data-testid="tweetText"]:not(.processed)');
    
        for (const el of elements) {
            if (processedElements.has(el)) continue; // Skip if already processed
    
            processedElements.add(el); // Mark as processed
            el.classList.add('processed');
    
            const text = el.innerText;
    
            try {
                // Call the API directly
                // const response = await fetch("https://peeredfast.ngrok.app/text/", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify({ text })
                // });
    
                //if (!response.ok) throw new Error(`API Error: ${response.status}`);
                //const result = await response.json();
    
                // Process response
                //console.log("API Response:", result);
                //if (result.text_label === "NEGATIVE") {
                    el.classList.add("spoiler");
                    setTooltipText(el);
                    el.addEventListener("click", () => el.classList.toggle("revealed"));
                //}
            } catch (error) {
                console.error("Error in censorXText:", error);
            }
        }
    }
    

    async function censorXImage() {
        const images = document.querySelectorAll('img[alt="Image"]:not(.processed)');
    
        for (const image of images) {
            if (processedElements.has(image)) continue; // Skip if already processed
    
            processedElements.add(image); // Mark as processed
            image.classList.add("processed");
    
            const image_url = image.src;
    
            try {
                // Call the API directly
                // const response = await fetch("https://peeredfast.ngrok.app/image/", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify({ image_url })
                // });
    
                //if (!response.ok) throw new Error(`API Error: ${response.status}`);
                //const result = await response.json();
    
                // Process response
                //console.log("API Response:", result);
                //if (result.image_label === "NEGATIVE") {
                    image.className = 'blurred'
                    setTooltipImage(image);
                    image.addEventListener("click", () => image.classList.toggle("revealed"));
                //}
            } catch (error) {
                console.error("Error in censorXImage:", error);
            }
        }
    }
    

    //Observer and reloading logic
    let observer;
    let debounceTimer;

    function debounce(func, delay) {
        return (...args) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func(...args), delay);
        };
    }

    function enableExtension() {
        console.log("Extension enabled");

        // Use debounce in MutationObserver
        observer = new MutationObserver(debounce(() => {
            const domain = window.location.hostname;
            if (domain.includes("facebook.com")) {
                censorFacebookText();
                censorFacebookImage();
            } else if (domain.includes("x.com") && !window.location.pathname.includes("/status")) {
                censorXImage();
                censorXText();
            }
        }, 200));

        observer.observe(document.body, { childList: true, subtree: true });

        const domain = window.location.hostname;
        if (domain.includes("facebook.com")) {
            censorFacebookText();
            censorFacebookImage();
        } else if (domain.includes("x.com") && !window.location.pathname.includes("/status")) { 
                injectCSStoX();
                censorXImage();
                censorXText();  
        }
    }

    function disableExtension() {
        console.log("Extension disabled");
        if (observer) observer.disconnect();
    }

    chrome.storage.sync.get(['toggleEnabled'], result => {
        if (result.toggleEnabled) {
            enableExtension();
        }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.toggleEnabled !== undefined) {
            if (message.toggleEnabled) {
                enableExtension();
            } else {
                disableExtension();
            }
        }
    });

    //Theme Changes
    detectThemeChanges((theme) => {
        console.log(`Theme changed to: ${theme}`);
    });

    //First time installation message
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "showAlert") {
            alert("Installation successful! Thank you for installing the extension.");
        }
    });
    

})();





  


//https://chatgpt.com/share/674d6ce3-34bc-800a-aef2-692e88e7a9d0
//https://chatgpt.com/c/674d696e-b348-8010-b50a-e8ebe6facf7c