function showPage(index,total){
	var _page='<li class="page-item active" data-page="'+index+'"><a>'+index+'</a></li>';
	for(var i=1;i<=3;i++){
		var _min=index-i,_max=index+i;
		if(_min>1){
			_page='<li class="page-item" data-page="'+_min+'"><a>'+_min+'</a></li>'+_page;
		}
		if(_max<total){
			_page=_page+'<li class="page-item" data-page="'+_max+'"><a>'+_max+'</a></li>';
		}
	}

	if(index-3>1){
		_page='<li><span>···</span></li>'+_page;
	}

	if(index+3<total){
		_page=_page+'<li><span>···</span></li>';
	}

	if(index>1){
		_page='<li class="page-item" data-page="1"><a>1</a></li>'+_page;
	}
	if(index<total){
		_page=_page+'<li class="page-item" data-page="'+total+'"><a>'+total+'</a></li>';
	}

	return '<ul class="page-list">'+_page+'</ul>';
}