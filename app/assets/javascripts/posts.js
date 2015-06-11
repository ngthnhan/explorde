function init_best_in_place() {
	jQuery(".best_in_place").best_in_place();

	$(".best_in_place").bind("best_in_place:activate", function() {
		// Find the OK-button and hide it
		$(this).find("input[type=submit]").hide();
		// Append instruction
		$(this).append("<div class='comment-edit-help text-right'>Press <span class='keyword'>Enter</span> to save, <span class='keyword'>ESC</span> to cancel</div>");
		$(this).find("textarea").keydown(function(e) {
			if (e.keyCode == 13 && !e.shiftKey) {
				e.preventDefault();
				$(this).submit();
			}
		});
	});
}

$(document).on("ready, page:change", function() {
	var TWO_PI = 2 * Math.PI;

	var MAX_LEVEL = $("#main-canvas").data("resolution-level") - 1;
	var MAX_RESOLUTION = Math.pow(2, MAX_LEVEL);

	var SIZE = 512;
	// Must be divisible
	var STEP = SIZE / MAX_RESOLUTION;
	var maskArray = [];
	var backgroundOpacity = 0;
	var backgroundRGB;
	var backgroundScaleFactor = 0.2 / MAX_RESOLUTION;
	initializeMaskArray();

	function initializeMaskArray() {
		for (var r=0; r < MAX_RESOLUTION; r++) {
			var row_cells = [];
			for (var c=0; c < MAX_RESOLUTION; c++) {
				row_cells.push(0); // Start at level 0
			}
			maskArray.push(row_cells.slice(0, row_cells.length));
		}
	}

	function basicCell(r, c) {
		this.row = r;
		this.col = c;
		this.getLevel = function() {
			return maskArray[this.row][this.col];
		}
	}

	function mousePos(x, y) {
		this.x = x;
		this.y = y;
		this.getCell = function() {
			// ~~(a/b) for integer division
			var row = ~~(this.x / STEP);		
			var col = ~~(this.y / STEP);

			return new basicCell(row, col);
		};
	}

	function canExplode(pos) {
		var cell = pos.getCell();
		var lvl = cell.getLevel();
		
		var cur_r = ~~(cell.col / (MAX_RESOLUTION / Math.pow(2, lvl)));
		var cur_c = ~~(cell.row / (MAX_RESOLUTION / Math.pow(2, lvl)));

		// pos is in pixel_matrices[lvl][cur_r][cur_c]
		var radius = SIZE / (Math.pow(2, lvl + 1));
		var x = (2 * cur_c + 1) * radius;
		var y = (2 * cur_r + 1) * radius;
		
		var isTouched = (x-pos.x)*(x-pos.x) + (y-pos.y)*(y-pos.y) <= radius*radius;
		return isTouched && lvl < MAX_LEVEL;	
	}

	function draw() {
		var canvas = $("#main-canvas");
		var pixelMatrices = canvas.data("pixel-matrices");
		var red = 0, green = 1, blue = 2;

		// Initial draw
		if (canvas[0] && canvas[0].getContext) {
			var ctx = canvas[0].getContext("2d");
			var rad = SIZE / 2;
			ctx.beginPath();
			ctx.moveTo(rad, 0);
			ctx.arc(rad, rad, rad, 0, TWO_PI);
			var pixel = pixelMatrices[0][0][0];
			ctx.closePath();
			var rgb = Math.floor(pixel[red]) + "," + Math.floor(pixel[green]) + "," + Math.floor(pixel[blue]);
			ctx.fillStyle = "rgb(" + rgb + ")";
			ctx.fill();
			
			backgroundRGB = rgb;
			// Set up background for canvas
			$("#main-canvas").css("background-color", "rgba(" + rgb + "," + backgroundOpacity + ")");
		} else {
			return;
		}

		// Add event listener
		canvas[0].addEventListener('mousemove', function(e) {
			var rect = canvas[0].getBoundingClientRect();
			var x = Math.max(e.clientX - rect.left, 0);
			var y = Math.max(e.clientY - rect.top, 0);
			var pos = new mousePos(x, y);
			if (canExplode(pos)) {
				explode(pos.getCell());
				backgroundOpacity += backgroundScaleFactor;
				$("#main-canvas").css("background-color", "rgba(" + backgroundRGB + "," + backgroundOpacity + ")");
			}
		});

		function explode(cell) {
			var lvl = cell.getLevel();

			// Update maskArray
			var factor = MAX_RESOLUTION / Math.pow(2, lvl);
			var starting_row = ~~(cell.row / factor);
			var starting_col = ~~(cell.col / factor);
			for (var r = starting_row * factor; r < (starting_row + 1) * factor; r++) {
				for (var c = starting_col * factor; c < (starting_col + 1) * factor; c++) {
					maskArray[r][c] += 1;
				}
			}

			// Update graphic
			// Remove old bubble
			// Adding new bubble
			var size_factor = SIZE / Math.pow(2, lvl);
			var starting_x = starting_row * size_factor;
			var starting_y = starting_col * size_factor;
			ctx.clearRect(starting_x, starting_y, size_factor, size_factor);
			
			var row, col;
			var radius = size_factor / 4;
			for (var i = 0; i < 2; i++) {
				col = 2 * starting_row + i;
				for (var j = 0; j < 2; j++) {
					row = 2 * starting_col + j; 
					var pixel = pixelMatrices[lvl+1][row][col];
					ctx.beginPath();
					ctx.moveTo((2 * col + 1) * radius, row * radius);
					ctx.arc((2 * col + 1) * radius, (2 * row + 1) * radius, radius, 0, TWO_PI);
					var rgb = "rgb(" + Math.floor(pixel[red]) + "," + Math.floor(pixel[green]) + "," + Math.floor(pixel[blue]) + ")";
					ctx.closePath();
					ctx.fillStyle = rgb;
					ctx.fill();
				}
			}
		}
	}

	draw();
	init_best_in_place();
});
