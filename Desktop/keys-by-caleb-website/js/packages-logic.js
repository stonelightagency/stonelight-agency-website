/* --- packages-logic.js --- */

document.addEventListener('DOMContentLoaded', () => {

    // --- Existing Tab Logic ---
    const tabContainer = document.querySelector('.packages-tabs-container');
    if (tabContainer) {
        const tabs = tabContainer.querySelectorAll('.packages-tab-item');
        const tabContents = document.querySelectorAll('.packages-tab-content');

        const activateTab = (tabToActivate) => {
            if (!tabToActivate) return;

            const targetId = tabToActivate.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);

            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            tabToActivate.classList.add('active');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                activateTab(tab);
            });
        });

        if (tabs.length > 0) {
            activateTab(tabs[0]);
        }
    }

    // --- New Add-ons Modal Logic ---
    const openModalBtn = document.getElementById('open-addons-modal');
    const closeModalBtn = document.getElementById('close-addons-modal');
    const modalOverlay = document.getElementById('addons-modal-overlay');

    const openModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            // We need a small delay to allow the 'display' property to change before transitioning opacity
            requestAnimationFrame(() => {
                modalOverlay.classList.add('active');
            });
        }
    };

    const closeModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            // Wait for the transition to finish before setting display to none
            modalOverlay.addEventListener('transitionend', () => {
                modalOverlay.classList.add('hidden');
            }, { once: true });
        }
    };

    if (openModalBtn && modalOverlay) {
        openModalBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        // Close modal if the overlay (background) is clicked
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Close modal on escape key press
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
});