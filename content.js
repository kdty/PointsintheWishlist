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

window.addEventListener("load",function(eve){
	console.log("addEventListener load");
	//options.htmlで設定した値をAmazonのローカルストレージに移す
	chrome.runtime.sendMessage({method: "getLocalStorage", 
									key1: "fetchType",
									key2: "loadType",
									key3: "delayTime",
									key4: "waitTime",
									key5: "pointColor50",
									key6: "pointColor40",
									key7: "pointColor30"
								}, function(response) {
		localStorage["fetchType"]=response.data1;
		localStorage["loadType"]=response.data2;
		localStorage["delayTime"]=response.data3;
		localStorage["waitTime"]=response.data4;
		localStorage["pointColor50"]=response.data5;
		localStorage["pointColor40"]=response.data6;
		localStorage["pointColor30"]=response.data7;
	});
	//前のセッションが残っていた場合を考慮し最初のロード時に消す
	sessionStorage.clear();
	
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


	//fetchAPIを用いるかjqueryのajaxを用いるか
	if(localStorage["fetchType"]=="fetchapi"){
		wishpoints(true);
	}else if(localStorage["fetchType"]=="jqueryajax"){
		wishpoints(false);
	}
},false);

const waitTime=localStorage["waitTime"];
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

var price50plus = 0;
var price40plus = 0;
var price30plus = 0;

var totalItemsCnt = 0;
var processedItemsCnt = 0;

var FETCH_STAT = {	NOT_YET: 1,
					FETTING:2,
					DONE: 3
};

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

function priceToColor(prices){
	var price = prices.match(/(\d+)%/);
	if(price[1]){
		if(price[1] >= 50){
			price50plus++;
			return localStorage["pointColor50"];
		} else if( (price[1] < 50) && (price[1] >= 40) ){
			price40plus++;
			return localStorage["pointColor40"];
		} else if( (price[1] < 40) && (price[1] >= 30) ){
			price30plus++;
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
					var spanColor = pointToColor(points);
					//console.log(spanColor);
					var bgColor="#FFFFFF";
					if(spanColor!="#000000"){
						bgColor="#000000";
					}
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
					var dropColor = priceToColor(dropPercent);
					//console.log(spanColor);
					var bgColor="#FFFFFF";
					if(dropColor!="#000000"){
						bgColor="#000000";
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
					var headers = Array.from(res.headers);
					console.log(headers);

					var keys = Array.from(res.headers.keys());
					console.log(keys);
					var csp = res.headers.get("strict-transport-security");
					console.log('csp: ' + csp);
					return res.text();
				})
				.then(text=>{
					const domtree = dom_parser.parseFromString(text, "text/html");
					var alertPage = domtree.title.includes('警告：アダルトコンテンツ');
					console.log('alertPage: ' + alertPage);
					if (alertPage)
					{
						function triggerEvent(element, event) {
						   if (domtree.createEvent) {
						       // IE以外
						       var evt = domtree.createEvent("HTMLEvents");
						       evt.initEvent(event, true, true ); // event type, bubbling, cancelable
						       return element.dispatchEvent(evt);
						   } else {
						       // IE
						       var evt = domtree.createEventObject();
						       return domtree.fireEvent("on"+event, evt)
						   }
						}
						
						var elms = domtree.getElementsByClassName('alert');
						var a_elm = elms[0].parentElement.getElementsByTagName('a')[0];
						//var eRet = triggerEvent(a_elm, 'click');
						//a_elm.click();
						//console.log(eRet);
						
						//sleep(waitTime);
						
						//console.log(domtree);
						/*
						
						
						fetch('https://www.amazon.co.jp/dp/'+asin,{credentials: 'include'})
							.then(res2=>res2.text())
							.then(text2=>GetPoint(text2))
							.catch(err=>console.error(err));
						*/
						

						
						var newURL = a_elm.href.replace('http:','');
						console.log('newURL: ' + newURL);
						let text2 = fetch(newURL,
											{
											credentials: 'include', 
											referrer: '', 
											redirect: 'error',
											referrerPolicy: 'unsafe-url',
											headers: { 'Upgrade-Insecure-Requests' : '1'}
											})
											.then(res2=>{
												console.log('t2' + res2.text());
												return res2.text();
											})
											.then(text2=>text2)
											.catch(err=>console.error(err));
						console.log('text2' + text2);
						
						
						
					}
					else
					{
						GetPoint(text);
					}
					
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

