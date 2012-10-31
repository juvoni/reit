
$('tr td').each(function(){
	var ind = $(this).index();
	switch(ind){
		case 1:$(this).addClass('Minial');
		break;
		case 2:$(this).addClass('Modest');
		break;
		case 3:$(this).addClass('Intermediate');
		break;
		case 4:$(this).addClass('Significant');
		break;
		case 5:$(this).addClass('Agressive');
		break;
		case 6:$(this).addClass('Highly_Leveraged');
		break;
	}

});