let waitTime;

let pointBgColor;

let pointBgColorType;

let pointColor50;
let pointColor40;
let pointColor30;

let pointBgColor50;
let pointBgColor40;
let pointBgColor30;


if(typeof localStorage["fetchType"] == 'undefined'){
	localStorage["fetchType"] = "fetchapi";
}

if(typeof localStorage["loadType"] == 'undefined'){
	localStorage["loadType"] = "autoload";
}

if(typeof localStorage["delayTime"] == 'undefined'){
	localStorage["delayTime"] = 5000;
}

if(typeof localStorage["waitTime"] == 'undefined'){
	localStorage["waitTime"] = 5000;
}

if(typeof localStorage["pointColor50"] == 'undefined'){
	localStorage["pointColor50"] = "#ff0000";
}

if(typeof localStorage["pointColor40"] == 'undefined'){
	localStorage["pointColor40"] = "#00ff00";
}

if(typeof localStorage["pointColor30"] == 'undefined'){
	localStorage["pointColor30"] = "#0000ff";
}

if(typeof localStorage["pointBgColor"] == 'undefined'){
	localStorage["pointBgColor"] = "#0f0f0f";
}

if(typeof localStorage["bgColorType"] == 'undefined'){
	localStorage["bgColorType"] = "complementaryColor";
}

window.addEventListener("load",function(eve){
	console.log("addEventListener load");
	//options.htmlで設定した値をAmazonのローカルストレージに移す
	chrome.runtime.sendMessage({
			method: "getLocalStorage", 
			key1: "fetchType",
			key2: "loadType",
			key3: "delayTime",
			key4: "waitTime",
			key5: "pointColor50",
			key6: "pointColor40",
			key7: "pointColor30",
			key8: "pointBgColor",
			key9: "bgColorType"
		}, function(response) {
		
			localStorage["fetchType"]=response.data1;
			localStorage["loadType"]=response.data2;
			localStorage["delayTime"]=response.data3;
			localStorage["waitTime"]=response.data4;
			localStorage["pointColor50"]=response.data5;
			localStorage["pointColor40"]=response.data6;
			localStorage["pointColor30"]=response.data7;
			localStorage["pointBgColor"]=response.data8;
			localStorage["bgColorType"]=response.data9;
			
			if(typeof localStorage["fetchType"] == 'undefined'){
				localStorage["fetchType"] = "fetchapi";
			}

			if(typeof localStorage["loadType"] == 'undefined'){
				localStorage["loadType"] = "autoload";
			}

			if(typeof localStorage["delayTime"] == 'undefined'){
				localStorage["delayTime"] = 5000;
			}

			if(typeof localStorage["waitTime"] == 'undefined'){
				localStorage["waitTime"] = 5000;
			}

			if(typeof localStorage["pointColor50"] == 'undefined'){
				localStorage["pointColor50"] = "#ff0000";
			}

			if(typeof localStorage["pointColor40"] == 'undefined'){
				localStorage["pointColor40"] = "#00ff00";
			}

			if(typeof localStorage["pointColor30"] == 'undefined'){
				localStorage["pointColor30"] = "#0000ff";
			}

			if(typeof localStorage["pointBgColor"] == 'undefined'){
				localStorage["pointBgColor"] = "#0f0f0f";
			}

			if(typeof localStorage["bgColorType"] == 'undefined'){
				localStorage["bgColorType"] = "complementaryColor";
			}
			
			//fetchAPIを用いるかjqueryのajaxを用いるか
			if(localStorage["fetchType"]=="fetchapi"){
				wishpoints(true);
			}else if(localStorage["fetchType"]=="jqueryajax"){
				wishpoints(false);
			}
			
			waitTime = localStorage["waitTime"];

			pointBgColor = localStorage["pointBgColor"];

			pointBgColorType = localStorage["bgColorType"];

			pointColor50 = localStorage["pointColor50"];
			pointColor40 = localStorage["pointColor40"];
			pointColor30 = localStorage["pointColor30"];

			pointBgColor50 = (pointBgColorType == 'complementaryColor') ? 
										calcComplementaryColor(pointColor50) : 
										pointBgColor;
			pointBgColor40 = (pointBgColorType == 'complementaryColor') ?
										calcComplementaryColor(pointColor40) : 
										pointBgColor;
			pointBgColor30 = (pointBgColorType == 'complementaryColor') ?
										calcComplementaryColor(pointColor30) : 
										pointBgColor;

	});
	//前のセッションが残っていた場合を考慮し最初のロード時に消す
	sessionStorage.clear();
	

},false);

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

let point50plus = 0;
let point40plus = 0;
let point30plus = 0;

let price50plus = 0;
let price40plus = 0;
let price30plus = 0;

let totalItemsCnt = 0;
let processedItemsCnt = 0;

let FETCH_STAT = {	NOT_YET: 1,
					FETTING:2,
					DONE: 3
};



function compareFunc(a, b) {
  return a - b;
}

function calcComplementaryColor(color){	
	var nrmColor = parseInt(color.replace(/#/g, ''),16);
	var Rval = (nrmColor & 0xFF0000) >> 16;
	var Gval = (nrmColor & 0x00FF00) >> 8;
	var Bval = (nrmColor & 0x0000FF) >> 0;
	
	let primaryColors = new Array(Rval, Gval, Bval);
	primaryColors.sort(compareFunc);
	
	const temp = primaryColors[0] + primaryColors[2];
	
	var newR = temp - Rval;
	var newG = temp - Gval;
	var newB = temp - Bval;
	
	complementaryColor = '#' +
						( '00' + newR.toString(16)).slice( -2 ) +
						( '00' + newG.toString(16)).slice( -2 ) +
						( '00' + newB.toString(16)).slice( -2 );
	
	return complementaryColor;
}



function pointToColor(points){
	var point = points.match(/.+\((\d+)%\)/);
	var foreColor = '#000000';
	var backColor = '#ffffff';
	
	if(point[1]){
		if(point[1] >= 50){
			point50plus++;
			foreColor = pointColor50;
			backColor = pointBgColor50;
		} else if( (point[1] < 50) && (point[1] >= 40) ){
			point40plus++;
			foreColor = pointColor40;
			backColor = pointBgColor40;
		} else if( (point[1] < 40) && (point[1] >= 30) ){
			point30plus++;
			foreColor = pointColor30;
			backColor = pointBgColor30;
		}
	}
	
	return Array(foreColor, backColor);
}

function priceToColor(prices){
	var price = prices.match(/(\d+)%/);
	var foreColor = '#000000';
	var backColor = '#ffffff';

	if(price[1]){
		if(price[1] >= 50){
			price50plus++;
			foreColor = pointColor50;
			backColor = pointBgColor50;
		} else if( (price[1] < 50) && (price[1] >= 40) ){
			price40plus++;
			foreColor = pointColor40;
			backColor = pointBgColor40;
		} else if( (price[1] < 40) && (price[1] >= 30) ){
			price30plus++;
			foreColor = pointColor30;
			backColor = pointBgColor30;
		}
	}
	
	return Array(foreColor, backColor);
}



async function wishpoints(enablefetch){
	const dom_parser = new DOMParser();
	//wishlist内のアイテムのリスト
	const itemList = document.getElementsByClassName("price-section");
	

	var bbb = document.getElementById("processedPercent");
	
	if(bbb == null)
	{
		var aaa = document.getElementById("listPrivacy");
		console.log(aaa);
		aaa.insertAdjacentHTML("afterend", "<br><span id=\"processedPercent\">" + processedItemsCnt / totalItemsCnt * 100 + "%</span>" + 
											"<br><span>[point]</span>" +
											"<br><span id=\"point50plus\">over 50%: " + point50plus + "</span>" +
											"<br><span id=\"point40plus\">40%～49%: " + point40plus + "</span>" +
											"<br><span id=\"point30plus\">30%～39%: " + point30plus + "</span>" +
											"<br><span>[price drop]</span>" +
											"<br><span id=\"price50plus\">over 50%: " + price50plus + "</span>" +
											"<br><span id=\"price40plus\">40%～49%: " + price40plus + "</span>" +
											"<br><span id=\"price30plus\">30%～39%: " + price30plus + "</span>"
		);
		bbb = document.getElementById("processedPercent");
	}
	console.log(bbb);
	
	var ccc = document.getElementById("point50plus");
	var ddd = document.getElementById("point40plus");
	var eee = document.getElementById("point30plus");
	
	var fff = document.getElementById("price50plus");
	var ggg = document.getElementById("price40plus");
	var hhh = document.getElementById("price30plus");
	
	
	for(let item of Array.from(itemList)){
		const data_item_prime_info = JSON.parse(item.attributes["data-item-prime-info"].value);
		const asin = data_item_prime_info.asin;
		const itemId = data_item_prime_info.id;
		
		//console.log("asin: " + asin);
		const key = "asin:" + asin;
		
		//console.log(JSON.parse(item.attributes["data-item-prime-info"].value));
		
		//以前に調べてないアイテムに対しfetchを行う
		if(sessionStorage.getItem(key) === null)
		{
			totalItemsCnt++;
			sessionStorage.setItem(key, FETCH_STAT.NOT_YET);
			
			const parentDoc = document;
			
			
			async function GetPoint(text){
				
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
					
					var Colors = pointToColor(points);
					var spanColor = Colors[0];
					var bgColor = Colors[1];
					
					/*
					var spanColor = pointToColor(points);
					//console.log(spanColor);
					var bgColor="#FFFFFF";
					if(spanColor!="#000000"){
						//bgColor=pointBgColor;
						bgColor=calcComplementaryColor(spanColor);
					}
					*/
					var pAsin = document.getElementById("points_" + asin);
					if (pAsin == null)
					{
						var insertText = '<br><span id=points_' + asin + " class=\"a-price\" data-a-size=\"m\" style=\"background-color:" + bgColor + "; color:" + spanColor + ";\">" + points + "</span>";
						//console.log(insertText);
						item.firstElementChild.insertAdjacentHTML("afterend", insertText);
						
						pAsin = document.getElementById("points_" + asin);
						if(spanColor!="#000000"){
							pAsin.classList.add('a-text-bold');
						}
						processedItemsCnt++;
						sessionStorage.setItem(key, FETCH_STAT.DONE);
					}
				}
				//debug
				//console.log(points);
				
				//console.log("processedItemsCnt: " + processedItemsCnt);
				//bbb.textContent = processedItemsCnt / totalItemsCnt * 100 + "%";
				bbb.textContent = processedItemsCnt + "/" + totalItemsCnt;
				ccc.textContent = "over 50%: " + point50plus;
				ddd.textContent = "40%～49%: " + point40plus;
				eee.textContent = "30%～39%: " + point30plus;
					
				//console.log(typeof item);
				var priceDropAsin = parentDoc.getElementById("itemPriceDrop_" + itemId);//itemPriceDrop_IC71PTVPG3C5K
				if(priceDropAsin)
				{
					
					var dropPercent = priceDropAsin.textContent.trim().replace(/\s+/g, "").replace(/価格が(.+)下がりました/g,"$1");
					
					var Colors = priceToColor(dropPercent);
					var dropColor = Colors[0];
					var bgColor = Colors[1];
					
					//var dropColor = priceToColor(dropPercent);
					//console.log(spanColor);
					//var bgColor="#FFFFFF";
					if(dropColor!="#000000"){
						//bgColor=pointBgColor;
						//bgColor=calcComplementaryColor(dropColor);
						priceDropAsin.setAttribute('data-a-size','m');
						priceDropAsin.classList.add('a-price');
					}
					priceDropAsin.style.backgroundColor = bgColor;
					priceDropAsin.style.color = dropColor;
					
					fff.textContent = "over 50%: " + price50plus;
					ggg.textContent = "40%～49%: " + price40plus;
					hhh.textContent = "30%～39%: " + price30plus;

					//console.log(asin + ": " + dropPercent);
				}
			}
			
			if(enablefetch){
				//console.log("fetch:" + asin);
				//fetch('https://www.amazon.co.jp/dp/'+asin,{credentials: 'omit', referrer: '', referrerPolicy: 'no-referrer'})
				fetch('https://www.amazon.co.jp/dp/'+asin,{credentials: 'include'})
				.then(res=>{
					return res.text();
				})
				.then(text=>{
					GetPoint(text);
				})
				.catch(err=>console.error(err));
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
		
			await sleep(waitTime);
		}
		else if(sessionStorage.getItem(key) == FETCH_STAT.DONE)
		{
		/*
			processedItemsCnt++;
			//console.log("processedItemsCnt: " + processedItemsCnt);
			//bbb.textContent = processedItemsCnt / totalItemsCnt * 100 + "%";
			bbb.textContent = processedItemsCnt + "/" + totalItemsCnt;
			ccc.textContent = "over 50%: " + point50plus;
				ddd.textContent = "40%～49%: " + point40plus;
				eee.textContent = "30%～39%: " + point30plus;
		*/
		}
		
		
	}
};

