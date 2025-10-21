const btn = document.getElementById("btn");
const colorPicker = document.getElementById("color-picker");
const modeSelect = document.getElementById("mode-select");
const colorScheme = document.getElementById("color-scheme");

btn.addEventListener("click", () => {
    const hex = colorPicker.value.slice(1);
    const mode = modeSelect.value;
    const url = `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=5`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            // Clear previous colors
            colorScheme.innerHTML = "";

            data.colors.forEach(color => {
                const hexValue = color.hex.value;

                // Wrapper div
                const wrapper = document.createElement("div");
                wrapper.classList.add("color-wrapper");

                // Color box
                const div = document.createElement("div");
                div.classList.add("color-box");
                div.style.backgroundColor = hexValue;

                // Hex text
                const text = document.createElement("p");
                text.textContent = hexValue;
                text.style.cursor = "pointer";
                text.title = "Click to copy";

                // Click-to-copy with UI feedback
                text.addEventListener("click", () => {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(hexValue)
                            .then(() => showCopyMessage(text, hexValue))
                            .catch(err => console.error("Failed to copy:", err));
                    } else {
                        // Fallback for older browsers
                        const textarea = document.createElement("textarea");
                        textarea.value = hexValue;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);
                        showCopyMessage(text, hexValue);
                    }
                });

                // Append elements
                wrapper.appendChild(div);
                wrapper.appendChild(text); 
                colorScheme.appendChild(wrapper);
            });
        })
        .catch(err => {
            console.error("Error fetching color scheme:", err);
            alert("Failed to fetch color scheme. Try a different color or mode.");
        });
});

// Helper: show small "Copied!" message next to hex
function showCopyMessage(element, hexValue) {
    const existingMsg = element.parentElement.querySelector(".copy-msg");
    if (existingMsg) existingMsg.remove();

    const msg = document.createElement("span");
    msg.textContent = `Copied ${hexValue}`;
    msg.classList.add("copy-msg");
    element.parentElement.appendChild(msg);

    setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 500);
    }, 1500);
}
