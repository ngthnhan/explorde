$(document).on("ready, page:change", function() {
	var TWO_PI = 2 * Math.PI;

	var MAX_LEVEL = $("#resolution_level").data("resolution-level") - 1;
	var MAX_RESOLUTION = Math.pow(2, MAX_LEVEL);

	var SIZE = 512;
	// Must be divisible
	var STEP = SIZE / MAX_RESOLUTION;
	var maskArrays = new Array(MAX_LEVEL);
	initializeMaskArrays();

	function initializeMaskArrays() {
		for (var lvl=0; lvl <= MAX_LEVEL; lvl++) {
			var level = [];
			for (var r=0; r < MAX_RESOLUTION; r++) {
				var row_cells = [];
				for (var c=0; c < MAX_RESOLUTION; c++) {
					row_cells.push(lvl); // Start at level 0
				}
				level.push(row_cells.slice(0, row_cells.length));
			}
			maskArrays[lvl] = level.slice(0, level.length);
		}
		console.log(maskArrays);
	}

	function basicCell(level, r, c) {
		this.row = r;
		this.col = c;
		this.getLevel = function() {
			// console.log(level + ": " + this.row + " x " + this.col);
			return maskArrays[level][this.row][this.col];
		}
	}

	function mousePos(level, x, y) {
		this.x = x;
		this.y = y;
		this.getCell = function() {
			// ~~(a/b) for integer division
			var row = Math.floor(this.x / STEP);		
			var col = Math.floor(this.y / STEP);

			return new basicCell(level, row, col);
		};
	}

	function isInContact(level, pos) {
		var cell = pos.getCell();
		var lvl = cell.getLevel();
		
		var cur_r = cell.row / (MAX_RESOLUTION / Math.pow(2, lvl));
		var cur_c = cell.col / (MAX_RESOLUTION / Math.pow(2, lvl));

		// pos is in pixel_matrices[lvl][cur_r][cur_c]
		var radius = SIZE / (Math.pow(2, lvl + 1));
		var x = (2 * cur_c + 1) * radius;
		var y = (2 * cur_r + 1) * radius;

		var isTouched = (x - pos.x)*(x-pos.x) + (y - pos.y)*(y - pos.y) <= radius * radius;
		console.log("Level: " + level + "\nMouse position: " + pos.x + " x " + pos.y + "in level " + level + "\nTouch: " + isTouched);
	}

	function draw(level) {
		var canvas = $("#level" + level);
		var level_matrix = canvas.data("pixel-matrix");

		canvas[0].addEventListener('mousemove', function(e) {
			var rect = canvas[0].getBoundingClientRect();
			var x = Math.max(e.clientX - rect.left, 0);
			var y = Math.max(e.clientY - rect.top, 0);
			var pos = new mousePos(level, x, y);
			isInContact(level, pos);
		});

		if (canvas[0].getContext) {
			var ctx = canvas[0].getContext("2d");
			var size = 512;
			var radius = size / (Math.pow(2, level + 1));
			var red = 0, green = 1, blue = 2;
			for (var row = 0; row < Math.pow(2, level); row++) {
				for (var col = 0; col < Math.pow(2, level); col++) {
					var pixel = level_matrix[row][col];
					ctx.beginPath();
					ctx.moveTo((2 * col + 1) * radius, row * radius);
					ctx.arc((2 * col + 1) * radius, (2 * row + 1) * radius, radius, 0, TWO_PI);
					var rgb = "rgb(" + Math.floor(pixel[red]) + "," + Math.floor(pixel[green]) + "," + Math.floor(pixel[blue]) + ")";
					ctx.fillStyle = rgb;
					ctx.fill();
				}
			}
		} else {
			return;
		}
	}

	for (var cvsLevel = 0; cvsLevel <= MAX_LEVEL; cvsLevel++) {
		draw(cvsLevel);
	}
});
