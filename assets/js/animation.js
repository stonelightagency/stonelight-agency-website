(function() {
  var Util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Util = (function() {
    function Util() {}

    Util.prototype.extend = function(custom, defaults) {
      var key, value;
      for (key in custom) {
        value = custom[key];
        if (value != null) {
          defaults[key] = value;
        }
      }
      return defaults;
    };

    Util.prototype.isMobile = function(agent) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
    };

    return Util;

  })();

  this.WOW = (function() {
    WOW.prototype.defaults = {
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0, // Default offset is 0, we will override this below
      mobile: true,
      live: true // Keep live checking elements
    };

    function WOW(options) {
      if (options == null) {
        options = {};
      }
      this.scrollCallback = __bind(this.scrollCallback, this);
      this.scrollHandler = __bind(this.scrollHandler, this);
      this.start = __bind(this.start, this);
      this.scrolled = true;
      this.config = this.util().extend(options, this.defaults);
      // Ensure live option is correctly set from defaults if not provided
      if (options.live == null) {
        this.config.live = this.defaults.live;
       }
      this.animationNameCache = {}; // Use an object for cache
      this.init(); // Initialize right away
    }


    WOW.prototype.init = function() {
      var _ref;
      this.element = window.document.documentElement;
      if ((_ref = document.readyState) === "interactive" || _ref === "complete") {
         this.start();
       } else {
        // Use load event to ensure all resources are loaded
        document.addEventListener('load', this.start);
       }
       this.finished = []; // Initialize finished array
    };

    WOW.prototype.start = function() {
      var box, _i, _len, _ref;
      this.stopped = false; // Ensure animation isn't stopped
      this.boxes = [].slice.call(this.element.getElementsByClassName(this.config.boxClass)); // Convert HTMLCollection to Array
      this.all = this.boxes.slice(0); // Copy boxes array

      if (this.boxes.length) {
        if (this.disabled()) {
          this.resetStyle();
        } else {
          _ref = this.boxes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            box = _ref[_i];
             // Apply the initial style to hide elements before they animate
             this.applyStyle(box, true);
          }

          // Use requestAnimationFrame for scroll handling if available
           if (window.requestAnimationFrame) {
             window.addEventListener('scroll', this.scrollHandler, false);
             window.addEventListener('resize', this.scrollHandler, false);
           } else {
             // Fallback for older browsers
             setInterval(this.scrollCallback, 50);
           }
          this.interval = setInterval(this.scrollCallback, 50); // Keep interval for live checking
        }
      }
       if (this.config.live) {
         // Initial check after setup
         this.scrollCallback();
       }
    };


    WOW.prototype.stop = function() {
       this.stopped = true; // Set stopped flag
      window.removeEventListener('scroll', this.scrollHandler, false);
      window.removeEventListener('resize', this.scrollHandler, false);
      if (this.interval != null) {
         clearInterval(this.interval);
         this.interval = null; // Clear interval reference
      }
    };

    WOW.prototype.show = function(box) {
      this.applyStyle(box); // Apply final animation styles
       // Use dataset for animation name, fallback to class name
       var animationName = box.getAttribute('data-wow-animation') || box.className.match(/(\S*fadeIn\S*|\S*bounceIn\S*|\S*slideIn\S*)/); // Example regex, adjust as needed
       if (animationName) {
         // If animationName is an array from regex match, take the first match
         if (Array.isArray(animationName)) animationName = animationName[0];
         // Add only the animation class and the base animated class
         box.className = "" + box.className.replace(this.config.boxClass, '').trim() + " " + this.config.animateClass + " " + animationName;
       } else {
         // Fallback if no specific animation class found (might just add animated)
         box.className = "" + box.className.replace(this.config.boxClass, '').trim() + " " + this.config.animateClass;
       }

      if (this.config.callback) {
        this.config.callback(box);
      }
       this.finished.push(box); // Add to finished list
       // Remove from boxes list to prevent re-checking
       this.boxes = this.boxes.filter(function(item) { return item !== box; });

      return box; // Return the element
    };


    WOW.prototype.applyStyle = function(box, hidden) {
      var delay, duration, iteration;
      duration = box.getAttribute('data-wow-duration');
      delay = box.getAttribute('data-wow-delay');
      iteration = box.getAttribute('data-wow-iteration');
      // Pass this.config.animateClass to customStyle
      return this.customStyle(box, hidden, duration, delay, iteration);
    };


     // Reset style function for disabled state
     WOW.prototype.resetStyle = function() {
      var box, _i, _len, _ref, _results;
       _ref = this.boxes;
       _results = [];
       for (_i = 0, _len = _ref.length; _i < _len; _i++) {
         box = _ref[_i];
         _results.push(box.style.visibility = 'visible');
       }
       return _results;
     };

     WOW.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
       var style = hidden ? 'visibility: hidden; -webkit-animation-name: none; -moz-animation-name: none; animation-name: none;' : 'visibility: visible;';
      if (duration) {
        style += "-webkit-animation-duration: " + duration + "; -moz-animation-duration: " + duration + "; animation-duration: " + duration + ";";
      }
      if (delay) {
        style += "-webkit-animation-delay: " + delay + "; -moz-animation-delay: " + delay + "; animation-delay: " + delay + ";";
      }
      if (iteration) {
        style += "-webkit-animation-iteration-count: " + iteration + "; -moz-animation-iteration-count: " + iteration + "; animation-iteration-count: " + iteration + ";";
      }
       box.setAttribute('style', style); // Apply the style directly
      return style; // Return the style string if needed elsewhere
    };

    WOW.prototype.scrollHandler = function() {
       if (!this.stopped) { // Only set scrolled if not stopped
         this.scrolled = true;
         // Use requestAnimationFrame for smoother callback execution
         if (window.requestAnimationFrame) {
           window.requestAnimationFrame(this.scrollCallback);
         }
       }
    };

    WOW.prototype.scrollCallback = function() {
      var box;
       if (this.scrolled || this.config.live) { // Check live option as well
        this.scrolled = false;
         var remainingBoxes = []; // Keep track of boxes still to be animated
        for (var _i = 0, _len = this.boxes.length; _i < _len; _i++) {
          box = this.boxes[_i];
          if (!box) continue; // Skip if box is null/undefined
           if (this.isVisible(box)) {
            this.show(box); // Show the box, this also removes it from this.boxes
          } else {
             remainingBoxes.push(box); // Keep the box if it's not visible yet
           }
        }
         this.boxes = remainingBoxes; // Update the boxes array

        if (!this.boxes.length && !this.config.live) {
          // Stop only if not in live mode and no boxes left
          this.stop();
        }
      }
    };


    WOW.prototype.offsetTop = function(element) {
       // Calculate offset top relative to document, handling potential errors
       try {
         var top = element.offsetTop;
         while (element = element.offsetParent) {
           top += element.offsetTop;
         }
         return top;
       } catch (e) {
         // Fallback or error handling if offsetParent is not accessible
         return 0; // Or calculate differently
       }
    };


    WOW.prototype.isVisible = function(box) {
      var offset, top, bottom, viewTop, viewBottom;
      offset = box.getAttribute('data-wow-offset') || this.config.offset;
      viewTop = window.pageYOffset || document.documentElement.scrollTop; // More robust scroll top
       viewBottom = viewTop + (window.innerHeight || document.documentElement.clientHeight) - offset; // More robust view height
      top = this.offsetTop(box);
      bottom = top + box.offsetHeight;
      return top <= viewBottom && bottom >= viewTop;
    };

    WOW.prototype.util = function() {
      return this._util || (this._util = new Util());
    };

    WOW.prototype.disabled = function() {
      return !this.config.mobile && this.util().isMobile(navigator.userAgent);
    };

    return WOW;

  })();

}).call(this);


// Initialize WOW.js with the new offset
wow = new WOW(
  {
    animateClass: 'animated',
    offset:       10, // <<< CHANGED FROM 50 to 10
    callback:     function(box) {
      // console.log("WOW: animating <" + box.tagName.toLowerCase() + ">") // Optional callback
    }
  }
);
wow.init();