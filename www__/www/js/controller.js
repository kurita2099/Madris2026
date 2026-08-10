var startX, startY;
var moveX, moveY;
var endX, endY;
var rotate_flag = true;
document.body.onkeydown = function( e ) {
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate'
    };
    if ( typeof keys[ e.keyCode ] != 'undefined' ) {
        keyPress( keys[ e.keyCode ] );
        //render();
    }
};
$(function(){
	
		var slide = false;
		$('#game').bind('touchstart', function() {
			event.preventDefault();                     // ページが動いたり、反応を止める（A タグなど）
			if(lose != true && pause == false && now == false){
			this.pageX = event.changedTouches[0].pageX; // X 座標の位置
			this.pageY = event.changedTouches[0].pageY; // Y 座標の位置
			startX = this.pageX;
			startY = this.pageY;
			//alert(this.pageX + "" + this.pageY);
			}
		});

		$('#game').bind('touchmove', function() {
			event.preventDefault();                     // ページが動いたり、反応を止める（A タグなど）
			if(lose != true && pause == false && now == false){
			this.pageX = event.changedTouches[0].pageX; // X 座標の位置
			this.pageY = event.changedTouches[0].pageY; // Y 座標の位置
			moveX = this.pageX;
			moveY = this.pageY;
			var X = moveX - startX;
			var Y = moveY - startY;
			if(X > 80){
				//alert('→');
				if ( valid( 1 ) ) {
	                ++currentX;
	                startX = this.pageX;
	        		startY = this.pageY;
	        		slide = true;
	        		drawMINO('right');
	            }
			}else if(X < -80){
				//alert('←');
				if ( valid( -1 ) ) {
	                --currentX;
	                startX = this.pageX;
	        		startY = this.pageY;
	        		slide = true;
	        		drawMINO('left');
	            }
			}
			if(Y > 60){
				//alert('↓');
				if ( valid( 0, 1 ) ) {
	                ++currentY;
	                startX = this.pageX;
	        		startY = this.pageY;
	                slide = true;
	                drawMINO('down');
	            }
			}/*else if(Y > 220){
				for (var i = 0; i < 16; i++){
					if ( valid( 0, 1 ) ) {
		                ++currentY;
		                startX = this.pageX;
		        		startY = this.pageY;
		                slide = true;
		                drawMINO('down');
		            }//else{
		            //	break;
		            //}
				}
				//drawMINO('down');
			}*/
			drawFall();
		    downCheck();
			}
		});

		$('#game').bind('touchend', function() {
			event.preventDefault();                     // ページが動いたり、反応を止める（A タグなど）
			if(lose != true && pause == false && now == false){
			this.pageX = event.changedTouches[0].pageX; // X 座標の位置
			this.pageY = event.changedTouches[0].pageY; // Y 座標の位置
			endX = this.pageX;
			endY = this.pageY;
			var X = Math.abs(endX - startX);
			var Y = Math.abs(endY - startY);
			if(slide == false && X <= 20 && Y <= 20 && endY > 82 && rotate_flag == true){
				rotate_flag = false;
				setTimeout(function(){
					rotate_flag = true;
				  }, 150);
				//alert('回転');
				var rotated = rotate( current );
	            if ( valid( 0, 0, rotated ) ) {
	                current = rotated;
	                shape_rotate += 90;
	                if(shape_rotate == 360){
	                	shape_rotate = 0;
	                }
	                drawMINO('rotate');
	                if(plugin||plugin2){
	            		soundplay('sounds/turn.mp3');
	            	}
	            }else if( valid( 1, 0, rotated ) ){
	            	++currentX;
	            	current = rotated;
	                //回転角度を90度加算
	                shape_rotate += 90;
	                if(shape_rotate == 360){
	                	shape_rotate = 0;
	                }
	                drawMINO('rotate');
	                drawMINO('right');
	                if(plugin||plugin2){
	            		soundplay('sounds/turn.mp3');
	            	}
	            }else if( valid( -1, 0, rotated ) ){
	            	--currentX;
	            	current = rotated;
	                //回転角度を90度加算
	                shape_rotate += 90;
	                if(shape_rotate == 360){
	                	shape_rotate = 0;
	                }
	                drawMINO('rotate');
	                drawMINO('left');
	                if(plugin||plugin2){
	            		soundplay('sounds/turn.mp3');
	            	}
	            }else if( valid( 2, 0, rotated ) ){
	            	++currentX;
	            	++currentX;
	            	current = rotated;
	                //回転角度を90度加算
	                shape_rotate += 90;
	                if(shape_rotate == 360){
	                	shape_rotate = 0;
	                }
	                drawMINO('rotate');
	                drawMINO('right');
	                drawMINO('right');
	                if(plugin||plugin2){
	            		soundplay('sounds/turn.mp3');
	            	}
	            }
			}else{
				slide = false;
			}
			drawFall();
			//render();
		    downCheck();
			}
		});

		$('#title').bind('touchstart', function() {
			event.preventDefault();
		});
		$('#title').bind('touchmove', function() {
			event.preventDefault();
		});
		$('#title').bind('touchend', function() {
			event.preventDefault();
		});
});
