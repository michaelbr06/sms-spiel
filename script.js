        document.addEventListener('DOMContentLoaded', () => {
            const nameInput = document.getElementById('name');
            const dateInput = document.getElementById('date');
            const statusButtonsContainer = document.getElementById('status-buttons-container');
            const messageDisplay = document.getElementById('message-display');
            const copyMessageButton = document.getElementById('copy-message-button');
            let currentActiveButton = null; // Variable to keep track of the currently active button

            // Function to copy text to clipboard
            function copyToClipboard(text) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    console.log('Text copied to clipboard!');
                    return true;
                } catch (err) {
                    console.error('Failed to copy text:', err);
                    return false;
                } finally {
                    document.body.removeChild(textarea);
                }
            }

            statusButtonsContainer.addEventListener('click', (event) => {
                const clickedButton = event.target.closest('.status-button');

                // Ensure a status button was clicked
                if (clickedButton) {
                    // If there's an active button, remove its 'active' class
                    if (currentActiveButton) {
                        currentActiveButton.classList.remove('active');
                    }

                    // Add 'active' class to the newly clicked button
                    clickedButton.classList.add('active');

                    // Update the reference to the current active button
                    currentActiveButton = clickedButton;

                    // Get input values
                    const name = nameInput.value.trim();
                    const date = dateInput.value; // Date input value is already a string in 'YYYY-MM-DD' format

                    // Format date for display (e.g., "June 23, 2025") if possible
                    let formattedDate = date;
                    if (date) {
                        try {
                            const dateObj = new Date(date + 'T00:00:00'); // Add T00:00:00 to handle timezone issues
                            formattedDate = dateObj.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                        } catch (e) {
                            console.error("Error formatting date:", e);
                            formattedDate = date; // Fallback to original if formatting fails
                        }
                    } else {
                        formattedDate = "N/A"; // Or any other placeholder for empty date
                    }

                    let message = '';
                    const status = clickedButton.dataset.status;

                    // Generate message based on selected status
                    switch (status) {
                        case 'ready-for-pickup':
                            message = `Good day, ${name || 'customer'}! Thank you for choosing Vision Learning Clinic.\n\nWe're glad to inform you that your eyeglasses are now ready for pick up.\n\n Please confirm when you have received this message.\n\nStore hours:\n10:00 AM - 10:00 PM\nMon - Sun.`;
                            break;
                        case 'delayed-lens-delivery':
                            message = `Good day, ${name || 'customer'}! Thank you for your purchase here at Vision Learning Clinic.\n\nPlease be informed that there may be a delay in the delivery of your lenses.\n\nNew tentative delivery date is on ${formattedDate}.\n\nPlease confirm when you have received this message.\n\nIf you have any other concerns, please don't hesitate to contact us through this number.\n\nThank you for your kind understanding.`;
                            break;
                        case 'frame-to-follow':
                            message = `Good day, ${name || 'customer'}! Thank you for choosing the Vision Learning Clinic.\n\nWe're glad to let you know that your lenses has been delivered in our store. Please bring your chosen frame and warranty card for assembly.\n\nWe would very much appreciate it if you could visit our store before 8:00 PM so that we have enough time to make any further adjustments, if needed.\n\nPlease confirm when you have received this message.\n\nStore Hours:\n10:00 AM - 10:00 PM\nMon - Sun`;
                            break;
                        case 'unclaimed-60-days':
                            message = `Good day, ${name || 'customer'}! Thank you for your purchase last ${formattedDate}. We're going to have to dispose your purchased items. Sorry.`;
                            break;
                        default:
                            message = 'Please select a status.';
                    }

                    // Display the message
                    if (message) {
                        messageDisplay.textContent = message;
                        messageDisplay.classList.remove('hidden'); // Make the message area visible
                        copyMessageButton.classList.remove('hidden'); // Make copy button visible
                    } else {
                        messageDisplay.classList.add('hidden'); // Hide if no message
                        copyMessageButton.classList.add('hidden'); // Hide copy button
                    }

                    // Reset copy button text if a new status is selected
                    copyMessageButton.textContent = 'Copy Message';
                    console.log('Selected Status:', status);
                }
            });

            // Event listener for the copy message button
            copyMessageButton.addEventListener('click', () => {
                const messageToCopy = messageDisplay.textContent;
                if (copyToClipboard(messageToCopy)) {
                    copyMessageButton.textContent = 'Message Copied!';
                    setTimeout(() => {
                        copyMessageButton.textContent = 'Copy Message';
                    }, 2000); // Revert after 2 seconds
                } else {
                    // Optionally, handle copy failure (e.g., show a small error message)
                    console.error('Failed to copy message to clipboard.');
                }
            });
        });