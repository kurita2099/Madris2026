var beginner_best_score;
var easy_best_score;
var normal_best_score;
var hard_best_score;
var interval_render;
var PC = false;
var click = 'touchstart';
$(function(){
//        $('#koukoku').css('background-color', 'black');
  if(screen.availHeight > 500){//iphon5
  $('#selectarea').css('height','420px');
  }
	if(PC == true){
		click = 'click';
	}
	$('#beginner_btn').bind(click, function() {
		$('#title').css('display', 'none');
		$('#game').css('display', 'block');
		gamemode = 3;
		setTimeout(function(){
			newGame();
		},200);
	});
	$('#easy_btn').bind(click, function() {
		$('#title').css('display', 'none');
		$('#game').css('display', 'block');
		gamemode = 0;
		setTimeout(function(){
			newGame();
		},200);
	});
	$('#normal_btn').bind(click, function() {
		$('#title').css('display', 'none');
		$('#game').css('display', 'block');
		gamemode = 1;
		setTimeout(function(){
			newGame();
		},200);
	});
	$('#hard_btn').bind(click, function() {
		$('#title').css('display', 'none');
		$('#game').css('display', 'block');
		gamemode = 2;
		setTimeout(function(){
			newGame();
		},200);
	});
	$('#rule_btn').bind(click, function() {
        event.preventDefault();
		$('#title').css('display', 'none');
		$('#rule').css('display', 'block');
//                $('#koukoku').css('background-color', 'red');
	});
	$('#ranking_btn').bind(click, function() {
                           //$('#title').css('display', 'none');
                           //$('#ranking').css('display', 'block');
                           if(plugin){

                           try{
                           window.plugins.gamecenter.showLeaderboard(function(){;},function(){;},CATEGORY + '0');
                           }catch(e){
                           //alert(e.stack);
                           }
                           }
	});
	$('#others_btn').bind(click, function() {
//		$('#title').css('display', 'none');
//		$('#others').css('display', 'block');
		//location.href = 'http://qooga.com/app/';
	});

	//各モードベストスコアの読込・表示

	beginner_best_score = localStorage.getItem('BEGINNER_BEST_SCORE');
	if(beginner_best_score >= 1000){
		$('#beginner_best_score_suzi4').css('display', 'block');
		$('#beginner_best_score_comma1').css('display', 'block');
		$('#beginner_best_score_suzi3').css('display', 'block');
		$('#beginner_best_score_suzi2').css('display', 'block');
	}
	if(beginner_best_score >= 10000){
		$('#beginner_best_score_suzi5').css('display', 'block');
	}
	if(beginner_best_score >= 100000){
		$('#beginner_best_score_suzi6').css('display', 'block');
	}
	if(beginner_best_score >= 1000000){
		$('#beginner_best_score_suzi7').css('display', 'block');
		$('#beginner_best_score_comma2').css('display', 'block');
	}
	if(beginner_best_score >= 10000000){
		$('#beginner_best_score_suzi8').css('display', 'block');
	}
	if(beginner_best_score >= 100000000){
		$('#beginner_best_score_suzi9').css('display', 'block');
	}

	$('#beginner_best_score_suzi4').attr('src', suzi_images[Math.floor(beginner_best_score / 1000) % 10]);
	$('#beginner_best_score_suzi5').attr('src', suzi_images[Math.floor(beginner_best_score / 10000) % 10]);
	$('#beginner_best_score_suzi6').attr('src', suzi_images[Math.floor(beginner_best_score / 100000) % 10]);
	$('#beginner_best_score_suzi7').attr('src', suzi_images[Math.floor(beginner_best_score / 1000000) % 10]);
	$('#beginner_best_score_suzi8').attr('src', suzi_images[Math.floor(beginner_best_score / 10000000) % 10]);
	$('#beginner_best_score_suzi9').attr('src', suzi_images[Math.floor(beginner_best_score / 100000000) % 10]);

	easy_best_score = localStorage.getItem('EASY_BEST_SCORE');
	if(easy_best_score >= 1000){
		$('#easy_best_score_suzi4').css('display', 'block');
		$('#easy_best_score_comma1').css('display', 'block');
		$('#easy_best_score_suzi3').css('display', 'block');
		$('#easy_best_score_suzi2').css('display', 'block');
	}
	if(easy_best_score >= 10000){
		$('#easy_best_score_suzi5').css('display', 'block');
	}
	if(easy_best_score >= 100000){
		$('#easy_best_score_suzi6').css('display', 'block');
	}
	if(easy_best_score >= 1000000){
		$('#easy_best_score_suzi7').css('display', 'block');
		$('#easy_best_score_comma2').css('display', 'block');
	}
	if(easy_best_score >= 10000000){
		$('#easy_best_score_suzi8').css('display', 'block');
	}
	if(easy_best_score >= 100000000){
		$('#easy_best_score_suzi9').css('display', 'block');
	}

	$('#easy_best_score_suzi4').attr('src', suzi_images[Math.floor(easy_best_score / 1000) % 10]);
	$('#easy_best_score_suzi5').attr('src', suzi_images[Math.floor(easy_best_score / 10000) % 10]);
	$('#easy_best_score_suzi6').attr('src', suzi_images[Math.floor(easy_best_score / 100000) % 10]);
	$('#easy_best_score_suzi7').attr('src', suzi_images[Math.floor(easy_best_score / 1000000) % 10]);
	$('#easy_best_score_suzi8').attr('src', suzi_images[Math.floor(easy_best_score / 10000000) % 10]);
	$('#easy_best_score_suzi9').attr('src', suzi_images[Math.floor(easy_best_score / 100000000) % 10]);

	normal_best_score = localStorage.getItem('NORMAL_BEST_SCORE');
	if(normal_best_score >= 1000){
		$('#normal_best_score_suzi4').css('display', 'block');
		$('#normal_best_score_comma1').css('display', 'block');
		$('#normal_best_score_suzi3').css('display', 'block');
		$('#normal_best_score_suzi2').css('display', 'block');
	}
	if(normal_best_score >= 10000){
		$('#normal_best_score_suzi5').css('display', 'block');
	}
	if(normal_best_score >= 100000){
		$('#normal_best_score_suzi6').css('display', 'block');
	}
	if(normal_best_score >= 1000000){
		$('#normal_best_score_suzi7').css('display', 'block');
		$('#normal_best_score_comma2').css('display', 'block');
	}
	if(normal_best_score >= 10000000){
		$('#normal_best_score_suzi8').css('display', 'block');
	}
	if(normal_best_score >= 100000000){
		$('#normal_best_score_suzi9').css('display', 'block');
	}



	$('#normal_best_score_suzi4').attr('src', suzi_images[Math.floor(normal_best_score / 1000) % 10]);
	$('#normal_best_score_suzi5').attr('src', suzi_images[Math.floor(normal_best_score / 10000) % 10]);
	$('#normal_best_score_suzi6').attr('src', suzi_images[Math.floor(normal_best_score / 100000) % 10]);
	$('#normal_best_score_suzi7').attr('src', suzi_images[Math.floor(normal_best_score / 1000000) % 10]);
	$('#normal_best_score_suzi8').attr('src', suzi_images[Math.floor(normal_best_score / 10000000) % 10]);
	$('#normal_best_score_suzi9').attr('src', suzi_images[Math.floor(normal_best_score / 100000000) % 10]);

	hard_best_score = localStorage.getItem('HARD_BEST_SCORE');
	if(hard_best_score >= 1000){
		$('#hard_best_score_suzi4').css('display', 'block');
		$('#hard_best_score_comma1').css('display', 'block');
		$('#hard_best_score_suzi3').css('display', 'block');
		$('#hard_best_score_suzi2').css('display', 'block');
	}
	if(hard_best_score >= 10000){
		$('#hard_best_score_suzi5').css('display', 'block');
	}
	if(hard_best_score >= 100000){
		$('#hard_best_score_suzi6').css('display', 'block');
	}
	if(hard_best_score >= 1000000){
		$('#hard_best_score_suzi7').css('display', 'block');
		$('#hard_best_score_comma2').css('display', 'block');
	}
	if(hard_best_score >= 10000000){
		$('#hard_best_score_suzi8').css('display', 'block');
	}
	if(hard_best_score >= 100000000){
		$('#hard_best_score_suzi9').css('display', 'block');
	}

	$('#hard_best_score_suzi4').attr('src', suzi_images[Math.floor(hard_best_score / 1000) % 10]);
	$('#hard_best_score_suzi5').attr('src', suzi_images[Math.floor(hard_best_score / 10000) % 10]);
	$('#hard_best_score_suzi6').attr('src', suzi_images[Math.floor(hard_best_score / 100000) % 10]);
	$('#hard_best_score_suzi7').attr('src', suzi_images[Math.floor(hard_best_score / 1000000) % 10]);
	$('#hard_best_score_suzi8').attr('src', suzi_images[Math.floor(hard_best_score / 10000000) % 10]);
	$('#hard_best_score_suzi9').attr('src', suzi_images[Math.floor(hard_best_score / 100000000) % 10]);

});

function gamen(){
	setTimeout(function(){
		$('#content').css('display', 'block');
	//中央表示
	var gamen =	document.getElementById('content');
	gamenWidth = parseInt(gamen.style.width);
	gamenHeight = parseInt(gamen.style.height);
	//alert("screen.availWidth:" + screen.availWidth + "gamenWidth:" + gamenWidth);
	//alert("screen.availWidth/2:" + screen.availWidth/2 + "gamenWidth/2/2:"+ gamenWidth/2/2);
	//alert("screen.availHeight/2:" + screen.availHeight/2 + "gamenHeight/2/2:" + gamenHeight/2/2);
		if(PC == false){
			if((screen.availWidth - gamenWidth) / 2 >= 0){
				gamen.style.left = (screen.availWidth - gamenWidth) / 2 + 'px';
				//alert(gamen.style.left);
			}
		}else if(PC == true){
			if((screen.availWidth - gamenWidth) / 2 >= 0){
				gamen.style.left = screen.availWidth/2 - gamenWidth/2 + 'px';
			}
		}

		if(PC == false){
		    	//alert(screen.availHeight + "," + gamenHeight);
		    	if(screen.availHeight > 500){//iphon5
		    		gamen.style.top = '80px';
		    	}
			//if((screen.availHeight - gamenHeight) / 2 >= 0){
			//	gamen.style.top = (screen.availHeight - gamenHeight) / 2 + 'px';
				//alert(gamen.style.top);
			//}
		}else if(PC ==true){
			if((screen.availHeight - gamenHeight) / 2 >= 0){
				gamen.style.top = screen.availHeight/2 - gamenHeight/2 + 'px';
			}
		}
	},200);
}
