(function () {
  'use strict';

  if (window.__tfwwModalInit) return;
  window.__tfwwModalInit = true;

  var SUBMIT_ENDPOINT = 'https://lead-intake.dylan-2f6.workers.dev/lead-intake';
  var CALENDLY_PAGE = '/book.html';
  var currentStep = 0;
  var totalSteps = 4;
  var formData = {};
  var modal = null;

  var COUNTRIES = [
    { code: 'US', dial: '+1', name: 'United States' },
    { code: 'CA', dial: '+1', name: 'Canada' },
    { code: 'GB', dial: '+44', name: 'United Kingdom' },
    { code: 'AU', dial: '+61', name: 'Australia' },
    { code: 'DE', dial: '+49', name: 'Germany' },
    { code: 'FR', dial: '+33', name: 'France' },
    { code: 'IN', dial: '+91', name: 'India' },
    { code: 'BR', dial: '+55', name: 'Brazil' },
    { code: 'MX', dial: '+52', name: 'Mexico' },
    { code: 'JP', dial: '+81', name: 'Japan' },
    { code: 'KR', dial: '+82', name: 'South Korea' },
    { code: 'IT', dial: '+39', name: 'Italy' },
    { code: 'ES', dial: '+34', name: 'Spain' },
    { code: 'NL', dial: '+31', name: 'Netherlands' },
    { code: 'SE', dial: '+46', name: 'Sweden' },
    { code: 'NO', dial: '+47', name: 'Norway' },
    { code: 'DK', dial: '+45', name: 'Denmark' },
    { code: 'FI', dial: '+358', name: 'Finland' },
    { code: 'NZ', dial: '+64', name: 'New Zealand' },
    { code: 'SG', dial: '+65', name: 'Singapore' },
    { code: 'IE', dial: '+353', name: 'Ireland' },
    { code: 'CH', dial: '+41', name: 'Switzerland' },
    { code: 'AT', dial: '+43', name: 'Austria' },
    { code: 'BE', dial: '+32', name: 'Belgium' },
    { code: 'PT', dial: '+351', name: 'Portugal' },
    { code: 'ZA', dial: '+27', name: 'South Africa' },
    { code: 'PH', dial: '+63', name: 'Philippines' },
    { code: 'AE', dial: '+971', name: 'United Arab Emirates' },
    { code: 'IL', dial: '+972', name: 'Israel' },
    { code: 'PL', dial: '+48', name: 'Poland' },
  ];

  function createModal() {
    var overlay = document.createElement('div');
    overlay.id = 'tfww-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Apply for your free website');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm hidden';
    overlay.innerHTML = buildModalHTML();
    document.body.appendChild(overlay);
    modal = overlay;

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    setupStepListeners();
  }

  function buildModalHTML() {
    return '<div class="bg-brand-surface border border-slate-700/50 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl">' +
      '<button id="modal-close" type="button" aria-label="Close" class="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">' +
        '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>' +
      '</button>' +
      '<div class="mb-6">' +
        '<div class="flex gap-1 mb-2" id="progress-bar"></div>' +
        '<p class="text-sm text-slate-400" id="step-counter">Step 1 of ' + totalSteps + '</p>' +
      '</div>' +
      '<div id="form-steps">' +
        buildStep1() +
        buildStep2() +
        buildStep3() +
        buildStep4() +
      '</div>' +
      '<div id="form-error" class="mt-4 text-red-400 text-sm hidden"></div>' +
      '<div id="form-submitting" class="mt-6 text-center hidden">' +
        '<div class="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>' +
        '<p class="mt-2 text-slate-400">Submitting your application...</p>' +
      '</div>' +
    '</div>';
  }

  function buildStep1() {
    return '<div class="form-step" data-step="0">' +
      '<h2 class="text-2xl font-heading font-bold mb-2">Tell us about your project</h2>' +
      '<p class="text-slate-400 mb-6">What kind of website do you need? (optional)</p>' +
      '<textarea id="step-description" rows="4" placeholder="e.g. A website for my bakery with online ordering..." ' +
        'class="w-full bg-brand-bg border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"></textarea>' +
      '<button type="button" class="btn-primary w-full mt-6 step-next">Continue</button>' +
    '</div>';
  }

  function buildStep2() {
    return '<div class="form-step hidden" data-step="1">' +
      '<h2 class="text-2xl font-heading font-bold mb-2">What\'s your first name?</h2>' +
      '<p class="text-slate-400 mb-6">So we know what to call you</p>' +
      '<input id="step-name" type="text" required placeholder="Your first name" autocomplete="given-name" ' +
        'class="w-full bg-brand-bg border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">' +
      '<button type="button" class="btn-primary w-full mt-6 step-next">Continue</button>' +
    '</div>';
  }

  function buildStep3() {
    return '<div class="form-step hidden" data-step="2">' +
      '<h2 class="text-2xl font-heading font-bold mb-2">What\'s your email?</h2>' +
      '<p class="text-slate-400 mb-6">We\'ll send your website details here</p>' +
      '<input id="step-email" type="email" required placeholder="you@example.com" autocomplete="email" ' +
        'class="w-full bg-brand-bg border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">' +
      '<button type="button" class="btn-primary w-full mt-6 step-next">Continue</button>' +
    '</div>';
  }

  function buildStep4() {
    return '<div class="form-step hidden" data-step="3">' +
      '<h2 class="text-2xl font-heading font-bold mb-2">Phone number (optional)</h2>' +
      '<p class="text-slate-400 mb-6">In case we need to reach you quickly</p>' +
      '<div class="flex gap-3">' +
        '<select id="step-country" class="bg-brand-bg border border-slate-700 rounded-xl px-3 py-3 text-white focus:border-purple-500 focus:outline-none w-28 cursor-pointer">' +
          buildCountryOptions() +
        '</select>' +
        '<input id="step-phone" type="tel" placeholder="(555) 123-4567" autocomplete="tel" ' +
          'class="flex-1 bg-brand-bg border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">' +
      '</div>' +
      '<label class="flex items-start gap-3 mt-4 cursor-pointer">' +
        '<input type="checkbox" id="step-consent" checked class="mt-1 w-4 h-4 accent-purple-500 cursor-pointer">' +
        '<span class="text-sm text-slate-400">I agree to receive communications about my website project</span>' +
      '</label>' +
      '<button type="button" class="btn-primary w-full mt-6" id="submit-form">Submit Application</button>' +
    '</div>';
  }

  function buildCountryOptions() {
    var html = '';
    COUNTRIES.forEach(function (c) {
      var selected = c.code === 'US' ? ' selected' : '';
      html += '<option value="' + c.dial + '"' + selected + '>' + c.code + ' ' + c.dial + '</option>';
    });
    return html;
  }

  function setupStepListeners() {
    modal.querySelector('#modal-close').addEventListener('click', closeModal);

    modal.querySelectorAll('.step-next').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (validateStep(currentStep)) {
          saveStepData(currentStep);
          goToStep(currentStep + 1);
        }
      });
    });

    modal.querySelector('#submit-form').addEventListener('click', function () {
      saveStepData(currentStep);
      submitForm();
    });

    // Enter key advances steps
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        var activeStep = modal.querySelector('.form-step:not(.hidden)');
        var nextBtn = activeStep?.querySelector('.step-next, #submit-form');
        nextBtn?.click();
      }
    });

    updateProgressBar();
  }

  function validateStep(step) {
    var errorEl = modal.querySelector('#form-error');
    errorEl.classList.add('hidden');

    if (step === 1) {
      var name = modal.querySelector('#step-name').value.trim();
      if (!name) {
        showError('Please enter your first name');
        return false;
      }
    }

    if (step === 2) {
      var email = modal.querySelector('#step-email').value.trim();
      var emailInput = modal.querySelector('#step-email');
      if (!email || !emailInput.validity.valid) {
        showError('Please enter a valid email address');
        return false;
      }
    }

    return true;
  }

  function saveStepData(step) {
    switch (step) {
      case 0:
        formData.description = (modal.querySelector('#step-description').value || '').trim();
        break;
      case 1:
        formData.firstName = modal.querySelector('#step-name').value.trim();
        break;
      case 2:
        formData.email = modal.querySelector('#step-email').value.trim();
        break;
      case 3:
        formData.countryCode = modal.querySelector('#step-country').value;
        formData.phone = modal.querySelector('#step-phone').value.trim();
        formData.consent = modal.querySelector('#step-consent').checked;
        break;
    }
  }

  function goToStep(step) {
    if (step >= totalSteps) return;
    currentStep = step;

    modal.querySelectorAll('.form-step').forEach(function (el) {
      el.classList.add('hidden');
    });

    var target = modal.querySelector('[data-step="' + step + '"]');
    target.classList.remove('hidden');
    var input = target.querySelector('input, textarea');
    if (input) input.focus();

    updateProgressBar();
  }

  function updateProgressBar() {
    var bar = modal.querySelector('#progress-bar');
    var counter = modal.querySelector('#step-counter');
    if (!bar) return;

    var html = '';
    for (var i = 0; i < totalSteps; i++) {
      var cls = i <= currentStep ? 'bg-purple-500' : 'bg-slate-700';
      html += '<div class="flex-1 h-1 rounded-full ' + cls + ' transition-colors duration-300"></div>';
    }
    bar.innerHTML = html;
    counter.textContent = 'Step ' + (currentStep + 1) + ' of ' + totalSteps;
  }

  function showError(msg) {
    var errorEl = modal.querySelector('#form-error');
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }

  function submitForm() {
    var submitBtn = modal.querySelector('#submit-form');
    var submitting = modal.querySelector('#form-submitting');
    var lastStep = modal.querySelector('[data-step="3"]');

    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-50');
    lastStep.classList.add('hidden');
    submitting.classList.remove('hidden');

    var abVariants = typeof window.tfwwGetAbVariants === 'function' ? window.tfwwGetAbVariants() : {};

    var payload = new FormData();
    payload.append('firstName', formData.firstName || '');
    payload.append('email', formData.email || '');
    payload.append('phone', (formData.countryCode || '') + ' ' + (formData.phone || ''));
    payload.append('description', formData.description || '');
    payload.append('consent', formData.consent ? 'yes' : 'no');
    payload.append('source', window.location.pathname);
    payload.append('ab_variants', JSON.stringify(abVariants));
    payload.append('ua', navigator.userAgent);

    // Tracking cookies
    var cookies = document.cookie.split(';').reduce(function (acc, c) {
      var parts = c.trim().split('=');
      acc[parts[0]] = parts[1] || '';
      return acc;
    }, {});
    if (cookies._fbp) payload.append('fbp', cookies._fbp);
    if (cookies._fbc) payload.append('fbc', cookies._fbc);

    fetch(SUBMIT_ENDPOINT, { method: 'POST', body: payload })
      .then(function (res) {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      })
      .then(function () {
        // Track conversion
        if (typeof window.tfwwTrack === 'function') {
          window.tfwwTrack('lead_submitted', { name: formData.firstName });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'Lead', { content_name: 'website_application' });
        }

        // Store data for booking page (not in URL params)
        try {
          sessionStorage.setItem('tfww_lead', JSON.stringify({
            name: formData.firstName,
            email: formData.email,
          }));
        } catch (e) { /* ignore */ }

        window.location.href = CALENDLY_PAGE;
      })
      .catch(function (err) {
        submitting.classList.add('hidden');
        lastStep.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50');
        showError('Something went wrong. Please try again or email us at dylan@thefreewebsitewizards.com');
      });
  }

  function openModal() {
    if (!modal) createModal();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    currentStep = 0;
    goToStep(0);

    if (typeof window.tfwwTrack === 'function') {
      window.tfwwTrack('modal_opened', { page: window.location.pathname });
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Expose globally
  window.tfwwOpenModal = openModal;
  window.tfwwCloseModal = closeModal;

  // Auto-bind all apply buttons
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal="apply"]');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });
})();
