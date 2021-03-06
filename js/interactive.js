function reit_comp(name, financial, business, sector){
	this.name = name,
	this.financial = financial,
	this.business = business,
	this.sector = sector;
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
	},
	getSector: function(){
		return this.sector;
	},
	setSector: function(sector){
		this.sector = sector;
	}

};

$.ajaxSetup({
	async: false
});
var binder = [];
$.getJSON('ajax/reit_data.json', function(data) {
		$.each(data, function(){
			var key;
			for(key in this['Sector']){
				if(this['Sector'][key] === 'true'){
					break;
				}
			}
			binder.push(new reit_comp(this['Company Name'], this['Financial Risk Profile'], this['Business Risk Profile'], key));
		});
});
var bg, selectedOption = 'All', priorText;
var dataInfo = false,
	active = false;
var companiesSimilar = [];
var finRisk = bizRisk = ' ';
var selection;


init();

$("td").each(function() {
	var $this = $(this);
	$.data(this, 'css', { opacity: $this.css('opacity'),
						  width: $this.css('width'),
						  height: $this.parent().css('height') });
});

$('img.closeBtn').click(function(){
	if(active){
		restore();
		if(selectedOption == 'All')
			renderContent();
		else
			generateOption();
		$('.expand').animate({
			opacity:0,
			visibility:"hidden"
		},1000);
		$('.expand').css("visibility","hidden");
		$('.info').animate({
			opacity:0
		},1000);
		$('.info').css("visibility","hidden");
		$('.category').css("visibility","hidden");
		companiesSimilar.length = 0;
		$('.content').html('');
		$('img.back').detach();
	}
});

$('.btn-group > button.btn').click(function(){
	selectedOption = $(this).text();
	if(priorText != selectedOption && selectedOption !== 'All')
		generateOption();
	else if(priorText != selectedOption && selectedOption == 'All')
		renderContent();
	priorText = $(this).text();
});

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
	clearContent();
	$('td').each(function(){
		items.length = 0;
		var $this = $(this);
		getParamters($this);
		for(var i = 0; i<binder.length;i++){
			if(finRisk === binder[i].getFinancial() && bizRisk === binder[i].getBusiness()){
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
	listenToMax();
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
		if(!active){
			bg = $(this).css('backgroundColor');
			$info.css('backgroundColor',bg);
			$('.expand').css('backgroundColor',bg);
		}
		active = true;
	});
	$('li').click(function(){
		selection = $(this).text();
		finRisk = $(this).closest('td').attr("class");
		bizRisk = $(this).closest('tr').attr("class");
		if(selection === "more.."){
			groupCompanies();
			$('.expand').css("visibility","visible").show().animate({
				opacity: 1,
				width:"35%",
				height:"310px"
			},500);
		}
		else{
			$('.expand').css("visibility","hidden");
			$('.info').css("visibility","visible").show().animate({
				opacity: 1,
				width:"30%",
				height:"200px"
			},500);
			finRisk = (finRisk === 'highly_leveraged')?'highly  leveraged':finRisk;
			$('.category').css("visibility","visible").html("<p>"+finRisk+" & "+bizRisk+"</p>");
			$('.pick').html(selection);
		}
		clearContent();
		shrink();
		});
};

function restore() {
  active = false;
  $("tr td").each(function() {
	var orig = $.data(this,'css');
	$(this).animate({opacity: orig.opacity, width: orig.width, height: orig.height}, 600);
  });

	$('.heading h2').animate({
		fontSize:"22px",
		marginLeft:"380px"
	},1000);
	$('div.y-axis img').animate({
			width: "39px",
			height: "389px",
			marginTop: "0px"
	},1000);
	$('.optionSection').show();
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
	$('.optionSection').hide();
};

function getParamters(that){
		finRisk = that.attr('class');
		bizRisk = that.closest("tr").attr('class');
};

function extract(val){
	$(val).find('li').each(function(){
		companiesSimilar.push($(this).text());
	});
};
function generateOption(){
	var items = [];
	var buffer = 0;
	clearContent();
	$('td').each(function(){
		items.length = 0;
		var $this = $(this);
		getParamters($this);
		for(var i = 0; i<binder.length;i++){
			if(finRisk === binder[i].getFinancial() && bizRisk === binder[i].getBusiness() && binder[i].getSector() === selectedOption){
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
	listenToMax();
};
function groupCompanies(){
	for(var i = 0; i<binder.length;i++){
			if(finRisk === binder[i].getFinancial() && bizRisk === binder[i].getBusiness()){
				companiesSimilar.push("<li>"+binder[i].getName()+"</li>");
			}
	}
	insert();
	$('.content li').click(function(){
	var selection = $(this).text();
	$('.expand').animate({
		opacity: 0.6
	},500);
	$('.info').css("visibility","visible").show().animate({
			opacity: 1,
			width:"30%",
			height:"200px"
		},500);
	$('.category').css("visibility","visible");
		$('.pick').html(selection);
	});
};

function insert(){
	var content = " ";
	content +="<ul>";
	for(var i = 0; i<companiesSimilar.length;i++){
		content+="<li class = 'compSimilar'>"+companiesSimilar[i]+"</li>";
	}
	content += "</ul>";
	$('.content').html(content);
	$('.info div').append('<img src="img/back_2.png" alt="" class="back" width="30px" height="20px">');
	$('img.back').click(function(){
	$('.info').animate({
			opacity:0
		},1000);
	$('.expand').css("opacity",1);
	$('.info').css("visibility","hidden");
	$('.category').css("visibility","hidden");
});
};

