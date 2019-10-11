
	var tr1, tr;
	var nid1;
	var begin = true;
	var hasconnected = false;
	var isMax = false, isMin = false; //最大 最小保持

   var State = {
        isConnected: false,
        connected: function () {
            this.isConnected = true;
        },

        disconnected: function () {
            this.isConnected = false;
        }
    };

    var hasdrawed = true;
    var ori=0,noi=0;
    var Connection = {
        socket: null,
        connect: function () {
            var socket = this.socket = new SockJS('http://'+hostname+':'+port);
            //var socket = this.socket = new SockJS('http://192.168.31.238:8080');
            socket.onopen = function () {
                console.log('Connection opened');
                State.connected();
            };
            socket.onmessage = function (e) {
                //console.log(e.data);
                if(ori == 0)
                    console.time('time');
                ori++;
                onMessageArrived(e.data);
                if(ori == 60){
                    console.timeEnd('time');
                    ori = 0;
                }

            }
            socket.onclose = function () {
                console.log('Connection closed');
                State.disconnected();
            }
        },
        disconnect: function () {
            if (this.socket) {
                this.socket.close()
                this.socket = null;
            }
        },
        send: function (message) {
            console.log("Sending: " + message);

            this.socket.send(message);
        }
    };

//离开页面..............................
    function checkLeave(){
        Connection.disconnect();
　　　}
//存储主题
	var topics=[];
// 切换频谱..............................
	$(document).on('click', '#client_edit', function () {
		var nid = $(this).parents("tr").find("td").eq(0).text();
		var name = $(this).parents("tr").find("td").eq(1).text();
		var client_key = $(this).parents("tr").find("td").eq(2).text();
		var longitude = $(this).parents("tr").find("td").eq(3).text();
		var latitude = $(this).parents("tr").find("td").eq(4).text();
		topic = $(this).parents("tr").find("td").eq(5).text();
		console.log(topic);
		var i=0;
		$("#id-topic").empty();
		topics=[];
		$(this).parents("tr").find("td").eq(6).find("option").each(function(){
        	addtopic = $(this).text().split("-")[1];
        	topics.push(addtopic);
        	i++;
            $("#id-topic").append("<div>"+
                    "<input id="+"topic"+i+" style='margin:10px;' type='checkbox'"+
				    "οnclick="+"topic"+i+"(this)"+">"+
                    "<label for="+"topic"+i+">"+
                    addtopic+
                    "</label>"
			        +"</div>");


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
			if (Connection.isConnected == true) {
				console.log('qiehuan');
				Connection.disconnect();
				Connection.connect();

				var jsubtopic = {'sub':[]};
				jsubtopic['sub']=topics;
				console.log(jsubtopic);
				Connection.send(JSON.stringify( jsubtopic ));
				topic1 = topic;

			}
			else {
				    var jsubtopic = {'sub': []};
					jsubtopic['sub']=topics;
					console.log(jsubtopic);
					Connection.send(JSON.stringify(jsubtopic));
					//注册消息接收处理事件
					topic1 = topic;
			}

		}

	});
	Connection.connect();



// processing..............................

	function onMessageArrived(message)
	{
		var $log = $('#rec-text');

		//console.log(message);
		var jsObject = JSON.parse(message);
        var key;
        var strdata;
        for(key in jsObject ){
            //console.log(key);
            strdata = jsObject[key];
			for(j = 1,len=topics.length; j <= len; j++) {
				if(document.getElementById("topic"+j).checked)
				{
					if(key == topics[j-1])
					{
						//console.log("topic"+j);
						$log.append('接收主题('+key+')数据：\n');
						$log.append(strdata+'\n\n');
					}

				}
            }
        }
	}








