Pace.on("done", function (){
	$("#main").fadeIn(1000);
	});
// JavaScript Document
$(document).ready(function() {
	BuildCheckbox()
	ReadSettings();
	Getsettings();	//获取设置
	Zhilist();		//把封面的纸张列表给内页
	Init();
	Result();

$("#contract .editable").editable({
			editby: "click",
			type: "text",
			submitBy: "blur",
/*			onSubmit:function(){}*/
			});

			
			
//保存历史记录对话框显示的时候
$('#myModal').on('shown.bs.modal', function () {
		$("#customer").val("");
		$("#price").val($("#danjia_num").text());
		$("#note").val("");
		$("#guige").text(showname());
    $('#customer').focus();
  })
 
//历史记录保存对话框保存按钮
$("#history_submit").on( "click", function() {
      addUser();
    });

//修改总价后改变人民币大写
$("body").on( "blur","#hkze input", function() {
	HetongPrice($(this).val().GetNum());
	PriceEditable();
    });


//载入配置文件上传按钮
$("#LoadFileBtn").on( "click", function() {
      $("#LoadFileBox").trigger("click");
    });

//载入配置文件选择文件以后
$("#LoadFileBox").on( "change", function() {
		 var file=document.getElementById("LoadFileBox").files[0].name;
      $("#LoadFileInput").val(file);
	  var filename=file.substr(0,file.lastIndexOf('.')); 
	  $("#LoadConfigName").val(filename);
    });

//载入配置对话框确定按钮
$("#btn_LoadConfig").on( "click", function() {
	var file=document.getElementById("LoadFileBox").files[0];
	var reader=new FileReader();
	reader.readAsText(file);
	reader.onload=function(f){
		$("#config_select").append("<option value='"+ this.result +"'>"+$("#LoadConfigName").val()+"</option>");
		CheckMenuStatus();
		$('#config_select').selectmenu();
		SaveConfigList();	//保存配置列表
		}

	$("#Modal_LoadConfig").modal('hide');
    });

//保存配置文件按钮
$('#Modal_SaveConfig').on('shown.bs.modal', function () {
    $('#ConfigName').focus();
  })

//保存配置文件对话框确定按钮
$("#btn_SaveConfig").on( "click", function() {
	var title=$("#ConfigName").val();
      SaveConfig(title);
	  $("#config_select option").eq(0).attr('selected', 'true');
	  $('#config_select').selectmenu();
	  SaveConfigList();	//保存配置列表
	  $("#Modal_SaveConfig").modal('hide');
    });

//替换当前配置文件对话框出现时
$('#Modal_SaveThisConfig').on('shown.bs.modal', function () {
		$("#label_savethisconfig").text("当前的设置将会保存到["+$('#config_select option:selected').text()+"]");
  })

//替换配置文件对话框确定按钮
$("#btn_SaveThisConfig").on( "click", function() {
	  $('#config_select option:selected').val(MakeConfig());
	  $("#Modal_SaveThisConfig").modal('hide');
	  SaveConfigList();	//保存配置列表
	  Messenger().post({
		message: "已保存到 "+$('#config_select option:selected').text(),
		hideAfter: 3,
		id: "Only-one-message"
	});
    });


//下载配置文件对话框打开
$('#Modal_DownConfig').on('shown.bs.modal', function () {
    $("#downform_filename").val($("#config_select option:selected").text());
  })
  
//下载配置文件对话框确定按钮
$("#btn_DownConfig").on( "click", function() {
	$("#downform_data").val($("#config_select").val());
	$("#downconfig_form").submit();
	$("#Modal_DownConfig").modal('hide');
    });

//载入默认配置文件对话框
$("#btn_LoadDefaultConfig").on( "click", function() {
		LoadConfig(DefaultConfig());
		$("#company_title").css({"background": "url(../images/logo.png) 10px center no-repeat" });
		$("#company_title").text("");
	  $("#Modal_LoadDefault").modal('hide');
    });


//删除配置文件对话框
$("#btn_DelConfig").on( "click", function() {
		$("#config_select option").eq($("#config_select").get(0).selectedIndex).remove();
		$('#config_select').selectmenu();
		CheckMenuStatus();	//检查配置菜单中灰色按钮状态
		SaveConfigList();	//保存配置列表
	  $("#Modal_DelConfig").modal('hide');
    });
	

//切换配置文件
$("#config_select").on('change', function() {
	$('#Modal_ChangeConfig').modal({
		keyboard: true
		});
});
//切换配置文件对话框
$("#btn_ChangeConfig").on( "click", function() {
	$("#Modal_ChangeConfig").modal('hide');
	LoadConfig($("#config_select").val());
	Refresh();
	Messenger().post({
		message: "切换配置文件成功",
		hideAfter: 1,
		id: "Only-one-message"
	});
    });



	
//	添加历史记录
	function addUser() {
		var customer=$("#customer").val();
		var price=$("#price").val();
		var note=$("#note").val();
		var mydate = new Date();
		var thetime=mydate.toLocaleString();
		$("#history_list").prepend($("#blank_history").html());
		if(customer==""){customer="报价"}
		$("#history_list a:first").hide();
		$("#history_list a:first").find(".name").text(customer);
		$("#history_list a:first").find(".price").text(price);
		$("#history_list a:first").find(".total").text(Wtotal);
		$("#history_list a:first").find(".lirun").text(Wlirun);
		$("#history_list a:first").find(".content").text(showname());
		$("#history_list a:first").find(".note").text(note);
		$("#history_list a:first").find(".time").text(thetime);
		SaveHistoryList();
		$("#myModal").modal('hide');
	 	jQuery.sidr('open','history_panel',function(){
			$("#history_list a:first").slideDown(1000);
		});
		$("#history_list a:first").slideDown(1000);
		//$("#history_list a:first").slideDown("fast");
        
    }

//点击价格弹出详情
$("#history_list").on("click","button.pricebtn", function(){
	var total=$(this).parents("a").find(".total").text();
	var lirun=$(this).parents("a").find(".lirun").text();

	Messenger({extraClasses:"messenger-fixed messenger-on-top messenger-on-right"}).post({
	  message: "总价："+total+" 利润："+lirun,
	  hideAfter: 3,
	  showCloseButton: true,
	  hideOnNavigate: true,
	  id: "Only-one-message"
	});
});


//点击x删除一条历史记录
$("#history_list").on("click","button.close", function(){
	$(this).closest("a").slideUp("slow",function(){
   $(this).closest("a").remove();
   SaveHistoryList();
 });
	
});

//打印合同
$("#PrintContract").on("click", function(){
	$("#contract .modal-body").print();
});
	
//点击价格表打印按钮时
$("#printtable").on("click", function(){
	$("#alltable").print();
});
//价格表鼠标移动时加亮行和列
$("#alltable").on("mouseover","td", function(){
	 $(this).siblings().addClass("tdhover");
	 //$(this).parent("tr").siblings().eq($(this).index()).addClass("tdhover");
	 var ii=$(this).index();
	 $(this).parents("tbody").find("tr").each(function(){
   $(this).find("td").eq(ii).addClass("tdhover");
 });
	 $(this).addClass("tdnow");
});
$("#alltable").on("mouseout","td", function(){
	 $(this).siblings().removeClass("tdhover");
	 var ii=$(this).index();
	 $(this).parents("tbody").find("tr").each(function(){
   $(this).find("td").eq(ii).removeClass("tdhover");
 });
	 $(this).removeClass("tdnow");
});
$("#PriceList").click(function (){
	CreatPricelist();
	//$("#alltable").show();
	});
	//左面板滑动
  $('#setting').sidr({
      name: 'left_panel',
      side: 'left', // By default
	  body:'body',
    });
	//历史记录面板滑动
  $('#history').sidr({
      name: 'history_panel',
      side: 'right', // By default
	  displace:'true',
	  body:'main',
    });
	//报价单面板滑动
  $('#PriceList').sidr({
      name: 'alltable',
      side: 'right', // By default
	  displace:'true',
	  body:'main',
    });
//左侧滑动面吧关闭按钮	
$("#close-left").on("click", function(){
	 jQuery.sidr('close','left_panel');
});
//提示框配置
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom',
    theme: 'air'
}
//保存按钮
/*$("#save").on("click", function(){
	Messenger().post({
	  message: "保存",
	  hideAfter: 3,
	  showCloseButton: true,
	  hideOnNavigate: true,
	  id: "Only-one-message"
});
});*/
//关闭价格表按钮
$("#close-pricelist").on("click", function(){
	 jQuery.sidr('close','alltable');
});
//关闭历史记录按钮
$("#close-history").on("click", function(){
	 jQuery.sidr('close','history_panel');
});


	//左面板收起样式
	$( "#left_panel" ).accordion({ 
	header: "h3",
	heightStyle:"content"
	 });
	 
//纸价tabs
$( "#tabs" ).tabs({
	event: "click",
	heightStyle: "content"
	});	 
//纸重tabs
$( "#tabs-weight" ).tabs({
	event: "click",
	heightStyle: "content"
	});	
//复选框样式
$('#calc_panel input').iCheck({
    checkboxClass: 'icheckbox_square-aero',
    radioClass: 'iradio_square-aero',
    increaseArea: '20%' // optional
  });
//拍照难度
$( "#plv" ).text("易");
$( "#pl" ).slider({
	animate:true,
      range: "min",
      value: 1,
      min: 1,
      max: 3,
      slide: function( event, ui ) {
		  var x;
		  switch(ui.value)
			{
			case 2:
			x="中";
			  break;
			case 3:
			x="难";
			  break;
			default:
			 x="易";
			}
		 $( ".ui-slider-handle" ).text(x);
		 Result();
      }
	});  
	  $( ".ui-slider-handle" ).text("易");

//计算器选项改变时
$("#calc_panel input,#calc_panel select").on('ifChanged change', function() {
  Result();
  if($("#alltable").css("display")=="block"){
	CreatPricelist();
	}
});

//点击鼠标移到价格上显示保存按钮
$("div.total_rightbox").on('mouseover', function() {
	$("#pricesave").show();
});
$("div.total_rightbox").on('mouseout', function() {
	$("#pricesave").hide();
});

$("#pricesave").on('click', function() {
	$("#save").trigger("click");
});

//设置改变时
$("#left_panel input").on('change',function() {
	Refresh();
	Messenger().post({
		message: "保存成功",
		hideAfter: 1,
		id: "Only-one-message"
	});
});



//点击烫金展开
$("#stj").on('ifClicked', function() {
	if($("#stj").is(":checked")){
		$("#sgtj_d").slideDown("slow");
		} else {
			$("#sgtj_d").slideUp("slow");
			}
	
});

//点击UV展开
$("#suv").on('ifClicked', function() {
	if($("#suv").is(":checked")){
		$("#sguv_d").slideDown("slow");
		} else {
			$("#sguv_d").slideUp("slow");
			}
	$("#sguv_d").slideToggle("slow");
});

//鼠标划过高亮
$(".group").on('mouseover', function() {
	$(this).addClass("orange");
});
$(".group").on('mouseout', function() {
	$(this).removeClass("orange");
});
//数量增加
$("#num").spinner({
  min:500,
  max:50000,
  step:500,
  change:function(event, ui) {
    Result();
  },
  spin:function(event, ui) {
    Result();
  }
});
//页码增加
$("#p").spinner({
  min:8,
  max:800,
  step:4,
  change:function(event, ui) {
	var x=$("#neiye").val();
	var i=$("#p").val();
    if (i % 4 !== 0) {
      $(this).spinner("value", 8);
    }
	CheckPics();//按页数预计照片数量
	CheckZD();
    Result();
  },
  spin:function(event, ui) {
	 var x=$("#neiye").val();
	var i=$("#p").val();
	CheckPics();//按页数预计照片数量
	CheckZD();
    Result();
  }
});
//里程增加
$("#far").spinner({
  min:0,
  max:50,
  step:1,
  change:function(event, ui) {
    Result();
  },
  spin:function(event, ui) {
    Result();
  }
});

//照片数量
$("#pnum").spinner({
  min:0,
  max:1000,
  step:10,
  change:function(event, ui) {
    Result();
  },
  spin:function(event, ui) {
    Result();
  }
});


//滑动解锁
var lock = new PatternLock("#patternContainer",{
    onDraw:function(pattern){
        if(pattern==spassword){
			Messenger().post({
				type:"info",
			  message: "解锁成功",
			  hideAfter: 3,
			  showCloseButton: true,
			  hideOnNavigate: true,
			  id: "Only-one-message"
			});
			lock.reset();
			$("#detailpad").fadeIn("slow");
			$("#patternContainer").hide();
		} else {
			//lock.reset();
			Messenger().post({
				type:"error",
				message: "密码错误",
				hideAfter: 3,
				showCloseButton: true,
				hideOnNavigate: true,
				id: "Only-one-message"
			});
			lock.error();
			}
    }
});
/*lock.checkForPattern('12369',function(){
	lock.reset();
    //$("#div_ys").css("visibility","visible");
	$("#detailpad").fadeIn("slow");
	$("#patternContainer").hide();
	
},function(){
    lock.reset();
}); */

//加锁
$("#coverthis img").click(function (){
	$("#detailpad").hide();
	$("#patternContainer").fadeIn("slow");
	});

//自动评估照片数量
$("#auto_pic").click(function (){
	CheckPics();
	Result();
	});


//快速选择纸张类型
$("#AreaFm .Qpage li,#AreaNy .Qpage li").click(function(e) {
	$(this).parents(".Qpage").prevAll("select").selectmenu("value",$(this).attr("rel"));
	CheckZD();
});
//快速选择数量
$("#AreaNum .Qpage li").click(function(e) {
	$("#AreaNum input").val($(this).attr("rel"));
	Result();
});

//快速选择页码
$("#AreaP .Qpage li").click(function(e) {
	$("#AreaP input").val($(this).attr("rel"));
	CheckPics();//按页数预计照片数量
	CheckZD();
	Result();
});


//快速选择鼠标进入
$("#AreaFm,#AreaNy,#AreaNum,#AreaP,#AreaFar").mouseenter(function(e) {
    $(this).find(".Qpage").animate({width:'150px'},"fast");
});
$("#AreaFm,#AreaNy,#AreaNum,#AreaP,#AreaFar").mouseleave(function(e) {
    $(this).find(".Qpage").animate({width:'0'},"fast");
});

//照片清零
$("#zero").click(function (){
	$("#pnum").val(0);//按页数预计照片数量
	Result();
	});
//下拉列表样式
$('#fengmian').selectmenu({
	style:'dropdown',
	icons: [
					{find: '.tbz', icon: 'ui-icon-document'},
					{find: '.sjz', icon: 'ui-icon-image'}
					
				]
});
$('#neiye').selectmenu({
	style:'dropdown',
	icons: [
					{find: '.tbz', icon: 'ui-icon-document'},
					{find: '.sjz', icon: 'ui-icon-image'}
					
				]});
				
$('#config_select').selectmenu({
	style:'dropdown',
	width:'170',
	icons: [
					{find: '.tbz', icon: 'ui-icon-document'},
					{find: '.sjz', icon: 'ui-icon-image'}
					
				]
});

//可选计算结果项目
$("#detailpad input[type=checkbox]").on('switchChange.bootstrapSwitch', function(event, state){
	Result()
	});
//设置展示标题的时候同步显示
$("#stitle").on("change", function(){
		SetTitle();
	});

<!--结束-->
});


//载入配置文件数据
function LoadConfig(data){
	var J=JSON.parse(data);
	$.each( J, function(index, obj){
		$("#"+obj.id+"").val(obj.text);
	});
	SaveSettings();
	SaveConfigList();	//保存配置列表
}


//保存配置文件的列表到本地
function SaveConfigList(){
	var jdata = [];
	$("#config_select option").each(function(i, val) {
		var row = {};
		row.name = $(val).text();
		row.data = $(val).val();
		jdata.push(row);
	});
	localStorage.setItem("ConfigList",JSON.stringify(jdata));
	}

//读取配置文件的列表
function ReadConfigList(){
	var data=localStorage.getItem("ConfigList");
	if (!data){return false;}
	var J=JSON.parse(data);
	$.each( J, function(index, obj){
		$("#config_select").append("<option value='"+obj.data +"'>"+obj.name+"</option>");
	});
	}	

//保存历史记录列表到本地
function SaveHistoryList(){
	var jdata = [];
	$("#history_list a").each(function(i, val) {
		var row = {};
		row.name = $(val).find(".name").text();
		row.price = $(val).find(".price").text();
		row.total = $(val).find(".total").text();
		row.lirun = $(val).find(".lirun").text();
		row.content = $(val).find(".content").text();
		row.note = $(val).find(".note").text();
		row.time = $(val).find(".time").text();
		
		jdata.push(row);
	});
	localStorage.setItem("HistoryList",JSON.stringify(jdata));
	}

//读取配置文件的列表
function ReadHistoryList(){
	var data=localStorage.getItem("HistoryList");
	if (!data){return false;}
	
	var J=JSON.parse(data);
	
	$.each( J, function(index, obj){
		
		$("#history_list").prepend($("#blank_history").html());
		if(customer==""){customer="报价"}
		$("#history_list a:first").find(".name").text(obj.name);
		$("#history_list a:first").find(".price").text(obj.price);
		$("#history_list a:first").find(".total").text(obj.total);
		$("#history_list a:first").find(".lirun").text(obj.lirun);
		$("#history_list a:first").find(".content").text(obj.content);
		$("#history_list a:first").find(".note").text(obj.note);
		$("#history_list a:first").find(".time").text(obj.time);
	});

	}
	
	
//根据页码估计照片数量
function CheckPics(){
	$("#pnum").val(($("#p").val()-3)*spzp);//按页数预计照片数量
	}
//根据纸张和页码计算装订方式
function CheckZD(){
	$("input[id='"+GetidfromZd(ChangeZD($("#neiye").val(),$("#p").val()))+"']").iCheck('check');
	}

//让合同总价内容可编辑
function PriceEditable(){
	$("#hkze").editable({
			editby: "click",
			type: "text",
			submitBy: "blur",
/*			onSubmit:function(){}*/
			});
	}

//计算器初始值
function Init(){
	$("#fengmian option").eq(4).attr('selected', 'true');
	$("#neiye option").eq(3).attr('selected', 'true');
	CheckPics();//按页数预计照片数量
	SetTitle();		//如果设置了标题，则替换自定义文字
	ReadConfigList();
	CheckMenuStatus();	//检查配置选项里按钮状态
	ReadHistoryList();
	}
//设置展示标题
function SetTitle(){
	if($("#stitle").val()!==""){
		$("#company_title").css({"background": "none"});
		$("#pagelogo").hide();
		$("#company_title").text(stitle);
		document.title=stitle;
	} else {
		$("#company_title").css({"background": "url(../images/logo.png) 10px center no-repeat" });
		$("#pagelogo").show();
		$("#company_title").text("");
			}
	}
function BuildCheckbox(){
	$("#V_ban").bootstrapSwitch({onText:'版费',offText:'无版费',size:'small'});
	$("#V_fm").bootstrapSwitch({onText:'封面',offText:'无封面',size:'small'});
	$("#V_ny").bootstrapSwitch({onText:'内页',offText:'无内页',size:'small'});
	$("#V_mo").bootstrapSwitch({onText:'覆膜',offText:'不覆膜',size:'small'});
	$("#V_zd").bootstrapSwitch({onText:'装订',offText:'不装订',size:'small'});
	$("#V_gy").bootstrapSwitch({onText:'工艺',offText:'无工艺',size:'small'});
	$("#V_df").bootstrapSwitch({onText:'电分',offText:'无电分',size:'small'});
	$("#V_photo").bootstrapSwitch({onText:'照片',offText:'无照片',size:'small'});
	$("#V_kt").bootstrapSwitch({onText:'抠图',offText:'不抠图',size:'small'});
	$("#V_design").bootstrapSwitch({onText:'设计',offText:'无设计',size:'small'});
	$("#V_lr").bootstrapSwitch({onText:'利润',offText:'无利润',size:'small'});
	}



//获取计算器面板输入   p开头
function GetCalcpad(){
	pchicun=$("input[name='chicun']:checked").val();
	pfengmian=$("#left_panel input[id="+$("#fengmian").val()+"]").val()*0.531*$("#fengmian").val().GetNum()/1000/500;		//封面纸张每张价格
	pneiye=$("#left_panel input[id="+$("#neiye").val()+"]").val()*0.531*$("#neiye").val().GetNum()/1000/500;	//内页纸张每张
	wfengmian=$("#left_panel input[id="+$("#fengmian").val()+"w]").val();		//封面纸张每张重量
	wneiye=$("#left_panel input[id="+$("#neiye").val()+"w]").val();	//内页纸张每张重量
	if($("input[name='fumo']:checked").val()!=="smn"){
		pswm=$("#left_panel input[id="+$("input[name='fumo']:checked").val()+"w]").val();	//膜重量 g/㎡
	} else {
		pswm=0;
		}
	shuji=$("#neiye").val()+"sj";
	pnums=$("#num").val();	//数量
	pp=$("#p").val();		//页码
	phb=$("#hb").is(":checked");	//横版
	pgq=$("#gq").is(":checked");	//高清
	pmo=$("#left_panel input[id="+$("input[name='fumo']:checked").val()+"]").val();			//覆膜
	pmoyj=$("#fumo_yj").is(":checked");	//是否油胶
	pzdw=$("input[name='zhuangding']:checked").val();		//装订方式
	if(pzdw=="szq"){
		pswjiao=0.01;
	} else {
		pswjiao=$("#swjiao").val();	//胶重量 g/P	
			}

	pzd=$("#left_panel input[id="+$("input[name='zhuangding']:checked").val()+"]").val();	//装订价格
	ptj=$("#stj").is(":checked");	//烫金
	puv=$("#suv").is(":checked");	//UV
	ptj_n=$("#sgtj_n").val();	//烫金面积
	puv_n=$("#sguv_n").val();	//烫金面积
	pdf=$("#pdf").val();	//电分面积
	ppnum=$("#pnum").val();			//照片数量
	pkt=$("#spkt").val();			//抠图价格
	ppl=$( "#pl .ui-slider-handle" ).text();		//拍照难度
	pway=$("#left_panel input[id="+$("input[name='pway']:checked").val()+"]").val();	//上门价格
	pfar=$("#far").val();		//上门距离
	
	//状态
	V_ban=$("#V_ban").is(":checked");
	V_fm=$("#V_fm").is(":checked");
	V_ny=$("#V_ny").is(":checked");
	V_mo=$("#V_mo").is(":checked");
	V_zd=$("#V_zd").is(":checked");
	V_gy=$("#V_gy").is(":checked");
	V_df=$("#V_df").is(":checked");
	V_photo=$("#V_photo").is(":checked");
	V_kt=$("#V_kt").is(":checked");
	V_design=$("#V_design").is(":checked");
	V_lr=$("#V_lr").is(":checked");

	}

//计算报价
//版费
function Rban(pnum){
	if(!V_ban){return 0;}
	var x=(syq-syz+pnum/1000*syz);
	if(pnum>=3000){x-=10;}
	x*=pp/4;
	if(pgq){
	x+=pp/4*sygq;}
	x=Math.ceil(x);
	return x;
	}
//封面
function Rfm(pnum){
	if(!V_fm){return 0;}
	if(pnum<5000){	//5000本以内加80元损耗，超过翻倍
		sunhao=sys;
		} else {
		sunhao=sys*2;
			}
	var x=Math.ceil((pnum/8+sunhao/8)*pfengmian);  //数量除8等于用纸张数，加上损耗，得出用纸总量再乘每张价格
	x=Math.ceil(x);
	return x;
	}

//内页
function Rny(pnum){
	if(!V_ny){return 0;}
	if(pnum<5000){	//5000本以内加80元损耗，超过翻倍
		sunhao=sys;
		} else {
		sunhao=sys*2;
			}
	var x=Math.ceil(((pp-4)/32*pnum+sunhao*(pp-4)/8)*pneiye);	//P数-封面P，得到内页数量除32等于用纸张数，加上损耗版张数乘以每个版损耗纸数（双面）损耗，得出用纸总量再乘每张价格，再乘以p数比4（每个）
	x=Math.ceil(x);
	return x;
	}

//覆膜
function Rmo(pnum){
	if(!V_mo){return 0;}
	var x=pnum/1000*pmo;	//数量+损耗*膜	
	if(pmoyj){
		x*=smyj;			//油胶加价
	}
	x=Math.ceil(x);		//取整
	return x;
	}

//装订
function Rzd(pnum){
	if(!V_zd){return 0;}
	var x;
	if(pzdw=="szq"){
		//骑马钉
		x=pzd*pp/4*pnum;
		} else {
		//胶装
		x=pzd*pnum;
			}
	if(phb){x*=szhb;}
	x=Math.ceil(x);
	
	return x;
	
	}
//烫金UV工艺
function Rgy(pnum){
	if(!V_gy){return 0;}
	var x=0;
	if(ptj){
		x+=ptj_n*sgtj*pnum;
		x+=Number(sgtjbf);
		}
	if(puv){
		x+=puv_n*sguv*pnum;
		x+=Number(sguvbf);
		}
	return x;
	}
//电分价格
function Rdf(){
	if(!V_df){return 0;}
	var x=0;
	if(pdf!=="0"){
		x=spdf*pdf;
	}
	return x;
	}
//设计费	
function Rsj(){
	if(!V_design){return 0;}
	var x;
	if (pp<=52){
		x=$("#left_panel input[id=sd"+pp+"p]").val();
		} else {
		x=$("#left_panel input[id=sdmore]").val();
			}
	x*=pp;
	return x;
	}
//拍照费
function Rphoto(){
	if(!V_photo){return 0;}
	var x;
	var y;
	x=ppnum*pway;
	switch(ppl)
			{
			case "中":
			y=spznd/100+1;
			  break;
			case "难":
			y=spgnd/100+1;
			  break;
			default:
			 y=1;
			} 
	x*=y;	//拍照价格
	x+=Number(spq);	//加起步价
	x+=pfar*spc;		//差旅费
	if(x<spq){x=spq;}
	if(ppnum=="0"){x=0;}
	return Math.ceil(x);
	}
//抠图费	
function Rkt(){
	if(!V_kt){return 0;}
	var x;
	x=pkt*ppnum;
	return x;
	}	
//产品重量
function Rweight(){
	x=(0.42*0.285*wfengmian+(0.42*0.285*wneiye)*((pp-4)/4)+0.42*0.285*pswm+pswjiao*pp)*pnums;
	return x;
	}
//书脊厚度
function Rshuji(){
	x=arr_shuji[shuji]*(pp-4)/2+1;
	//x=(pp-4)/2*0.001346*arr_shuji[shuji];
	if(pzdw!=="szq"){
		return x.toFixed(1);
	} else {
		return false;
		}
	
	}
function Getprice(pnum){
	if(pzdw=="szq"){
		sys=$("#sys").val();
		} else{
		sys=$("#sys2").val();
			}
	
	Wban=Rban(pnum);	//版费
	Wfm=Rfm(pnum);		//封面
	Wny=Rny(pnum);		//内页
	Wmo=Rmo(pnum);		//覆膜
	Wzd=Rzd(pnum);		//装订
	Wsj=Rsj();		//设计
	Wdf=Rdf();		//电分
	Wkt=Rkt();		//抠图
	Wgy=Rgy(pnum);		//烫金工艺
	Wphoto=Rphoto();	//拍照价格
	Wshuji=Rshuji();	//书脊厚度
	Wweight=parseInt(Rweight()/1000);	//重量
	WYSF=Wban+Wfm+Wny+Wmo+Wzd;	//印刷总费:版费+封面+内页+覆膜+装订
	if(pchicun=="c32"){WYSF=parseInt(WYSF*sy32k);}
	WYSLR=0;
	if(V_lr){WYSLR=Math.ceil(WYSF*syl/100);}	//印刷利润
	Wall=WYSF+WYSLR+Wkt+Wsj+Wphoto+Wgy+Wdf;
	Wtotal=parseInt((Wall+Wall*syywtc+Wall*sysjstc)*0.1)*10;
	Wdanjia=(Wtotal/pnum).toFixed(2);	//总价：印刷费+印刷利润+设计费+抠图+拍照+工艺+电分 除以数量=单价
	Wpaizhao=Wdf+Wphoto+Wkt;
	
	Wlirun=Wsj+WYSLR;		//总利润：设计费+印刷利润
	return Wdanjia;
	}

//更新合同价格
function HetongPrice(price){
	//更新合同上价格
	$("#pagetitle").text(sname+"业务合同");
	$("#hkze").text("￥"+price+"元");//货款总额
	var dingjin=parseInt(price*sysf/100)*100;
	$("#dj,#sf").text("￥"+dingjin+"元");//定金
	var yufu=parseInt(price*syzf/100)*100;
	$("#yqyf,#dg").text("￥"+yufu+"元");//印前预付
	$("#yk").text("￥"+(price-dingjin-yufu)+"元");//尾款
	$("#dx").text(upDigit(price));//人民币大写
	if(!syzf){		//印前再付为0则隐藏相关条款
		$("#zftext").hide();
		} else {
		$("#zftext").show();
			}
	
	if(!sysf){		//货款首付为0则隐藏相关条款
		$("#sftext").hide();
		} else {
		$("#sftext").show();
			}
	}


function Result(){
	GetCalcpad();		//获取计算器面板内容
	Getprice(pnums);			//计算价格
	
	//累计价格;
	
	$("#cbf_n").text(Wban);	//版费
	$("#cfm_n").text(Wfm);	//封面
	$("#cny_n").text(Wny);	//内页
	$("#cmo_n").text(Wmo);	//覆膜
	$("#czd_n").text(Wzd);	//装订
	$("#cd_n").text(Wsj);	//设计
	$("#ck_n").text(Wkt);	//抠图费
	$("#cys_n").text(WYSF);	//印刷费
	$("#cyslr_n").text(WYSLR);//印刷利润
	$("#total_num").text(Wtotal);	//总价
	$("#danjia_num").text(Wdanjia);//单价
	$("#shoufu_num").text(parseInt(Wtotal*sysf/100)*100);//首付
	$("#yinqian_num").text(parseInt(Wtotal*syzf/100)*100);//印前
	$("#clr_n").text(Wlirun);//利润
	$("#cp_n").text(Wphoto);//拍照
	$("#cpz_n").text(Wpaizhao);//拍照总费用
	HetongPrice(Wtotal);
	
	//选择重量运输交通工具
	if(Wweight<50){
		car="fa-bicycle";
		} else if(Wweight<150){
			car="fa-motorcycle";
			} else if(Wweight<250){
			car="fa-car";
			} else if(Wweight<10000){
			car="fa-truck";
			} else if(Wweight<19000){
			car="fa-train";
			} else{
			car="fa-space-shuttle";
			}
	$("#info").empty();
	$("#info").append("<span class='item' title='总重量'><i class='fa "+car+"'></i> "+Wweight+"<small>kg</small></span>");
	if(Wshuji){
		$("#info").append("<span class='item' title='书脊厚度'><i class='fa fa-book'></i> "+Rshuji()+"<small>mm</small></span>");
		}
	$("#info").append("<span class='item' title='简介'><i class='fa fa-tag'></i> "+showname()+"</span>");
	//Wdf=$("#pdf").val();
	if(Wdf||!V_df){//电分
		$("#df_d").slideDown("slow");
		$("#cdf_n").text(Wdf);
		} else {
		$("#df_d").slideUp("slow");	
			}
	if(Wgy||!V_gy){//工艺
		$("#r_gy").slideDown("slow");
		$("#cgy_n").text(Wgy);
	} else {
		$("#r_gy").slideUp("slow");
		}
	}
//人民币转大写
function upDigit(n)   
{  
    var fraction = ['角', '分'];  
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];  
    var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];  
    var head = n < 0? '欠': '';  
    n = Math.abs(n);  

    var s = '';  

    for (var i = 0; i < fraction.length; i++)   
    {  
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');  
    }  
    s = s || '整';  
    n = Math.floor(n);  

    for (var i = 0; i < unit[0].length && n > 0; i++)   
    {  
        var p = '';  
        for (var j = 0; j < unit[1].length && n > 0; j++)   
        {  
            p = digit[n % 10] + unit[1][j] + p;  
            n = Math.floor(n / 10);  
        }  
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;  
    }  
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');  
} 
//把封面的纸张列表给内页
function Zhilist(){
	$("#neiye").append($("#fengmian").html());
	}
// 保留数字  
String.prototype.GetNum = function() {  
    var regEx = /[^\d]/g;  
    return this.replace(regEx, '');  
};  
function showname(){
	var size=mo=$("#calc_panel label[for="+$("input[name='chicun']:checked").attr("id")+"]").text();
	var fm="封面"+$("#fengmian").val().GetNum()+"克";	//封面
	var nv="内文"+$("#neiye").val().GetNum()+"克";		//内文
	var p=$("#p").val()+"P";		//页码
	var num=$("#num").val()+"本";		//数量
	var mojiao="";//油胶
	if($("#fumo_yj").is(":checked")){
		mojiao=$("#calc_panel label[for='fumo_yj']").text();	
		}
	var hengban="";	//横版
	if($("#hb").is(":checked")){
		hengban=$("#calc_panel label[for='hb']").text();	
		}
	var gq="";	//高清
	if($("#gq").is(":checked")){
		gq="-350线";//$("#calc_panel label[for='gq']").text();	
		}
	var tj="";	//烫金
	if($("#stj").is(":checked")){
		tj="-烫金工艺";//$("#calc_panel label[for='gq']").text();	
		}
	var uv="";	//UV
	if($("#suv").is(":checked")){
		uv="-UV工艺";//$("#calc_panel label[for='gq']").text();	
		}
	var mo=$("#calc_panel label[for="+$("input[name='fumo']:checked").attr("id")+"]").text();		//覆膜
	var zd=$("#calc_panel label[for="+$("input[name='zhuangding']:checked").attr("id")+"]").text();	//装订
	//合同生成
	$("#cpmc").text(size+hengban+"画册");

	$("#fmgg").text($("#fengmian option:selected").text());
	$("#nwgg").text($("#neiye option:selected").text());
	$("#fm").text(mojiao+mo);
	$("#zdfs").text(zd);
	$("#zys").text(p);
	$("#yssl").text(num);
	$("#sm").text(gq);
	var now = new Date();
	$("#sxrq").html("生效日期："+now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日 ");
		if(scellphone!==""){$("#contact").html("<i class='fa fa-phone'></i> "+scellphone);}
		if(sqq!==""){$("#contact").append(" <i class='fa fa-qq'></i> "+sqq);}
		if(saddress!==""){$("#contact").append(" <i class='fa fa-home'></i> "+saddress);}
	x=size+"画册-"+fm+"-"+nv+"-"+p+"-"+num+"-"+mojiao+mo+"-"+hengban+zd+gq+tj+uv;
	return x;
	}	
//保存配置
function SaveSettings(){
$("#left_panel input").each(function(index, element) {
		localStorage.setItem($(this).attr("id"),$(this).val());
    });
	
	}

//生成默认配置
function DefaultConfig(){
	var jdata = [];
	$("#left_panel input").each(function(i, val) {
		var row = {};
		row.id = $(val).attr("id");
		row.text = $(val).attr("placeholder");
		jdata.push(row);
	});
	return JSON.stringify(jdata);
}


//将当前设置保存成字符串
function MakeConfig(){
	var jdata = [];
	$("#left_panel input").each(function(i, val) {
		var row = {};
		row.id = $(val).attr("id");
		row.text = $(val).val();
		jdata.push(row);
	});
	return JSON.stringify(jdata);
	}


//保存设置到配置文件
function SaveConfig(title){
	$("#config_select").prepend("<option value='"+ MakeConfig() +"'>"+title+"</option>");
	CheckMenuStatus();	//检查按钮状态
	SaveConfigList();	//保存配置列表
}

//从装订方式中获取装订选项的id
//传入szq输出zhuangding_qmd
function GetidfromZd(fs){
if(fs=="szq"){fs="zhuangding_qmd"}
if(fs=="szj"){fs="zhuangding_jz"}
if(fs=="szs"){fs="zhuangding_sx"}
return fs;
	}


function ChangeZD(neiye,p){ 	//	根据页码和纸张确定装订方式
//var x=$("#neiye").val();
//var i=$("#p").val();
switch(neiye)
{
case "stbz200":
	if(p<=32){			//装订方式
	pzdw="szq";
	} else if(p>32 && p<=40){
	pzdw="szj";
	} else {
	pzdw="szs";
	}
  break;
case "stbz157":
	if(p<=40){			//装订方式
	pzdw="szq";
	} else if(p>40 && p<=52){
	pzdw="szj";
	} else {
	pzdw="szs";
	}
  break;
  case "stbz128":
	if(p<=48){			//装订方式
	pzdw="szq";
	} else if(p>48 && p<=120){
	pzdw="szj";
	} else {
	pzdw="szs";
	}
  break;
default:
 if(p<=32){			//装订方式
	pzdw="szq";
	} else if(p>32 && p<=40){
	pzdw="szj";
	} else {
	pzdw="szs";
	}
}

return pzdw;
	}

	
//读取配置
function ReadSettings(){
	$("#left_panel input").each(function(index, element) {
		var x=localStorage.getItem($(this).attr("id"));
		if (x){
			$(this).val(x);
			}

    });
	}
//检测配置列表工具菜单中是否有需要置灰的选项
function CheckMenuStatus(){
	//如果列表是空的，删除配置应该是灰色
	if($("#config_select option").size()){
			$("#con_del").show();	
		} else {
			$("#con_del").hide();	
			}
	}
	
//获取设置
function Getsettings(){
	//处理变量
	//纸价  铜版纸
	stbz105=$("#stbz105").val();
	stbz128=$("#stbz128").val();
	stbz157=$("#stbz157").val();
	stbz200=$("#stbz200").val();
	stbz250=$("#stbz250").val();
	stbz105=$("#stbz300").val();
	//双胶纸
	ssjz60=$("#ssjz60").val();
	ssjz70=$("#ssjz70").val();
	ssjz80=$("#ssjz80").val();
	ssjz90=$("#ssjz90").val();
	ssjz105=$("#ssjz105").val();
	ssjz128=$("#ssjz128").val();
	
	//重量 铜版纸
	stbzw105=$("#stbzw105").val();
	stbzw128=$("#stbzw128").val();
	stbzw157=$("#stbzw157").val();
	stbzw200=$("#stbzw200").val();
	stbzw250=$("#stbzw250").val();
	stbzw105=$("#stbzw300").val();
	//双胶纸
	ssjzw60=$("#ssjzw60").val();
	ssjzw70=$("#ssjzw70").val();
	ssjzw80=$("#ssjzw80").val();
	ssjzw90=$("#ssjzw90").val();
	ssjzw105=$("#ssjzw105").val();
	ssjzw128=$("#ssjzw128").val();
	
/*	//特种纸
	stzz60=$("#stzz60").val();
	stzz70=$("#stzz70").val();
	stzz80=$("#stzz80").val();
	stzz90=$("#stzz90").val();
	stzz105=$("#stzz105").val();
	stzz128=$("#stzz128").val();*/
	
	//印刷费
	syq=$("#syq").val();	//起价
	syz=$("#syz").val();	//每千本增加
	sys=$("#sys").val()*2;	//损耗
	sys2=$("#sys2").val()*2;	//损耗
	syl=$("#syl").val();	//利润率
	sy32k=$("#sy32k").val()/100;
	sygq=$("#sygq").val();	//高清加价
	syywtc=$("#syywtc").val()/100;	//业务提成
	sysjstc=$("#sysjstc").val()/100;	//设计师提成
	sysf=$("#sysf").val()/100;	//货款首付
	syzf=$("#syzf").val()/100;//印前再付
	
	//设计费
	sd8p=$("#sd8p").val();
	sd16p=$("#sd16p").val();
	sd20p=$("#sdp").val();
	sd24p=$("#sd24p").val();
	sd28p=$("#sd28p").val();
	sd32p=$("#sd32p").val();
	sd36p=$("#sd36p").val();
	sd40p=$("#sd40p").val();
	sd44p=$("#sd44p").val();
	sd48p=$("#sd48p").val();
	sd52p=$("#sd52p").val();
	sdmore=$("#sdmore").val();
	//装订费
	szq=$("#szq").val();	//骑马钉
	szhb=$("#szhb").val()/100+1;	//骑马钉
	szj=$("#szj").val();	//胶装
	szs=$("#szs").val();	//锁线胶装
	//覆膜费
	sml=$("#sml").val();	//亮膜
	smy=$("#smy").val();	//哑膜
	smyj=$("#smyj").val()/100+1;	//油胶加价
	//工艺
	sgtj=$("#sgtj").val();	//烫金银
	sguv=$("#sguv").val();	//UV
	sgtjbf=$("#sgtjbf").val();	//烫金版费
	sguvbf=$("#sguvbf").val();	//烫金版费
	//照片
	spdf=$("#spdf").val();	//电分价格
	spzp=$("#spzp").val();	//估算照片每P多少张
	spkt=$("#spkt").val();	//抠图价
	spq=$("#spq").val();	//起步价
	spc=$("#spc").val();	//差旅费
	spznd=$("#spznd").val();	//中难度
	spgnd=$("#spgnd").val();	//高难度
	
	//书脊厚度
	arr_shuji=new Array();
	arr_shuji["stbz105sj"]=0.085;
	arr_shuji["stbz128sj"]=0.105;
	arr_shuji["stbz157sj"]=0.135;
	arr_shuji["stbz200sj"]=0.18;
	arr_shuji["stbz250sj"]=0.23;
	arr_shuji["stbz300sj"]=0.34;
	arr_shuji["ssjz80sj"]=0.1;
	arr_shuji["ssjz100sj"]=0.13;
	
	
	
	//公司信息
	sname=$("#sname").val();
	if(sname==""){sname="飞图广告"}
	scellphone=$("#scellphone").val();
	sqq=$("#sqq").val();
	saddress=$("#saddress").val();
	stitle=$("#stitle").val();
	spassword=$("#spassword").val();
	/*arr_shuji["stbz105sj"]=105;
	arr_shuji["stbz128sj"]=128;
	arr_shuji["stbz157sj"]=157;
	arr_shuji["stbz200sj"]=200;
	arr_shuji["stbz250sj"]=250;
	arr_shuji["stbz300sj"]=300;*/
	}
	
	//输出价格表
	function ShowPriceList(thefengmian,theneiye,thepage){
		$("#alltable .title").text(sname+"画册报价");
		xneiye="stbz"+theneiye;
		pfengmian=$("#left_panel input[id=stbz"+thefengmian+"]").val()*0.531*thefengmian/1000/500;
		pneiye=$("#left_panel input[id=stbz"+theneiye+"]").val()*0.531*theneiye/1000/500;
		theid="F"+thefengmian+"N"+theneiye;
		thename="封面"+thefengmian+"内页"+theneiye;
		$("#alltable .tables").append("<table width='48%' id='"+theid+"' border='1' cellspacing='0' align='center' cellpadding='0'></table>");
		$("#"+theid+"").append("<tr><th colspan='6' class='top'>"+thename+"</th></tr>");
		$("#"+theid+"").append("<tr><td>数量</td><td>1000</td><td>2000</td><td>3000</td><td>4000</td><td>5000</td></tr>");	
		for (var i=8;i<=thepage;i+=4){		//循环页码
			pp=i;	//页码
			ppnum=(i-3)*spzp;		//照片数量
			pzdw=ChangeZD(xneiye,i)
			pzd=$("#left_panel input[id="+pzdw+"]").val();	//装订价
			$("#"+theid+"").append("<tr></tr>");
			$("#"+theid+" tr:last").append("<td>"+i+"P</td>");
			for (var t=1000;t<=5000;t+=1000){		//循环印刷数量
				$("#"+theid+" tr:last").append("<td>"+Getprice(t)+"</td>");
			};
		}

		
		//日期
		var now = new Date();
		$("#alltable .date").html("时间："+now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日 ");
		if(scellphone!==""){$("#alltable .pricelist-contact").html("<i class='fa fa-phone'></i> "+scellphone);}
		if(sqq!==""){$("#alltable .pricelist-contact").append("<i class='fa fa-qq'></i> "+sqq);}
		if(saddress!==""){$("#alltable .pricelist-contact").append("<i class='fa fa-home'></i> "+saddress);}
		
	}
	/*function PrintTable(){
		$("#alltable").print();
	}*/

	function CreatPricelist(){
	var p=52;
	$("#alltable .tables").html("");
	ShowPriceList(250,200,p);
	ShowPriceList(250,157,p);
	ShowPriceList(200,200,p);
	ShowPriceList(200,157,p);
	ShowPriceList(200,128,p);
	ShowPriceList(157,157,p);
	}
//刷新结果
function Refresh(){
	SaveSettings();	//保存设置
	Getsettings()	//获取设置
	Result();
	SetTitle();
	if($("#alltable").css("display")=="block"){
		CreatPricelist();
	}
}
