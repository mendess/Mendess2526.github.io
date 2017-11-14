window.onload = loadProjects();


function projectHtml (name,description,link) {
	var html = "";
	html+="\t<li class=\"post-item\">";
	html+="\t\t<h2 class=\"post-header\">";
	html+="\t\t\t<a class=\"post-link\" href=\""+link+"\">"+name+" <i class=\"fa fa-long-arrow-right\" aria-hidden=\"true\"></i></a>";
	html+="\t\t</h2>"
	if(description!=null){
		html+="\t\t<p class=\"post-description\">"+description+"</p>"
	}
	html+="\t</li>"

	return html;
}

function printProject (project,has_pages) {
	var link;
	var element;
	if(has_pages){
		link = "/"+project.name;
		element = "main-project-list";
	}else{
		link = "https://github.com/Mendess2526/"+project.name;
		element = "secondary-project-list";
	}
	document.getElementById(element).innerHTML += projectHtml(project.name,project.description,link);  
}

function printProjects () {
	console.log("tou no printProjects");
	var responseObj = JSON.parse(this.responseText);
	for (var i = 0; i < responseObj.length; i++) {
		if(project.name!="Mendess2526.github.io"){
			printProject(responseObj[i],responseObj[i].has_pages);
		}
	}
}

function loadProjects () {
	var request = new XMLHttpRequest();
	request.onload = printProjects;
	request.open('get','https://api.github.com/users/Mendess2526/repos', true);
	request.send();
}