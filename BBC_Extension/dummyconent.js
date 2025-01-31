(() => {
        const messagesText = {
            message1: "This text exhibits indirect, negative, and verbal peer pressure.",
            message2: "This text exhibits indirect, negative, and non-verbal peer pressure.",
            message3: "This text exhibits direct, negative, and verbal peer pressure.",
            message4: "This text exhibits direct, negative, and non-verbal peer pressure."
        };
    
        const messagesImage = {
            message1: "This image exhibits indirect, negative, and verbal peer pressure.",
            message2: "This image exhibits indirect, negative, and non-verbal peer pressure.",
            message3: "This image exhibits direct, negative, and verbal peer pressure.",
            message4: "This image exhibits direct, negative, and non-verbal peer pressure."
        };
    
        function injectCSStoX() {
            if (!document.getElementById('custom-style')) {
                const style = document.createElement('style');
                style.id = 'custom-style';
                style.innerHTML = 
                    .spoiler {'
                        background-color: #333;
                        color: transparent;
                        cursor: pointer;
                        border-radius: 4px;
                        padding: 2px 5px;
                        position: relative;
                        transition: color 0.3s ease, background-color 0.3s ease;
                    }
        
                    .spoiler::after {
                        content: attr(data-tooltip);
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: #000;
                        color: #fff;
                        padding: 5px;
                        border-radius: 3px;
                        white-space: nowrap;
                        font-size: 12px;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        pointer-events: none;
                    }
        
                    .spoiler:hover::after {
                        opacity: 1;
                    }
        
                    .spoiler.revealed {
                        color: inherit;
                        background-color: transparent;
                    }
        
                    /* Blur effect for images */
                    .blurred {g
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
                ;
                document.head.appendChild(style);
            }
        }
    
        function setTooltipText(el, condition) {
            const tooltipMessage = messagesText[condition];
            el.setAttribute("data-tooltip", tooltipMessage);
        }
    
        function setTooltipImage(image, condition) {
            const tooltipMessage = messagesImage[condition];
            image.title = tooltipMessage;
        }
    
        function sendDataToBackgroundText(data) {
            chrome.runtime.sendMessage({ type: "SEND_DATA_TEXT", payload: data });
        }
    
        function sendDataToBackgroundImage(data) {
            chrome.runtime.sendMessage({ type: "SEND_DATA_TEXT", payload: data });
        }
    
        // const processedTextElements = new WeakSet();
        // const processedImageElements = new WeakSet();
    
        function censorFacebookText() {
            try {
                // Select all target elements that haven't been processed yet
                // const elements = document.querySelectorAll(
                //     'div[dir="auto"][style*="text-align: start;"]:not(.processed), div[dir="auto"][style*="text-align:start"]:not(.processed)'
                // );
    
                let elements = document.querySelectorAll('span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h:not(.processed)');
                
                elements.forEach(el => {
                    console.log(el.innerText); // Log the element's text for debugging
                    
                    // Mark as processed
                    el.classList.add("processed");
    
                    sendDataToBackgroundText(el.innerText)
                    
                    // Add the "spoiler" class to censor the text
                    el.classList.add("spoiler");
                    
                    // Set tooltip text
                    setTooltipText(el, "message1");
                    
                    // Add a click event to toggle the "revealed" state
                    el.addEventListener('click', () => el.classList.toggle("revealed"));
                });
            } catch (error) {
                console.error("Error in censorFacebookText:", error);
            }
        }
        
    
        function censorFacebookImage() {
            const divElements = document.querySelectorAll('div[style*="height:"][style*="left:"][style*="width:"]:not(.processed)');
    
            divElements.forEach(div => {
                const image = div.querySelector('img');
                if (image && image.width > 20 && image.height > 20) { 
                    //processedImageElements.add(image);
                    //console.log(image.src)
                    image.classList.add("processed")
                    image.classList.add("blurred");
                    setTooltipImage(image, "message2");
                }
            });
        }
    
        function censorXText() {
            // Select all target elements that haven't been processed yet
            const elements = document.querySelectorAll(
                'div[data-testid="tweetText"] span:not(.processed)'
            );
        
            elements.forEach(el => {
                // Add a class to mark the element as processed
                el.classList.add("processed");
        
                // Add the "spoiler" class to censor the text
                el.classList.add("spoiler");
        
                // Set tooltip text
                setTooltipText(el, "message1");
                console.log(el.innerText)
        
                // Add a click event to toggle the "revealed" state
                el.addEventListener('click', () => el.classList.toggle("revealed"));
            });
        }
        
    
        function censorXImage() {
            const images = document.querySelectorAll('img[alt="Image"]:not(.processed)');
    
            images.forEach(image => {
                
                    //processedImageElements.add(image);
                    //console.log(image.src)
                    image.className = 'blurred'
                    image.classList.add("processed")
                    setTooltipImage(image, "message2");
                
            });
        }      
})();
                              