window.onload = loadProjects();


function projectHtml (name,description) {
	var html = "";
	html+="\t<li class=\"post-item\">";
	html+="\t\t<h2 class=\"post-header\">";
    html+="\t\t\t<a class=\"post-link\" href=\"/"+name+"\">"+name+"<i class=\"fa fa-long-arrow-right\" aria-hidden=\"true\"></i></a>";
    html+="\t\t</h2>"
    html+="\t\t<p class=\"post-description\">"+description+"</p>"
    html+="\t</li>"

    return html;
}

function printProject (project) {
	document.getElementById('post-list').innerHTML += projectHtml(project.name,project.description);
}

function printProjects () {
	console.log("tou no printProjects");
	var responseObj = JSON.parse(this.responseText);
    //console.log(responseObj.name + " has " + responseObj.public_repos + " public repositories!");
    for (var i = 0; i < responseObj.length; i++) {
    	if(responseObj[i].has_pages && responseObj[i].name!="Mendess2526.github.io"){
    		printProject(responseObj[i]);
    	}
    }
}

function loadProjects () {
	var request = new XMLHttpRequest();
	request.onload = printProjects;
	request.open('get','https://api.github.com/users/Mendess2526/repos', true);
	request.send();
}
