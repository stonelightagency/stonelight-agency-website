/**
 * JavaScript for Keys by Caleb - Multi-Step Booking Pages (V4.6 - Real Netlify Submission)
 */

// --- Global Helper Stubs ---
function showElement(el) { if(el) el.classList.remove('hidden'); }
function hideElement(el) { if(el) el.classList.add('hidden'); }
function addClass(el, className) { if(el) el.classList.add(className); }
function removeClass(el, className) { if(el) el.classList.remove(className); }
function setAriaAttribute(el, attr, value) { if(el) el.setAttribute(attr, value); }
function hasClass(el, className) { return el?.classList.contains(className); }

// --- Google Maps Autocomplete Initialization ---
function initMapAutocomplete() {
    console.log("Global initMapAutocomplete (V4.6 Booking Page) CALLED.");
    const addressInput = document.getElementById('venue_address');

    if (!addressInput) {
        console.error("BOOKING PAGE ERROR: #venue_address input NOT FOUND. Autocomplete cannot initialize.");
        return;
    }

    if (typeof google === 'undefined' || typeof google.maps === 'undefined' || typeof google.maps.places === 'undefined' || typeof google.maps.places.Autocomplete === 'undefined') {
        console.error("BOOKING PAGE ERROR: Google Maps Places API objects NOT LOADED. Autocomplete cannot initialize. Check API key and script loading.");
        return;
    }

    try {
        const autocomplete = new google.maps.places.Autocomplete(addressInput, {
            componentRestrictions: { country: "us" },
            fields: ["formatted_address", "geometry", "name", "address_components"],
            types: ["geocode"],
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
                addressInput.value = place.formatted_address;
                console.log("Address selected and input value SET to:", addressInput.value);
            } else {
                console.warn("Place changed, but no formatted_address found or place is invalid.");
            }
        });

        addressInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const pacContainer = document.querySelector('.pac-container');
                if (pacContainer && getComputedStyle(pacContainer).display !== 'none' && pacContainer.querySelector('.pac-item.pac-item-selected, .pac-item:hover')) {
                    event.preventDefault();
                }
            }
        });
        console.log("Google Places Autocomplete initialized and attached to #venue_address.");

    } catch (e) {
        console.error("BOOKING PAGE CRITICAL ERROR during 'new google.maps.places.Autocomplete()':", e);
    }
}
window.initMapAutocomplete = initMapAutocomplete;

window.clearBookingFieldError = (field, formElement) => {
    if (!field) return;
    const name = field.name || field.id;
    if (!formElement) return;
    const errorElement = formElement.querySelector(`.error-message[data-for="${name}"]`);
    removeClass(field, 'input-error');
    setAriaAttribute(field, 'aria-invalid', 'false');
    if (errorElement) {
        hideElement(errorElement);
        errorElement.textContent = '';
        field.removeAttribute('aria-describedby'); 
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("Keys by Caleb - Booking Page JS Initialized (V4.6 - Real Netlify Submission)");
    gsap.registerPlugin(ScrollToPlugin);

    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) { console.error("Booking form not found."); return; }
    
    const TOTAL_STEPS = 6; 
    const formSteps = Array.from(bookingForm.querySelectorAll('.booking-step'));
    if (formSteps.length !== TOTAL_STEPS) { console.warn(`Expected ${TOTAL_STEPS} steps, found ${formSteps.length}.`); }
    
    const stepIndicators = Array.from(bookingForm.querySelectorAll('.step-indicator'));
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const submitRequestButton = document.getElementById('submit-request-button'); 
    const formMessage = document.getElementById('form-message'); 
    const bookingCard = document.querySelector('.booking-card');
    const loaderOverlay = document.getElementById('booking-loader-overlay');
    const loaderText = document.getElementById('loader-text');

    const openModalBtn = document.getElementById('open-addons-modal-booking');
    const closeModalBtn = document.getElementById('close-addons-modal-booking');
    const modalOverlay = document.getElementById('addons-modal-overlay-booking');
    
    // --- Summary Field References ---
    const summaryFields = {
        event_date: document.getElementById('summary-event_date'),
        event_time: document.getElementById('summary-event_time'),
        event_type_selection: document.getElementById('summary-event_type_selection'),
        wedding_moment: document.getElementById('summary-wedding_moment'),
        wedding_parts: document.getElementById('summary-wedding_parts'),
        venue_name: document.getElementById('summary-venue_name'),
        venue_address: document.getElementById('summary-venue_address'),
        estimated_guest_count: document.getElementById('summary-estimated_guest_count'), 
        estimated_duration: document.getElementById('summary-estimated_duration'),
        request_additional_hours: document.getElementById('summary-request_additional_hours'),
        acknowledge_billing: document.getElementById('summary-acknowledge_billing'),
        acknowledge_hours: document.getElementById('summary-acknowledge_hours'),
        music_style_vibe: document.getElementById('summary-music_style_vibe'), 
        piano_availability: document.getElementById('summary-piano_availability'),
        song_requests: document.getElementById('summary-song_requests'),
        name: document.getElementById('summary-name'),
        email: document.getElementById('summary-email'),
        phone: document.getElementById('summary-phone'),
        referral: document.getElementById('summary-referral'),
        message: document.getElementById('summary-message'),
        addons_list: document.getElementById('summary-addons-list'),
        addons_section: document.getElementById('summary-addons-section'),
        accept_vinyl: document.getElementById('summary-accept_vinyl'),
        accept_rehearsal: document.getElementById('summary-accept_rehearsal'),
        upgrade_vinyl: document.getElementById('summary-upgrade_vinyl')
    };


    const header = document.getElementById('main-header');
    const scrollToTopButton = document.getElementById('scroll-to-top');
    const currentYearSpan = document.getElementById('current-year');
    const dateField = document.getElementById('event_date');
    const REVIEW_STEP_INDEX = TOTAL_STEPS - 1; 
    
    let currentStepIndex = 0;
    let isTransitioning = false;
    let formAttemptedSubmit = false;
    const PHONE_PATTERN = /^(\+?1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
    const CSS_TRANSITION_DURATION = 400;
    
    const getHeaderHeight = () => header?.offsetHeight || (window.innerWidth <= 1023 ? 60 : 70);
    const scrollIntoViewIfNeeded = (element) => { if (!element) return; const rect = element.getBoundingClientRect(); const headerHeight = getHeaderHeight(); const isAbove = rect.top < headerHeight + 10; const isBelow = rect.bottom > window.innerHeight - 10; if (isAbove || isBelow) { const elementTopRelativeToDocument = window.scrollY + rect.top; const targetScrollY = elementTopRelativeToDocument - headerHeight - 30; window.scrollTo({ top: targetScrollY, behavior: 'smooth' }); } };
    const disableButton = (button) => { if (button) { button.disabled = true; addClass(button, 'btn-disabled'); } }; 
    const enableButton = (button) => { if (button) { button.disabled = false; removeClass(button, 'btn-disabled'); } };
    const setButtonLoading = (button, isLoading, loadingText = "Processing...") => { if (!button) return; if (isLoading) { button.disabled = true; addClass(button, 'loading'); setAriaAttribute(button, 'aria-busy', 'true'); setAriaAttribute(button, 'aria-live', 'assertive'); if (!button.dataset.originalText) { button.dataset.originalText = button.textContent.trim(); } button.innerHTML = `${loadingText}`; } else { if (hasClass(button, 'loading')) { button.disabled = false; removeClass(button, 'loading'); setAriaAttribute(button, 'aria-busy', 'false'); if(button.dataset.originalText) { button.textContent = button.dataset.originalText; } } } };
    const showFormMessageScoped = (message, type = 'error', targetElement = formMessage) => { if (targetElement) { targetElement.textContent = message; targetElement.className = `form-message-area visible ${type}`; setAriaAttribute(targetElement, 'role', 'alert'); scrollIntoViewIfNeeded(targetElement); } };
    const hideFormMessageScoped = (targetElement = formMessage) => { if (targetElement && hasClass(targetElement, 'visible')) { removeClass(targetElement, 'visible'); removeClass(targetElement, 'success'); removeClass(targetElement, 'error'); targetElement.textContent = ''; } };
    const debounce = (func, wait) => { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func.apply(this, args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; };

    const formatDate = (dateStr) => { if (!dateStr) return '-'; try { const d = new Date(dateStr + 'T00:00:00Z'); if (isNaN(d.getTime())) throw new Error("Invalid date"); return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }); } catch { return '-'; } };
    const formatTime = (timeStr) => { if (!timeStr) return '-'; try { const [hours, minutes] = timeStr.split(':'); if (hours === undefined || minutes === undefined) throw new Error("Invalid time format"); const d = new Date(); d.setHours(parseInt(hours), parseInt(minutes), 0, 0); if (isNaN(d.getTime())) throw new Error("Invalid time"); return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); } catch { return '-'; } };
    const formatPhone = (phoneStr) => { const r = phoneStr?.trim(); if (!r) return 'Not provided'; const c = r.replace(/\D/g, ''); const m = c.match(/^(\d{3})(\d{3})(\d{4})$/); return m ? `(${m[1]}) ${m[2]}-${m[3]}` : (r !== '-' ? r : 'Not provided'); };
    const formatSelection = (s, d = '-') => { const v = s?.trim(); return (!v || v === "Unknown") ? d : v.replace(/_/g, ' '); };
    const formatNotes = (n) => { const v = n?.trim(); return v || 'No additional notes.'; };
    const formatGuestCount = (g) => { const v = g?.trim(); return v ? `${v} Guests` : 'Not specified'; }
    const formatCheckbox = (c) => c ? 'Yes' : 'No';

    const updateStepIndicatorsScoped = (index) => { stepIndicators.forEach((indicator, i) => { const stepNum = parseInt(indicator.dataset.step || '0', 10) - 1; const conn = indicator.previousElementSibling; removeClass(indicator, 'active'); removeClass(indicator, 'completed'); setAriaAttribute(indicator, 'aria-selected', 'false'); if (stepNum === index) { addClass(indicator, 'active'); setAriaAttribute(indicator, 'aria-selected', 'true'); if (conn && hasClass(indicator.previousElementSibling?.previousElementSibling, 'completed')) addClass(conn, 'completed'); else if (conn) removeClass(conn, 'completed'); } else if (stepNum < index) { addClass(indicator, 'completed'); const nextConn = indicator.nextElementSibling; if (nextConn && hasClass(nextConn, 'step-connector')) addClass(nextConn, 'completed'); } else { if (conn && hasClass(conn, 'step-connector') && !hasClass(indicator.previousElementSibling?.previousElementSibling, 'completed')) removeClass(conn, 'completed'); const nextConn = indicator.nextElementSibling; if (nextConn && hasClass(nextConn, 'step-connector')) removeClass(nextConn, 'completed'); } }); };
    const updateNavigationButtonsScoped = (index) => {
        if(prevButton) prevButton.style.visibility = (index > 0) ? 'visible' : 'hidden';
        if(nextButton) hideElement(nextButton);
        if(submitRequestButton) hideElement(submitRequestButton);
        if(prevButton) enableButton(prevButton);
        if (index < REVIEW_STEP_INDEX) { if(nextButton) { showElement(nextButton); enableButton(nextButton); } } 
        else if (index === REVIEW_STEP_INDEX) { if(submitRequestButton) { showElement(submitRequestButton); enableButton(submitRequestButton); } }
    };
    const updateBookingSummaryScoped = () => {
        if (!bookingForm) return;
        const formData = new FormData(bookingForm);
    
        // Handle standard text/select fields
        for (const key in summaryFields) {
            if (!summaryFields[key]) continue;
            
            let value = formData.get(key);
            let formattedValue = value;
    
            switch (key) {
                case 'event_date': formattedValue = formatDate(value); break;
                case 'event_time': formattedValue = formatTime(value); break;
                case 'phone': formattedValue = formatPhone(value); break;
                case 'estimated_guest_count': formattedValue = formatGuestCount(value); break;
                case 'song_requests': case 'message': formattedValue = formatNotes(value); break;
                case 'request_additional_hours': case 'acknowledge_billing': case 'acknowledge_hours': case 'accept_vinyl': case 'accept_rehearsal': case 'upgrade_vinyl': formattedValue = formatCheckbox(formData.has(key)); break;
                case 'wedding_parts':
                    let parts = formData.getAll(key).join(', ');
                    if (formData.has('wedding_part_other_details') && formData.get('wedding_part_other_details').trim()) {
                        parts += `, Other: ${formData.get('wedding_part_other_details').trim()}`;
                    }
                    formattedValue = parts || 'Not specified';
                    break;
                case 'wedding_moment':
                    let moment = value;
                    if (moment === 'Other' && formData.has('other_moment_details') && formData.get('other_moment_details').trim()) {
                        moment = `Other: ${formData.get('other_moment_details').trim()}`;
                    }
                    formattedValue = formatSelection(moment);
                    break;
                case 'estimated_duration': formattedValue = value === 'Package' ? 'Package' : (value ? `${value} hours` : '-'); break;
                default: formattedValue = formatSelection(value, (key === 'venue_name' || key === 'referral') ? 'Not specified' : '-'); break;
            }
            if (summaryFields[key].tagName === 'SPAN') {
                 summaryFields[key].textContent = formattedValue;
            }
        }
    
        // Handle optional paid addons
        const selectedAddons = Array.from(bookingForm.querySelectorAll('input[name="addons"]:checked')).map(cb => cb.value);
        if (summaryFields.addons_list && summaryFields.addons_section) {
            if (selectedAddons.length > 0) {
                summaryFields.addons_list.innerHTML = selectedAddons.join('<br>');
                showElement(summaryFields.addons_section);
            } else {
                summaryFields.addons_list.textContent = 'None selected';
                 if(bookingForm.name !== 'booking-tfe-request') {
                    hideElement(summaryFields.addons_section);
                 }
            }
        }
        
        // Conditional visibility for TFE vinyl upgrade in summary
        const vinylUpgradeSummaryWrapper = document.getElementById('summary-vinyl-upgrade-wrapper');
        if(vinylUpgradeSummaryWrapper) {
            const vinylAccepted = formData.has('accept_vinyl');
            vinylAccepted ? showElement(vinylUpgradeSummaryWrapper) : hideElement(vinylUpgradeSummaryWrapper);
        }
    };
    const navigateToStepScoped = (targetIndex, isMovingForward = true) => {
        if (isTransitioning || targetIndex < 0 || targetIndex >= TOTAL_STEPS || targetIndex === currentStepIndex) return;
        isTransitioning = true;
        if (targetIndex === REVIEW_STEP_INDEX) { updateBookingSummaryScoped(); }
        const currentStepEl = formSteps[currentStepIndex]; const targetStepEl = formSteps[targetIndex];
        if(prevButton) disableButton(prevButton); if(nextButton) disableButton(nextButton); if(submitRequestButton) disableButton(submitRequestButton);
        if (currentStepEl) { addClass(currentStepEl, 'exiting'); setAriaAttribute(currentStepEl, 'aria-hidden', 'true'); }
        if (targetStepEl) { removeClass(targetStepEl, 'exiting'); addClass(targetStepEl, 'active'); setAriaAttribute(targetStepEl, 'aria-hidden', 'false'); }
        updateStepIndicatorsScoped(targetIndex); updateNavigationButtonsScoped(targetIndex); 
        setTimeout(() => {
            if (currentStepEl) { removeClass(currentStepEl, 'active'); removeClass(currentStepEl, 'exiting'); }
            currentStepIndex = targetIndex; isTransitioning = false;
            updateNavigationButtonsScoped(currentStepIndex); 
            if (bookingCard) { const titleEl = targetStepEl?.querySelector('.step-title'); scrollIntoViewIfNeeded(titleEl || targetStepEl || bookingCard); }
        }, CSS_TRANSITION_DURATION);
    };

    const clearBookingFormFieldErrorScoped = (field) => {
        if (!field) return;
        let name;
        if (field.type === 'checkbox' && field.name === 'wedding_parts') {
            name = 'wedding_parts';
        } else {
            name = field.name || field.id;
        }
        const errorElement = bookingForm.querySelector(`.error-message[data-for="${name}"]`);
        removeClass(field, 'input-error');
        setAriaAttribute(field, 'aria-invalid', 'false');
        if (errorElement) {
            hideElement(errorElement);
            errorElement.textContent = '';
            const desc = field.getAttribute('aria-describedby');
            if (desc && desc.includes(errorElement.id)) {
                const newDesc = desc.replace(errorElement.id, '').trim();
                if (newDesc) setAriaAttribute(field, 'aria-describedby', newDesc);
                else field.removeAttribute('aria-describedby');
            }
        }
    };

    const validateFieldScoped = (field) => {
        if (!field || (field.type === 'hidden')) return true;
        if (field.offsetParent === null && !field.classList.contains('form-checkbox') && field.type !== 'radio') return true;
        
        let isValid = true;
        const value = field.value.trim();
        const type = field.type;
        const isRequired = field.required;

        if (type === 'checkbox' && field.name === 'wedding_parts') {
            const group = bookingForm.querySelectorAll('input[name="wedding_parts"]:checked');
            if (group.length === 0) {
                isValid = false;
            } else {
                // Clear error if valid
                const errorElement = bookingForm.querySelector('.error-message[data-for="wedding_parts"]');
                if (errorElement) {
                    hideElement(errorElement);
                    errorElement.textContent = '';
                }
                return true;
            }
        } else if (isRequired) {
            if (type === 'checkbox' && !field.checked) isValid = false;
            else if (type !== 'checkbox' && value === '') isValid = false;
        }

        if (isValid && value !== '') {
            switch (type) {
                case 'email': if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) isValid = false; break;
                case 'date': try { const d = new Date(value + 'T00:00:00Z'); const t = new Date(); t.setUTCHours(0,0,0,0); if (isNaN(d.getTime()) || d < t) isValid = false; } catch { isValid = false; } break;
                case 'tel': if (value && !PHONE_PATTERN.test(value)) isValid = false; break;
                case 'number': const min = field.getAttribute('min'); const max = field.getAttribute('max'); if (min !== null && min !== "" && parseFloat(value) < parseFloat(min)) isValid = false; if (max !== null && max !== "" && parseFloat(value) > parseFloat(max)) isValid = false; break;
            }
        }
        return isValid;
    };

    const showFieldErrorScoped = (field) => {
        if (!field) return;
        let name;
        let defaultErrorMessage;

        if (field.type === 'checkbox' && field.name === 'wedding_parts') {
            name = 'wedding_parts';
            defaultErrorMessage = 'Please select at least one part of your wedding day.';
        } else {
            name = field.name || field.id;
            const type = field.type;
            if(type === 'email') defaultErrorMessage = "Valid Email Required";
            else if(type === 'date') defaultErrorMessage = "Future Date Required";
            else if(type === 'time') defaultErrorMessage = "Required";
            else if(type === 'tel') defaultErrorMessage = "Invalid Format (e.g., (123) 456-7890)";
            else if(type === 'number' && field.min !== "" && field.max !== "") defaultErrorMessage = `Value must be between ${field.min} and ${field.max}`;
            else if(type === 'number' && field.min !== "") defaultErrorMessage = `Min ${field.min} required`;
            else if(type === 'checkbox') defaultErrorMessage = "Agreement is required";
            else defaultErrorMessage = "Required";
        }
        
        const errorElement = bookingForm?.querySelector(`.error-message[data-for="${name}"]`);
        if (name !== 'wedding_parts') {
             addClass(field, 'input-error');
             setAriaAttribute(field, 'aria-invalid', 'true');
        }

        if (errorElement) {
            errorElement.textContent = defaultErrorMessage;
            showElement(errorElement);
            if (name !== 'wedding_parts') {
                 const desc = field.getAttribute('aria-describedby') || '';
                if (!desc.includes(errorElement.id)){field.setAttribute('aria-describedby', (desc + ' ' + errorElement.id).trim());}
            }
        }
        const label = field.closest('label');
        if (label && field.type === 'checkbox') addClass(label, 'label-error');
    };

    const validateStepScoped = (stepIndex, showUIErrors = true) => {
        let isStepValid = true;
        const stepElement = formSteps[stepIndex];
        if (!stepElement) { console.warn(`validateStepScoped: Step element for index ${stepIndex} not found.`); return false; }

        const fieldsToValidate = stepElement.querySelectorAll('input:not([type=hidden]), select, textarea');
        
        fieldsToValidate.forEach(field => {
            if (field.offsetParent === null && !field.classList.contains('form-checkbox') && field.type !== 'radio' && field.type !== 'checkbox') return;

            if (field.name === 'wedding_parts') {
                if (!validateFieldScoped(field)) {
                    isStepValid = false;
                    if (showUIErrors) showFieldErrorScoped(field);
                } else {
                    clearBookingFormFieldErrorScoped(field);
                }
            } else {
                 const isRequired = field.required;
                 const needsFormatCheck = ['email', 'tel', 'date', 'number', 'time'].includes(field.type);
                 const hasValue = field.value.trim() !== '';
                 if (isRequired || (needsFormatCheck && hasValue)) {
                     if (!validateFieldScoped(field)) {
                         isStepValid = false;
                         if (showUIErrors) { showFieldErrorScoped(field); }
                     } else {
                         clearBookingFormFieldErrorScoped(field);
                     }
                 } else if (!isRequired && !hasValue) {
                     clearBookingFormFieldErrorScoped(field);
                 }
            }
        });
        return isStepValid;
    };

    const handleFullFormValidationScoped = (lastStepToIndex) => { let isAllValid = true; for (let i = 0; i <= lastStepToIndex; i++) { if (!validateStepScoped(i, true)) { isAllValid = false; if (currentStepIndex !== i) { navigateToStepScoped(i, false); } setTimeout(() => { showFormMessageScoped("Please correct the errors highlighted above.", "error", formMessage); const firstErrorField = formSteps[i]?.querySelector('.input-error, .error-message[data-for="wedding_parts"]:not(.hidden)'); if (firstErrorField) { firstErrorField.focus({preventScroll: true}); scrollIntoViewIfNeeded(firstErrorField.closest('.input-group') || firstErrorField); } }, currentStepIndex !== i ? CSS_TRANSITION_DURATION + 50 : 0); break; } } return isAllValid; };
    
    nextButton?.addEventListener('click', () => { hideFormMessageScoped(formMessage); if (validateStepScoped(currentStepIndex, true)) { formAttemptedSubmit = true; navigateToStepScoped(currentStepIndex + 1, true); } else { showFormMessageScoped("Please correct the errors highlighted above.", "error", formMessage); const firstError = formSteps[currentStepIndex]?.querySelector('.input-error, .error-message[data-for="wedding_parts"]:not(.hidden)'); if (firstError) { (firstError.closest('.input-group') || firstError).scrollIntoView({ behavior: 'smooth', block: 'center'}); firstError.focus({preventScroll: true}); } } });
    prevButton?.addEventListener('click', () => { hideFormMessageScoped(formMessage); navigateToStepScoped(currentStepIndex - 1, false); });
    
    submitRequestButton?.addEventListener('click', async () => {
        if (currentStepIndex !== REVIEW_STEP_INDEX) return;
        formAttemptedSubmit = true;
        setButtonLoading(submitRequestButton, true, "Validating...");
        hideFormMessageScoped(formMessage);
    
        if (!handleFullFormValidationScoped(REVIEW_STEP_INDEX - 1)) {
            setButtonLoading(submitRequestButton, false);
            return;
        }
    
        // --- Start of REAL Netlify Submission ---
        setButtonLoading(submitRequestButton, true, "Submitting Request...");
        showElement(loaderOverlay);
        addClass(loaderOverlay, 'visible');
        if (loaderText) loaderText.textContent = "Sending your request...";
    
        try {
            const formData = new FormData(bookingForm);
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            });
    
            if (response.ok) {
                console.log("Form submitted successfully to Netlify.");
                window.location.href = 'booking-success.html';
            } else {
                throw new Error(`Netlify submission failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            showFormMessageScoped("There was a problem submitting your request. Please try again later.", "error");
            removeClass(loaderOverlay, 'visible');
            hideElement(loaderOverlay);
            setButtonLoading(submitRequestButton, false);
        }
        // --- End of REAL Netlify Submission ---
    });

    bookingForm.addEventListener('click', (e) => { const target = e.target.closest('.summary-edit-link'); if (target && target.dataset.targetStep && currentStepIndex === REVIEW_STEP_INDEX) { const targetStepIndex = parseInt(target.dataset.targetStep, 10) - 1; if (!isNaN(targetStepIndex) && targetStepIndex < currentStepIndex) { hideFormMessageScoped(formMessage); navigateToStepScoped(targetStepIndex, false); } } });
    bookingForm.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id !== 'venue_address') { const targetElement = e.target; if (targetElement.tagName === 'TEXTAREA') { return; } e.preventDefault(); if (!isTransitioning) { if (currentStepIndex < REVIEW_STEP_INDEX) { nextButton?.click(); } else if (currentStepIndex === REVIEW_STEP_INDEX) { submitRequestButton?.click(); } } } });
    const setupRealtimeValidationScoped = () => { bookingForm?.querySelectorAll('input:not([type=hidden]), select, textarea').forEach(field => { field.addEventListener('blur', () => { if (field.offsetParent === null) return; if (formAttemptedSubmit || hasClass(field, 'input-error')) { if (!validateFieldScoped(field)) { showFieldErrorScoped(field); } else { clearBookingFormFieldErrorScoped(field); } } }); const eventType = (field.tagName === 'SELECT' || ['date', 'time', 'number', 'radio', 'checkbox'].includes(field.type)) ? 'change' : 'input'; field.addEventListener(eventType, () => { if (hasClass(field, 'input-error') || (field.name === 'wedding_parts' && bookingForm.querySelector('.error-message[data-for="wedding_parts"]:not(.hidden)'))) { clearBookingFormFieldErrorScoped(field); } }); }); };

    const openModal = () => { if (modalOverlay) { hideElement(modalOverlay); removeClass(modalOverlay, 'active'); requestAnimationFrame(() => { showElement(modalOverlay); requestAnimationFrame(() => { addClass(modalOverlay, 'active'); }); }); document.body.style.overflow = 'hidden'; } };
    const closeModal = () => { if (modalOverlay) { removeClass(modalOverlay, 'active'); modalOverlay.addEventListener('transitionend', () => { hideElement(modalOverlay); document.body.style.overflow = ''; }, { once: true }); } };

    const handleScrollToTopVisibilityScoped = () => { if (!scrollToTopButton) return; if (window.scrollY > 300) { if (!hasClass(scrollToTopButton, 'visible')) { showElement(scrollToTopButton); requestAnimationFrame(() => { addClass(scrollToTopButton, 'visible'); }); } } else { if (hasClass(scrollToTopButton, 'visible')) { removeClass(scrollToTopButton, 'visible'); setTimeout(() => { if (window.scrollY <= 300 && !hasClass(scrollToTopButton, 'visible')) hideElement(scrollToTopButton); }, 300); } else if (!hasClass(scrollToTopButton, 'hidden')) { hideElement(scrollToTopButton);}} };
    const scrollToTopHandlerScoped = () => { gsap.to(window, { duration: 1.0, scrollTo: 0, ease: 'power2.inOut' }); };
    const setFooterYearScoped = () => { if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); } };
    const setMinDateScoped = () => { if (dateField) { try { const today = new Date(); const year = today.getFullYear(); const mm = String(today.getMonth() + 1).padStart(2, '0'); const dd = String(today.getDate()).padStart(2, '0'); dateField.min = `${year}-${mm}-${dd}`; } catch (e) { console.error("Error setting min date:", e); } } };
    
    // --- Package Specific Logic ---
    const setupConditionalFields = () => {
        // JOM Page: Other moment details
        const weddingMomentSelect = document.getElementById('wedding_moment');
        const otherMomentWrapper = document.getElementById('other_moment_wrapper');
        weddingMomentSelect?.addEventListener('change', (e) => {
            e.target.value === 'Other' ? showElement(otherMomentWrapper) : hideElement(otherMomentWrapper);
        });

        // Hourly Page: Additional hours context
        const additionalHoursCheckbox = document.getElementById('request_additional_hours');
        const additionalHoursWrapper = document.getElementById('additional_hours_context_wrapper');
        additionalHoursCheckbox?.addEventListener('change', (e) => {
            e.target.checked ? showElement(additionalHoursWrapper) : hideElement(additionalHoursWrapper);
        });

        // TFE Page: Other wedding part details
        const weddingPartOtherCheckbox = document.getElementById('wedding_part_other_checkbox');
        const weddingPartOtherWrapper = document.getElementById('wedding_part_other_wrapper');
        weddingPartOtherCheckbox?.addEventListener('change', (e) => {
            e.target.checked ? showElement(weddingPartOtherWrapper) : hideElement(weddingPartOtherWrapper);
        });
        
        // TFE Page: Included addon cards
        const acceptVinylCheckbox = document.querySelector('input[name="accept_vinyl"]');
        const vinylUpgradeWrapper = document.getElementById('vinyl-upgrade-wrapper');
        if (acceptVinylCheckbox && vinylUpgradeWrapper) {
            acceptVinylCheckbox.addEventListener('change', (e) => {
                e.target.checked ? showElement(vinylUpgradeWrapper) : hideElement(vinylUpgradeWrapper);
            });
        }
    };

    const initializeBookingForm = () => {
        formSteps.forEach((step, index) => { if (index === 0) { addClass(step, 'active'); setAriaAttribute(step, 'aria-hidden', 'false'); } else { removeClass(step, 'active'); setAriaAttribute(step, 'aria-hidden', 'true'); } removeClass(step, 'exiting'); });
        updateStepIndicatorsScoped(currentStepIndex);
        updateNavigationButtonsScoped(currentStepIndex);
        setupRealtimeValidationScoped();
        setupConditionalFields();
        setFooterYearScoped();
        setMinDateScoped();
        handleScrollToTopVisibilityScoped(); 
        const debouncedScrollHandler = debounce(handleScrollToTopVisibilityScoped, 100);
        window.addEventListener('scroll', debouncedScrollHandler);
        scrollToTopButton?.addEventListener('click', scrollToTopHandlerScoped);

        if (openModalBtn) openModalBtn.addEventListener('click', openModal);
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', (event) => { if (event.target === modalOverlay) closeModal(); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modalOverlay && hasClass(modalOverlay, 'active')) closeModal(); });

        console.log("Booking form V4.6 (Real Netlify Submission) initialization complete.");
    };

    initializeBookingForm();
});