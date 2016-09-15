(function($, navigator) {
  var DATA_KEY = 'mobile-form';

  function MobileForm($element, options) {
    this.$element = $element;
    this.options = options;
    this.tabableInputs = generateTabableSelector();
    this.onSubmit = $.proxy(this.onSubmit, this);
    this.onFocus = $.proxy(this.onFocus, this);
    this.focusedFields = {};
    this.attachListeners();
  }

  MobileForm.prototype = {
    constructor: MobileForm,

    attachListeners: function() {
      this.$element.on('submit', this.onSubmit);

      if (this.options.trackFocusedFields) {
        this.$element.on('focus', this.tabableInputs, this.onFocus);
      }
    },

    destroy: function() {
      this.removeListeners();
      this.$element = null;
      this.onSubmit = null;
      this.onFocus = null;
      this.focusedFields = null;
    },

    findTabableFieldAfter: function(field) {
      var $formFields = this.$element.find(this.tabableInputs);
      var fieldIndex = $formFields.index(field);
      var focusedFields = this.focusedFields;
      var availableFields = $formFields.slice(fieldIndex + 1);

      if (this.options.trackFocusedFields) {
        availableFields = availableFields.filter(function(index, field) {
          return !focusedFields[field.name];
        });
      }

      return availableFields[0];
    },

    onFocus: function(event) {
      var field = event.originalEvent.target || event.originalEvent.currentTarget;
      this.focusedFields[field.name] = true;
    },

    onSubmit: function() {
      var nextTabableField = this.findTabableFieldAfter(document.activeElement);

      if (nextTabableField) {
        nextTabableField.focus();
        return false;
      }
    },

    removeListeners: function() {
      this.$element.off('submit', this.onSubmit);
      this.$element.off('focus', this.tabableInputs, this.onFocus);
    }
  };

  function setup(element, options) {
    var $element = $(element);

    if ($element.data(DATA_KEY)) {
      return $element;
    }

    $element.data(DATA_KEY, new MobileForm($element, options));
  }

  function teardown(element, options) {
    var $element = $(element);
    var plugin = $element.data(DATA_KEY);

    if (plugin) {
      plugin.destroy();
      $element.data(DATA_KEY, null);
    }
  }

  function generateTabableSelector() {
    var tabables = [
      'checkbox',
      'color',
      'date',
      'datetime',
      'email',
      'month',
      'number',
      'password',
      'radio',
      'search',
      'submit',
      'tel',
      'text',
      'time',
      'url',
      'week'
    ].map(function(type) {
      return 'input[type=' + type + ']';
    });

    tabables.push('select', 'textarea');
    tabables = tabables.map(function(selector) {
      return selector + ':visible';
    });

    return tabables.join(',');
  }

  $.fn.extend({
    mobileForm: function(options) {
      options = options || {};
      options.trackFocusedFields = !!options.trackFocusedFields;

      var func;
      var isMobile = (/Mobi/).test(navigator.userAgent);

      switch(options) {
        case 'remove':
          func = teardown;
          break;
        default:
          func = setup;
          break;
      }

      if (!isMobile && !options.ovverideMobileCheck) {
        return this;
      }

      this.each(function(index, element) {
        func.apply(this, [element, options]);
      });
      return this;
    }
  });
})(jQuery, window.navigator);
