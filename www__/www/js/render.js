//背景とスコアcanvas
var canvas_bg = document.getElementById( 'canvas_bg' );
var ctx_bg = canvas_bg.getContext( '2d' );
//積まれているcanvas
var canvas_freeze = document.getElementById( 'canvas_freeze' );
var ctx_freeze = canvas_freeze.getContext( '2d' );
//落下中canvas
var canvas_mino = document.getElementById( 'canvas_mino' );
var ctx_mino = canvas_mino.getContext( '2d' );
var canvas_MINO = document.getElementById( 'canvas_MINO' );
var ctx_MINO = canvas_MINO.getContext( '2d' );
//ゲームオーバー等のメッセージcanvas
var canvas_message = document.getElementById( 'canvas_message' );
var ctx_message = canvas_message.getContext( '2d' );
//var img_bg = new Image();
var W = 640, H = 1024;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

function drawBlock( x, y) {
	//固定済みの描画
    ctx_bg.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H );
}

function render() {
	//numsCheck();
	//deleteCheck();
    //downCheck();
	//canvas全体を白紙
    ctx_bg.clearRect( 0, 0, W, H );
    //canvas全体を描画し直す
    //var delno = 0;
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
        	if(board[ y ][ x ] == 0){
        		ctx_freeze.clearRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H );
            	ctx_message.clearRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H );
            }
            if ( board[ y ][ x ] ) {
            	if(board[ y ][ x ] <= 11){
            		ctx_bg.fillStyle = 'white';
            		drawBlock( x, y);
                }else if(board[ y ][ x ] <= 22){	//横列揃いした後のマスならば緑色に変える
                	ctx_bg.fillStyle = 'ff6';
                	drawBlock( x, y);
                }else if(board[ y ][ x ] <= 33){	//横列揃いした後のマスならば黄色に変える
                	ctx_bg.fillStyle = 'yellow';
                	board[ y ][ x ] += 11;
                	drawBlock( x, y);
                }else{
                    ctx_bg.fillStyle = 'yellow';////////
                    /*
                    if(minoes[ y ][ x ] != delno){
                        delno = minoes[ y ][ x ];
                        deleteMino(delno);
                    }*/
		    	deleteMino(minoes[ y ][ x ]);
                	board[ y ][ x ] = 0;
                	minoes[ y ][ x ] = 0;
                	messages[ y ][ x ] = 0;
                	ctx_freeze.clearRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H );
                	ctx_message.clearRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H );
                }
                //drawBlock( x, y);
            }
        }
    }
    //drawFall();
    //scoreDisplay();
    //linesCheck();
    //numsCheck();
    //deleteCheck();//
    //downCheck();//
}

//落下中canvasの描画
function drawFall(){
	gameoverCheck();
	//4*4を左上から捜査し空白でないマスでidを取得し、4*4の左上を起点に落下中テトリミノを丸ごと描画、捜査ループから抜ける
	//canvas全体を白紙
    ctx_mino.clearRect( 0, 0, W, H );

    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            //if ( current[ y ][ x ] ) {
            		//ctx_bg.fillStyle = 'yellow';
            		//ctx_bg.fillStyle = 'white';//colors[ current[ y ][ x ] - 1 ];
                	//drawBlock( currentX + x, currentY + y);
            		//drawMino(currentX + x, currentY + y, current[ y ][ x ]);
            		if(current[ y ][ x ] != 0){
            			//drawMino(currentX, currentY, current[ y ][ x ], ctx_MINO);///
            			break;
            		}
            //}
        }
    }
}

//setInterval( render, 60 );

//テトリミノの描画
function drawMino( x, y, no, ctx) {
	//if(ctx == ctx_MINO){
	if(ctx != ctx_freeze){
		for ( var q = 0; q < 4; ++q ) {
	        for ( var p = 0; p < 4; ++p ) {
	        	if(current[ q ][ p ] > 0 && current[ q ][ p ] <= 11){
	        		ctx.fillStyle = 'white';
	        		ctx.fillRect( BLOCK_W * (p + x), BLOCK_H * (q + y), BLOCK_W, BLOCK_H);
	    		}
	        }
	    }
	}
	//}else{
	//テトリミノに回転毎に画像をセット
    //var img = new Image();
    switch(no){
    case 1:
    	switch(shape_rotate){
    		case 0:
//	    		img.src = './images/b_a.png';
//	    		img.onload = function() {
	        		ctx.drawImage(deferreds['./images/b_a.png'],  BLOCK_W * (x + 2), BLOCK_H * y, BLOCK_W , BLOCK_H * 4);
//	        	};
	    		break;
    		case 270:
//	    		img.src = './images/b_a_90.png';
//	    		img.onload = function() {
	        		ctx.drawImage(deferreds['./images/b_a_90.png'],  BLOCK_W * x , BLOCK_H * (y + 1), BLOCK_W * 4, BLOCK_H );
//	        	};
	        	break;
    		case 180:
//    			img.src = './images/b_a_180.png';
//        		img.onload = function() {
            		ctx.drawImage(deferreds['./images/b_a_180.png'],  BLOCK_W * (x + 2), BLOCK_H * y, BLOCK_W, BLOCK_H * 4);
//            	};
            	break;
    		case 90:
//    			img.src = './images/b_a_270.png';
//        		img.onload = function() {
            		ctx.drawImage(deferreds['./images/b_a_270.png'],  BLOCK_W * x, BLOCK_H * (y + 1), BLOCK_W * 4, BLOCK_H);
//            	};
            	break;

    	}
    	break;
    case 2:
    	switch(shape_rotate){
		case 0:
//    		img.src = './images/b_b.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_b.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 2);
//        	};
    		break;
		case 270:
//    		img.src = './images/b_b_90.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_b_90.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 2);
//        	};
        	break;
		case 180:
//			img.src = './images/b_b_180.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_b_180.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 2);
//        	};
        	break;
		case 90:
//			img.src = './images/b_b_270.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_b_270.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 2);
//        	};
        	break;
    	}
    	break;
    case 3:
    	switch(shape_rotate){
		case 0:
//    		img.src = './images/b_c1.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_c1.png'],  BLOCK_W * (x + 1), BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 3);
//        	};
    		break;
		case 270:
//    		img.src = './images/b_c1_90.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_c1_90.png'],  BLOCK_W * x, BLOCK_H * (y + 1), BLOCK_W * 3, BLOCK_H * 2);
//        	};
        	break;
		case 180:
//			img.src = './images/b_c1_180.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_c1_180.png'],  BLOCK_W * (x + 1), BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 3);
//        	};
        	break;
		case 90:
//			img.src = './images/b_c1_270.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_c1_270.png'],  BLOCK_W * x, BLOCK_H * (y + 1), BLOCK_W * 3, BLOCK_H * 2);
//        	};
        	break;
    	}
    	break;
    case 4:
    	switch(shape_rotate){
		case 0:
//    		img.src = './images/b_c2.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_c2.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 3);
//        	};
    		break;
		case 270:
//    		img.src = './images/b_c2_90.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_c2_90.png'],  BLOCK_W * x, BLOCK_H * (y + 1), BLOCK_W * 3, BLOCK_H * 2);
//        	};
        	break;
		case 180:
//			img.src = './images/b_c2_180.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_c2_180.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 3);
//        	};
        	break;
		case 90:
//			img.src = './images/b_c2_270.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_c2_270.png'],  BLOCK_W * x, BLOCK_H * (y + 1), BLOCK_W * 3, BLOCK_H * 2);
//        	};
        	break;
    	}
    	break;
    case 5:
    	switch(shape_rotate){
		case 0:
  //  		img.src = './images/b_d.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_d.png'],  BLOCK_W * (x + 1), BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 3);
//        	};
    		break;
		case 270:
//    		img.src = './images/b_d_90.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_d_90.png'],  BLOCK_W * x, BLOCK_H * (y + 1), BLOCK_W * 3, BLOCK_H * 2);
//        	};
        	break;
		case 180:
//			img.src = './images/b_d_180.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_d_180.png'],  BLOCK_W * (x + 1), BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 3);
//        	};
        	break;
		case 90:
//			img.src = './images/b_d_270.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_d_270.png'],  BLOCK_W * x, BLOCK_H * (y + 1), BLOCK_W * 3, BLOCK_H * 2);
//        	};
        	break;
    	}
    	break;
    case 6:
    	switch(shape_rotate){
		case 0:
//    		img.src = './images/b_e1.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_e1.png'],  BLOCK_W * (x + 1), BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 3);
//        	};
    		break;
		case 270:
//    		img.src = './images/b_e1_90.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_e1_90.png'],  BLOCK_W * (x + 1), BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 3);
//        	};
        	break;
		case 180:
//			img.src = './images/b_e1_180.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_e1_180.png'],  BLOCK_W * (x + 1) , BLOCK_H * y , BLOCK_W * 3, BLOCK_H * 3);
//        	};
        	break;
		case 90:
//			img.src = './images/b_e1_270.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_e1_270.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 3);
//        	};
        	break;
    	}
    	break;
    case 7:
    	switch(shape_rotate){
		case 0:
//    		img.src = './images/b_e2.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_e2.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 3);
//        	};
    		break;
		case 270:
//    		img.src = './images/b_e2_90.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_e2_90.png'],  BLOCK_W * (x + 1), BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 3);
//        	};
        	break;
		case 180:
//			img.src = './images/b_e2_180.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_e2_180.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 3);
//        	};
        	break;
		case 90:
//			img.src = './images/b_e2_270.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_e2_270.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 3);
//        	};
        	break;
    	}
    	break;
    case 8:
    	switch(shape_rotate){
		case 0:
//    		img.src = './images/b_f.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_f.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 4, BLOCK_H * 3);
//        	};
    		break;
		case 270:
//    		img.src = './images/b_f_90.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_f_90.png'],  BLOCK_W * (x + 1), BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 4);
//        	};
        	break;
		case 180:
//			img.src = './images/b_f_180.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_f_180.png'],  BLOCK_W * x, BLOCK_H * (y + 1), BLOCK_W * 4, BLOCK_H * 3);
//        	};
        	break;
		case 90:
//			img.src = './images/b_f_270.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_f_270.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 4);
//        	};
        	break;
    	}
    	break;
    case 9:
    	switch(shape_rotate){
		case 0:
//    		img.src = './images/b_g.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_g.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 4, BLOCK_H * 4);
//        	};
    		break;
		case 270:
//    		img.src = './images/b_g_90.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_g_90.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 4, BLOCK_H * 4);
//        	};
        	break;
		case 180:
//			img.src = './images/b_g_180.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_g_180.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 4, BLOCK_H * 4);
//        	};
        	break;
		case 90:
//			img.src = './images/b_g_270.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_g_270.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 4, BLOCK_H * 4);
//        	};
        	break;
    	}
    	break;
    case 10:
    	switch(shape_rotate){
		case 0:
//    		img.src = './images/b_h1.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_h1.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 3);
//        	};
    		break;
		case 270:
//    		img.src = './images/b_h1_90.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_h1_90.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 2);
//        	};
        	break;
		case 180:
//			img.src = './images/b_h1_180.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_h1_180.png'],  BLOCK_W * (x + 1), BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 3);
//        	};
        	break;
		case 90:
//			img.src = './images/b_h1_270.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_h1_270.png'],  BLOCK_W * x, BLOCK_H * (y + 1), BLOCK_W * 3, BLOCK_H * 2);
//        	};
        	break;
    	}
    	break;
    case 11:
    	switch(shape_rotate){
		case 0:
//    		img.src = './images/b_h2.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_h2.png'],  BLOCK_W * (x + 1), BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 3);
//        	};
    		break;
		case 270:
//    		img.src = './images/b_h2_90.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_h2_90.png'],  BLOCK_W * x, BLOCK_H * (y + 1), BLOCK_W * 3, BLOCK_H * 2);
//        	};
        	break;
		case 180:
//			img.src = './images/b_h2_180.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_h2_180.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 2, BLOCK_H * 3);
//        	};
        	break;
		case 90:
//			img.src = './images/b_h2_270.png';
//    		img.onload = function() {
        		ctx.drawImage(deferreds['./images/b_h2_270.png'],  BLOCK_W * x, BLOCK_H * y, BLOCK_W * 3, BLOCK_H * 2);
//        	};
        	break;
    	}
    	break;
    }
    if(ctx == ctx_freeze){
    	//テトリミノに回転毎に日当たり画像をセット
/*	
    var img2 = new Image();
    img2.src = './images/p_02.png';
    var img3 = new Image();
    img3.src = './images/p_01.png';
    */
    var img2 = './images/p_02.png';
    var img3 = './images/p_01.png';
     
    switch(no){
    case 1:
    	switch(shape_rotate){
    		case 0:
//	    		img2.onload = function() {
	        		ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 12, BLOCK_H * (y + 3), 40 , 64);
//	        	};
	        	messages[y + 3][x + 2] = 1;
	        	if(board[y + 1][x + 3] == 0 && board[y + 2][x + 3] == 0){
//	        		img3.onload = function() {
		        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 2)+ 12, BLOCK_H * (y + 1) + 32, 40 , 64);
//		        	};
		        	messages[y + 1][x + 2] = 2;
	        	}
	    		break;
    		case 270:
    			if(board[y + 2][x + 1] == 0 && board[y + 2][x + 2] == 0){
//	        		img3.onload = function() {
		        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12 + 32, BLOCK_H * (y + 1), 40 , 64);
//		        	};
		        	messages[y + 1][x + 1] = 2;
	        	}
    			break;
    		case 180:
	        	if(board[y + 1][x + 1] == 0 && board[y + 2][x + 1] == 0){
//	        		img3.onload = function() {
		        		ctx.drawImage(deferreds[img3],  BLOCK_W * ( x + 2 ) + 12, BLOCK_H * (y + 1) + 32, 40 , 64);
//		        	};
		        	messages[y + 1][x + 2] = 2;
	        	}
	    		break;
    		case 90:
//    			img2.onload = function() {
        		ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 34, BLOCK_H * (y + 1), 40 , 64);
        		ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 3) + 12, BLOCK_H * (y + 1), 40 , 64);
//        		};
        		messages[y + 1][x + 2] = 1;
        		messages[y + 1][x + 3] = 1;
    			if(board[ y ][x + 1] == 0 && board[ y ][x + 2] == 0){
//	        		img3.onload = function() {
		        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12 + 32, BLOCK_H * (y + 1), 40 , 64);
//		        	};
		        	messages[ y + 1 ][x + 1] = 2;
	        	}
    			break;
    	}
    	break;
    case 2:
    	switch(shape_rotate){
		case 0:
//			img2.onload = function() {
    		ctx.drawImage(deferreds[img2],  BLOCK_W * x + 12, BLOCK_H * (y + 1), 40 , 64);
//    		};
    		messages[y + 1][ x ] = 1;
    		if(board[y + 1][x + 2] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1) - 12, 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
    		break;
		case 270:
			if(board[y + 2][ x ] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * x + 24, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
			break;
		case 180:
			if(board[ y ][x - 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * x + 12, BLOCK_H * y + 12, 40 , 64);
//	        	};
	        	messages[ y ][ x ] = 2;
        	}
			break;
		case 90:
//			img2.onload = function() {
    			ctx.drawImage(deferreds[img2],  BLOCK_W * x + 23, BLOCK_H * (y + 1), 40 , 64);
    			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1) + 1 , BLOCK_H * (y + 1), 40 , 64);
//    		};
    		messages[y + 1][ x ] = 1;
    		messages[y + 1][x + 1] = 1;
    		if(board[y - 1][x + 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1), BLOCK_H * y, 40 , 64);
//	        	};
	        	messages[ y ][x + 1] = 2;
        	}
        	break;
    	}
    	break;
    case 3:
    	switch(shape_rotate){
		case 0:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1) + 23, BLOCK_H * (y + 2), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 1, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][x + 1] = 1;
			messages[y + 2][x + 2] = 1;
			if(board[ y ][x + 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
    		break;
		case 270:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * x + 12, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][ x ] = 1;
			if(board[y + 1][x + 2] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
        	break;
		case 180:
			if(board[y + 2][x + 2] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 2) + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 2] = 2;
        	}
			break;
		case 90:
			if(board[y + 2][ x ] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 2), 40 , 64);
//	        	};
	        	messages[y + 2][x + 1] = 2;
        	}
			break;
    	}
    	break;
    case 4:
    	switch(shape_rotate){
    	case 0:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * x + 23, BLOCK_H * (y + 2), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1) + 1, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][ x ] = 1;
			messages[y + 2][ x + 1] = 1;
			if(board[ y ][x + 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y +1 ][x + 1] = 2;
        	}
    		break;
    	case 270:
    		if(board[y + 2][x + 2] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 2), 40 , 64);
//	        	};
	        	messages[y + 2][x + 1] = 2;
        	}
    		break;
    	case 180:
    		if(board[y + 2][ x ] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * x + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][ x ] = 2;
        	}
    		break;
		case 90:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 12, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][x + 2] = 1;
			if(board[y + 1][ x ] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
        	break;
    	}
    	break;
    case 5:
    	switch(shape_rotate){
		case 0:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][x + 1] = 1;
			if(board[y + 1][x + 3] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 2) + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 2] = 2;
        	}
    		break;
		case 270:
			if(board[y + 3][x + 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 2), 40 , 64);
//	        	};
	        	messages[y + 2][x + 1] = 2;
        	}
			break;
		case 180:
			if(board[y + 1][ x ] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
			break;
		case 90:
//			img2.onload = function() {
				ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1) + 26, BLOCK_H * (y + 2), 40 , 64);
				ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 4, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][x + 1] = 1;
			messages[y + 2][x + 2] = 1;
			if(board[ y ][x + 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
        	break;
    	}
    	break;
    case 6:
    	switch(shape_rotate){
    	case 0:
    		if(board[y + 1][x + 4] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 3) + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 3] = 2;
        	}
    		break;
    	case 270:
    		if(board[y + 3][x + 2] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 2) + 12, BLOCK_H * (y + 2), 40 , 64);
//	        	};
	        	messages[y + 2][x + 2] = 2;
        	}
    		break;
		case 180:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 42, BLOCK_H * (y + 1), 40 , 64);
//			};
			messages[y + 1][x + 2] = 1;
			if(board[y + 1][ x ] == 0){
        		img3.onload = function() {
	        		ctx.drawImage(img3,  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1), 40 , 64);
	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
        	break;
		case 90:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1) + 23, BLOCK_H * (y + 2), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 1, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][x + 1] = 1;
			messages[y + 2][x + 2] = 1;
			if(board[y - 1][x + 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * y, 40 , 64);
//	        	};
	        	messages[ y ][x + 1] = 2;
        	}
        	break;
    	}
    	break;
    case 7:
    	switch(shape_rotate){
    	case 0:
    		if(board[y + 1][x - 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * x + 12, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][ x ] = 2;
        	}
    		break;
		case 270:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1) + 23, BLOCK_H * (y + 2), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 1, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][x + 1 ] = 1;
			messages[y + 2][x + 2] = 1;
			if(board[y - 1][x + 2] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 2) + 12, BLOCK_H * y, 40 , 64);
//	        	};
	        	messages[ y ][x + 2] = 2;
        	}
        	break;
		case 180:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1) - 20, BLOCK_H * (y + 1), 40 , 64);
//			};
			messages[y + 1][x + 1] = 1;
			if(board[y + 1][x + 3] == 0){
        		img3.onload = function() {
	        		ctx.drawImage(img3,  BLOCK_W * (x + 2) + 12, BLOCK_H * (y + 1), 40 , 64);
	        	};
	        	messages[y + 1][x + 2] = 2;
        	}
        	break;
		case 90:
			if(board[y + 3][x + 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 2), 40 , 64);
//	        	};
	        	messages[y + 2][x + 1] = 2;
        	}
			break;
    	}
    	break;
    case 8:
    	switch(shape_rotate){
		case 0:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * x + 30, BLOCK_H * (y + 2), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 12, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][ x ] = 1;
			messages[y + 2][x + 2] = 1;
			if(board[y + 1][x + 4] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 3) + 12, BLOCK_H * (y + 1) - 6, 40 , 64);
//	        	};
	        	messages[y + 1][x + 3] = 2;
        	}
    		break;
		case 270:
			if(board[y + 4][x + 2] == 0){
  //      		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 2) + 18, BLOCK_H * (y + 3), 40 , 64);
//	        	};
	        	messages[y + 3][x + 2] = 2;
        	}
			break;
		case 180:
			if(board[y + 2][x - 1] == 0){
  //      		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * x + 12, BLOCK_H * (y + 2) + 6, 40 , 64);
//	        	};
	        	messages[y + 2][ x ] = 2;
        	}
			break;
		case 90:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * x + 12, BLOCK_H * (y + 2), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 12, BLOCK_H * (y + 3), 40 , 64);
//			};
			messages[y + 2][ x ] = 1;
			messages[y + 3][x + 2] = 1;
			if(board[y - 1][x + 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 6, BLOCK_H * y, 40 , 64);
//	        	};
	        	messages[ y ][x + 1] = 2;
        	}
        	break;
    	}
    	break;
    case 9:
    	switch(shape_rotate){
		case 0:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * x + 36, BLOCK_H * (y + 3), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 10, BLOCK_H * (y + 3), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 3) - 12, BLOCK_H * (y + 3), 40 , 64);
//			};
			messages[y + 3][ x ] = 1;
			messages[y + 3][x + 2] = 1;
			messages[y + 3][x + 3] = 1;
			if(board[y - 1][x + 1] == 0 && board[y - 1][x + 2] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 44, BLOCK_H * y, 40 , 64);
//	        	};
	        	messages[ y ][x + 1] = 2;
        	}
    		break;
		case 270:
			if(board[y + 1][x + 4] == 0 && board[y + 2][x + 4] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 3) + 12, BLOCK_H * (y + 1) + 32, 40 , 64);
//	        	};
	        	messages[y + 1][x + 3] = 2;
        	}
			break;
		case 180:
			if(board[y + 4][x + 1] == 0 && board[y + 4][x + 2] == 0){
  //      		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 44, BLOCK_H * (y + 3), 40 , 64);
//	        	};
	        	messages[y + 3][x + 1] = 2;
        	}
			break;
		case 90:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1) - 18, BLOCK_H * (y + 3), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 3) - 22, BLOCK_H * (y + 3), 40 , 64);
//			};
			messages[y + 3][x + 1] = 1;
			messages[y + 3][x + 3] = 1;
			if(board[y + 1][x - 1] == 0 && board[y + 2][x - 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * x + 12, BLOCK_H * (y + 1) + 32, 40 , 64);
//	        	};
	        	messages[y + 1][ x ] = 2;
        	}
        	break;
    	}
    	break;
    case 10:
    	switch(shape_rotate){
		case 0:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * x + 23, BLOCK_H * (y + 2), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1) + 1, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][ x ] = 1;
			messages[y + 2][x + 1] = 1;
			if(board[y + 1][ x ] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1)+ 12, BLOCK_H * (y + 1) + 12, 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
    		break;
		case 270:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * x + 12, BLOCK_H * (y + 1), 40 , 64);
//			};
			messages[y + 1][ x ] = 1;
			if(board[ y ][x + 1] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1), BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
        	break;
		case 180:
			if(board[y + 1][x + 2] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1) - 12, 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
			break;
		case 90:
			if(board[y + 2][x + 1] == 0){
  //      		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 24, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
			break;
    	}
    	break;
    case 11:
    	switch(shape_rotate){
		case 0:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 1)+ 12, BLOCK_H * (y + 2), 40 , 64);
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2) + 12, BLOCK_H * (y + 2), 40 , 64);
//			};
			messages[y + 2][x + 1] = 1;
			messages[y + 2][x + 2] = 1;
			if(board[y + 1][x + 2] == 0){
//        		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1) + 12, 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
    		break;
		case 270:
			if(board[y + 2][x + 1] == 0){
  //      		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1), BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
			break;
		case 180:
			if(board[y + 1][ x ] == 0){
  //      		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 12, BLOCK_H * (y + 1) - 12, 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
			break;
		case 90:
//			img2.onload = function() {
			ctx.drawImage(deferreds[img2],  BLOCK_W * (x + 2)+ 12, BLOCK_H * (y + 1), 40 , 64);
//			};
			messages[y + 1][x + 2] = 1;
			if(board[ y ][x + 1] == 0){
  //      		img3.onload = function() {
	        		ctx.drawImage(deferreds[img3],  BLOCK_W * (x + 1) + 24, BLOCK_H * (y + 1), 40 , 64);
//	        	};
	        	messages[y + 1][x + 1] = 2;
        	}
        	break;
    	}
    	break;
    }
    }
//}
}
