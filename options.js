window.addEventListener("load",function(eve){
	let button = document.getElementById("save");
	button.addEventListener("click",function(){
		let fetchId = document.getElementById("fetchid");
		let loadId = document.getElementById("loadid");
		let delayTime = document.getElementById("delaytime");
		let waitTime = document.getElementById("waittime");
		let pointColor50 = document.getElementById("pointcolor50");
		let pointColor40 = document.getElementById("pointcolor40");
		let pointColor30 = document.getElementById("pointcolor30");
		
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

