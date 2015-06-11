// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require foundation
//= require turbolinks
//= require jquery.purr
//= require best_in_place
//= require best_in_place.purr
//= require_tree .

// Override Best In Place default purr wrapper
BestInPlaceEditor.defaults.purrErrorContainer =  "<div class='alert'></div>";

$(function(){ 
	$(document).foundation(); 
	if ($('.purr').length !== 0) {
		setTimeout(function() { $(".purr").fadeOut(500, function() { $(this).remove() }); }, 4000);
	}
});

