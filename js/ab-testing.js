(function () {
  'use strict';

  var STORAGE_KEY = 'tfww_ab';
  var AB_TESTS = {
    'hero-headline': { variants: ['a', 'b'], weight: [50, 50] },
    'cta-text': { variants: ['a', 'b'], weight: [50, 50] },
    'social-proof-position': { variants: ['a', 'b'], weight: [50, 50] },
  };

  function getAssignments() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  function saveAssignments(assignments) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch (e) {
      // localStorage unavailable
    }
  }

  function weightedRandom(weights) {
    var total = weights.reduce(function (a, b) { return a + b; }, 0);
    var rand = Math.random() * total;
    var cumulative = 0;
    for (var i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (rand < cumulative) return i;
    }
    return 0;
  }

  function assignVariants() {
    var assignments = getAssignments();
    var changed = false;

    Object.keys(AB_TESTS).forEach(function (testId) {
      if (!assignments[testId]) {
        var test = AB_TESTS[testId];
        var idx = weightedRandom(test.weight);
        assignments[testId] = test.variants[idx];
        changed = true;
      }
    });

    if (changed) saveAssignments(assignments);
    return assignments;
  }

  function applyVariants(assignments) {
    Object.keys(assignments).forEach(function (testId) {
      var activeVariant = assignments[testId];
      var elements = document.querySelectorAll('[data-ab="' + testId + '"]');

      elements.forEach(function (el) {
        var variant = el.getAttribute('data-variant');
        if (variant === activeVariant) {
          el.removeAttribute('hidden');
          el.style.display = '';
        } else {
          el.setAttribute('hidden', '');
          el.style.display = 'none';
        }
      });

      // Track impression
      if (typeof window.tfwwTrack === 'function') {
        window.tfwwTrack('ab_impression', {
          test_id: testId,
          variant: activeVariant,
        });
      }
    });
  }

  var assignments = assignVariants();

  // Apply immediately for elements already in DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyVariants(assignments);
    });
  } else {
    applyVariants(assignments);
  }

  // Expose for form submission
  window.tfwwGetAbVariants = function () {
    return getAssignments();
  };
})();
