/* ======================================
    JavaScript for Keys by Caleb Vendor Pages
    Version: 2.1 (Rebuilt with Library Logic)
    Description: Manages tab navigation and scroll animations.
                 Relies on global scripts for header and scroll-to-top.
   ======================================
*/

document.addEventListener('DOMContentLoaded', () => {
    console.log("Vendor JS Initialized (V2.1)");

    /**
     * Tab Navigation System
     * Handles switching between content sections on vendor sub-pages.
     */
    const tabContainer = document.querySelector('.vendor-tabs');
    if (tabContainer) {
        const tabs = tabContainer.querySelectorAll('.tab-item');
        const tabContents = document.querySelectorAll('.tab-content');

        const activateTab = (tabToActivate) => {
            if (!tabToActivate) return;

            const targetId = tabToActivate.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);

            // Deactivate all others
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activate the selected one
            tabToActivate.classList.add('active');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                activateTab(tab);
            });
        });

        // Activate the first tab by default on page load.
        if (tabs.length > 0) {
            activateTab(tabs[0]);
        }
    }


    /**
     * Animate elements on scroll using Intersection Observer
     * Triggers fade-in/slide-up animations when elements enter the viewport.
     */
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observerInstance.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => observer.observe(element));
    } else {
        // Fallback for older browsers, make elements visible immediately.
        animatedElements.forEach(el => el.classList.add('active'));
    }

    /**
     * Accordion FAQ Logic
     * Handles the collapsible FAQ section on the contact page.
     */
    const accordions = document.querySelectorAll('.faq-accordion');
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.faq-item');
        items.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = question.classList.contains('active');
                    
                    // Close all other items before opening the new one
                    accordion.querySelectorAll('.faq-item').forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.querySelector('.faq-question').classList.remove('active');
                            otherItem.querySelector('.faq-answer').style.maxHeight = null;
                            otherItem.querySelector('.faq-answer').style.paddingTop = null;
                            otherItem.querySelector('.faq-answer').style.paddingBottom = null;
                        }
                    });

                    // Toggle the clicked item
                    if (!isActive) {
                        question.classList.add('active');
                        answer.style.paddingTop = '0';
                        answer.style.paddingBottom = '1rem';
                        answer.style.maxHeight = answer.scrollHeight + "px";
                    } else {
                        question.classList.remove('active');
                        answer.style.maxHeight = null;
                        answer.style.paddingTop = null;
                        answer.style.paddingBottom = null;
                    }
                });
            }
        });
    });

});