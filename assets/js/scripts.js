$( document ).ready(function() {
  smoothScroll(300);

  $('.count input').on('change', function(){
    var total = 0;
    total += $('[name="cutii_mici"]').val() * 20;
    total += $('[name="cutii_mari"]').val() * 40;
    $('#emojiTotal').text(total);
  });
});

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
