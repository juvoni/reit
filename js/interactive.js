function reit_comp(name, financial, business){
	this.name = name,
	this.financial = financial,
	this.business = business;
};

reit_comp.prototype = {
	getName: function(){
		return this.name;
	},
	setName: function (name){
		this.name = name;
	},
	getFinancial: function(){
		return this.financial;
	},
	setFinancial: function(financial){
		this.financial = financial;
	},
	getBusiness: function(){
		return this.business;
	},
	setBusiness: function(business){
		this.business = business;
	}

};



$.ajaxSetup({
	async: false
});

var binder = [];
$.getJSON('ajax/reit_data.json', function(data) {
		$.each(data, function(){
			binder.push(new reit_comp(this['Company Name'], this['Financial Risk Profile'], this['Business Risk Profile']));
		});
});
function init(){
	$('tbody tr').each(function(){
		for(var i = 0 ; i<6;i++){
			$(this).append('<td></td>');
		}
	});
	$('tbody tr td').each(function(){
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
};

function renderContent(){
	var items = [];
	$('td').each(function(){
		items.length = 0;
		for(var i = 0; i<binder.length;i++){
			if($(this).attr("class") === binder[i].getFinancial() && $(this).closest("tr").attr("class") === binder[i].getBusiness()){
				 if ($(this).find('ul').length > 0){
					items.push('<li>'+binder[i].getName()+'</li>');
				 }
				 else{
					$(this).append("<ul></ul>");
					items.push('<li>'+binder[i].getName()+'</li>');
				 }
			}
		}
		$(this).find('ul').append(items.join(''));
	});
};

init();
renderContent();

$("ul").delegate('li', 'click', function () {
	//console.log("Company Clicked!");
});
$('td').click(function(){
	if($(this).html() === ''){
		console.log('It\'s empty!');
		$('.warning').fadeIn('700').css("display","inline").fadeOut('200');
	}
	else
		console.log('There\'s something here!');
});