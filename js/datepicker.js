(function(){
	var datepicker={};
	datepicker.getMonthDate=function(year,month){
		var ret=[];

		if(month===0){
			month=12;
			year--;
		}

		if(!year||!month){
			var today=new Date();
			year=today.getFullYear();
			month=today.getMonth()+1;
		}

		var firstDay=new Date(year,month-1,1);
		var firstDayWeekDay=firstDay.getDay();
		firstDayWeekDay=firstDayWeekDay==0?7:firstDayWeekDay;

		var lastDayOfLastMonth=new Date(year,month-1,0);
		var lastDateOfLastMonth=lastDayOfLastMonth.getDate();

		var preMonthDayCount=firstDayWeekDay-1;

		var lastDay=new Date(year,month,0);
		var lastDate=lastDay.getDate();

		for(var i=0;i<7*6;i++){
			var date=i+1-preMonthDayCount;
			var showDate=date;
			var thisMonth=month;
			//上一月
			if(date<=0){
				thisMonth=month-1;
				showDate=lastDateOfLastMonth+date;
			}else if(date>lastDate){
				//下一月
				thisMonth=month+1;
				showDate=showDate-lastDate;
			}

			thisMonth=thisMonth==0?12:thisMonth==13?1:thisMonth;

			ret.push({
				month:thisMonth,
				date:date,
				showDate:showDate
			});
		}

		return {ret:ret,month:firstDay.getMonth()+1,year:firstDay.getFullYear()};
	}

	datepicker.buildUi=function(config){
		config=config||{};
		var data=this.getMonthDate(config.year,config.month);
		var monthDate=data.ret;
		var picker='<div class="ui-datepicker-header">'
							+'<a class="ui-datepicker-btn ui-datepicker-pre" data-month="'+(data.month-1)+'" data-year="'+data.year+'">&lt;</a>'
							+'<a class="ui-datepicker-btn ui-datepicker-next" data-month="'+(data.month+1)+'" data-year="'+data.year+'">&gt;</a>'
							+'<span>'+data.year+'-'+data.month+'</span>'
						+'</div>'
						+'<div class="ui-datepicker-body">'
							+'<table>'
								+'<thead>'
									+'<tr>'
										+'<th>一</th>'
										+'<th>二</th>'
										+'<th>三</th>'
										+'<th>四</th>'
										+'<th>五</th>'
										+'<th>六</th>'
										+'<th>日</th>'
									+'</tr>'
								+'</thead>'
								+'<tbody>';
		for(var i=0;i<monthDate.length;i++){
			if(i%7==0){
				picker+='<tr>';
			}
			
			var _class='';
			if(monthDate[i]['date']<monthDate[i]['showDate']){
				_class='preMonth';
			}else if(monthDate[i]['date']==monthDate[i]['showDate']){
				_class='thisMonth';
			}else if(monthDate[i]['date']>monthDate[i]['showDate']){
				_class='nextMonth';
			}
			picker+='<td class="'+_class+'" data-month="'+data.month+'" data-year="'+data.year+'" data-day="'+monthDate[i]['date']+'">'+monthDate[i]['showDate']+'</td>';

			if(i%7==6){
				picker+='</tr>';
			}
		}
		picker+='</tbody></table>';
		if(!!config.showtime){
			var date = new Date();
			var hours=date.getHours();
			var minutes= date.getMinutes()
            var seconds=date.getSeconds();
            picker+='<div class="ui-datepicker-time">'
						+'<span class="ui-input-group">'
							+'<input type="number" id="hours" value="'+hours+'" min="0" max="23">'
						+'</span>'
						+'<span class="ui-group-span">:</span>'
						+'<span class="ui-input-group">'
							+'<input type="number" id="minutes" value="'+minutes+'" min="0" max="59">'
						+'</span>'
						+'<span class="ui-group-span">:</span>'
						+'<span class="ui-input-group">'
							+'<input type="number" id="seconds" value="'+seconds+'" min="0" max="59">'
						+'</span></div>';
		}
		picker+='</div>';

		return picker;
	}

	datepicker.init=function(config){
		config=config||{};
		var clas='.datepicker';
		var picker=datepicker.buildUi(config);

		var _wrapper=document.createElement('div');
		_wrapper.className='ui-datepicker-wrapper';
		_wrapper.innerHTML=picker;

		document.body.appendChild(_wrapper);

		var _input=document.querySelectorAll(clas);

		_wrapper.addEventListener('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			var _target=e.target;
			if(_target.classList.contains('ui-datepicker-btn')){
				var _picker='';
				var _month=parseInt(_target.dataset.month);
				var _year=parseInt(_target.dataset.year);
				_picker=datepicker.buildUi({year:_year,month:_month,showtime:config.showtime});
				_wrapper.innerHTML=_picker;
			}
			return false;
		},false);

		_wrapper.addEventListener('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			var _target=e.target;
			if(_target.tagName.toLowerCase()=='td'){
				var _month=parseInt(_target.dataset.month);
				var _year=parseInt(_target.dataset.year);
				var _day=parseInt(_target.dataset.day);
				
				var date=new Date(_year,_month-1,_day);

				var _inputValue=formatDate(date);

				_inputValue=config.showtime==true?_inputValue+' '+document.getElementById("hours").value+':'+document.getElementById("minutes").value+':'+document.getElementById('seconds').value:_inputValue;

				document.querySelector('.ui-input-focus').value=_inputValue;

				_wrapper.classList.remove('ui-datepicker-show');
				document.querySelector('.ui-input-focus').classList.remove('ui-input-focus');
			}
			return false;
		},false);

		for(var i=0;i<_input.length;i++){
			_input[i].addEventListener('focus',function(){
				var _old_focus=document.querySelector('.ui-input-focus');
				if(_old_focus!=null){
					_old_focus.classList.remove('ui-input-focus');
				}

				this.classList.add('ui-input-focus');
				_wrapper.classList.add('ui-datepicker-show');
				var _left=this.offsetLeft;
				var _top=this.offsetTop+this.offsetHeight;
				_wrapper.style.left=_left+'px';
				_wrapper.style.top=_top+'px';
			},false);

			// _input[i].addEventListener('blur',function(){
			// 	_wrapper.classList.remove('ui-datepicker-show');
			// 	this.classList.remove('ui-input-focus');
			// },false);
		}

	}
	function formatDate(date){
		function doubleMath(num){
			return num<10?'0'+num:num;
		}
		return date.getFullYear()+'-'+doubleMath(date.getMonth()+1)+'-'+doubleMath(date.getDate());
	}

	window.datepicker=datepicker;
})();