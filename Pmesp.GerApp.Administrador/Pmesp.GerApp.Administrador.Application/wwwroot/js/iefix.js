// Correções e Fixes para IE's antigos (IE 8 ou inferior)

// Corrige a renderização de TAGS HTML5 para os IE's
// Obs.: IE 9+ renderizam normalmente
(function(){
	var tags = ["abbr", "article", "aside", "audio", "bdi", "button", "canvas", "data", "datalist", "details", "dialog", "figcaption", "figure", "footer", "header", "hgroup", "main", "mark", "meter", "nav", "output", "progress", "section", "summary", "template", "time", "video"];
	for (var i=0,j=tags.length;i<j;i++){
		document.createElement(tags[i]);
	}

})();

$(function(){
    $('.main-menu .main-menu-button:nth-child(even)').addClass('even');
});