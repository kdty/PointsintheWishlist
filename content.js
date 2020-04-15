window.addEventListener("load",function(eve){
	//options.htmlで設定した値をAmazonのローカルストレージに移す
	chrome.runtime.sendMessage({method: "getLocalStorage", 
									key1: "fetchType",
									key2: "loadType",
									key3: "delayTime",
									key4: "pointColor50",
									key5: "pointColor40",
									key6: "pointColor30"
								}, function(response) {
		localStorage["fetchType"]=response.data1;
		localStorage["loadType"]=response.data2;
		localStorage["delayTime"]=response.data3;
		localStorage["pointColor50"]=response.data4;
		localStorage["pointColor40"]=response.data5;
		localStorage["pointColor30"]=response.data6;
	});
	//前のセッションが残っていた場合を考慮し最初のロード時に消す
	sessionStorage.clear();
	
	if(!localStorage["fetchType"]){
		localStorage["fetchType"]="fetchapi";
	}
	if(!localStorage["loadType"]){
		localStorage["loadType"]="autoload";
	}
	if(!localStorage["delayTime"]){
		localStorage["delayTime"]=100;
	}
	if(!localStorage["pointColor50"]){
		localStorage["pointColor50"]="#800000";
	}
	if(!localStorage["pointColor40"]){
		localStorage["pointColor40"]="#0000ff";
	}
	if(!localStorage["pointColor30"]){
		localStorage["pointColor30"]="#008000";
	}


	//fetchAPIを用いるかjqueryのajaxを用いるか
	if(localStorage["fetchType"]=="fetchapi"){
		wishpoints(true);
	}else if(localStorage["fetchType"]=="jqueryajax"){
		wishpoints(false);
	}
},false);

const waitTime=100;
function sleep(waitMsec){
	return new Promise(function(resolve){
		setTimeout(function(){resolve()},waitMsec);
	});
}

//DOMの変更を監視する
const obtarget = document.getElementById("g-items");
const observer = new MutationObserver(records =>{
	//debug
	//console.log("observe!");
	if(localStorage["fetchType"]=="fetchapi"){
		wishpoints(true);
	}else if(localStorage["fetchType"]=="jqueryajax"){
		wishpoints(false);
	}
});
observer.observe(obtarget,{childList:true});

var point50plus = 0;
var point40plus = 0;
var point30plus = 0;

function pointToColor(points){
	var point = points.match(/.+\((\d+)%\)/);
	if(point[1]){
		if(point[1] >= 50){
			point50plus++;
			return localStorage["pointColor50"];
		} else if( (point[1] < 50) && (point[1] >= 40) ){
			point40plus++;
			return localStorage["pointColor40"];
		} else if( (point[1] < 40) && (point[1] >= 30) ){
			point30plus++;
			return localStorage["pointColor30"];
		} else {
			return '#000000';
		}
	}
	
	return '#000000';
}


async function wishpoints(enablefetch){
	const dom_parser = new DOMParser();
	//wishlist内のアイテムのリスト
	const itemList = document.getElementsByClassName("price-section");
	//どこまで読み込んだのかsessionStorageに記録
	const olditemnum = sessionStorage.getItem("storageItemNum")||0;
	//debug
	//console.log(itemList);
	console.log("olditemnum: " + olditemnum);
	
	const totalProcessedItemsCnt = olditemnum + itemList.length;
	var processedItemsCnt = olditemnum;
	var aaa = document.getElementById("listPrivacy");
	console.log(aaa);
	aaa.insertAdjacentHTML("afterend", "<br><span id=\"processedPercent\">" + processedItemsCnt / totalProcessedItemsCnt * 100 + "%</span>" + 
										"<br><span id=\"point50plus\">over 50%: " + point50plus + "</span>" +
										"<br><span id=\"point40plus\">40%～49%: " + point40plus + "</span>" +
										"<br><span id=\"point30plus\">30%～39%: " + point30plus + "</span>"
	);
	var bbb = document.getElementById("processedPercent");
	console.log(bbb);
	
	var ccc = document.getElementById("point50plus");
	var ddd = document.getElementById("point40plus");
	var eee = document.getElementById("point30plus");
	
	//以前に調べてないアイテムに対しfetchを行う
	for(let item of Array.from(itemList).slice(olditemnum)){
		const asin = JSON.parse(item.attributes["data-item-prime-info"].value).asin;

		if(enablefetch){
			//console.log("fetch");
			fetch('https://www.amazon.co.jp/dp/'+asin,{credentials: 'omit', referrer: ''})
			.then(res=>res.text())
			.then(text=>{
			const lopoints = dom_parser.parseFromString(text, "text/html").getElementsByClassName("loyalty-points");
			//debug
			//console.log(lopoints);
			//loyalty-pointsがない場合にはエラーが出るため存在判定
			let points = "";
			//console.log(lopoints.length);
			if(lopoints.length!=0){
				//points = lopoints[0].children[1].innerText.trim();
				points = lopoints[0].innerText.trim().replace(/\s+/g, "").replace(/獲得ポイント:/g,"");
				//console.log(points);
				var spanColor = pointToColor(points);
				//console.log(spanColor);
				var insertText = "<br><span class=\"a-price\" data-a-size=\"m\" style=\"color:" + spanColor + ";\">" + points + "</span>";
				//console.log(insertText);
				item.firstElementChild.insertAdjacentHTML("afterend", insertText);
			}
			//debug
			//console.log(points);
			processedItemsCnt++;
			//console.log("processedItemsCnt: " + processedItemsCnt);
			bbb.textContent = processedItemsCnt / totalProcessedItemsCnt * 100 + "%";
			ccc.textContent = "over 50%: " + point50plus;
			ddd.textContent = "40%～49%: " + point40plus;
			eee.textContent = "30%～39%: " + point30plus;
		}).catch(err=>console.error(err));
		}else{
			//debug
			// console.log("jquery ajax");
			$.ajax({
				type:'GET',
				url:'https://www.amazon.co.jp/dp/'+asin,
				dataType:'html'
			}).done(function(data,status,xhr){
				const lopoints = dom_parser.parseFromString(data, "text/html").getElementsByClassName("loyalty-points");
				//kindle本でポイントがついている場合のみ計算
				if(lopoints.length){
					//trimをすることでスペースを削除
					var points = lopoints[0].children[1].innerText.trim();
					//debug
					// console.log(kindlepoints);
					item.firstElementChild.insertAdjacentHTML("beforeend", "<br><span>" + points + "</span>");
				}
			}).fail(function(xhr,status,error){
				console.error(error);
			});
		};
		
		await sleep(10);
	}
	//debug
	console.log(itemList.length);
	//セッションストレージに現在の読み込み数を記録
	sessionStorage.setItem("storageItemNum", itemList.length);
};

