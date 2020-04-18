window.addEventListener("load",function(eve){
	console.log("delayTime " + localStorage["delayTime"]);
	
	let fetchId = document.getElementById("fetchid");
	if(typeof localStorage["fetchType"] != 'undefined'){
		if(localStorage["fetchType"] == "jqueryajax"){
			fetchId.selectedIndex = 1;
		} else {
			fetchId.selectedIndex = 0;
		}
	} else {
		fetchId.selectedIndex = 0;
	}

	let loadId = document.getElementById("loadid");
	if(typeof localStorage["loadType"] != 'undefined'){
		if(localStorage["loadType"] == "pushbutton"){
			loadId.selectedIndex = 1;
		} else {
			loadId.selectedIndex = 0;
		}
	} else {
		loadId.selectedIndex = 0;
	}

	let delayTime = document.getElementById("delaytime");
	if(typeof localStorage["delayTime"] != 'undefined'){
		delayTime.value = localStorage["delayTime"];
	} else {
		delayTime.value = 1000;
	}

	let waitTime = document.getElementById("waittime");
	if(typeof localStorage["waitTime"] != 'undefined'){
		waitTime.value = localStorage["waitTime"];
	} else {
		waitTime.value = 1000;
	}
	
	let pointColor50 = document.getElementById("pointcolor50");
	if(typeof localStorage["pointColor50"] != 'undefined'){
		pointColor50.value = localStorage["pointColor50"];
	} else {
		pointColor50.value = "#ff0000";
	}

	let pointColor40 = document.getElementById("pointcolor40");
	if(typeof localStorage["pointColor40"] != 'undefined'){
		pointColor40.value = localStorage["pointColor40"];
	} else {
		pointColor40.value = "#00ff00";
	}

	let pointColor30 = document.getElementById("pointcolor30");
	if(typeof localStorage["pointColor30"] != 'undefined'){
		pointColor30.value = localStorage["pointColor30"];
	} else {
		pointColor30.value = "#0000ff";
	}
	
	let button = document.getElementById("save");
	button.addEventListener("click",function(){
		localStorage["fetchType"] = fetchId.options[fetchId.selectedIndex].value;
		localStorage["loadType"] = loadId.options[loadId.selectedIndex].value;
		localStorage["delayTime"] = delayTime.value;
		localStorage["waitTime"] = waitTime.value;
		localStorage["pointColor50"] = pointColor50.value;
		localStorage["pointColor40"] = pointColor40.value;
		localStorage["pointColor30"] = pointColor30.value;
		window.close();
	},false);
},false);

