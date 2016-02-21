$(function() {
	smoothScroll(300);
	workBelt();
	workLoad();
	clientStuff();
	pulseCart();

	$("header h1").fitText(1, { minFontSize: '20px', maxFontSize: '72px' });
	$(".biglink").fitText(1.5);

	$('textarea').autosize();
});

function pulseCart() {
	setInterval(function(){
		if(Number($('.cart-quantity').text()) > 0) {
			$(".toggle").addClass("pulsing");
			setTimeout(function(){
							$(".toggle").removeClass("pulsing");
			}, 1200);
		}
	}, 30000);
}

// smoothScroll function is applied from the document ready function
function smoothScroll (duration) {
	$('a[href^="#"]').on('click', function(event) {

	    var target = $( $(this).attr('href') );

	    if( target.length ) {
	        event.preventDefault();
	        $('html, body').animate({
	            scrollTop: target.offset().top
	        }, duration);
	    }
	});
}


function workBelt() {

  $(".trigger").remove();
  $(".return").remove();

  $('.thumb-container label').click(function() {
    $('.work-belt').addClass("slided");
    $('.work-container').show();
  });

  $('.work-return').click(function() {
    $('.work-belt').removeClass("slided");
    $('.work-container').hide(800);
  });

}


function  workLoad() {

  $.ajaxSetup({ cache: true });

  $('.thumb-container label').click(function() {
    var $this = $(this),
        newTitle = $this.find('strong').text(),
        newFolder = $this.find('.thumb-unit').data('folder'),
        spinner = '<div class="loader">Loading...</div>',
        newHTML = 'work/'+ newFolder;

    $('.project-load').html(spinner).load(newHTML);
    $('.project-title').text(newTitle);
  });

}




function clientStuff() {

  $('.client-logo, .client-button').click(function() {
    var $this = $(this),
        position = $this.parent().children().index($this);

    $('.client-unit').removeClass('active-client').eq(position).addClass('active-client');
    $('.client-logo').removeClass('active-client').eq(position).addClass('active-client');
    $('.client-button').removeClass('active-client').eq(position).addClass('active-client');
  });


  $('.client-control-next, .client-control-prev').click(function() {

    var $this = $(this),
        curActiveClient = $('.clients-belt').find('.active-client'),
        position = $('.clients-belt').children().index(curActiveClient),
        clientNum = $('.client-unit').length;

      if($this.hasClass('client-control-next')) {

        if(position < clientNum -1){
          $('.active-client').removeClass('active-client').next().addClass('active-client');
        } else {
          $('.client-unit').removeClass('active-client').first().addClass('active-client');
          $('.client-logo').removeClass('active-client').first().addClass('active-client');
          $('.client-button').removeClass('active-client').first().addClass('active-client');
        }

      } else {

        if (position === 0) {
          $('.client-unit').removeClass('active-client').last().addClass('active-client');
          $('.client-logo').removeClass('active-client').last().addClass('active-client');
          $('.client-button').removeClass('active-client').last().addClass('active-client');
        } else {
          $('.active-client').removeClass('active-client').prev().addClass('active-client');
        }

      }


  });

}


(function( $ ){

  $.fn.fitText = function( kompressor, options ) {

    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);

    return this.each(function(){

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);

    });

  };

})( jQuery );


/*!
	Autosize 1.18.12
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function ($) {
	var
	defaults = {
		className: 'autosizejs',
		id: 'autosizejs',
		append: '\n',
		callback: false,
		resizeDelay: 10,
		placeholder: true
	},

	// border:0 is unnecessary, but avoids a bug in Firefox on OSX
	copy = '<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',

	// line-height is conditionally included because IE7/IE8/old Opera do not return the correct value.
	typographyStyles = [
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'letterSpacing',
		'textTransform',
		'wordSpacing',
		'textIndent',
		'whiteSpace'
	],

	// to keep track which textarea is being mirrored when adjust() is called.
	mirrored,

	// the mirror element, which is used to calculate what size the mirrored element should be.
	mirror = $(copy).data('autosize', true)[0];

	// test that line-height can be accurately copied.
	mirror.style.lineHeight = '99px';
	if ($(mirror).css('lineHeight') === '99px') {
		typographyStyles.push('lineHeight');
	}
	mirror.style.lineHeight = '';

	$.fn.autosize = function (options) {
		if (!this.length) {
			return this;
		}

		options = $.extend({}, defaults, options || {});

		if (mirror.parentNode !== document.body) {
			$(document.body).append(mirror);
		}

		return this.each(function () {
			var
			ta = this,
			$ta = $(ta),
			maxHeight,
			minHeight,
			boxOffset = 0,
			callback = $.isFunction(options.callback),
			originalStyles = {
				height: ta.style.height,
				overflow: ta.style.overflow,
				overflowY: ta.style.overflowY,
				wordWrap: ta.style.wordWrap,
				resize: ta.style.resize
			},
			timeout,
			width = $ta.width(),
			taResize = $ta.css('resize');

			if ($ta.data('autosize')) {
				// exit if autosize has already been applied, or if the textarea is the mirror element.
				return;
			}
			$ta.data('autosize', true);

			if ($ta.css('box-sizing') === 'border-box' || $ta.css('-moz-box-sizing') === 'border-box' || $ta.css('-webkit-box-sizing') === 'border-box'){
				boxOffset = $ta.outerHeight() - $ta.height();
			}

			// IE8 and lower return 'auto', which parses to NaN, if no min-height is set.
			minHeight = Math.max(parseInt($ta.css('minHeight'), 10) - boxOffset || 0, $ta.height());

			$ta.css({
				overflow: 'hidden',
				overflowY: 'hidden',
				wordWrap: 'break-word' // horizontal overflow is hidden, so break-word is necessary for handling words longer than the textarea width
			});

			if (taResize === 'vertical') {
				$ta.css('resize','none');
			} else if (taResize === 'both') {
				$ta.css('resize', 'horizontal');
			}

			// The mirror width must exactly match the textarea width, so using getBoundingClientRect because it doesn't round the sub-pixel value.
			// window.getComputedStyle, getBoundingClientRect returning a width are unsupported, but also unneeded in IE8 and lower.
			function setWidth() {
				var width;
				var style = window.getComputedStyle ? window.getComputedStyle(ta, null) : false;

				if (style) {

					width = ta.getBoundingClientRect().width;

					if (width === 0 || typeof width !== 'number') {
						width = parseInt(style.width,10);
					}

					$.each(['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'], function(i,val){
						width -= parseInt(style[val],10);
					});
				} else {
					width = $ta.width();
				}

				mirror.style.width = Math.max(width,0) + 'px';
			}

			function initMirror() {
				var styles = {};

				mirrored = ta;
				mirror.className = options.className;
				mirror.id = options.id;
				maxHeight = parseInt($ta.css('maxHeight'), 10);

				// mirror is a duplicate textarea located off-screen that
				// is automatically updated to contain the same text as the
				// original textarea.  mirror always has a height of 0.
				// This gives a cross-browser supported way getting the actual
				// height of the text, through the scrollTop property.
				$.each(typographyStyles, function(i,val){
					styles[val] = $ta.css(val);
				});

				$(mirror).css(styles).attr('wrap', $ta.attr('wrap'));

				setWidth();

				// Chrome-specific fix:
				// When the textarea y-overflow is hidden, Chrome doesn't reflow the text to account for the space
				// made available by removing the scrollbar. This workaround triggers the reflow for Chrome.
				if (window.chrome) {
					var width = ta.style.width;
					ta.style.width = '0px';
					var ignore = ta.offsetWidth;
					ta.style.width = width;
				}
			}

			// Using mainly bare JS in this function because it is going
			// to fire very often while typing, and needs to very efficient.
			function adjust() {
				var height, original;

				if (mirrored !== ta) {
					initMirror();
				} else {
					setWidth();
				}

				if (!ta.value && options.placeholder) {
					// If the textarea is empty, copy the placeholder text into
					// the mirror control and use that for sizing so that we
					// don't end up with placeholder getting trimmed.
					mirror.value = ($ta.attr("placeholder") || '') + options.append;
				} else {
					mirror.value = ta.value + options.append;
				}

				mirror.style.overflowY = ta.style.overflowY;
				original = parseInt(ta.style.height,10);

				// Setting scrollTop to zero is needed in IE8 and lower for the next step to be accurately applied
				mirror.scrollTop = 0;

				mirror.scrollTop = 9e4;

				// Using scrollTop rather than scrollHeight because scrollHeight is non-standard and includes padding.
				height = mirror.scrollTop;

				if (maxHeight && height > maxHeight) {
					ta.style.overflowY = 'scroll';
					height = maxHeight;
				} else {
					ta.style.overflowY = 'hidden';
					if (height < minHeight) {
						height = minHeight;
					}
				}

				height += boxOffset;

				if (original !== height) {
					ta.style.height = height + 'px';
					if (callback) {
						options.callback.call(ta,ta);
					}
					$ta.trigger('autosize.resized');
				}
			}

			function resize () {
				clearTimeout(timeout);
				timeout = setTimeout(function(){
					var newWidth = $ta.width();

					if (newWidth !== width) {
						width = newWidth;
						adjust();
					}
				}, parseInt(options.resizeDelay,10));
			}

			if ('onpropertychange' in ta) {
				if ('oninput' in ta) {
					// Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
					// so binding to onkeyup to catch most of those occasions.  There is no way that I
					// know of to detect something like 'cut' in IE9.
					$ta.on('input.autosize keyup.autosize', adjust);
				} else {
					// IE7 / IE8
					$ta.on('propertychange.autosize', function(){
						if(event.propertyName === 'value'){
							adjust();
						}
					});
				}
			} else {
				// Modern Browsers
				$ta.on('input.autosize', adjust);
			}

			// Set options.resizeDelay to false if using fixed-width textarea elements.
			// Uses a timeout and width check to reduce the amount of times adjust needs to be called after window resize.

			if (options.resizeDelay !== false) {
				$(window).on('resize.autosize', resize);
			}

			// Event for manual triggering if needed.
			// Should only be needed when the value of the textarea is changed through JavaScript rather than user input.
			$ta.on('autosize.resize', adjust);

			// Event for manual triggering that also forces the styles to update as well.
			// Should only be needed if one of typography styles of the textarea change, and the textarea is already the target of the adjust method.
			$ta.on('autosize.resizeIncludeStyle', function() {
				mirrored = null;
				adjust();
			});

			$ta.on('autosize.destroy', function(){
				mirrored = null;
				clearTimeout(timeout);
				$(window).off('resize', resize);
				$ta
					.off('autosize')
					.off('.autosize')
					.css(originalStyles)
					.removeData('autosize');
			});

			// Call adjust in case the textarea already contains text.
			adjust();
		});
	};
}(jQuery || $)); // jQuery or jQuery-like library, such as Zepto



$(document).ready(function() {

  // Product data to be used in shop and in cart
  var products = {
		'pisica_roz' : ['Pisică roz', "", 7, 'assets/images/pisica_roz.jpg', 8],
		'pisica_alba' : ['Pisică albă', "", 5, 'assets/images/pisica_alba.jpg', 9],
		'pisica_neagra' : ['Pisică neagră', "", 5, 'assets/images/pisica_neagra.jpg', 10],
		'bufnita_maro' : ['Bufniță maro', "",5 , 'assets/images/bufnita_maro.jpg', 11],
		'bufnita_alba' : ['Buniță albă', "", 5, 'assets/images/bufnita_alba.jpg', 12],
		'martisor_snur' : ['Marțișor șnur', "", 5, 'assets/images/martisor_snur.jpg', 13],
		'pinguin_mic' : ['Marțișor pinguin', "", 3.5, 'assets/images/pinguin_mic.jpg', 14],
		'soricel_saculet' : ['Șoricel cu buchet', "", 7, 'assets/images/soricel_saculet.jpg', 15],
		'emoji_inimioare' : ['Emoticon îndrăgostit', "",2 , 'assets/images/emoji_inimioare.jpg', 16],
		'soricel_inimioara' : ['Șoricel cu inimioară', "", 5, 'assets/images/soricel_inimioara.jpg', 17],
		'broscute' : ['Broscuță', "", 5, 'assets/images/broscute.jpg', 18],
		'ursulet' : ['Ursuleț', "", 5, 'assets/images/ursulet.jpg', 19],
		'iepure_mesaj' : ['Iepure cu mesaj', "", 8, 'assets/images/iepure_mesaj.jpg', 20],
		'pinguin_mesaj' : ['Pinguin cu mesaj', "",8 , 'assets/images/pinguin_mesaj.jpg', 21],
		'soricel_mesaj' : ['Șoricel cu mesaj', "", 8, 'assets/images/soricel_mesaj.jpg', 22],
		'panseluta_mov' : ['Broșă panseluță mov', "", 5, 'assets/images/panseluta_mov.jpg', 23],
		'brosa_panseluta' : ['Broșă panseluță', "", 5, 'assets/images/brosa_panseluta.jpg', 24],
		'brosa_orhidee' : ['Broșă orhidee', "",10 , 'assets/images/brosa_orhidee.jpg', 25],
		'cercei_pisici_1' : ['Cercei pisici Felix', "", 15, 'assets/images/cercei_pisici_1.jpg', 26],
		'bufnita_lant' : ['Colier lanț bufniță', "",12 , 'assets/images/bufnita_lant.jpg', 6],
		'bufnita_cauciuc' : ['Colier bufniță', "", 10, 'assets/images/bufnita_cauciuc.jpg', 7],
		'medalion_mac' : ['Medalion mac', "",10 , 'assets/images/medalion_mac.jpg', 3],
		'medalion_flori' : ['Medalion flori de câmp', "", 10, 'assets/images/medalion_flori.jpg', 4],
		'medalion_floare_colt' : ['Medalion floare de colț', "", 10, 'assets/images/medalion_floare_colt.jpg', 5],
		'colier_orhidee' : ['Colier piele cu orhidee', "",12 , 'assets/images/colier_orhidee.jpg', 1],
		'set_panseluta' : ['Set panseluțe', "",15 , 'assets/images/set_panseluta.jpg', 27],
		'set_mac' : ['Set maci', "", 15, 'assets/images/set_mac.jpg', 2]
  };

  // Populates shop with items based on template and data in var products

  var $shop = $('.shop');
  var $cart = $('.cart-items, .aici-produse');

  for(var item in products) {
    var itemName = products[item][0],
        itemDescription = products[item][1],
        itemPrice = products[item][2],
        itemImg = products[item][3],
        itemId = products[item][4],
        $template = $($('#productTemplate').html());

    $template.find('h1').text(itemName);
    $template.find('p').text(itemDescription);
    $template.find('.price').text(itemPrice + ' Lei');
    $template.css('background-image', 'url(' + itemImg + ')');

    $template.data('id', itemId);
    $template.data('name', itemName);
    $template.data('price', itemPrice);
    $template.data('image', itemImg);

	$template.find('.expand-link').attr('href',$template.data('image'));
	$template.find('.expand-link').attr('data-lightbox','image-'+$template.data('id'));
	$template.find('.expand-link').attr('data-title',$template.data('name'));

    $shop.append($template);
  }

  // Checks quantity of a cart item on input blur and updates total
  // If quantity is zero, item is removed

  $('body').on('blur', '.cart-items input', function() {
    var $this = $(this),
        $item = $this.parents('li');
    if (+$this.val() === 0) {
      $item.remove();
    } else {
      calculateSubtotal($item);
    }
    updateCartQuantity();
    calculateAndUpdate();
		fillForm();
  });

  // Add item from the shop to the cart
  // If item is already in the cart, +1 to quantity
  // If not, creates the cart item based on template

  $('body').on('click', '.product .add', function() {
    var items = $cart.children(),
        $item = $(this).parents('.product'),
        $template = $($('#cartItem').html()),
        $matched = null,
        quantity = 0;

    $matched = items.filter(function(index) {
      var $this = $(this);
      return $this.data('id') === $item.data('id');
    });

    if ($matched.length) {
      quantity = +$matched.find('.quantity').val() + 1;
      $matched.find('.quantity').val(quantity);
      calculateSubtotal($matched);
    } else {
      $template.find('.cart-product').css('background-image', 'url(' + $item.data('image') + ')');
      $template.find('h3').text($item.data('name'));
      $template.find('.subtotal').text($item.data('price') + ' Lei');

      $template.data('id', $item.data('id'));
      $template.data('price', $item.data('price'));
      $template.data('subtotal', $item.data('price'));

      $cart.append($template);
    }

    updateCartQuantity();
    calculateAndUpdate();
		fillForm();
  });

  $('body').on('click', '.cart-items li .fa-times', function() {
	  var $timesParent = $(this).parent();
	  var $aiciItems = $('.aici-produse li');
	  var $aiciDelete;

	  $aiciDelete = $aiciItems.filter(function(index) {
        var $this = $(this);
        return $this.data('id') === $timesParent.data('id');
      });

    if ($timesParent.find('.quantity').val() > 1) {
      $timesParent.find('.quantity').val( $timesParent.find('.quantity').val() - 1 );
	  $aiciDelete.find('.quantity').val( $aiciDelete.find('.quantity').val() - 1 );
    } else {
      $timesParent.remove();
	  $aiciDelete.remove();
    }

    updateCartQuantity();
    calculateAndUpdate();
		fillForm();
  });

	$('body').on('click', '.aici-produse li .fa-times', function() {
	  var $timesParent = $(this).parent();
	  var $aiciItems = $('.aici-produse li');
	  var $aiciDelete;

	  $aiciDelete = $aiciItems.filter(function(index) {
        var $this = $(this);
        return $this.data('id') === $timesParent.data('id');
      });

    if ($timesParent.find('.quantity').val() > 1) {
      $timesParent.find('.quantity').val( $timesParent.find('.quantity').val() - 1 );
	  $aiciDelete.find('.quantity').val( $aiciDelete.find('.quantity').val() - 1 );
    } else {
      $timesParent.remove();
	  $aiciDelete.remove();
    }

    updateCartQuantity();
    calculateAndUpdate();
		fillForm();
  });

  // Calculates subtotal for an item

  function calculateSubtotal($item) {
    var quantity = $item.find('.quantity').val(),
        price = $item.data('price'),
        subtotal = quantity * price;
    $item.find('.subtotal').text(subtotal + ' Lei');
    $item.data('subtotal', subtotal);
  }

  // Clicking on the cart link opens up the shopping cart

  var $cartlink = $('.cart-link'), $wrap = $('#wrap');

  $cartlink.on('click', function() {
    $cartlink.toggleClass('active');
    $wrap.toggleClass('active');
    return false;
	});

  // Clicking outside the cart closes the cart, unless target is the "Add to Cart" button

  // $('body').on('mousedown', function(e){
  //   if (!$(e.target).is('.add') && !$(e.target).is('.added') && !$(e.target).is('label.toggle')
	// && !$(e.target).is('#cart')) {
  //     $wrap.removeClass('active');
  //     $cartlink.removeClass('active');
  //  $('#sidebartoggler').prop( "checked", false );
  //   }
  // });

  // Calculates and updates totals, taxes, shipping

  function calculateAndUpdate() {
    var subtotal = 0,
        items = $cart.children(),
        // shipping not applied if there are no items
        shipping = 0,
        tax = 0;
    items.each(function(index, item) {
      var $item = $(item),
          price = $item.data('subtotal');
      subtotal += price;
    });
    $('.subtotalTotal span').text(formatDollar(subtotal));
    tax = 0;
    $('.taxes span').text(formatDollar(tax));
    $('.shipping span').text(formatDollar(shipping));
    $('.finalTotal span').text(formatDollar((subtotal + tax + shipping)/2));
  }

  //  Update the total quantity of items in notification, hides if zero

  function updateCartQuantity() {
    var quantities = 0,
        $cartQuantity = $('span.cart-quantity'),
        items = $cart.children();
    items.each(function(index, item) {
      var $item = $(item),
          quantity = +$item.find('.quantity').val();
      quantities += quantity;
    });
    if(quantities > 0){
      $cartQuantity.removeClass('empty');
    } else {
      $cartQuantity.addClass('empty');
    }
    $cartQuantity.text(quantities/2);
  }


  //  Formats number into dollar format

  function formatDollar(amount) {
    return parseFloat(Math.round(amount * 100) / 100) + ' Lei';
  }

  // Restrict the quantity input field to numbers only

  $('body').on('keypress', '.cart-items input', function (ev) {
      var keyCode = window.event ? ev.keyCode : ev.which;
      if (keyCode < 48 || keyCode > 57) {
        if (keyCode != 0 && keyCode != 8 && keyCode != 13 && !ev.ctrlKey) {
          ev.preventDefault();
        }
      }
    });

  // Trigger animation on Add to Cart button click

  $('.addtocart').on('click', function () {
    $(this).addClass('active');
    setTimeout(function () {
      $('.addtocart').removeClass('active');
    }, 1000);
  });

  // Trigger error animation on Checkout button

  // $('.checkout').on('click', function () {
  //   $(this).addClass('active');
  //   $('.error').css('display', 'block');
  //   setTimeout(function () {
  //     $('.checkout').removeClass('active');
  //     $('.error').css('display', 'none');
  //   }, 1000);
  // });

	function fillForm() {
		var shipString = "";
		var $aiciItems = $('.aici-produse li');
		$aiciItems.each(function( item ) {
			var $this = $(this);
		  shipString += $this.find('h3').text() + " x" + $this.find('.quantity').val() + "\n";
		});
		shipString += "Total= " + $('.total .finalTotal span').text();
		$('#shipText').val(shipString);
	}

});
