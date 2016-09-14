(function($) {
  var DATA_KEY = 'mobile-form';

  function MobileForm($element, options) {
    this.$element = $element;
    this.onSubmit = $.proxy(this.onSubmit, this);
    this.attachListeners();
  }

  MobileForm.prototype = {
    constructor: MobileForm,

    attachListeners: function() {
      this.$element.on('submit', this.onSubmit);
    },

    destroy: function() {
      this.removeListeners();
      this.$element = null;
      this.onSubmit = null;
    },

    onSubmit: function() {
      return false;
    },

    removeListeners: function() {
      this.$element.off('submit', this.onSubmit);
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

  $.fn.extend({
    mobileForm: function(options) {
      var func;

      switch(options) {
        case 'remove':
          func = teardown;
          break;
        default:
          func = setup;
          break;
      }

      this.each(function(index, element) {
        func.apply(this, [element, options]);
      });
      return this;
    }
  });
})(jQuery);
