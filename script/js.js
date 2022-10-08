	// SETTING ALL VARIABLES

		var isMouseDown=false;
		var canvas = document.createElement('canvas');
		var body = document.getElementsByTagName("body")[0];
		var ctx = canvas.getContext('2d');
		var linesArray = [];
		currentSize = 5;
		var currentColor = "rgb(200,20,100)";
		var currentBg = "white";

		// INITIAL LAUNCH

		createCanvas();

		// BUTTON EVENT HANDLERS

		document.getElementById('canvasUpdate').addEventListener('click', function() {
			createCanvas();
			redraw();
		});
		document.getElementById('newCanvas').addEventListener('click', function() {
			createCanvas();
			redraw();
		});
		document.getElementById('colorpicker').addEventListener('change', function() {
			currentColor = this.value;
		});
		document.getElementById('bgcolorpicker').addEventListener('change', function() {
			ctx.fillStyle = this.value;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			redraw();
			currentBg = ctx.fillStyle;
		});
		document.getElementById('controlSize').addEventListener('change', function() {
			currentSize = this.value;
			document.getElementById("showSize").innerHTML = this.value;
		});
		document.getElementById('saveToImage').addEventListener('click', function() {
			downloadCanvas(this, 'canvas', 'masterpiece.png');
		}, false);
		document.getElementById('eraser').addEventListener('click', eraser);
        document.getElementById('delete').addEventListener('click', function() {
			createCanvas();
		});
		document.getElementById('filter-blur').addEventListener('click', function() {
			filterBlur();
		});
		document.getElementById('filter-brightness').addEventListener('click', function() {
			filterBrightness();
		});
		document.getElementById('filter-sepia').addEventListener('click', function() {
			filterSepia();
		});
		document.getElementById('filter-gray').addEventListener('click', function() {
			filterGray();
		});
		document.getElementById('filter-negative').addEventListener('click', function() {
			filterNegative();
		});
		document.getElementById('filter-contrast').addEventListener('click', function() {
			filterContrast();
		});
		document.getElementById('filter-null').addEventListener('click', function() {
			filterNone();
		});


		
		// REDRAW 

		function redraw() {
				for (var i = 1; i < linesArray.length; i++) {
					ctx.beginPath();
					ctx.moveTo(linesArray[i-1].x, linesArray[i-1].y);
					ctx.lineWidth  = linesArray[i].size;
					ctx.lineCap = "round";
					ctx.strokeStyle = linesArray[i].color;
					ctx.lineTo(linesArray[i].x, linesArray[i].y);
					ctx.stroke();
				}
		}

		// DRAWING EVENT HANDLERS

		canvas.addEventListener('mousedown', function() {mousedown(canvas, event);});
		canvas.addEventListener('mousemove',function() {mousemove(canvas, event);});
		canvas.addEventListener('mouseup',mouseup);

		// CREATE CANVAS

		function createCanvas() {
			canvas.id = "canvas";
			canvas.width = parseInt(document.getElementById("sizeX").value);
			canvas.height = parseInt(document.getElementById("sizeY").value);
			canvas.style.zIndex = 8;
			canvas.style.position = "absolute";
			canvas.style.border = "1px solid";
			canvas.style.margin = "50px";
			ctx.fillStyle = currentBg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			body.appendChild(canvas);
		}

		// DOWNLOAD CANVAS

		function downloadCanvas(link, canvas, filename) {
			link.href = document.getElementById(canvas).toDataURL();
			link.download = filename;
		}

		// ERASER HANDLING

		function eraser() {
			currentSize = 50;
			currentColor = ctx.fillStyle
		}

		// GET MOUSE POSITION

		function getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}

		// ON MOUSE DOWN

		function mousedown(canvas, evt) {
			var mousePos = getMousePos(canvas, evt);
			isMouseDown=true
			var currentPosition = getMousePos(canvas, evt);
			ctx.moveTo(currentPosition.x, currentPosition.y)
			ctx.beginPath();
			ctx.lineWidth  = currentSize;
			ctx.lineCap = "round";
			ctx.strokeStyle = currentColor;

		}

		// ON MOUSE MOVE

		function mousemove(canvas, evt) {

			if(isMouseDown){
				var currentPosition = getMousePos(canvas, evt);
				ctx.lineTo(currentPosition.x, currentPosition.y)
				ctx.stroke();
				store(currentPosition.x, currentPosition.y, currentSize, currentColor);
			}
		}

		// STORE DATA

		function store(x, y, s, c) {
			var line = {
				"x": x,
				"y": y,
				"size": s,
				"color": c
			}
			linesArray.push(line);
		}

		// ON MOUSE UP

		function mouseup() {
			isMouseDown=false
			store()
		}


		// UPDATE FILE

        var fileUpload = document.getElementById('file-input');
        
        function readImage() {
            if ( this.files && this.files[0] ) {
                var FR= new FileReader();
                FR.onload = function(e) {
                   var img = new Image();
                   img.src = e.target.result;
                   img.onload = function() {
                     ctx.drawImage(img, 0, 0, 512, 512);
                   };
                };       
                FR.readAsDataURL( this.files[0] );
            }
        }
        
        fileUpload.onchange = readImage;

		// filters

		
		function filterBlur(){
			canvas.style.filter = "blur(2px)";
		};
		function filterBrightness(){
			canvas.style.filter = "brightness(2)";
		};
		function filterSepia(){
			canvas.style.filter =  "sepia(100%)";
		};
		function filterGray(){
			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var data = imageData.data;
				for (var i = 0; i < data.length; i += 4) {
				  var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
				  data[i]     = avg; // red
				  data[i + 1] = avg; // green
				  data[i + 2] = avg; // blue
				}
				ctx.putImageData(imageData, 0, 0);
		};

		function filterNegative(){
			canvas.style.filter = "invert(100%)";
		};
		function filterContrast(){
			canvas.style.filter = "contrast(200%)";
		};
		function filterNone(){
			canvas.style.filter = "none";
		};