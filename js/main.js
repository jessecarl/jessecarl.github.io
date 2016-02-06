// Nav
$(document).ready(function() {
  var menuToggle = $('#js-mobile-menu').unbind();
  $('#js-navigation-menu').removeClass("show");

  menuToggle.on('click', function(e) {
    e.preventDefault();
    $('#js-navigation-menu').slideToggle(function(){
      if($('#js-navigation-menu').is(':hidden')) {
        $('#js-navigation-menu').removeAttr('style');
      }
    });
  });
});

$(document).ready(function(){
  var switchImages = function() {
    var $this = $(this),
    alternate = $this.data('src'),
    original = $this.attr('src');
    $this.data('src', original).attr('src', alternate);
  };

  $('img.project-image').filter(function() {
    return typeof $(this).data('src') !== "undefined"
  }).on({
    mouseenter: switchImages,
    mouseleave: switchImages
  });
});
