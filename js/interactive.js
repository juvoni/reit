
$('tr td').each(function(){
	var ind = $(this).index();
	switch(ind){
		case 1:$(this).addClass('minimal');
		break;
		case 2:$(this).addClass('modest');
		break;
		case 3:$(this).addClass('intermediate');
		break;
		case 4:$(this).addClass('significant');
		break;
		case 5:$(this).addClass('aggressive');
		break;
		case 6:$(this).addClass('highly_leveraged');
		break;
	}

});