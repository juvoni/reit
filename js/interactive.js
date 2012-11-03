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
	renderContent();
};

function renderContent(){
	var items = [];
	$('td').each(function(){
		items.length = 0;
		var $this = $(this);
		for(var i = 0; i<binder.length;i++){
			if($this.attr("class") === binder[i].getFinancial() && $this.closest("tr").attr("class") === binder[i].getBusiness()){
				 if ($this.find('ul').length > 0){
					items.push('<li>'+binder[i].getName()+'</li>');
				 }
				 else{
					$this.append("<ul></ul>");
					items.push('<li>'+binder[i].getName()+'</li>');
				 }
			}
		}
		$this.find('ul').append(items.join(''));
	});
};

init();

$("td").each(function() {
    var $this = $(this);
    $.data(this, 'css', { opacity: $this.css('opacity'), 
                          width: $this.css('width'),
                          height: $this.parent().css('height') });
});


 function restore() {
  $("tr td").each(function() {
    var orig = $.data(this, 'css');
    $(this).animate({opacity: orig.opacity, width: orig.width, height: orig.height}, 600);
  });
	$('h2').animate({
		fontSize:"22px"
	},1000);
	$('div.y-axis').animate({
		marginTop:"300px"
	},1000);
};

function shrink(){
	$('#canvas tr').animate({
			height: "30px"
		},1000);

	$('td').animate({
		width: "70px",
		height: "30px"
	},800);
	$('h2').animate({
		fontSize:"12px"
	},1000);
	$('div.y-axis').animate({
		marginTop:"100px"
	},1000);
};
function clearContent(){
	$('td').each(function(){
		$(this).html('');
	});
};
var bg;
function listen(){
	$("ul li").click(function(){
		var selection = $(this).text();
		bg = $(this).parent().css('background-color');
		console.log(bg);
		clearContent();
		shrink();
		$('.max').show();
		$('.siblings').show().animate({
		opacity: 1,
		width:"350px",
		height:"300px"
	},1000).html(
	"<p>List of Companies in Similar State</p>"
	).css('backgroundColor',bg);
		$('.child').show().animate({
		opacity: 1,
		width:"450px",
		height:"300px"
	},1000).html(
	"<p>Company Profile</p><br><p>"+selection+"</p>"
	);
	});
};
listen();

$('td').click(function(){
	if($(this).html() === '')
		$('.warning').fadeIn('700').css("display","inline").fadeOut('200');
});
$('.max').click(function(){
	restore();
	renderContent();
	listen();
	$('.max').hide();
	$('.siblings').html('').hide();
	$('.child').html('').hide();

});

