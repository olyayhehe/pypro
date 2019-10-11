

	var timeout = 5,
		keepAlive = 100,
		cleanSession = false,
		ssl = false,
		arr = [],
		maxarr = [],
		minarr = [],
		max = 0.0,
		min = 0.0,
		dif = 0,
		per = 0;


	var tr1, tr;
	var nid1;
	var begin = true;
	var hasconnected = false;
	var isMax = false, isMin = false; //最大 最小保持

//canvas canvasbottom 变量的设置..................

	var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),
		HORIZONTAL_AXIS_MARGIN = 40,   //水平和垂直框离边像素值
		VERTICAL_AXIS_MARGIN = 40,
		m_left = HORIZONTAL_AXIS_MARGIN,
		m_top = VERTICAL_AXIS_MARGIN,
		m_right = canvas.width - HORIZONTAL_AXIS_MARGIN,
		m_bottom = canvas.height - VERTICAL_AXIS_MARGIN,
		t_left = canvas.width / 65,   //方便画出频谱参数
		t_top = canvas.height / 14,
		t_right = canvas.width - canvas.width / 80,
		t_bottom = canvas.height - canvas.height / 50,


		rgbaTable = [[0, 0, 162], [0, 0, 189], [0, 0, 219], [23, 23, 255], [0, 91, 255], [3, 18, 255], [8, 149, 255], [8, 170, 255], [2, 206, 255], [4, 230, 220], [4, 253, 197], [53, 252, 200], [94, 254, 159], [127, 254, 125], [176, 255, 78], [219, 255, 0], [251, 255, 14], [255, 214, 0], [255, 182, 0], [255, 155, 2], [250, 80, 0], [255, 45, 0], [245, 4, 0], [225, 0, 6], [200, 0, 6]];

    //var image = new Image(),
	var canvas2 = document.getElementById('canvasbottom'),
		context2 = canvas2.getContext('2d'),
		m_left2 = HORIZONTAL_AXIS_MARGIN,
		m_top2 = VERTICAL_AXIS_MARGIN,
		m_right2 = canvas2.width - HORIZONTAL_AXIS_MARGIN,
		m_bottom2 = canvas2.height - VERTICAL_AXIS_MARGIN;





//end canvas canvasbottom 变量的设置..................


//存储放大缩小插值数组
	var dotsum = 401;  //随着读取数据大小来设置
	var dotsum2 = (dotsum - 1) * 2 + 1,
		dotsum3 = (dotsum - 1) * 3 + 1,
		dotsum4 = (dotsum - 1) * 4 + 1,
		dotsum5 = (dotsum - 1) * 4 + 1;
	// var arr2 = new Array(dotsum2);
	// var arr3 = new Array(dotsum3);

	var arr2 = new Array();
	var arr3 = new Array();
	var newCenerFreq, newFreqSpan;


	context.font = '10px Arial';
	drawGrid('lightgray', 10, 10);
	context.shadowColor = 'rgba(100, 140, 230, 0.8)';
	drawAxes();


	//****缓冲canvas
	var canvasBuffer = document.createElement("canvas");
    canvasBuffer.width = dotsum;
    canvasBuffer.height = canvas2.height - VERTICAL_AXIS_MARGIN * 2;
    var contextBuffer = canvasBuffer.getContext("2d");






//鼠标相关...........................................
	var drawingSurfaceImageData,
		mousedown = {},
		dragging = false,
		isMoveCor = false,
		locx = 0,
		locy = 0;

	var config = {
		maxScale: 90,        // 最大放大倍数
		minScale: 1,        // 最小放大倍数
		step: 1            // 每次放大、缩小 倍数的变化值
	};
	var lastStatus = {
		'mouseX': 0,
		'mouseY': 0,
		'translateX': 0,
		'translateY': 0,
	};

// 标记是否移动事件
	var isMove = false;

	var imgStatus = {
		'scale': 1.0,
		'rotate': 0
	};
//end 鼠标相关...........................................


//离开页面..............................
	var client;
	function checkLeave() {
		client.unsubscribe(subtopic, {
			onSuccess: onUnsubscribe
		});
	}






//查找最大最小值..............................
	function mathMin(arr) {
		var min = parseFloat(arr[13]);
		for (var i = 14, ilen = arr.length; i < ilen; i += 1) {
			if (parseFloat(arr[i]) < min) {
				min = arr[i];
			}
		}
		return min;
	}

// 在数组中查找最大值
	function mathMax(arr) {
		var max = parseFloat(arr[13]);
		for (var i = 14, ilen = arr.length; i < ilen; i++) {
			if (parseFloat(arr[i]) > max) {
				max = arr[i];
			}
		}
		return max;
	}




// 切换频谱..............................
	$(document).on('click', '#client_edit', function () {
		var nid = $(this).parents("tr").find("td").eq(0).text();
		var name = $(this).parents("tr").find("td").eq(1).text();
		var client_key = $(this).parents("tr").find("td").eq(2).text();
		var longitude = $(this).parents("tr").find("td").eq(3).text();
		var latitude = $(this).parents("tr").find("td").eq(4).text();
		topic = $(this).parents("tr").find("td").eq(5).text();
		console.log("test...");

		$(this).parents("tr").find("td").eq(6).find("option").each(function(){
        	if($(this).val()=="freq_control")
			{
				ctr_topic = $(this).text().split("-")[1];
			}
        	if($(this).val()=="freq_para")
			{
				para_topic = $(this).text().split("-")[1];
			}
        	if($(this).val()=="freq_data")
			{
				topic = $(this).text().split("-")[1];
			}
        });
		console.log(ctr_topic,para_topic,topic);

		tr = $(this).parents("tr");
		//tr.attr('class','success');
		if (nid != nid1) {
			if (begin == true) {
				tr.attr('class', 'success');
				tr1 = tr;
				nid1 = nid;
				begin = false;
			} else {
				tr1.removeAttr('class');
				tr.attr('class', 'success');
				tr1 = tr;
				nid1 = nid;
				begin = false;
			}

		}

		if (topic1 != topic) {
			console.log('origin-' + topic1);
			console.log('now-' + topic);
			if (hasconnected == true) {
				console.log('qiehuan');
				client.unsubscribe(topic1, {
					onSuccess: onUnsubscribe
				});

				client = new Paho.MQTT.Client(hostname, port, clientId);
				//建立客户端实例
				var options = {
					invocationContext: {
						host: hostname,
						port: port,
						path: client.path,
						clientId: clientId
					},
					timeout: timeout,
					keepAliveInterval: keepAlive,
					cleanSession: cleanSession,
					useSSL: ssl,
					// userName: userName,
					// password: password,
					onSuccess: onConnect,
					onFailure: function (e) {
						console.log(e);
						s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onFailure()}";
						console.log(s);
					}
				};
				client.connect(options);
				client.onConnectionLost = onConnectionLost;
				//注册连接断开处理事件
				client.onMessageArrived = onMessageArrived;
				//注册消息接收处理事件
				topic1 = topic;

			} else {
				client = new Paho.MQTT.Client(hostname, port, clientId);
				//建立客户端实例
				var options = {
					invocationContext: {
						host: hostname,
						port: port,
						path: client.path,
						clientId: clientId
					},
					timeout: timeout,
					keepAliveInterval: keepAlive,
					cleanSession: cleanSession,
					useSSL: ssl,
					// userName: userName,
					// password: password,
					onSuccess: onConnect,
					onFailure: function (e) {
						console.log(e);
						s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onFailure()}";
						console.log(s);
					}
				};
				client.connect(options);
				client.onConnectionLost = onConnectionLost;
				//注册连接断开处理事件
				client.onMessageArrived = onMessageArrived;
				//注册消息接收处理事件
				topic1 = topic;
			}

		}

	});

// js mqtt processing..............................

//连接服务器并注册连接成功处理事件
	function onConnect() {
		console.log("onConnected");
		s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnected()}";
		console.log(s);
		client.subscribe(topic);
		client.subscribe(para_topic);
		subtopic = topic;
		hasconnected = true;
	}

	onUnsubscribe = function () {
		console.log("%s unsubscribed", clientId);
		subscribed = false;
	};

	function onConnectionLost(responseObject) {
		console.log(responseObject);
		s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnectionLost()}";
		console.log(s);
		if (responseObject.errorCode !== 0) {
			console.log("onConnectionLost:" + responseObject.errorMessage);
			console.log("连接已断开");
			hasconnected = false;
		}
	}

    var befordotsum=0;

	var chan="1",antenna="TX/RX",gain="30",sample_rate="5000000",frame_rate="10",avg_alpha="1";
	var para_arr = new Array();
	//年 月 日 时 分 秒
	//参考电平 db/每格  中心频率  带宽 resBw vidBw swTime;
	arr[0] = "2019";
	arr[1] = "1";
	arr[2] = "1";
	arr[3] = "0";
	arr[4] = "0";
	arr[5] = "0";
	arr[6] = "-20";
	arr[7] = "10";
	arr[8] = "50000000";
	arr[9] = "5000000";
	arr[10] = "10000000";
	arr[11] = "10000000";
	arr[12] = "0.004";
	function getPara(message)
	{
        console.log(message.payloadString);
		para_arr = message.payloadString.split(" ");
		//console.log(para_arr);
		chan=para_arr[0];
		antenna=para_arr[1];
		gain=para_arr[2];
		sample_rate=para_arr[3];

		arr[0]=para_arr[4]; //time
		arr[1]=para_arr[5];
		arr[2]=para_arr[6];
		arr[3]=para_arr[7];
		arr[4]=para_arr[8];
		arr[5]=para_arr[9];


		arr[8]=para_arr[10]; //中心频率
		arr[9]=para_arr[11]; //带宽


		frame_rate=para_arr[12];
		avg_alpha=para_arr[13];
		dotsum=parseInt(para_arr[14]); //fftsize

		dotsum2 = (dotsum) * 2;
		dotsum3 = (dotsum) * 3;
		dotsum4 = (dotsum) * 4;
		dotsum5 = (dotsum) * 4;

		if(befordotsum != dotsum)
		{
			canvasBuffer = document.createElement("canvas");
			canvasBuffer.width = dotsum;
			canvasBuffer.height = canvas2.height - VERTICAL_AXIS_MARGIN * 2;
			contextBuffer = canvasBuffer.getContext("2d");
			befordotsum = dotsum;
		}



	}

	// base64解码
	var array;
	function base64ToArrayBuffer(base64) {
		var binary_string =  window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array( len );
		for (var i = 0; i < len; i++)        {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}

	function getFreq(message)
	{

		array = base64ToArrayBuffer(message.payloadString);

		var float32 = new Float32Array(array);
		//console.log(float32);

		var len = float32.length;
		if(isMax == true)
		{
			for(i=0; i<len; i++)
			{
				if(parseFloat(maxarr[13+i]) < float32[i])
					maxarr[13+i] = String(float32[i]);
				arr[13+i] = String(float32[i]);
			}
		}
		if(isMin == true)
		{
			for(i=0; i<len; i++)
			{
				if(parseFloat(minarr[13+i]) > float32[i])
					minarr[13+i] = String(float32[i]);
				arr[13+i] = String(float32[i]);
			}
		}
        if(isMax == false && isMin == false)
		{
			for(i=0; i<len; i++)
			{
				arr[13+i] = String(float32[i]);
			}
		}


	}


	function onMessageArrived(message)
	{

		//message.destinationName //station/lot/4/freq

		if (message.destinationName == topic) {
			
			getFreq(message);

		}
		if (message.destinationName == para_topic) {
			getPara(message);
		}

		onDrawImg();

	}





    function onDrawImg()
	{
		//console.log(arr.length);
		if(arr.length < 100)
		{
			return;
		}
		max = mathMax(arr);
		min = mathMin(arr);
		dif = Math.abs(max - min);
		per = (dif + 6) / 25;

		//放大缩小数据处理
		/*
        滚轮值除以10 <3正常显示；>3&&<=6 2倍，插值1；>6&&<=9 3倍，插值2; >9&&<=12 4倍，插值3;>12&&<=16,5倍，插值4.
        */
		var cenFreq = arr[8];
		var freSpan = arr[9];
		var scale = Math.round(imgStatus.scale / 10);
		var i = 0;
		if (scale < 3) {
		} else if (scale > 3 && scale <= 6) {
			console.log("2");
			if (lastStatus.translateX <= 0) {
				lastStatus.translateX = 0;
			} else if (lastStatus.translateX >= dotsum2 - dotsum) {
				lastStatus.translateX = dotsum2 - dotsum;
			}

			var begin = Math.floor(lastStatus.translateX / 2);
			//var end = begin + 201;
			var end = begin + Math.ceil(dotsum/2);
			var j = 0;
			for (i = begin; i < end - 1; i++, j++) {
				arr2[j] = arr[i + 14];
				arr2[j + 1] = String((parseFloat(arr[i + 14 + 1]) - parseFloat(arr[i + 14])) / 2 + parseFloat(arr[i + 14]));
				j = j + 1;
			}
			arr2[j] = arr[end - 1];
			for (i = 0; i < dotsum; i++) {
				arr[i + 14] = arr2[i];
			}
			newCenerFreq = String(Math.round((parseInt(cenFreq) - parseInt(freSpan) / 2) + (lastStatus.translateX + dotsum / 2) * (parseInt(freSpan) / dotsum2)));
			newFreqSpan = String(Math.round(parseInt(freSpan) / 2));
			arr[8] = newCenerFreq;
			arr[9] = newFreqSpan;
			console.log(newCenerFreq,newFreqSpan);
		} else if (scale > 6 && scale <= 9) {
			console.log("3");

			if (lastStatus.translateX <= 0) {
				lastStatus.translateX = 0;
			} else if (lastStatus.translateX >= dotsum3 - dotsum) {
				lastStatus.translateX = dotsum3 - dotsum;
			}

			var begin = Math.floor(lastStatus.translateX / 3);
			//var end = begin + 135;
			var end = begin + Math.ceil(dotsum/3);
			var j = 0;
			for (i = begin; i < end - 1; i++, j++) {
				arr3[j] = arr[i + 14];
				arr3[j + 1] = String((parseFloat(arr[i + 14 + 1]) - parseFloat(arr[i + 14])) / 3 + parseFloat(arr[i + 14]));
				arr3[j + 2] = String(((parseFloat(arr[i + 14 + 1]) - parseFloat(arr[i + 14])) / 3) * 2 + parseFloat(arr[i + 14]));
				j = j + 2;
			}
			arr3[j] = arr[end - 1];
			for (i = 0; i < dotsum; i++) {
				arr[i + 14] = arr3[i];
			}

			newCenerFreq = String(Math.round((parseInt(cenFreq) - parseInt(freSpan) / 2) + (lastStatus.translateX + dotsum / 2) * (parseInt(freSpan) / dotsum3)));
			newFreqSpan = String(Math.round(parseInt(freSpan) / 3));
			arr[8] = newCenerFreq;
			arr[9] = newFreqSpan;
			console.log(newCenerFreq,newFreqSpan);
		}
		
		drawFreline();
		//console.time('time');
		drawWaterFall();
		//console.timeEnd('time');
	}




	function send() {
		var s = document.getElementById("msg").value;
		if (s) {
			s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", content:" + (s) + ", from: web console}";
			message = new Paho.MQTT.Message(s);
			message.destinationName = topic;
			client.send(message);
			document.getElementById("msg").value = "";
		}
	}

	var count = 0;

	function start() {
		window.tester = window.setInterval(function () {
			if (client.isConnected) {
				var s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", content:" + (count++) +
					", from: web console}";
				message = new Paho.MQTT.Message(s);
				message.destinationName = topic;
				//client.send(message);
			}
		}, 1000);
	}

	function stop() {
		window.clearInterval(window.tester);
	}

	Date.prototype.Format = function (fmt) { //author: meizz
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[
				k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};


// Functions..........................................................

	function drawAxes() {
		context.save();
		context.lineWidth = 1.0;
		context.fillStyle = 'rgba(100, 140, 230, 0.8)';//
		context.strokeStyle = 'navy';

		drawHoriVerAxis();

		context.lineWidth = 0.5;
		context.strokeStyle = 'navy';

		context.strokeStyle = 'darkred';
		//drawVerticalAxisTicks();
		//drawHorizontalAxisTicks();

		context.restore();
	}

	function drawGrid(color, stepx, stepy) {
		context.save()

		context.strokeStyle = color;
		context.fillStyle = '#ffffff';
		context.lineWidth = 0.5;
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		var dh = (m_right - m_left) / 10;
		var dv = (m_bottom - m_top) / 10;
		for (var i = 1; i < 10; i++) {
			var dth = i * dh;
			var dtv = i * dv;
			context.beginPath();
			context.moveTo(m_left, m_top + dtv);
			context.lineTo(m_right, m_top + dtv);
			context.moveTo(m_left + dth, m_top);
			context.lineTo(m_left + dth, m_bottom);
			context.stroke();
		}

		context.strokeStyle = 'navy';
		context.fillStyle = '#ffffff';
		context.lineWidth = 0.5;
		var minper = (t_right-t_left)/50;
		for (var i = 0; i < 10; i++) {
			var dth = i * dh;
			context.beginPath();
			context.moveTo(m_left + dth, m_bottom);
			context.lineTo(m_left + dth, m_bottom+15);
			for(var j = 1; j < 5; j++)
			{
				context.moveTo(m_left + dth + minper*j, m_bottom);
				context.lineTo(m_left + dth + minper*j, m_bottom+10);
			}
			context.stroke();
		}
		context.beginPath();
		context.moveTo(m_right, m_bottom);
		context.lineTo(m_right, m_bottom+15);
		context.stroke();
		context.restore();
	}

	function drawHoriVerAxis() {
		context.beginPath();
		context.moveTo(m_left, m_top);
		context.lineTo(m_left, m_bottom);
		context.lineTo(m_right, m_bottom);
		context.lineTo(m_right, m_top);
		context.lineTo(m_left, m_top);
		context.stroke();
	}



	function drawFreq() {
		var strCurTime = arr[0] + "-" + arr[1] + "-" + arr[2] + " " + arr[3] + ":" + arr[4] + ":" + arr[5];
		var refLev = arr[6];
		var refDIV = arr[7];
		var cenFreq = arr[8];
		var freSpan = arr[9];
		var resBw = arr[10];
		var vidBw = arr[11];
		var swTime = arr[12];


		context.font = '12pt Arial';
		context.fillStyle = 'cornflowerblue';
		context.strokeStyle = 'blue';

		var str_refLev = String(Math.round(refLev));
		var str_cenFreq = String((cenFreq / 1000000).toFixed(3));
		var str_lFreq = String((cenFreq / 1000000-freSpan/2000000).toFixed(3));
		var str_rFreq = String((cenFreq / 1000000+freSpan/2000000).toFixed(3));
		var str_freSpan = String((freSpan / 1000000).toFixed(3));
		var str_refDIV = String(Math.abs(refDIV));

		//	var chan="1",antenna="TX/RX",gain="30",sample_rate="5000000",frame_rate="10",avg_alpha="1";

		context.fillText("通   道:" + chan, t_right - (t_right - t_left) / 4,  t_top + (t_bottom - t_top) / 55+20);
		context.fillText("天线接口:" + antenna, t_right - (t_right - t_left) / 4, t_top + (t_bottom - t_top) / 55+40);
		context.fillText("采 样 率:" + sample_rate + "Hz", t_right - (t_right - t_left) / 4, t_top + (t_bottom - t_top) / 55+60);
		context.fillText("增   益:" + gain + "db", t_right - (t_right - t_left) / 4, t_top + (t_bottom - t_top) / 55+80);

		context.fillText("Ref:" + str_refLev + "dBm", t_left, t_top + (t_bottom - t_top) / 55-10);
				context.fillText("Time: " + arr[0] + "-" + arr[1] + "-" + arr[2]+" "+arr[3]+":"+arr[4]+":"+arr[5], t_left+150, t_top + (t_bottom - t_top) / 55-10);
		context.fillText("Center:" + str_cenFreq + "MHz", t_left+(t_right - t_left)/10*4.3, t_bottom - (t_bottom - t_top) / 120);
		context.fillText(str_lFreq + "MHz", t_left, t_bottom - (t_bottom - t_top) / 120);
		context.fillText(str_rFreq + "MHz", t_right - (t_right - t_left) / 8, t_bottom - (t_bottom - t_top) / 120);
		context.fillText("Span:" + str_freSpan + "MHz", t_right - (t_right - t_left) / 4, t_bottom - (t_bottom - t_top) / 15);
		context.fillText("dB/ " + str_refDIV, t_left, t_top + (t_bottom - t_top) / 10);

		if (isMoveCor == true) {
			var freq = (cenFreq - freSpan / 2) + (locx - m_left) * (freSpan / (m_right - m_left));
			var str_freq = String((freq / 1000000).toFixed(5));
			context.fillText(str_freq + "MHz", locx + 10, locy - 10);
			context.beginPath();

			context.moveTo(locx + 0.5, 0);
			context.lineTo(locx + 0.5, context.canvas.height);
			context.moveTo(0, locy + 0.5);
			context.lineTo(context.canvas.width, locy + 0.5);
			context.stroke();
		}


		//画曲线
		context.strokeStyle = 'rgba(72, 118, 255, 1)';//rgba(192, 192, 192, 1)rgba(100, 140, 230, 0.8)
		context.lineWidth = 0.5;

		context.beginPath();
		context.moveTo(m_left, (refLev - arr[13]) / refDIV * (m_bottom - m_top) / 10 + m_top);
		for (var k = 14; k < dotsum+13; k++) {
			context.lineTo(m_left + (k - 13) * (m_right - m_left) / dotsum, (refLev - arr[k]) / refDIV * (m_bottom - m_top) / 10 + m_top);
		}

		context.stroke();

		if(isMax == true)
		{
			//画曲线
			context.strokeStyle = 'rgba(205, 173, 0, 1)';//rgba(192, 192, 192, 1)rgba(100, 140, 230, 0.8)

			context.beginPath();
			context.moveTo(m_left, (refLev - maxarr[13]) / refDIV * (m_bottom - m_top) / 10 + m_top);
			for (var k = 14; k < dotsum+13; k++) {
				context.lineTo(m_left + (k - 13) * (m_right - m_left) / dotsum, (refLev - maxarr[k]) / refDIV * (m_bottom - m_top) / 10 + m_top);
			}

			context.stroke();
		}
		if(isMin == true)
		{
			//画曲线
			context.strokeStyle = 'rgba(255,0,255, 1)';//rgba(192, 192, 192, 1)rgba(100, 140, 230, 0.8)

			context.beginPath();
			context.moveTo(m_left, (refLev - minarr[13]) / refDIV * (m_bottom - m_top) / 10 + m_top);
			for (var k = 14; k < dotsum+13; k++) {
				context.lineTo(m_left + (k - 13) * (m_right - m_left) / dotsum, (refLev - minarr[k]) / refDIV * (m_bottom - m_top) / 10 + m_top);
			}

			context.stroke();
		}

	}


	function windowToCanvas(x, y) {
		var bbox = canvas.getBoundingClientRect();

		return {
			x: x - bbox.left * (canvas.width / bbox.width),
			y: y - bbox.top * (canvas.height / bbox.height)
		};
	}

// Save and restore drawing surface..............................

	function saveDrawingSurface() {
		drawingSurfaceImageData = context.getImageData(0, 0,
			canvas.width,
			canvas.height);
	}

	function restoreDrawingSurface() {
		context.putImageData(drawingSurfaceImageData, 0, 0);
	}


	function drawHorizontalLine(y) {
		context.beginPath();
		context.moveTo(0, y + 0.5);
		context.lineTo(context.canvas.width, y + 0.5);
		context.stroke();
	}

	function drawVerticalLine(x) {
		context.beginPath();
		context.moveTo(x + 0.5, 0);
		context.lineTo(x + 0.5, context.canvas.height);
		context.stroke();
	}

	function drawGuidewires(x, y) {
		context.save();
		context.strokeStyle = 'rgba(0,0,230,0.4)';
		context.lineWidth = 0.5;
		drawVerticalLine(x);
		drawHorizontalLine(y);
		context.restore();
	}

// Canvas event handlers.........................................

	canvas.onmousedown = function (e) {
		var loc = windowToCanvas(e.clientX, e.clientY);

		if (loc.x > m_left && loc.x < m_right && loc.y > m_top && loc.y < m_bottom) {
			isMoveCor = true;
			locx = loc.x;
			locy = loc.y;

			isMove = true;
			//canvas.style.cursor = "move";
			lastStatus.mouseX = loc.x;
			lastStatus.mouseY = loc.y;
		}


		e.preventDefault(); // prevent cursor change

		mousedown.x = loc.x;
		mousedown.y = loc.y;

	};

	canvas.onmouseout = function (e) {
		isMove = false;
		canvas.style.cursor = "default";
	}


	canvas.onmousemove = function (e) {
		var loc;

		e.preventDefault(); // prevent selections

		loc = windowToCanvas(e.clientX, e.clientY);

		if (loc.x > m_left && loc.x < m_right && loc.y > m_top && loc.y < m_bottom) {
			isMoveCor = true;
			locx = loc.x;
			locy = loc.y;

			if (isMove) {
				var box = windowToCanvas(e.clientX, e.clientY);
				drawImgByMove(box.x, box.y);
			}

		}
	};


	canvas.onmouseup = function (e) {
		loc = windowToCanvas(e.clientX, e.clientY);
		isMoveCor = false;
		isMove = false;
	};


	canvas.onmousewheel = function (e) {
		if (e.wheelDelta > 0) {
			imgStatus.scale = (imgStatus.scale >= config.maxScale) ? config.maxScale : imgStatus.scale + config.step;
		} else {
			imgStatus.scale = (imgStatus.scale <= config.minScale) ? config.minScale : imgStatus.scale - config.step;
		}
		//console.log(imgStatus.scale);
		var mXY = windowToCanvas(e.clientX, e.clientY);
		//drawImgByStatus(mXY.x, mXY.y);

		var scale = Math.round(imgStatus.scale / 10);
		var i = 0;
		if (scale < 3) {

		} else if (scale > 3 && scale <= 6) {
			lastStatus.translateX = dotsum2 / 2 - dotsum/2;
		} else if (scale > 6 && scale <= 9) {
			lastStatus.translateX = dotsum3 / 2 - dotsum/2;
		}

	}


	function drawImgByMove(x, y) {
		if (x > m_left && x < m_right && y > m_top && y < m_bottom) {
			lastStatus.translateX = lastStatus.translateX - (x - lastStatus.mouseX);
			lastStatus.translateY = lastStatus.translateY - (y - lastStatus.mouseY);

			var scale = Math.round(imgStatus.scale / 10);
			if (scale > 3 && scale <= 6) {
				if (lastStatus.translateX <= 0) {
					lastStatus.translateX = 0;
				} else if (lastStatus.translateX >= dotsum2 - dotsum) {
					lastStatus.translateX = dotsum2 - dotsum;
				}
			} else if (scale > 6 && scale <= 9) {
				if (lastStatus.translateX <= 0) {
					lastStatus.translateX = 0;
				} else if (lastStatus.translateX >= dotsum3 - dotsum) {
					lastStatus.translateX = dotsum3 - dotsum;
				}
			}
			lastStatus.mouseX = x;
			lastStatus.mouseY = y;
		}
	}


// Initialization.....................................................


	function drawFreline() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		context.font = '13px Arial';
		drawGrid('lightgray', 10, 10);
		context.shadowColor = 'rgba(100, 140, 230, 0.8)';

		drawAxes();
		drawFreq();
//drawAxisLabels();
	}


	var imgURI = canvasBuffer.toDataURL("image/png");
	var image = new Image()

	function drawWaterFall() {
		var data = undefined,
			i = 0, j = 0;
		imagedata = contextBuffer.getImageData(0, 0,
			dotsum, canvas2.height - VERTICAL_AXIS_MARGIN * 2);
//console.time('time');
		//移动数据
		for (i = 1; i < imagedata.height; i++) {
			for (j = 0; j < imagedata.width * 4; j += 4) {
				imagedata.data[(i - 1) * imagedata.width * 4 + j] = imagedata.data[i * imagedata.width * 4 + j];
				imagedata.data[(i - 1) * imagedata.width * 4 + j + 1] = imagedata.data[i * imagedata.width * 4 + j + 1];
				imagedata.data[(i - 1) * imagedata.width * 4 + j + 2] = imagedata.data[i * imagedata.width * 4 + j + 2];
				imagedata.data[(i - 1) * imagedata.width * 4 + j + 3] = 255;
			}
		}
//console.timeEnd('time');
		for (i = 0; i < imagedata.width; i++) {
			var sel = Math.round(Math.abs(arr[i + 13] - min) / per);
			//console.log(sel);
			imagedata.data[(imagedata.height - 1) * imagedata.width * 4 + i * 4] = rgbaTable[sel][0];
			imagedata.data[(imagedata.height - 1) * imagedata.width * 4 + i * 4 + 1] = rgbaTable[sel][1];
			imagedata.data[(imagedata.height - 1) * imagedata.width * 4 + i * 4 + 2] = rgbaTable[sel][2];
			imagedata.data[(imagedata.height - 1) * imagedata.width * 4 + i * 4 + 3] = 255;
		}
		

		
		contextBuffer.putImageData(imagedata, 0, 0);
		//
		imgURI = canvasBuffer.toDataURL("image/png");

		image.src = imgURI;
		image.onload = function(e){
			context2.drawImage(image,0,0,dotsum,canvas2.height - VERTICAL_AXIS_MARGIN * 2,40,40,canvas2.width-HORIZONTAL_AXIS_MARGIN*2,canvas2.height-VERTICAL_AXIS_MARGIN*2)
		}

	}


	function drawHoriVerAxis2() {
		context2.beginPath();
		context2.moveTo(m_left2, m_top2);
		context2.lineTo(m_left2, m_bottom2);
		context2.lineTo(m_right2, m_bottom2);
		context2.lineTo(m_right2, m_top2);
		context2.lineTo(m_left2, m_top2);
		context2.stroke();
	}


	function drawAxes2() {
		context2.save();
		context2.lineWidth = 1.0;
		context2.fillStyle = 'rgba(100, 140, 230, 0.8)';//
		context2.strokeStyle = 'navy';

		drawHoriVerAxis2();

		context2.lineWidth = 0.5;
		context2.strokeStyle = 'navy';

		context2.strokeStyle = 'darkred';
		context2.restore();
	}

	drawAxes2();






