$(window).on('load', function() {
  particlesJS.load('particles-js', 'particlesjs-config.json');

  $('#content').load('content.html', function() {
		$('#loading').delay(150).fadeOut('normal');
	});
});

function changePage(page) {
	$('#content').fadeOut('normal', function() {
		$('#content').load(page, function() {
			$('#content').fadeIn('normal');
		});
	});
}
