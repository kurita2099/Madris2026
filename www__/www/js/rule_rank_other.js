$(function(){
	$('#rule').bind(click, function() {
        event.preventDefault();  
		if(plugin){
			soundplay('sounds/tap.mp3');
		}
		var url = $('#rule').attr('src');
		if(url == './images/howto.png'){
			$('#rule').attr('src','./images/howto2.png');
//            $('#koukoku').css('background-color', 'rgb(153,204,51)');
		}else if(url == './images/howto2.png'){
			$('#rule').attr('src','./images/howto.png');
			$('#rule').css('display', 'none');
			$('#title').css('display', 'block');
//            $('#koukoku').css('background-color', 'black');
		}
	});
	$('#ranking').bind(click, function() {
        event.preventDefault();  
		$('#ranking').css('display', 'none');
		$('#title').css('display', 'block');
	});
	$('#others').bind(click, function() {
        event.preventDefault();  
		$('#others').css('display', 'none');
		$('#title').css('display', 'block');
	});
});