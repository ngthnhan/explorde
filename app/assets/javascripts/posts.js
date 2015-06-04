$(document).on("ready, page:change", function() {
	var TWO_PI = 2 * Math.PI;
	var dataCanvas = $("#data");
	var pixel_matrices = dataCanvas.data('pixel-matrix');

	var mainCanvas = $("#mainCanvas");
	var pixel_matrix = mainCanvas.data("pixel-matrix");
	var canvas = document.getElementById("mainCanvas");
	var ctx = canvas.getContext("2d");
	var red = 0, green = 1, blue = 2;
	canvas.addEventListener("mousemove", function(e){

	    var x;
	    var y;
	    if (e.pageX != undefined && e.pageY != undefined) {
			x = e.pageX;
			y = e.pageY;
	    }
	    else {
			x = e.clientX + document.body.scrollLeft +
	            document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop +
	            document.documentElement.scrollTop;
	    }


	    x -= canvas.offsetLeft;
	    y -= canvas.offsetTop;
		animate(x,y);
    	
	});

	//first level
	function draw() {	
		//var ctx = mainCanvas[0].getContext("2d");
		var size = 512;
		var radius = size / (Math.pow(2, 1));	
		var pixel = pixel_matrix[0][0];
		ctx.beginPath();
		ctx.moveTo((1) * radius, 0 * radius);
		ctx.arc((1) * radius, (1) * radius, radius, 0, TWO_PI);
		var rgb = "rgb(" + Math.floor(pixel[red]) + "," + Math.floor(pixel[green]) + "," + Math.floor(pixel[blue]) + ")";
		ctx.fillStyle = rgb;
		ctx.fill();	

	}

	function animate(x,y){
		var matched_corner = [];
		//find a matching corner
		var index = -1;
		for (var i = corner_list.length-1; i >= 0; i--){
			if (corner_list[i][0] < x){
				if (corner_list[i][1] < y){
					matched_corner = corner_list[i];
					index = i;
					break;
				}
			}
		}
		//do nothing if the side of the square is already at minimum(depend on max_level)
		if (matched_corner[2] == minimum){
			return
		}	

		//insert three new corner and modify the original one with diameter = 1/2 original
		//this is new diameter

		var diameter = matched_corner[2]/2;

		//level row col of the clicked one
		var level = Math.log2(512/matched_corner[2]);
		var row = matched_corner[1]/matched_corner[2];
		var col = matched_corner[0]/matched_corner[2];
		var background = pixel_matrices[level][row][col];
		//level row col of the new ones
		var lrc = [[level+1,row*2+0,col*2+0],
				[level+1,row*2+0,col*2+1],
				[level+1,row*2+1,col*2+0],
				[level+1,row*2+1,col*2+1]];
		

		//modify the original 
		corner_list[i][2] = diameter;
		corner_list.splice(index+1, 0,
			[matched_corner[0]+diameter, matched_corner[1], diameter],
			[matched_corner[0], matched_corner[1]+diameter, diameter],
			[matched_corner[0]+diameter, matched_corner[1]+diameter, diameter]);

		//erase the original circle
		//old diameter: diameter*2 is used to clear rectangle on canvas
		ctx.clearRect(matched_corner[0], matched_corner[1], diameter*2, diameter*2);
		var rgb = "rgb(" + Math.floor(background[red]+25) + "," + Math.floor(background[green]+25) + "," + Math.floor(background[blue]+25) + ")";
		ctx.fillStyle = rgb;
		ctx.fillRect(matched_corner[0], matched_corner[1], diameter*2, diameter*2);
		//draw new items
		for (var i = 0; i < 4; i++){
			var level = lrc[i][0];
			var row = lrc[i][1];
			var col = lrc[i][2];
			var color = pixel_matrices[level][row][col];
			console.log(color[0] + " " + color[1] + " " + color[2]);
			var radius = diameter/2;
			var centerX = corner_list[index+i][0] + radius;
			var centerY = corner_list[index+i][1] + radius;
			ctx.beginPath();
      		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      		var rgb = "rgb(" + Math.floor(color[red]) + "," + Math.floor(color[green]) + "," + Math.floor(color[blue]) + ")";
			ctx.fillStyle = rgb;
			ctx.fill();	
      		
		}
	}

	//corner_list structure:
	//[[corner1_x,corner1_y,diameter1],[corner2_x,corner2_x,diameter2],etc]
	var corner_list = [[0,0,512]];
	
	var MAX_LEVEL = $("#resolution_level").data("resolution-level");
	for (var level = 0; level <= MAX_LEVEL; level++) {
		draw(level);
	}

	var minimum = 512/Math.pow(2,MAX_LEVEL);
});
