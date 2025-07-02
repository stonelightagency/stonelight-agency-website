/* --- testimonials-new.js --- */
// V3.0 - Tab-based Redesign Logic

document.addEventListener('DOMContentLoaded', () => {

    const tabContainer = document.querySelector('.tm-tabs-container');
    if (!tabContainer) return;

    const tabs = tabContainer.querySelectorAll('.tm-tab-item');
    const tabContents = document.querySelectorAll('.tm-tab-content');

    const activateTab = (tabToActivate) => {
        if (!tabToActivate) return;

        const targetId = tabToActivate.getAttribute('data-tab');
        const targetContent = document.getElementById(targetId);

        // Deactivate all other tabs and content
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Activate the selected one
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

    // Ensure the first tab is active on load
    if (tabs.length > 0) {
        activateTab(tabs[0]);
    }
});