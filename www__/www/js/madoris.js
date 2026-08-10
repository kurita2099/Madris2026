var deferreds = new Object();//画像のプリロード配列
var next_newdisplay = false;
var  ispointdsp = true;
var  iscombodsp = false;
var plugin = false;
var plugin2= true;
var CATEGORY = "com.qooga.Madris.score0";
var APPURL = "https://itunes.apple.com/jp/app/madoris/id654879871?mt=8";
var REVIEW_URL = "http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?mt=8&type=Purple+Software&id=654879871";
var soundtable = ['sounds/bgm.mp3', 'sounds/income.mp3', 'sounds/set.mp3', 'sounds/tap.mp3', 'sounds/turn.mp3'];
document.addEventListener("deviceready", onDeviceReady, false);//サウンド読み込み用
if(!plugin){
	// Howler.js のグローバルなアンロック処理
	function forceUnlock() {
  		if (Howler.ctx && Howler.ctx.state !== 'running') {
    // 空のバッファを再生して AudioContext を「起こす」
    	Howler.ctx.resume().then(() => {
      	console.log('AudioContext is now active!');
		PGLowLatencyAudio.loop("sounds/bgm.mp3");
    	});
  		}
	}

// ユーザーの最初の操作で実行
	document.addEventListener('touchstart', forceUnlock, { once: true });

	setTimeout(()=>
		onDeviceReady(),100);
}
function onDeviceReady(){
    if(plugin||plugin2){

        for(var i=0;i<soundtable.length;i++){
            if(i==0){
            PGLowLatencyAudio.preloadAudio(soundtable[i], soundtable[i], i%4 + 1);
            }else{
            PGLowLatencyAudio.preloadFX(soundtable[i], soundtable[i], i%4 + 1);
            }
        }
        //BGMループ
		//PGLowLatencyAudio.loop("sounds/bgm.mp3");
        try{
            window.plugins.gamecenter.authenticate(function(){;},function(){;});
        }catch(e){
            //alert(e.stack);
        }
	}
}

var salemillisec  = (new Date()).getTime();
function soundplay(name){
	if(plugin||plugin2){
	    var todaymillisec = (new Date()).getTime();
	    if((todaymillisec-200) > salemillisec){//0.5秒以内に音はならさない
            PGLowLatencyAudio.play(name);
            salemillisec = todaymillisec;
	    }
	}else{
		//var sound = game.assets[name].clone();
		//sound.play();
	}
}

$('.btn').bind("touchstart", function() {
	if(plugin){
		soundplay('sounds/tap.mp3');
	}
});



var gamemode;				//0 EASY 1 NORMAL 2 HARD 3BEGINNER
var COLS = 10, ROWS = 16;	//横マス、縦マス
var board = [];				//本体配列
var lose;					//ゲームオーバー
var pause = false;			//一時中断
var interval ;				//タイマー
var current, currentX, currentY;
var mino_left, mino_top;
var next_ptn;
var next_Id;
var now = false;
var point = 0;				//取得ポイント
var score = 0;				//現在のスコア
var best_score;				//現在のモードのベストスコア
var area_y = 0;						//消えるテトリミノの上端y座標
var area_bonus = 0; 			//消えるテトリミノの所属エリアボーナス倍率％
var sunny_num = 0;				//消えるテトリミノの日当たり個数
var sunny_bonus = 0;			//消えるテトリミノの日当たりボーナス倍率％
var pet_num = 0;				//消えるテトリミノのペット可個数
var pet_bonus = 0;				//消えるテトリミノのペットボーナス倍率％
var newBuilding_bonus = 0;		//消えるテトリミノの新築ボーナス倍率％
var combo = 0;					//連鎖
var messages = [];	//0空 1日当たり 2ペット可 3新築
var minoes = [];	//作成済みテトリミノ配列 ○番目か
var mino_num = 0;		//何個目のテトリミノか
var mino_images = [
                   './images/b_a.png', './images/b_b.png', './images/b_c1.png', './images/b_c2.png', './images/b_d.png', './images/b_e1.png', './images/b_e2.png', './images/b_f.png', './images/b_g.png', './images/b_h1.png', './images/b_h2.png'
                   ];
var suzi_images = [
                   './images/0.png', './images/1.png', './images/2.png', './images/3.png', './images/4.png', './images/5.png', './images/6.png', './images/7.png', './images/8.png', './images/9.png'
                   ];
var shapes = [
    [ 0, 0, 1, 0,
      0, 0, 1, 0,
      0, 0, 1, 0,
      0, 0, 1, 0 ],			/*□□■□
    						  □□■□
    						  □□■□
    						  □□■□
    						*/

    [ 1, 1, 0, 0,
      1, 1 ],				/*■■□□
							  ■■□□
							  □□□□
							  □□□□
							*/

    [ 0, 0, 1, 0,
      0, 1, 1, 0,
      0, 1, 1],				/*□□■□
							  □■■□
							  □■■□
							  □□□□
							*/

    [ 1, 0, 0, 0,
      1, 1, 0, 0,
      1, 1 ],				/*■□□□
							  ■■□□
							  ■■□□
							  □□□□
							*/

    [ 0, 1, 1, 0,
      0, 1, 1, 0,
      0, 1, 1 ],			/*■■□□
							  ■■□□
							  ■■□□
							  □□□□
							*/

    [ 0, 0, 0, 1,
      0, 1, 1, 1,
      0, 1, 1, 1 ],			/*□□□■
							  □■■■
							  □■■■
							  □□□□
							*/

    [ 1, 0, 0, 0,
      1, 1, 1, 0,
      1, 1, 1 ],			/*■□□□
							  ■■■□
							  ■■■□
							  □□□□
							*/
    [ 0, 1, 1, 0,
      1, 1, 1, 1,
      1, 1, 1, 1 ],			/*□■■□
							  ■■■■
							  ■■■■
							  □□□□
							*/

    [ 1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 1, 1 ],			/*■■■■
							  ■■■■
							  ■■■■
							  ■■■■
							*/
      [ 0, 1, 0, 0,
        0, 1, 0, 0,
        1, 1, 0, 0 ],		/*□■□□
  							  □■□□
  							  ■■□□
  							  □□□□
  							*/
        [ 0, 1, 0, 0,
          0, 1, 0, 0,
          0, 1, 1, 0 ]		/*□■□□
    						  □■□□
    						  □■■□
    						  □□□□
    						*/

];
var shape_rotate;	//落下中のテトリミノの回転角度

var next_Id;
var next_images = ['./images/sb_a.png', './images/sb_b.png', './images/sb_c1.png', './images/sb_c2.png', './images/sb_d.png', './images/sb_e1.png', './images/sb_e2.png', './images/sb_f.png', './images/sb_g.png', './images/sb_h1.png', './images/sb_h2.png'

                   ];

//ラインが揃っているか判別用の背景画像、重くなるのでおそらく使用しない
var colors = [
              './images/g_1.png', './images/g_2.png', './images/g_3.png'
          ];
var id;
//メモリーリーク対策
(function(){
current = [];	//落下中配列(4 * 4)、 ID + 1を入れておく
for ( var y = 0; y < 4; ++y ) {
    current[ y ] = [];
    for ( var x = 0; x < 4; ++x ) {
            current[ y ][ x ] = 0;
    }
}
})();

//新しく落下してくるテトリミノを生成
function newShape() {
	next_newdisplay = false;
	mino_num++;
    //setNewMino(mino_num);
	shape_rotate = 0;
	id = next_Id;
	next_rand();
    var shape = shapes[ id ];
    //次に落下してくるテトリミノを上に表示
    //next_Id = Math.floor( Math.random() * shapes.length );
    //setTimeout(function(){
    /*
    $('#next').css('display', 'none');
    $('#next').css('background-image', 'url(' + next_images[next_Id] + ')');
    setTimeout(function(){
		$('#next').css('display', 'block');
	}, 300);
	*/
    //},2000);
    //current = [];	//落下中配列(4 * 4)、 ID + 1を入れておく
    for ( var y = 0; y < 4; ++y ) {
        //current[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            var i = 4 * y + x;
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
                current[ y ][ x ] = id + 1;
            }
            else {
                current[ y ][ x ] = 0;
            }
        }
    }
    //最初の表示位置の起点(左上)
    currentX = 4;
    currentY = 0;
    ctx_MINO.setTransform(1,0,0,1,0,0);
    setTimeout(function(){
    ctx_MINO.clearRect( 0, 0, 256 , 256 );
    drawMino(0, 0, id + 1, ctx_MINO);
    },100);

    $('#canvas_MINO').animate({
    	'top': '-174px',
    	'left': '256px'
	},{
		'duration': 0,
	}
    );
    if(id == 0){
    	currentX = 2;
    	$('#canvas_MINO').animate({
        	'top': '-174px',
        	'left': '128px'
    	},{
    		'duration': 0,
    	}
        );
    }else if(id == 2 || id == 4 || id == 5 || id == 7 || id == 8 || id == 10){
    	currentX = 3;
    	$('#canvas_MINO').animate({
        	'top': '-174px',
        	'left': '192px'
    	},{
    		'duration': 0,
    	}
        );
    }
    newCheck();
    setNewMino(mino_num);//-------------------------
}

//初期化
function init() {
	//bord[]
    //minoes[]
    for ( var y = 0; y < ROWS + 1; ++y ) {
        if(!minoes[ y ])minoes[ y ] = [];//メモリーリーク対策
        if(!board[ y ])board[ y ] = [];//メモリーリーク対策
        if(!messages[ y ])messages[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            minoes[ y ][ x ] = 0;
            board[ y ][ x ] = 0;
            messages[ y ][ x ] = 0;
            if(y == ROWS){
            	minoes[ y ][ x ] = 100;
            	board[ y ][ x ] = 100;
            	messages[ y ][ x ] = 100;
            }
            if(gamemode == 2){
            	if(y > 13){
            		minoes[ y ][ x ] = 100;
            		board[ y ][ x ] = 100;
            		messages[ y ][ x ] = 100;
            	}
            }
        }
    }
    //各描画クリア
    ctx_bg.clearRect( 0, 0, W, H );
    ctx_freeze.clearRect( 0, 0, W, H );
    ctx_mino.clearRect( 0, 0, W, H );
    ctx_MINO.clearRect( 0, 0, 256, 256 );
    ctx_message.clearRect( 0, 0, W, H );

    if(gamemode == 2){
    	$('#game').css('background-image' , 'url(./images/game_bg2.png)');
    }else{
    	$('#game').css('background-image' , 'url(./images/game_bg1.png)');
    }
}

//タイマー処理
function tick() {
	//if(currentY >= 2){
	//	$('#next').css('background-image', 'url(' + next_images[next_Id] + ')');
	//};
	if(next_newdisplay == false && now == false){
		if(id == 1){
			if(currentY >= 2){
				$('#next').css('background-image', 'url(' + next_images[next_Id] + ')');
				$('#next').css('display', 'none');
				setTimeout(function(){
					$('#next').css('display', 'block');
					next_newdisplay = true;
				}, 300)
			}
		}else if(id == 0 || id == 8){
			if(currentY >= 0){
				$('#next').css('background-image', 'url(' + next_images[next_Id] + ')');
				$('#next').css('display', 'none');
				setTimeout(function(){
					$('#next').css('display', 'block');
					next_newdisplay = true;
				}, 300)
			}
		}else{
			if(currentY >= 1){
				$('#next').css('background-image', 'url(' + next_images[next_Id] + ')');
				$('#next').css('display', 'none');
				setTimeout(function(){
					$('#next').css('display', 'block');
					next_newdisplay = true;
				}, 300)
			}
		}
		}
	//１マス↓へ
	if(now == false){
    if ( valid( 0, 1 ) ) {
    	//if(now == false){
	        ++currentY;
	        drawMINO('down');
	        //drawFall();
    	//}
    }
    else {
    	//１マス↓へ行けなかったら本体配列に固定
        freeze();
        //ライン揃っているかチェック
        //linesCheck();
        //テトリミノ毎に色かわっているかチェック
        //numsCheck();
        //deleteCheck();
        //downCheck();
        //deleteCheck();
        //ゲームオーバでなかったら次のテトリミノ生成
        ctx_MINO.clearRect( 0, 0, 256 , 256 );
        newShape();
        //drawFall();
        //deleteCheck();
        //render();
    }
	}
   now = false;//-----------------------------------------------------------------
   drawFall();
   scoreDisplay();
   downCheck();
   linesCheck();
   numsCheck();
   deleteCheck();
   render();
    if (lose) {
        //newGame();
    	//drawFall();
    	//clearInterval(interval_render);-----------
        var gcount = localStorage.getItem('GAMECOUNT') || 25;
        gcount++;
        localStorage.setItem('GAMECOUNT', gcount);

        var isconfirm = localStorage.getItem('CONFIRM') || 'on';

        if(plugin && isconfirm == 'on' && (gcount % 30) == 0){
        navigator.notification.confirm(
                                       "ご意見ご感想をお願いします。",
                                       onConfirm,
                                       "レビューを書きますか？",
                                       "はい,いいえ,今後は表示させない");
        }
        if(plugin && score>0){

            try{
                window.plugins.gamecenter.reportScore(function(){;},function(){;},CATEGORY + gamemode, score);
            }catch(e){
                alert(e.stack);
            }
        }
    	if(score > best_score){
        	switch(gamemode){
        	case 0:
        		localStorage.setItem('EASY_BEST_SCORE', score);
        		break;
        	case 1:
        		localStorage.setItem('NORMAL_BEST_SCORE', score);
        		break;
        	case 2:
        		localStorage.setItem('HARD_BEST_SCORE', score);
        		break;
        	case 3:
        		localStorage.setItem('BEGINNER_BEST_SCORE', score);
        		break;
        	}
    	}
    	$('#gameover_area').css('display', 'block');
    	$('#gameover').css('display', 'block');
    	$('#twitter').css('display', 'block');

    	/*ツイッターボタンは下部に記載しました*/

    	/*アクションボタン？
    	$('#action').bind(click, function() {

    	});
    	*/
    	clearInterval(interval);
        return false;
    }
}
function onConfirm(buttonIndex) {

    if (buttonIndex==1) {
        location.href = REVIEW_URL;
    } else if (buttonIndex==2) {
        //button = "はい";
    } else {
        localStorage.setItem('CONFIRM', 'off');
    }
    //alert(button + " が押されました。");
}

function gameoverCheck(){
	for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
        	if( y <= 3 && board[ y ][ x ] != 0){
        		lose = true;
        	}
        }
	}
}

//固定
function freeze() {
	combo = 0;
	//積まれているcanvasに描画
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
        	//alert(current[ y ][ x ]);
            		if(current[ y ][ x ] != 0 && current[ y ][ x ] != undefined){
            			drawMino(currentX, currentY, current[ y ][ x ], ctx_freeze);
            			break;
            		}
            //}
        }
    }

	//本体配列に固定
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
    //minoes[] 何個目かを管理;
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
            	minoes[ y + currentY ][ x + currentX ] = mino_num;
            }
        }
    }
    if(plugin){
		soundplay('sounds/set.mp3');
	}
    render();
    now = true;
}
//回転

function rotate( current ) {
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
        	switch(id){
        	case 0:
        		switch(shape_rotate){
        		case 0:
        			if(y == 1){
            			newCurrent[ 1 ][ 0 ] = current[ 3 ][ 2 ];
            			newCurrent[ 1 ][ 1 ] = current[ 2 ][ 2 ];
            			newCurrent[ 1 ][ 2 ] = current[ 1 ][ 2 ];
            			newCurrent[ 1 ][ 3 ] = current[ 0 ][ 2 ];
            		}
        			break;
        		case 90:
        			if(y == 0){
            			newCurrent[ 0 ][ 2 ] = current[ 1 ][ 0 ];
            		}else if(y == 1){
            			newCurrent[ 1 ][ 2 ] = current[ 1 ][ 1 ];
            		}else if(y == 2){
            			newCurrent[ 2 ][ 2 ] = current[ 1 ][ 2 ];
            		}else if(y == 3){
            			newCurrent[ 3 ][ 2 ] = current[ 1 ][ 3 ];
            		}
        			break;
        		case 180:
        			if(y == 1){
            			newCurrent[ 1 ][ 0 ] = current[ 3 ][ 2 ];
            			newCurrent[ 1 ][ 1 ] = current[ 2 ][ 2 ];
            			newCurrent[ 1 ][ 2 ] = current[ 1 ][ 2 ];
            			newCurrent[ 1 ][ 3 ] = current[ 0 ][ 2 ];
            		}
        			break;
        		case 270:
        			if(y == 0){
            			newCurrent[ 0 ][ 2 ] = current[ 1 ][ 0 ];
            		}else if(y == 1){
            			newCurrent[ 1 ][ 2 ] = current[ 1 ][ 1 ];
            		}else if(y == 2){
            			newCurrent[ 2 ][ 2 ] = current[ 1 ][ 2 ];
            		}else if(y == 3){
            			newCurrent[ 3 ][ 2 ] = current[ 1 ][ 3 ];
            		}
        			break;
        		}
        		break;
        	case 1:
        		newCurrent[ y ][ x ] = current[ x ][ y ];
        		break;
        	case 2:
        		switch(shape_rotate){
        		case 0:
        			if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][ 1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 2 ][ 2 ];//
            			}else if(y == 2){
            				//newCurrent[ 2 ][ 0 ] = current[ 2 ][ 2 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 0 ][ 2 ];
            			}
        			break;
        		case 270:
        			if(y == 0){
            			//newCurrent[ 0 ][ 1 ] = current[ 2 ][ 0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 1 ][ 0 ];
            			}else if(y == 1){
            				newCurrent[ 1 ][ 1 ] = current[ 2 ][ 1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 1 ][ 1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 1 ] = current[ 2 ][ 2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 2 ][ 0 ];//
            			}
        			break;
        		case 180:
        			if(y == 1){
        					newCurrent[ 1 ][ 0 ] = current[ 2 ][ 1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 1 ];
            				//newCurrent[ 1 ][ 2 ] = current[ 0 ][ 1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 0 ][ 1 ];//
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 0 ][ 2 ];
            			}
        			break;
        		case 90:
        			if(y == 0){
        				newCurrent[ 0 ][ 2 ] = current[ 1 ][ 0 ];
        				newCurrent[ 0 ][ 1 ] = current[ 1 ][ 2 ];//
        			}else if(y == 1){
        				newCurrent[ 1 ][ 1 ] = current[ 2 ][ 1 ];
        				newCurrent[ 1 ][ 2 ] = current[ 1 ][ 1 ];
        			}else if(y == 2){
        				newCurrent[ 2 ][ 1 ] = current[ 2 ][ 2 ];
        				//newCurrent[ 2 ][ 2 ] = current[ 1 ][ 2 ];
        			}
        			break;

        		}
        		break;
        	case 3:
        		switch(shape_rotate){
        		case 0:
        			if(y == 1){
            				//newCurrent[ 1 ][ 0 ] = current[ 2 ][ 0 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 0 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][ 0 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 2 ][ 1 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 1 ];
            				newCurrent[ 2 ][ 2 ] = current[ 2 ][ 0 ];//

            			}
        			break;
        		case 270:
        			if(y == 0){
            			newCurrent[ 0 ][ 0 ] = current[ 2 ][  0 ];
            			//newCurrent[ 0 ][ 1 ] = current[ 1 ][  0 ];
            			}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][ 1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 1 ][  0 ];//
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 2 ];
            			}
        			break;
        		case 180:
        			if(y == 1){
        					newCurrent[ 1 ][ 0 ] = current[ 0 ][ 1 ];//
            				newCurrent[ 1 ][ 1 ] = current[ 0 ][ 1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][ 0 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 2 ][ 1 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 1 ];
            				//newCurrent[ 2 ][ 2 ] = current[ 0 ][ 1 ];
            			}
        			break;
        		case 90:
        			if(y == 0){
        				newCurrent[ 0 ][ 0 ] = current[ 2 ][ 0 ];
        				newCurrent[ 0 ][ 1 ] = current[ 2 ][ 2 ];//
        			}else if(y == 1){
        				newCurrent[ 1 ][ 0 ] = current[ 2 ][ 1 ];
        				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 1 ];
        			}else if(y == 2){
        				//newCurrent[ 2 ][ 0 ] = current[ 2 ][ 2 ];
        				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 2 ];
        			}
        			break;

        		}
        		break;
        	case 4:
        		switch(shape_rotate){
        		case 0:
        			if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][ 1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][ 1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 2 ][ 2 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 0 ][ 2 ];
            			}
        			break;
        		case 90:
        			if(y == 0){
            			newCurrent[ 0 ][ 1 ] = current[ 2 ][ 0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 1 ][ 0 ];
            			}else if(y == 1){
            				newCurrent[ 1 ][ 1 ] = current[ 2 ][ 1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 1 ][ 1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 1 ] = current[ 2 ][ 2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 1 ][ 2 ];
            			}
        			break;
        		case 180:
        			if(y == 1){
        				newCurrent[ 1 ][ 0 ] = current[ 2 ][ 1 ];
        				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 1 ];
        				newCurrent[ 1 ][ 2 ] = current[ 0 ][ 1 ];
        			}else if(y == 2){
        				newCurrent[ 2 ][ 0 ] = current[ 2 ][ 2 ];
        				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 2 ];
        				newCurrent[ 2 ][ 2 ] = current[ 0 ][ 2 ];
        			}
        			break;
        		case 270:
        			if(y == 0){
            			newCurrent[ 0 ][ 1 ] = current[ 2 ][ 0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 1 ][ 0 ];
            			}else if(y == 1){
            				newCurrent[ 1 ][ 1 ] = current[ 2 ][ 1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 1 ][ 1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 1 ] = current[ 2 ][ 2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 1 ][ 2 ];
            			}
        			break;
        		}
        		break;
        	case 5:
        		switch(shape_rotate){
        		case 0:
        			if(y == 0){
        				newCurrent[ 0 ][ 0 ] = current[ 0 ][ 3 ];//
            			newCurrent[ 0 ][ 1 ] = current[ 2 ][ 1 ];
            			newCurrent[ 0 ][ 2 ] = current[ 1 ][ 1 ];
            		}else if(y == 1){
            				newCurrent[ 1 ][ 1 ] = current[ 2 ][ 2 ];
            				newCurrent[ 1 ][ 2 ] = current[ 1 ][ 2 ];
            		}else if(y == 2){
            				newCurrent[ 2 ][ 1 ] = current[ 2 ][ 3 ];
            				newCurrent[ 2 ][ 2 ] = current[ 1 ][ 3 ];
            				//newCurrent[ 2 ][ 3 ] = current[ 0 ][ 3 ];
            		}
        			break;
        		case 90:
        			if(y == 0){
            			newCurrent[ 0 ][ 1 ] = current[ 2 ][ 1 ];
            			newCurrent[ 0 ][ 2 ] = current[ 1 ][ 1 ];
            			newCurrent[ 0 ][ 3 ] = current[ 0 ][ 1 ];
            		}else if(y == 1){
            				newCurrent[ 1 ][ 1 ] = current[ 2 ][ 2 ];
            				newCurrent[ 1 ][ 2 ] = current[ 1 ][ 2 ];
            				newCurrent[ 1 ][ 3 ] = current[ 0 ][ 2 ];
            		}else if(y == 2){
            				newCurrent[ 2 ][ 1 ] = current[ 0 ][ 0 ];///
            		}
        			break;
        		case 180:
        			if(y == 0){
            			//newCurrent[ 0 ][ 0 ] = current[ 2 ][ 1 ];
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][ 1 ];
            			newCurrent[ 0 ][ 2 ] = current[ 0 ][ 1 ];
            		}else if(y == 1){
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 2 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][ 2 ];
            		}else if(y == 2){
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 3 ];
            				newCurrent[ 2 ][ 2 ] = current[ 0 ][ 3 ];
            				newCurrent[ 2 ][ 3 ] = current[ 2 ][ 1 ];
            		}
        			break;
        		case 270:
        			if(y == 0){
            			newCurrent[ 0 ][ 3 ] = current[ 2 ][ 3 ];///
            		}else if(y == 1){
            				newCurrent[ 1 ][ 1 ] = current[ 2 ][ 1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 1 ][ 1 ];
            				newCurrent[ 1 ][ 3 ] = current[ 0 ][ 1 ];
            		}else if(y == 2){
            				newCurrent[ 2 ][ 1 ] = current[ 2 ][ 2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 1 ][ 2 ];
            				newCurrent[ 2 ][ 3 ] = current[ 0 ][ 2 ];
            		}
        			break;
        		}
        		break;
        	case 6:
        		switch(shape_rotate){
        		case 0:
        			if(y == 0){
            			newCurrent[ 0 ][ 1 ] = current[ 2 ][ 0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 1 ][ 0 ];
            			//newCurrent[ 0 ][ 3 ] = current[ 0 ][ 0 ];
            		}else if(y == 1){
            				newCurrent[ 1 ][ 1 ] = current[ 2 ][ 1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 1 ][ 1 ];
            		}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 0 ][ 0 ];//
            				newCurrent[ 2 ][ 1 ] = current[ 2 ][ 2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 1 ][ 2 ];
            		}
        			break;
        		case 90:
        			if(y == 0){
            			newCurrent[ 0 ][ 0 ] = current[ 2 ][ 1 ];
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][ 1 ];
            			newCurrent[ 0 ][ 2 ] = current[ 0 ][ 1 ];
            		}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][ 2 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 2 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][ 2 ];
            		}else if(y == 2){
            				newCurrent[ 2 ][ 2 ] = current[ 2 ][ 0 ];///
            		}
        			break;
        		case 180:
        			if(y == 0){
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][ 0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 0 ][ 0 ];
            			newCurrent[ 0 ][ 3 ] = current[ 2 ][ 2 ];//
            		}else if(y == 1){
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][ 1 ];
            		}else if(y == 2){
            				//newCurrent[ 2 ][ 0 ] = current[ 2 ][ 2 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 0 ][ 2 ];
            		}
        			break;
        		case 270:
        			if(y == 0){
            			newCurrent[ 0 ][ 0 ] = current[ 0 ][ 3 ];///
            		}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][ 1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][ 1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][ 1 ];
            		}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 2 ][ 2 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][ 2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 0 ][ 2 ];
            		}
        			break;
        		}
        		break;
        	case 7:
        		newCurrent[ y ][ x ] = current[ x ][ 3 - y ];
        		break;
        	case 8:
        		newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
        		break;
        	case 9:
        		switch(shape_rotate){
        		case 0:
        			if(y == 0){
            			//newCurrent[ 0 ][ 0 ] = current[ 2 ][  0 ];
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][  0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 0 ][  0 ];
            			}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][  1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][  1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][  1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 2 ][  2 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][  2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 2 ][  0 ];///
            			}
        			break;
        		case 90:
        			if(y == 0){
            			newCurrent[ 0 ][ 0 ] = current[ 2 ][  0 ];
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][  0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 2 ][  2 ];///
            			}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][  1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][  1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][  1 ];
            			}else if(y == 2){
            				//newCurrent[ 2 ][ 0 ] = current[ 2 ][  2 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][  2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 0 ][  2 ];
            			}
        			break;
        		case 180:
        			if(y == 0){
            			newCurrent[ 0 ][ 0 ] = current[ 0 ][  2 ];///
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][  0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 0 ][  0 ];
            			}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][  1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][  1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][  1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 2 ][  2 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][  2 ];
            				//newCurrent[ 2 ][ 2 ] = current[ 0 ][  2 ];
            			}
        			break;
        		case 270:
        			if(y == 0){
            			newCurrent[ 0 ][ 0 ] = current[ 2 ][  0 ];
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][  0 ];
            			//newCurrent[ 0 ][ 2 ] = current[ 0 ][  0 ];
            			}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][  1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][  1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][  1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 0 ][  0 ];///
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][  2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 0 ][  2 ];
            			}
        			break;
        		}
        		break;
        	case 10:
        		switch(shape_rotate){
        		case 0:
        			if(y == 0){
            			newCurrent[ 0 ][ 0 ] = current[ 2 ][  0 ];
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][  0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 2 ][  2 ];///
            			}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][  1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][  1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][  1 ];
            			}else if(y == 2){
            				//newCurrent[ 2 ][ 0 ] = current[ 2 ][  2 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][  2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 0 ][  2 ];
            			}
        			break;
        		case 90:
        			if(y == 0){
            			newCurrent[ 0 ][ 0 ] = current[ 0 ][  2 ];///
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][  0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 0 ][  0 ];
            			}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][  1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][  1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][  1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 2 ][  2 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][  2 ];
            				//newCurrent[ 2 ][ 2 ] = current[ 0 ][  2 ];
            			}
        			break;
        		case 180:
        			if(y == 0){
            			newCurrent[ 0 ][ 0 ] = current[ 2 ][  0 ];
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][  0 ];
            			//newCurrent[ 0 ][ 2 ] = current[ 0 ][  0 ];
            			}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][  1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][  1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][  1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 0 ][  0 ];///
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][  2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 0 ][  2 ];
            			}
        			break;
        		case 270:
        			if(y == 0){
            			//newCurrent[ 0 ][ 0 ] = current[ 2 ][  0 ];
            			newCurrent[ 0 ][ 1 ] = current[ 1 ][  0 ];
            			newCurrent[ 0 ][ 2 ] = current[ 0 ][  0 ];
            			}else if(y == 1){
            				newCurrent[ 1 ][ 0 ] = current[ 2 ][  1 ];
            				newCurrent[ 1 ][ 1 ] = current[ 1 ][  1 ];
            				newCurrent[ 1 ][ 2 ] = current[ 0 ][  1 ];
            			}else if(y == 2){
            				newCurrent[ 2 ][ 0 ] = current[ 2 ][  2 ];
            				newCurrent[ 2 ][ 1 ] = current[ 1 ][  2 ];
            				newCurrent[ 2 ][ 2 ] = current[ 2 ][  0 ];///
            			}
        			break;
        		}
        		break;
        	}
            //newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
        }
    }
    render();
    return newCurrent;
}

//横ライン揃っているかチェック
function linesCheck() {
    for ( var y = ROWS - 1; y >= 0; --y ) {
        var row = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                row = false;
                break;
            }
        }
      //揃っていたら中身を+10しておく
        if ( row ) {
        	for ( var x = 0; x < COLS; ++x ) {
        		if(board[ y ][ x ] <= 11){
        		board[ y ][ x ] += 11;
        		now = true;
        		}
            }
//            for ( var yy = y; yy > 0; --yy ) {
//                for ( var x = 0; x < COLS; ++x ) {
//                    //board[ yy ][ x ] = board[ yy - 1 ][ x ];	//一段下げる
//                }
//            }
//		++y;
        	//render();
        }
    }
    //render();
    //deleteCheck();
}
//○番目毎にテトリミノをチェック
function numsCheck(){

	//for(var i = 1; i <= mino_num; i++){
    for(var idx = 0,ll=mino_arry.length; idx < ll; idx++){
	var i = mino_arry[idx];
		var yellow = true;
		for ( var x = 0; x < COLS; ++x ) {
	        for ( var y = 0; y < ROWS; ++y ) {
	        	if(minoes[ y ][ x ] == i){
	        		if(board[ y ][ x ] <= 11){
	        			yellow = false;
		                break;
	        		}
	            }
	        }
	    }
		if (yellow) {
			for ( var x = 0; x < COLS; ++x ) {
		        for ( var y = 0; y < ROWS; ++y ) {
		            if(minoes[ y ][ x ] == i){
		            	board[ y ][ x ] += 11;
		            	now = true;
		            }
		        }
		    }
		}
	}
}

function downCheck(){
	//now = false;
	var j = 0;
	while(j < 15){
	for(var idx = 0,ll=mino_arry.length; idx < ll; idx++){
	var i = mino_arry[idx];
		//if(i == 0)continue;
		var bottom = true;
		for ( var y = 0; y < ROWS; ++y ) {
			for ( var x = 0; x < COLS; ++x ) {
	        	if(minoes[ y ][ x ] == i){
	        		if(minoes[ y + 1 ][ x ] == 0 || minoes[ y + 1 ][ x ] == i){
	        				//bottom = true;
	        		}else{
	        			bottom = false;
	        			break;
	        		}
	            }
	        }
//			if(bottom == false){
//    			break;
//    		}
	    }
		if (bottom) {
			for ( var y = ROWS; y > 0; --y ) {
			for ( var x = 0; x < COLS; ++x ) {
		        //for ( var y = ROWS; y > 0; --y ) {
		            if(minoes[ y ][ x ] == i){
		            	board[y + 1][ x ] = board[ y ][ x ];
		            	minoes[y + 1][ x ] = minoes[ y ][ x];
		            	messages[y + 1][ x ] = messages[ y ][ x ];
		            	if(minoes[y - 1][ x ] == i){
		            	board[ y ][ x ] = board[y - 1][ x ];
		            	minoes[ y ][ x ] = minoes[y - 1][ x ];
		            	messages[ y ][ x ] = messages[y - 1][ x ];
		            	}else{
		            		board[ y ][ x ] = 0;
			            	minoes[ y ][ x ] = 0;
			            	messages[ y ][ x ] = 0;
		            	}
		            	/* 現時点でのイメージを保存する。 */
		            	var imagedata = ctx_freeze.getImageData(BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H);
		            	/* 描画削除 */
		            	ctx_freeze.clearRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H );
		            	ctx_freeze.putImageData(imagedata, BLOCK_W * x, BLOCK_H * (y + 1));

		            	var imagedata2 = ctx_message.getImageData(BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H);
		            	ctx_message.clearRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H );
		            	ctx_message.putImageData(imagedata2, BLOCK_W * x, BLOCK_H * (y + 1));

		            	var imagedata3 = ctx_bg.getImageData(BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H);
		            	ctx_bg.clearRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H );
		            	ctx_bg.putImageData(imagedata3, BLOCK_W * x, BLOCK_H * (y + 1));

		            	now = true;
		            }
		        }
		    }
			linesCheck();
			//render();
		}
	}
	j++;
	}
}

function deleteCheck(){
	var combo_flag = true;

    for(var idx = 0,ll=mino_arry.length; idx < ll; idx++){
    	//for(var idx in mino_arry){	//--------------------------------
		var i = mino_arry[idx];
		//if(i == 0)continue;
		var deletecheck = true;
		var point_ptn = 0;
		var point_left = 1;
		var point_top = 0;
		for ( var x = 0; x < COLS; ++x ) {
	        for ( var y = 0; y < ROWS; ++y ) {
	        	if(minoes[ y ][ x ] == i){
	        		if(board[ y ][ x ] <= 33){
	        			deletecheck = false;
		                break;
	        		}
	            }
	        }
	    }
		if (deletecheck) {
			//alert(i);
			for ( var x = 0; x < COLS; ++x ) {
		        for ( var y = 0; y < ROWS; ++y ) {
		            if(minoes[ y ][ x ] == i){
		            	//alert(i);
		            	//得点表示場所
		            	if(point_top == 0){
		            		point_top = BLOCK_H * (y - 3);
		            	}
		            	if(point_left == 1){
		            		point_left = BLOCK_W * x;
		            	}
		            	//alert(minoes[ y ][ x ]);
		            	//alert(board[ y ][ x ]);
		            	point_ptn = board[ y ][ x ] - 44;
		            	board[ y ][ x ] += 11;
		            	//render();
		            	//minoes[ y ][ x ] += 12;
		            	ctx_freeze.clearRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W , BLOCK_H );///
		            	//消したy座標取得
		            	//if(y == ROWS - 1){
		            	//	area_bonus = 50;
		            	//}
		            	//if(area_bonus != 50){
		            	if(area_y < y){
	            			area_y = y;
	            		}
		            	//}
		            	//新築があったら
		            	if(messages[ y ][ x ] == 3){
		            		newBuilding_bonus = 10;
		            	}else if(messages[ y ][ x ] == 1){
		            		sunny_bonus += 10;
		            	}else if(messages[ y ][ x ] == 2){
		            		pet_bonus += 10;
		            	}
		            	now = true;
		            	//deleteMino(mino_num);//----------------------------
		            }
		        }
		    }
		}
		if(point_ptn != 0){
			switch(point_ptn){
			case 1:
				point = 40000;
				break;
			case 2:
				point = 40000;
				break;
			case 3:
				point = 50000;
				break;
			case 4:
				point = 50000;
				break;
			case 5:
				point = 60000;
				break;
			case 6:
				point = 70000;
				break;
			case 7:
				point = 70000;
				break;
			case 8:
				point = 100000;
				break;
			case 9:
				point = 160000;
				break;
			case 10:
				point = 40000;
				break;
			case 11:
				point = 40000;
				break;
			}
			//消した位置でのボーナス
			if(area_y >= 12){
				area_bonus = 20;
			}else if(area_y >= 8){
				area_bonus = 0;
			}else{
				area_bonus = -20;
			}
            if(iscombodsp){
		//コンボ
		if(combo_flag == true){
			combo++;
			combo_flag = false;
		}
		var B = (100 + area_bonus + newBuilding_bonus + sunny_bonus + pet_bonus + (combo - 1) * 10) / 100;
            }else{
        var B = (100 + area_bonus + newBuilding_bonus + sunny_bonus + pet_bonus ) / 100;

            }
		if( B > 2){
			B = 2;
		}
		var pointB = point * B;
		score += pointB;
		//alert(point_ptn);
		//alert(pointB);
		//alert("mino_num:" + mino_num + "i:" + i);
		//alert("area_bonus:"+ area_bonus + "newBuilding_bonus:" + newBuilding_bonus + "sunny_bonus:" + sunny_bonus + "pet_bonus:" + pet_bonus + "pointB:" + pointB);
		//得点ボーナス初期化
		area_bonus = 0;
		newBuilding_bonus = 0;
		sunny_bonus = 0;
		pet_bonus = 0;
		area_y = 0;
	    if(point != 0){
	    	createPoint(point_left, point_top, pointB);
	    	point_left = 0;
			point_top = 0;
			downCheck();
	    }
	    point = 1;
		}
	}
	//downCheck();
}

//消した時の取得ポイントを作成
function createPoint(x, y, points){
	if(plugin){
		soundplay('sounds/income.mp3');
	}
    if(!ispointdsp)return;
	var point_img = './images/y' + points + '.png';
	// <img>要素を追加
	  $('<img />')
	    .attr('src', point_img)
	    .addClass("point")
	    .css({'position' : 'absolute', 'left':''+ x +'px', 'top':''+ y +'px'})
	    .appendTo('#game');
	  setTimeout(function(){
		  $(".point").remove();
	  }, 1000);
}

function newCheck(){
	//for(var i = 1; i < mino_num; i++){
        for(var idx = 0,ll=mino_arry.length; idx < ll; idx++){
		var i = mino_arry[idx];


    	//var newBuilding = true;
		for ( var x = 0; x < COLS; ++x ) {
			var newBuilding = true;
	        for ( var y = 0; y < ROWS; ++y ) {
				if(minoes[ y ][ x ] == i){
					if(messages[ y ][ x ] != 1 && messages[ y ][ x ] != 2){
//						var img2 = new Image();
//						.bind('onload',function(){
					var img2 = './images/p_03.png';
//			    		img2.onload = function() {
			    			ctx_message.drawImage(deferreds[img2],  BLOCK_W * x + 12, BLOCK_H * y, 40 , 64);
//			        	};
			    			messages[ y ][ x ] = 3;
			    			newBuilding = false;
			    			break;
					}else if(messages[ y ][ x ] == 3){
						newBuilding = false;
		    			break;
					}
				}else if(minoes[ y ][ x ] <= mino_num - 10){
					if(messages[ y ][ x ] == 3){
			    		ctx_message.clearRect(BLOCK_W * x + 12, BLOCK_H * y, 40 , 64);
			    		messages[ y ][ x ] = 0;
					}
				}else if(minoes[ y ][ x ] <= mino_num - 9){
					if(messages[ y ][ x ] == 3){
						//var img2 = new Image();
						//img2.src = './images/p_03b.png';
					        var img2 = './images/p_03b.png';
						ctx_message.clearRect(BLOCK_W * x + 12, BLOCK_H * y, 40 , 64);
						ctx_message.drawImage(deferreds[img2],  BLOCK_W * x + 12, BLOCK_H * y, 40 , 64);
					}
				}
			}
	        if(newBuilding == false){
				break;
			}
		}
	}
}

//キー入力
function keyPress( key ) {
	if(lose != true && pause == false){
	    switch ( key ) {
	        case 'left':
	            if ( valid( -1 ) ) {
	                --currentX;
	                drawMINO(key);
	            }
	            break;
	        case 'right':
	            if ( valid( 1 ) ) {
	                ++currentX;
	                drawMINO(key);
	            }
	            break;
	        case 'down':
	            if ( valid( 0, 1 ) ) {
	                ++currentY;
	                drawMINO(key);
	            }
	            break;
	        case 'rotate':
	            var rotated = rotate( current );
	            if ( valid( 0, 0, rotated ) ) {
	                current = rotated;
	                //回転角度を90度加算
	                shape_rotate += 90;
	                if(shape_rotate == 360){
	                	shape_rotate = 0;
	                }
	                drawMINO(key);
	                if(plugin){
	            		soundplay('sounds/turn.wav');
	            	}
	            }else if( valid( 1, 0, rotated ) ){
	            	++currentX;
	            	current = rotated;
	                //回転角度を90度加算
	                shape_rotate += 90;
	                if(shape_rotate == 360){
	                	shape_rotate = 0;
	                }
	                drawMINO(key);
	                drawMINO('right');
	                if(plugin){
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
	                drawMINO(key);
	                drawMINO('left');
	                if(plugin){
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
	                drawMINO(key);
	                drawMINO('right');
	                drawMINO('right');
	                if(plugin){
	            		soundplay('sounds/turn.mp3');
	            	}
	            }
	         break;
	    }
	    drawFall();
	    //render();
	    downCheck();
	}
}
function drawMINO(direct){
	mino_top = parseInt($('#canvas_MINO').css("top"));
	mino_left = parseInt($('#canvas_MINO').css("left"));
	switch(direct){
	case 'left':
		mino_left -= 64;
		break;
	case 'right':
		mino_left += 64;
		break;
	case 'down':
		mino_top += 64;
		break;
	case 'rotate':
		ctx_MINO.clearRect( 0, 0, 256, 256 );
		//var cx = canvas_MINO.width / 2;
		//var cy = canvas_MINO.height / 2;
		//ctx_MINO.translate(cx,cy);  // x軸方向にcx、y軸方向にcy移動
		//ctx_MINO.rotate( 90*Math.PI/180);  // 座標(0,0)を中心として時計回りにθ回転
		//ctx_MINO.translate(-1 * cx,-1 * cy);  // x軸方向に-cx、y軸方向に-cy移動
		drawMino(0, 0, id + 1, ctx_MINO);
		break;
	}
		$('#canvas_MINO').animate({
	    	'left': '' + mino_left + 'px',
	    	'top': '' + mino_top + 'px'
		},{
			'duration': 0,
		});
}

//当たり判定
function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;


    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
                	//(4, 4)にあるものが判定聞いているならばゲームオーバーフラグを立てる
                    //if (offsetY <= 4 && offsetX > 0 && offsetX < 9) lose = true;
                    return false;
                }
            }
        }
    }
    return true;
}
//次に何をだすか
function next_rand(){
	//next_Id = Math.floor( Math.random() * shapes.length );
	var kind;
	if(gamemode == 0){
		kind = 50;
		next_ptn = Math.floor( Math.random() * kind );	//0~42/43
	    if(next_ptn <= 8){			//9個
	    	next_Id = 0;
	    }else if(next_ptn <= 14){	//6
	    	next_Id = 1;
	    }else if(next_ptn <= 19){	//5
	    	next_Id = 2;
	    }else if(next_ptn <= 24){	//5
	    	next_Id = 3;
	    }else if(next_ptn <= 29){	//5
	    	next_Id = 4;
	    }else if(next_ptn <= 32){	//3
	    	next_Id = 5;
	    }else if(next_ptn <= 35){	//3
	    	next_Id = 6;
	    }else if(next_ptn <= 42){	//7
	    	next_Id = 9;
	    }else if(next_ptn <= 49){	//7
	    	next_Id = 10;
	    }else if(next_ptn <= 51){	//2
	    	next_Id = 7;
	    }else{	//1
	    	next_Id = 8;
	    }
	}else if(gamemode == 3){
		kind = 38;
		next_ptn = Math.floor( Math.random() * kind );	//0~42/43
	    if(next_ptn <= 8){			//9個
	    	next_Id = 0;
	    }else if(next_ptn <= 14){	//6
	    	next_Id = 1;
	    }else if(next_ptn <= 19){	//5
	    	next_Id = 2;
	    }else if(next_ptn <= 24){	//5
	    	next_Id = 3;
	    }else if(next_ptn <= 31){	//7
	    	next_Id = 9;
	    }else if(next_ptn <= 38){	//7
	    	next_Id = 10;
	    }
	}else{
		kind = 53;
		next_ptn = Math.floor( Math.random() * kind );	//0~42/43
	    if(next_ptn <= 8){			//9個
	    	next_Id = 0;
	    }else if(next_ptn <= 14){	//6
	    	next_Id = 1;
	    }else if(next_ptn <= 19){	//5
	    	next_Id = 2;
	    }else if(next_ptn <= 24){	//5
	    	next_Id = 3;
	    }else if(next_ptn <= 29){	//5
	    	next_Id = 4;
	    }else if(next_ptn <= 32){	//3
	    	next_Id = 5;
	    }else if(next_ptn <= 35){	//3
	    	next_Id = 6;
	    }else if(next_ptn <= 42){	//7
	    	next_Id = 9;
	    }else if(next_ptn <= 49){	//7
	    	next_Id = 10;
	    }
	}
}
//(新しく)ゲーム開始
function newGame() {
        initMinoArry();
    //alert(mino_arry.length);
	if(gamemode == 2){
		ROWS = 14;
	}else{
		ROWS = 16;
	}
	score = 0;
	mino_num = 0;
    //initMinoArry();
    clearInterval(interval);
    //clearInterval(interval_render);----------
//    $('#koukoku').css('background-color', 'red');
    init();
    next_rand();
    newShape();
    lose = false;
    interval = setInterval( tick, 1000 );
    //interval_render = setInterval( render, 50 );---------------------
    //現在のモードのベストスコアを取得
    switch(gamemode){
	case 0:
		best_score = localStorage.getItem('EASY_BEST_SCORE');
		break;
	case 1:
		best_score = localStorage.getItem('NORMAL_BEST_SCORE');
		break;
	case 2:
		best_score = localStorage.getItem('HARD_BEST_SCORE');
		break;
	case 3:
		best_score = localStorage.getItem('BEGINNER_BEST_SCORE');
		break;
	}
    //ベストスコアがなかったら０
    if(best_score == null){
		best_score == 0;
	}
    bestScoreDisplay();
    ctx_MINO.setTransform(1,0,0,1,0,0);

    $('#score_suzi9').css('display', 'none');
    $('#score_suzi8').css('display', 'none');
    $('#score_suzi7').css('display', 'none');
    $('#score_comma2').css('display', 'none');
    $('#score_suzi6').css('display', 'none');
    $('#score_suzi5').css('display', 'none');
    $('#score_suzi4').css('display', 'none');
	$('#score_comma1').css('display', 'none');
	$('#score_suzi3').css('display', 'none');
	$('#score_suzi2').css('display', 'none');

	$('#next').css('background-image', 'url(' + next_images[id] + ')');
}


//一時停止
$('#pause').bind('touchstart', function(e) {
	if(lose != true){
		var url = $('#pause').attr('src');
		if(url == './images/p_stop.png'){
			$('#pause').attr("src",'./images/p_start.png');
			pause = true;
			clearInterval(interval);
			//clearInterval(interval_render);---------
			$('#canvas_MINO').css('display', 'none');
			$('#canvas_freeze').css('display', 'none');
			$('#canvas_bg').css('display', 'none');
			$('#canvas_message').css('display', 'none');
			$('#gameover_area').css('display', 'block');
			$('#continue').css('display', 'block');
		}else if(url == './images/p_start.png'){
			$('#pause').attr("src",'./images/p_stop.png');
			pause = false;
			interval = setInterval( tick, 1000 );
			//interval_render = setInterval( render, 50 );----------
			$('#canvas_MINO').css('display', 'block');
			$('#canvas_freeze').css('display', 'block');
			$('#canvas_bg').css('display', 'block');
			$('#canvas_message').css('display', 'block');
			$('#gameover_area').css('display', 'none');
			$('#continue').css('display', 'none');
		}
	}
	e.stopPropagation();
});

//もう一度続ける
$('#continue').bind('touchstart', function(e) {
	if(lose != true){
			$('#pause').attr("src",'./images/p_stop.png');
			pause = false;
			interval = setInterval( tick, 1000 );
			//interval_render = setInterval( render, 50 );-------------
			$('#canvas_MINO').css('display', 'block');
			$('#canvas_freeze').css('display', 'block');
			$('#canvas_bg').css('display', 'block');
			$('#canvas_message').css('display', 'block');
			$('#gameover_area').css('display', 'none');
			$('#continue').css('display', 'none');
	}
	e.stopPropagation();
});

//タイトルにもどる
$('#gotitle').bind('touchstart', function() {
	location.href = "index.html";
});
//もう一度挑戦する
$('#retry').bind('touchstart', function(e) {
	setTimeout(function(){
	$('#gameover_area').css('display', 'none');
	$('#gameover').css('display', 'none');
	$('#twitter').css('display', 'none');
	var url = $('#pause').attr('src');
	if(url == './images/p_start.png'){
	    alert("resart");
		$('#pause').attr("src",'./images/p_stop.png');
		pause = false;
		interval = setInterval( tick, 1000 );
		//interval_render = setInterval( render, 50 );--------------------
		$('#canvas_MINO').css('display', 'block');
		$('#canvas_freeze').css('display', 'block');
		$('#canvas_bg').css('display', 'block');
		$('#canvas_message').css('display', 'block');
		$('#gameover_area').css('display', 'none');
	}
	newGame();
	e.stopPropagation();
	},500);
});
//ツイッター
$('#twitter').bind("touchstart", function() {
	var hako1 = "マドリスの";
	var hako2 = "";
	switch(gamemode){
	case 0:
		hako2 = "EASYモードで";
		break;
	case 1:
		hako2 = "NORMALモードで";
		break;
	case 2:
		hako2 = "HARDモードで";
		break;
	case 0:
		hako2 = "BEGINNERモードで";
		break;
	}
	var hako3 = "円を獲得!";
    var hako4 = APPURL;
    if(plugin){
     window.plugins.twitter.composeTweet(
    function(s){ ; },
    function(e){ ; },
    hako1 + hako2 + score + hako3+ hako4);

    }else{
	hako1 = encodeURIComponent( hako1 );
    hako2 = encodeURIComponent( hako2 );
    hako3 = encodeURIComponent( hako3 );
    hako4 = encodeURIComponent( "\n"+ hako4 );

    window.open("http://twitter.com/home?status=" + hako1 + hako2 + (score|0) + hako3 + hako4 );
    }

});

//スコア表示
function scoreDisplay(){
	if(score >= 1000){
		$('#score_suzi4').css('display', 'block');
		$('#score_comma1').css('display', 'block');
		$('#score_suzi3').css('display', 'block');
		$('#score_suzi2').css('display', 'block');
	}
	if(score >= 10000){
		$('#score_suzi5').css('display', 'block');
	}
	if(score >= 100000){
		$('#score_suzi6').css('display', 'block');
	}
	if(score >= 1000000){
		$('#score_suzi7').css('display', 'block');
		$('#score_comma2').css('display', 'block');
	}
	if(score >= 10000000){
		$('#score_suzi8').css('display', 'block');
	}
	if(score >= 100000000){
		$('#score_suzi9').css('display', 'block');
	}
	$('#score_suzi4').attr('src', suzi_images[Math.floor(score / 1000) % 10]);
	$('#score_suzi5').attr('src', suzi_images[Math.floor(score / 10000) % 10]);
	$('#score_suzi6').attr('src', suzi_images[Math.floor(score / 100000) % 10]);
	$('#score_suzi7').attr('src', suzi_images[Math.floor(score / 1000000) % 10]);
	$('#score_suzi8').attr('src', suzi_images[Math.floor(score / 10000000) % 10]);
	$('#score_suzi9').attr('src', suzi_images[Math.floor(score / 100000000) % 10]);
}

//現在のモードのベストスコア表示
function bestScoreDisplay(){
	if(best_score >= 1000){
		$('#best_score_suzi4').css('display', 'block');
		$('#best_score_comma1').css('display', 'block');
		$('#best_score_suzi3').css('display', 'block');
		$('#best_score_suzi2').css('display', 'block');
	}
	if(best_score >= 10000){
		$('#best_score_suzi5').css('display', 'block');
	}
	if(best_score >= 100000){
		$('#best_score_suzi6').css('display', 'block');
	}
	if(best_score >= 1000000){
		$('#best_score_suzi7').css('display', 'block');
		$('#best_score_comma2').css('display', 'block');
	}
	if(best_score >= 10000000){
		$('#best_score_suzi8').css('display', 'block');
	}
	if(best_score >= 100000000){
		$('#best_score_suzi9').css('display', 'block');
	}
	$('#best_score_suzi4').attr('src', suzi_images[Math.floor(best_score / 1000) % 10]);
	$('#best_score_suzi5').attr('src', suzi_images[Math.floor(best_score / 10000) % 10]);
	$('#best_score_suzi6').attr('src', suzi_images[Math.floor(best_score / 100000) % 10]);
	$('#best_score_suzi7').attr('src', suzi_images[Math.floor(best_score / 1000000) % 10]);
	$('#best_score_suzi8').attr('src', suzi_images[Math.floor(best_score / 10000000) % 10]);
	$('#best_score_suzi9').attr('src', suzi_images[Math.floor(best_score / 100000000) % 10]);
}


//テトリミノ画像のプリロード
$(function(){
	jQuery.preloadImages = function(){
		for(var i = 0; i<arguments.length; i++){
		    var src = arguments[i];
			jQuery("<img>").one('load', function() {
			    deferreds[src] = this;
  			// do stuff
			}).each(function() {
  			if(this.complete) $(this).load();
			}).attr("src", arguments[i]);

		}
	};
	$.preloadImages('./images/b_a.png', './images/b_a_90.png', './images/b_a_180.png', './images/b_a_270.png',
			'./images/b_b.png', './images/b_b_90.png', './images/b_b_180.png', './images/b_b_270.png',
			'./images/b_c1.png', './images/b_c1_90.png', './images/b_c1_180.png', './images/b_c1_270.png',
			'./images/b_c2.png', './images/b_c2_90.png', './images/b_c2_180.png', './images/b_c2_270.png',
			'./images/b_d.png', './images/b_d_90.png', './images/b_d_180.png', './images/b_d_270.png',
			'./images/b_e1.png', './images/b_e1_90.png', './images/b_e1_180.png', './images/b_e1_270.png',
			'./images/b_e2.png', './images/b_e2_90.png', './images/b_e2_180.png', './images/b_e2_270.png',
			'./images/b_f.png', './images/b_f_90.png', './images/b_f_180.png', './images/b_f_270.png',
			'./images/b_g.png', './images/b_g_90.png', './images/b_g_180.png', './images/b_g_270.png',
			'./images/b_h1.png', './images/b_h1_90.png', './images/b_h1_180.png', './images/b_h1_270.png',
			'./images/b_h2.png', './images/b_h2_90.png', './images/b_h2_180.png', './images/b_h2_270.png',
			'./images/p_01.png','./images/p_02.png','./images/p_03.png','./images/p_03b.png');
});
