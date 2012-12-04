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
var bg;
var dataInfo = false,
	active = false;
var companiesSimilar = [];


function init(){
	$('.info').hide();
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
	var buffer = 0;
	$('td').each(function(){
		items.length = 0;
		var $this = $(this);
		for(var i = 0; i<binder.length;i++){
			if($this.attr("class") === binder[i].getFinancial() && $this.closest("tr").attr("class") === binder[i].getBusiness()){
				 if ($this.find('ul').length > 0){
					if(buffer <=2){
						items.push('<li>'+binder[i].getName()+'</li>');
						buffer++;
					}
					else if(buffer === 3){
						items.push('<li class = "more">more..</li>');
						buffer++;
					}
				 }
				 else{
						$this.append("<ul></ul>");
						items.push('<li>'+binder[i].getName()+'</li>');
						buffer++;
				 }
			}
		}
		$this.find('ul').append(items.join(''));
		buffer = 0;
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
  active = false;
  $("tr td").each(function() {
	var orig = $.data(this, 'css');
	$(this).animate({opacity: orig.opacity, width: orig.width, height: orig.height}, 600);
  });
	$('.heading h2').animate({
		fontSize:"22px",
		marginLeft:"250px"
	},1000);
	$('div.y-axis img').animate({
			width: "39px",
			height: "389px",
			marginTop: "80px"
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
		fontSize:"16px",
		marginLeft:"160px"
	},1000);
	$('div.y-axis img').animate({
			width: "25px",
			height: "260px",
			marginTop: "-80px"
	},1000);
};

function clearContent(){
	$('td').each(function(){
		$(this).html('');
	});
};

function listenToMax(){
	$li = $("ul li");
	$siblings = $('.siblings');
	$info = $('.info');
	$('td').click(function(){
	// if($(this).html() === '')
	//	$('.warning').fadeIn('700').css("display","inline").fadeOut('200');
	if(!active){
		bg = $(this).css('backgroundColor');
		$info.css('backgroundColor',bg);
	}
	active = true;
});

	$li.click(function(){
		var selection = $(this).text();
		clearContent();
		shrink();

		$('.info').show().animate({
			opacity: 1,
			width:"30%",
			height:"200px"
		},1000);
		$('.pick').html(selection);
		$('.child').show().animate({
		opacity: 1,
		width:"400px",
		height:"300px"
	},1000).html(
	"<p>Company Profile</p><p>"+selection+"</p>"+"<h3>Rating:<h3><span>BBB</span>"+
	"<br>"+"<h3>Outlook:</h3><span>Positive</span><br><h3>Property</h3><br><h3>Subsector</h3>"
	);
	extract($(this).parent());
	// $('#tableSection').fadeIn(400);

	});
	//	$(window).click(function(e) {
	//	if(e.srcElement.className != 'info')// then e.srcElement.className has the class
	//		restore();
	// });

};
listenToMax();

$('img.closeBtn').click(function(){
	restore();
	renderContent();
	listenToMax();
	$('.info').animate({
		opacity:0
	},1000);
	companiesSimilar.length = 0;
});

function extract(val){
	$(val).find('li').each(function(){
		companiesSimilar.push($(this).text());
	});
};

function insert(that){
	var content = "<p>List of Companies in Similar State</p>"
	content +="<ul>";
	for(var i = 0; i<companiesSimilar.length;i++){
		content+="<li class = 'compSimilar'>"+companiesSimilar[i]+"</li>";
	}
	content += "</ul>";
	that.html(content);
};
