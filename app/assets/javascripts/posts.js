$(document).on("ready, page:change", function() {
	var TWO_PI = 2 * Math.PI;
	function draw(level) {
		var canvas = $("#level" + level);
		var level_matrix = canvas.data("pixel-matrix");
		var ctx = canvas[0].getContext("2d");
		var size = 512;
		var radius = size / (Math.pow(2, level + 1));
		var red = 0, green = 1, blue = 2;
		for (var row = 0; row < Math.pow(2, level); row++) {
			for (var col = 0; col < Math.pow(2, level); col++) {
				var pixel = level_matrix[row][col];
				console.log(row + " x " + col);
				ctx.beginPath();
				ctx.moveTo((2 * col + 1) * radius, row * radius);
				ctx.arc((2 * col + 1) * radius, (2 * row + 1) * radius, radius, 0, TWO_PI);
				var rgb = "rgb(" + Math.floor(pixel[red]) + "," + Math.floor(pixel[green]) + "," + Math.floor(pixel[blue]) + ")";
				console.log(rgb);
				ctx.fillStyle = rgb;
				ctx.fill();
			}
		}
	}

	var MAX_LEVEL = $("#resolution_level").data("resolution-level");
	for (var level = 0; level <= MAX_LEVEL; level++) {
		draw(level);
	}
});
