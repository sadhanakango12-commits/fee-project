document.addEventListener('DOMContentLoaded', () => {
    // Check if device supports hover
    if (window.matchMedia("(pointer: coarse)").matches) {
        return;
    }

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        body, a, button, input, select, textarea, [role="button"] {
            cursor: none !important;
        }
        
        .solid-glow-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 24px;
            height: 24px;
            /* Blue color on light backgrounds */
            background-color: rgba(37, 99, 235, 0.85); 
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate3d(-50%, -50%, 0);
            
            /* Glowing boundary in blue */
            box-shadow: 0 0 14px 5px rgba(37, 99, 235, 0.4);
            
            /* Smoothly animate color changes */
            transition: background-color 0.4s ease, box-shadow 0.4s ease;
            will-change: transform, background-color, box-shadow;
        }
        
        /* Dynamically applied when hovering over dark backgrounds */
        .solid-glow-cursor.on-dark {
            /* White color on dark backgrounds */
            background-color: rgba(255, 255, 255, 0.85); 
            box-shadow: 0 0 14px 5px rgba(255, 255, 255, 0.4);
        }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.classList.add('solid-glow-cursor');
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Helper function to dynamically check if the background is dark
    function isDarkBackground(element) {
        let current = element;
        while (current && current !== document.documentElement) {
            const bg = window.getComputedStyle(current).backgroundColor;
            // Ignore transparent backgrounds and keep checking the parent
            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (match) {
                    const r = parseInt(match[1], 10);
                    const g = parseInt(match[2], 10);
                    const b = parseInt(match[3], 10);
                    // Standard YIQ formula for perceived brightness
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    return brightness < 128; // Returns true if dark
                }
            }
            current = current.parentElement;
        }
        return false; // Assume light background by default
    }

    // High performance check: update color only when entering a new element
    document.addEventListener('mouseover', (e) => {
        if (isDarkBackground(e.target)) {
            cursor.classList.add('on-dark');
        } else {
            cursor.classList.remove('on-dark');
        }
    });

    // Animation loop for very smooth trailing
    function animate() {
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;

        cursor.style.transform = `translate3d(calc(-50% + ${cursorX}px), calc(-50% + ${cursorY}px), 0)`;

        requestAnimationFrame(animate);
    }
    animate();
});
