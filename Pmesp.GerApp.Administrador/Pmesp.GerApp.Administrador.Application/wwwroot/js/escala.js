    // JavaScript Document

$(function () {
    var _afterCustomRadioCheck = null;
    // Plugin para controles de radio/checkbox customizados
    // Para desabilitar/habilitar os controles que utilizam este componente
    // utilizar chamada de disparo de eventos via jQuery
    // Ex.: $('.radioBtn').trigger('disable'); // Desabilitar
    //      $('.radioBtn').trigger('enable'); // Habilitar
    $.fn.customRadioCheck = function(){
		for (var i=0,j=this.length;i<j;i++){
			var _this = $(this[i])
            , clickEvent = function(E){
                var $this = $(this);
                E.preventDefault();
                // Diferencia comportamento de radio para checkbox
				if ($this.is('.radioBtn')){
					var input = $this.find('input')[0]
					,   $sameGroupRadios = $('.radioBtn input[name='+input.name+']');
					$sameGroupRadios.parent().removeClass('checked');
					for (var i=0,j=$sameGroupRadios.length;i<j;i++){
						$sameGroupRadios[i].checked = false;
					}
					$this.addClass('checked');
					input.checked = true;
				} else {
					$this.trigger($this.hasClass('checked')?'uncheck':'check');
				}
                //Executa ação, caso alguma tenha sido informada.
                if (_afterCustomRadioCheck != null) {
                    _afterCustomRadioCheck();
                }
            };
            _this[_this.find('input')[0].checked?'addClass':'removeClass']('checked');

			_this.on('click',clickEvent);
            _this.on('check',function(){
                var $this = $(this);
                $this.addClass('checked');
                $this.find('input')[0].checked = true;
            });
            _this.on('uncheck',function(){
                var $this = $(this);
                $this.removeClass('checked');
                $this.find('input')[0].checked = false;
            });
            _this.on('disable',function(e){ $(this).addClass('disabled').off('click'); });
            _this.on('enable',function(e){
                $(this)
                    .removeClass('disabled')
                    .off('click')
                    .on('click',clickEvent); 
            });
		}
        return this;
	}
	// Ativa funcionalidade de click nos botões de radio/checkbox customizados
	// $('.radioBtn,.checkBtn').customRadioCheck();
    $('.radioBtn:not(.radioIncluir,.radioPesquisar,.radioMenuItem),.checkBtn').customRadioCheck();
    
    
    //Seta callback para ser realizado após a execução de customRadioCheck
    $.fn.afterCustomRadioCheck = function (action) {
        _afterCustomRadioCheck = action;
    }

    // Plugin para funcionamento correto do componente de listBox duplo.
    $.fn.dualListBox = function () {
        var setup = function($source){
            var _this = $($source)
            ,  $addBtn = _this.find('.dualListBox-add')
            ,  $addAllBtn = _this.find('.dualListBox-addAll')
            ,  $removeBtn = _this.find('.dualListBox-remove')
            ,  $removeAllBtn = _this.find('.dualListBox-removeAll')
            ,  $sourceList = _this.find('.dualListBox-source')
            ,  $targetList = _this.find('.dualListBox-target')
            ,  getSelected = function($list){ return $list.find('option:selected') }
            ,  getAll = function($list){ return $list.find('option') };
            if ($addBtn.length){
                _this.on('click',$addBtn.selector,function(E){
                    $targetList.append(getSelected($sourceList));
                });        
            }
            if ($addAllBtn.length){
                _this.on('click',$addAllBtn.selector,function(E){
                    $targetList.append(getAll($sourceList));
					$targetList.children().show();
                });
            }
            if ($removeBtn.length){
                _this.on('click',$removeBtn.selector,function(E){
                    $sourceList.append(getSelected($targetList));
                });
            }
            if ($removeAllBtn.length){
                _this.on('click',$removeAllBtn.selector,function(E){
                    $sourceList.append(getAll($targetList));
                });
            }
        };
        for (var i=0,j=this.length;i<j;i++){
            setup(this[i]);
        }
    }
    var $dualListBox = $('.dualListBox');
    if ($dualListBox.length){
        $dualListBox.dualListBox();
    }

    $.fn.smartPagination = function(options){
        var setup = function($source,options){
            // Configurações
            options = options || {}
            options.itemsPerPage = Number(options.itemsPerPage) || 10; // Valor default;
            options.defaultPage = Number(options.defaultPage) || 1; // Valor default;
            
            var _this = $($source);
            // Se o elemento em si não for uma tabela, procura a tabela internamente para resolver a funcionalidade
            if (!_this.is('table')){
                _this = _this.find('table').first();
            }
            // Se ainda não for tabela, para a execução 
            if (!_this.is('table')) return;
 
            var $tbody = _this.find('tbody')
            ,   __currentPage = 1
            ,   __getLines = function(){ return $tbody.find('tr') }
            ,   __getLineCount = function(){ return $tbody.find('tr').length; }
            ,   __getPageCount = function(){ 
                return Math.ceil( __getLineCount() / options.itemsPerPage ); 
            }
            ,   __hideLines = function(){ __getLines().hide() }
            ,   __showPage = function(pageNumber){
                var $lines = __getLines()
                ,   maxItem = pageNumber * options.itemsPerPage
                ,   minItem = 1 + maxItem - options.itemsPerPage;
                
                for(var i=minItem; i<=maxItem; i++){
                    $( $lines[i-1] ).css('display','table-row');
                }
                __currentPage = pageNumber;
                // Dispara evento para informar mudança de página
                // Envia por parâmetro a lista de itens(linhas) que estão sendo exibidas no momento
                _this.trigger('pageChange',[ $lines.filter(':visible') ]);
            }
            ,   __buildPagination = function(pageNumber){
                var pageCount = __getPageCount();
                _this.find('tfoot').remove();
                // Se houver só uma página não constrói footer
                if (pageCount == 1) return;
                var $tfoot = $('<tfoot><tr></tr></tfoot>')
                ,   $td = $('<td/>').attr('colspan', _this.find('thead th').length );

                if (pageCount > 10 && __currentPage > 1){
                    $td.append('<a class="firstPage" href="#">&lt;&lt;</a>');
                    $td.append('<a class="prevPage" href="#">&lt;</a>');
                }

                var startLimit = 1
                ,   endLimit = pageCount;
                if (pageCount > 10){
                    if (pageNumber >=5 && (pageCount - pageNumber > 4)){
                        startLimit = pageNumber - 4;
                        endLimit = pageNumber + 5;
                    } else if (pageNumber >=5 && (pageCount - pageNumber <= 4)){
                        startLimit = pageCount - 8;
                        endLimit = pageCount;
                    } else {
                        startLimit = 1;
                        endLimit = pageCount > 10 ? 10 : pageCount;
                    }
                }
                
                for (var i=startLimit; i<=endLimit; i++){
                    if (i==pageNumber){
                        $td.append('&nbsp;' + i.toString());
                    } else { 
                        $td.append('<a href="#">'+ i.toString() +'</a>')
                    }
                }
                
                if (pageCount > 10 && __currentPage < pageCount){
                    $td.append('<a class="nextPage" href="#">&gt;</a>');
                    $td.append('<a class="lastPage" href="#">&gt;&gt;</a>');
                } 
                
                
                $tfoot.find('tr').append($td);
                _this.append($tfoot);
            }
            ,   __loadPage = function(pageNumber){
                __hideLines();
                __showPage(pageNumber);
                __buildPagination(pageNumber);                
            };
            
            // Evento para ser disparado quando houver atualização de conteúdo da tabela
            _this.on('contentUpdate',function(){
                var pageCount = __getPageCount()
                ,   page = (__currentPage > pageCount ? pageCount : __currentPage); 
                __loadPage(page);
            });
            // Click nos links do rodape para avançar as páginas
            _this.on('click','tfoot a:not(.firstPage,.prevPage,.nextPage,.lastPage)',function(e){
                e.preventDefault();
                var page = Number($(this).text());
                __loadPage(page);
            });
            _this.on('click','tfoot .firstPage',function(e){
                e.preventDefault();
                __loadPage(1);
            });
            _this.on('click','tfoot .prevPage',function(e){
                e.preventDefault();
                __loadPage(--__currentPage);
            });
            _this.on('click','tfoot .nextPage',function(e){
                e.preventDefault();
                __loadPage(++__currentPage);
            });
            _this.on('click','tfoot .lastPage',function(e){
                e.preventDefault();
                __loadPage(__getPageCount());
            });
            

            __loadPage(options.defaultPage);
        };
        for (var i=0,j=this.length;i<j;i++){
            setup(this[i],options);
        }
    }
    
    var $smartPagination = $('.smartPagination');
    if ($smartPagination.length){
        $smartPagination.smartPagination();
    }

    
    $.fn.dropdownFilter = function(options){
        options = options || {};
        for (var i=0,j=this.length;i<j;i++){
            options.input = options.input || '.filterInput';
            options.list = options.list || '.filterList';
            var _this = $(this[i])
            ,   $input = _this.find(options.input)
            ,   $list = _this.find(options.list)
            ,   __getCurrentListItem = function(){
                // Retorna o item atual, se não houver, o selecionado, se não houver, o primeiro
                var $current = $list.find('.current');
                if (!$current.length){
                    $current = $list.find('.selected');
                    if (!$current.length){
                        $current = $list.find('li:first');
                    }
                }
                return $current;
            }
            ,   __selectItem = function(){
                $list.find('.selected').removeClass('selected');
                var $current = $list.find('.current');
                $current.addClass('selected');
                $input.val($current.text());
                setTimeout(function(){
                    __dropdownClose();
                    $input.trigger('blur');            
                },50);
            }
            ,   __setScrolling = function(direction){
                var $current = __getCurrentListItem()
                ,   itemPos = $current.get(0).getBoundingClientRect()
                ,   listPos = $list.get(0).getBoundingClientRect()
                ,   itemHeight = itemPos.bottom - itemPos.top;

                if (direction == 'up' && itemPos.bottom <= listPos.top){
                    // Está fora da tela, acima
                    $list.scrollTop($list.scrollTop() - (listPos.top - itemPos.bottom) - itemHeight);
                } else if (itemPos.top >= listPos.bottom){
                    // Está fora da tela, abaixo
                    $list.scrollTop(itemPos.top - listPos.bottom + itemHeight + $list.scrollTop());
                }
            }
            ,   __handleKeyboard = function(){
                var currentSelected = $list.find('.selected').attr('data-value')
                ,   options = $list.empty().scrollTop(0).data('listItems')
                ,   search = $.trim($input.val())
                ,   regex = new RegExp(search,'gi');
                $.each(options, function(i) {
                    var option = options[i];
                    if(option.text.match(regex) !== null) {
                        $list.append(
                            $('<li>').text(option.text).attr({
                                 'data-value':option.value
                                ,'title':option.text
                            }).addClass(currentSelected==option.value?'selected':'')
                        );
                    }
                });
            }
            ,   __handleUpMove = function(){
                var $current = __getCurrentListItem();
                if ($current.prev().length){
                    $current.prev().addClass('current');
                    $current.removeClass('current');
                    __setScrolling('up');
                } else {
                    $current.addClass('current');
                }
            }
            ,   __handleDownMove = function(){
                var $current = __getCurrentListItem();
                if ($current.next().length){
                    $current.next().addClass('current');
                    $current.removeClass('current');
                    __setScrolling('down');
                } else {
                    $current.addClass('current');
                }
            }
            ,   __dropdownOpen = function(){
                _this.addClass('open');
                $('body').on('click.dropdownFilter',function(E){
                    var containerSelector = '.'+_this.get(0).className.split(' ').join('.')
                    ,   $target = $(E.target);
                    if (!$target.is(containerSelector) && !$target.parents(containerSelector).length){
                        __dropdownClose();
                    }
                });
            }
            ,   __dropdownClose = function(){
                _this.removeClass('open');
                $list.find('.current').removeClass('current');
                $('body').off('.dropdownFilter');
            };
        
            var originalItems = [];
            $list.find('li').each(function(){
                originalItems.push({
                    value: $(this).attr('data-value')
                    ,text: $(this).text()
                })
            });
            $list.data('listItems',originalItems);
            $list.on('itemSelect',function(){ __selectItem() });
            $list.on('mouseover','li',function(){ 
                $(this).addClass('current');
                $(this).siblings().removeClass('current');
            });
            $list.on('click','li',function(){ $list.trigger('itemSelect') });
            $list[0].getValue = function(){
                return $(this).find('.selected').attr('data-value') || 0;
            }
            _this[0].getValue = function(){ return $list.get(0).getValue() }
            $input.on({
                 focus: function(){ __dropdownOpen() }
                ,keydown: function(E){
                    var key = E.keyCode || E.which;
                    switch(key){
                        case 13: // ENTER
                            $list.trigger('itemSelect');
                            break;
                        case 9:  // TAB    
                        case 27: // ESC
                            __dropdownClose();
                            break;
                        case 38: // Seta /\
                            __handleUpMove();
                            break;
                        case 40: // Seta \/
                            __handleDownMove();
                            break;
                        case 37: // Seta <
                        case 39: // Seta >
                            break;
                        default:
                            __handleKeyboard();
                            break;
                    }
                }
            });
        }
    }
    
    // Plugin para trabalhar com filtro em select/combo
    $.fn.filterByText = function(textbox, selectSingleMatch) {
        return this.each(function() {
            var select = this;
            var options = [];
            $(select).find('option').each(function() {
                options.push({value: $(this).val(), text: $(this).text()});
            });
            $(select).data('options', options);
            $(textbox).bind('change keyup', function() {
                var options = $(select).empty().scrollTop(0).data('options');
                var search = $.trim($(this).val());
                var regex = new RegExp(search,'gi');
                $.each(options, function(i) {
                    var option = options[i];
                    if(option.text.match(regex) !== null) {
                        $(select).append(
                            $('<option>').text(option.text).val(option.value)
                        );
                    }
                });
                if (selectSingleMatch === true && 
                $(select).children().length === 1) {
                    $(select).children().get(0).selected = true;
                }
            });
        });
    };
    if ($('.filterSelect')){
        $('.filterSelect').filterByText();
        $('.filterSelect').dropdownFilter();
    }

    // Plugin para trabalhar com seleção de HORAS
    $.fn.timePicker = function (params) {
        var configs = {
            onSelect : function(){},
            onClose : function(){}
        };
        if (params && typeof params === "object"){
            configs.onSelect = (typeof params.onSelect === 'function' ? params.onSelect : configs.onSelect );
            configs.onClose = (typeof params.onClose === 'function' ? params.onClose : configs.onClose );
        }

        var setup = function($source){
            var _this = $($source);
            _this.wrap('<div class="timePicker-container">');
            var $container = _this.parent()
            ,   _token = (new Date()).getTime().toString()
            ,   _currentTime
            ,   _currentMinute;

            function _openSelect(){
                var $pickerContent = $container.find('.timePicker-content');
                _setContentOrientation( $pickerContent );
                $pickerContent.show();
                $('body').on('click.pickerSelect.'+_token, function(e){
                    $target = $(e.target);
                    if (!$target.is(_this) && !$target.parents('.timePicker-content').length){
                        _closeSelect();
                    }
                });
            }

            function _closeSelect(){
                $('body').off('.'+_token);
                $container.find('.timePicker-content').fadeOut();
                configs.onClose();
            }

            function _setContentOrientation($pickerContent){
                $pickerContent = $($pickerContent);
                var contentRight = _this[0].getBoundingClientRect().left + $pickerContent.outerWidth();
                $pickerContent[ contentRight > window.innerWidth ? 'addClass' : 'removeClass' ]('timePicker-right');
            }

            function _setTime(){
                var timeStamp = '';
                timeStamp += (_currentTime ? _currentTime : '00');
                timeStamp += ':'; 
                timeStamp += (_currentMinute ? _currentMinute : '00');
                _this.val(timeStamp);

                if (_currentTime && _currentMinute){
                    configs.onSelect();
                }
            }

            function _setSelectedCell($cell){
                $cell = $($cell);
                if ($cell.length){
                    $cell.parents('table:first').find('td').removeClass('selected');
                    $cell.addClass('selected');
                } 
                return !!$cell.length;
            }

            function _setEvents(){
                var $hoursItem = $container.find(".timePicker-hours .timePicker-cell")
                ,   $minutesItem = $container.find(".timePicker-minutes .timePicker-cell");
                
                _this.on('keyup.pickerSelect',function(e){
                    var currentTime = this.value.split(':');
                    if (_setSelectedCell($hoursItem.filter('[data-hour="'+ currentTime[0] +'"]'))){
                        _currentTime = currentTime[0];
                    }
                    if (_setSelectedCell($minutesItem.filter('[data-minute="'+ currentTime[1] +'"]'))){
                        _currentMinute = currentTime[1];
                    }
                });
                _this.on('keydown.pickerSelect',function(e){
                    var key = e.keyCode || e.which;
                    if (key == 9 || key == 27){
                        _closeSelect();
                    }
                });
                $hoursItem.on('click',function(e){
                    var $this = $(this);
                    _setSelectedCell($this);
                    _currentTime = $this.attr('data-hour');
                    _setTime();
                });
                $minutesItem.on('click',function(e){
                    var $this = $(this);
                    _setSelectedCell($this);
                    _currentMinute = $this.attr('data-minute');
                    _setTime();
                });

                _this.trigger('keyup.pickerSelect');
            }

            function _setHTML(){
                $container.append(
                    '<div class="timePicker-content">'
                        +'<table class="timePicker-table">'
                            +'<tbody>'
                                +'<tr>'
                                    +'<td class="timePicker-hours">'
                                        +'<div class="timePicker-title">'
                                                +'Horas'
                                        +'</div>'
                                        +'<table class="">'
                                            +'<tbody>'
                                                +'<tr>'
                                                    +'<td class="timePicker-cell" data-hour="00">00</td>'
                                                    +'<td class="timePicker-cell" data-hour="01">01</td>'
                                                    +'<td class="timePicker-cell" data-hour="02">02</td>'
                                                    +'<td class="timePicker-cell" data-hour="03">03</td>'
                                                    +'<td class="timePicker-cell" data-hour="04">04</td>'
                                                    +'<td class="timePicker-cell" data-hour="05">05</td>'
                                                +'</tr>'
                                                +'<tr>'
                                                    +'<td class="timePicker-cell" data-hour="06">06</td>'
                                                    +'<td class="timePicker-cell" data-hour="07">07</td>'
                                                    +'<td class="timePicker-cell" data-hour="08">08</td>'
                                                    +'<td class="timePicker-cell" data-hour="09">09</td>'
                                                    +'<td class="timePicker-cell" data-hour="10">10</td>'
                                                    +'<td class="timePicker-cell" data-hour="11">11</td>'
                                                +'</tr>'
                                                +'<tr>'
                                                    +'<td class="timePicker-cell" data-hour="12">12</td>'
                                                    +'<td class="timePicker-cell" data-hour="13">13</td>'
                                                    +'<td class="timePicker-cell" data-hour="14">14</td>'
                                                    +'<td class="timePicker-cell" data-hour="15">15</td>'
                                                    +'<td class="timePicker-cell" data-hour="16">16</td>'
                                                    +'<td class="timePicker-cell" data-hour="17">17</td>'
                                                +'</tr>'
                                                +'<tr>'
                                                    +'<td class="timePicker-cell" data-hour="18">18</td>'
                                                    +'<td class="timePicker-cell" data-hour="19">19</td>'
                                                    +'<td class="timePicker-cell" data-hour="20">20</td>'
                                                    +'<td class="timePicker-cell" data-hour="21">21</td>'
                                                    +'<td class="timePicker-cell" data-hour="22">22</td>'
                                                    +'<td class="timePicker-cell" data-hour="23">23</td>'
                                                +'</tr>'
                                            +'</tbody>'
                                        +'</table>'
                                    +'</td>'
                                    +'<td class="timePicker-minutes">'
                                        +'<div class="timePicker-title">'
                                            +'Minutos'
                                        +'</div>'
                                        +'<table class="">'
                                            +'<tbody>'
                                                +'<tr>'
                                                    +'<td class="timePicker-cell" data-minute="00">00</td>'
                                                    +'<td class="timePicker-cell" data-minute="05">05</td>'
                                                    +'<td class="timePicker-cell" data-minute="10">10</td>'
                                                +'</tr>'
                                                +'<tr>'
                                                    +'<td class="timePicker-cell" data-minute="15">15</td>'
                                                    +'<td class="timePicker-cell" data-minute="20">20</td>'
                                                    +'<td class="timePicker-cell" data-minute="25">25</td>'
                                                +'</tr>'
                                                +'<tr>'
                                                    +'<td class="timePicker-cell" data-minute="30">30</td>'
                                                    +'<td class="timePicker-cell" data-minute="35">35</td>'
                                                    +'<td class="timePicker-cell" data-minute="40">40</td>'
                                                +'</tr>'
                                                +'<tr>'
                                                    +'<td class="timePicker-cell" data-minute="45">45</td>'
                                                    +'<td class="timePicker-cell" data-minute="50">50</td>'
                                                    +'<td class="timePicker-cell" data-minute="55">55</td>'
                                                +'</tr>'
                                            +'</tbody>'
                                        +'</table>'
                                    +'</td>'
                                +'</tr>'
                            +'</tbody>'
                        +'</table>'
                    +'</div>'
                );
            }
            
            _this.one('focus',function(){
                _setHTML();
                _setEvents();
            });
            _this.on('focus',_openSelect);
        };
        for (var i=0,j=this.length;i<j;i++){
            setup(this[i]);
        }
    }    

    
    $('.timePicker').timePicker();


	// Ativa funcionalidade de DatePicker a qualquer elemento com a classe datePicker
	$('.datePicker').datepicker(Escala.datePickerDefaultConfig);
	// Ativa funcionalidade de TimePicker a qualquer elemento com a classe timePicker
    // if ($.fn.timepicker){
    //     $('.timePicker').timepicker(Escala.timePickerDefaultConfig);
    // }
    // $('.timePicker').timepicki(Escala.timePickerDefaultConfig);
//    $('.timePicker').on('keypress',function(){
//        var $this  = $(this)
//        ,    v = $this.val();
//        if (v.length == 2){
//            v +=':';
//        }
//        $this.val(v);
//    });
//    $('.timePicker').on('blur',function(){
//        var test = (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).test(this.value);
//        if (!test && this.value != '') {
//            $(this).val('');
//        } else {
//            return;
//        }
//    });

    // Por padrão e performance o bootstrap não incializa tooltips
    // durante a carga da página sendo necessário chamada manual
    var $tooltips = $('[data-toggle=tooltip]');
    if ($tooltips.length){
        $tooltips.tooltip();
    }
    
    // Previne Click em item de menu já selecionado (Principalmente em função do IE)
    $('body').on('click','.main-menu-button.selected',function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
    });
//    var $mainMenu = $('.main-menu .main-menu-button');
//    $mainMenu.on('click',function(E){
//        E.preventDefault();
//        $mainMenu.removeClass('active');
//        var menuPos = $(this).addClass('active').index()
//        ,   $menuItems = $('.main-menu-items')
//        ,   $selectedMenu = $($menuItems.get(menuPos));
//        $selectedMenu[(menuPos+1)%2===0?'addClass':'removeClass']('even');
//        $menuItems.hide();
//        $selectedMenu.show();
//        
//        return false;
//    });
    
    var buttonMenuSetup = function(buttonSelector, menuSelector){
        var $menuButton = $(buttonSelector);
        if ($menuButton.length){
            $menuButton.on('click',function(){
                var $this = $(this);
                if ($this.hasClass('open')){
                    $this.removeClass('open');
                    $('body').off('click.buttonMenu');
                } else {
                    $this.addClass('open');
                    $('body').on('click.buttonMenu',function(E){
                        var $target = $(E.target);
                        if (!$target.is(buttonSelector) && 
                            !$target.parents(buttonSelector).length && 
                            !$target.is(menuSelector) && 
                            !$target.parents(menuSelector).length ){
                            $this.removeClass('open');
                        }
                    });
                }
            });
        }    
    }
    
    buttonMenuSetup('.userMenu-button','.userMenu-details');
    buttonMenuSetup('.notification-button','.notification-details');
    buttonMenuSetup('.sysmenu-button','.sysmenu-details');
    
    $('.sysmenu-item.submenu').on('click',function(E){
        E.stopPropagation();
        if ($(E.target).is('.submenu')){
            $(this).toggleClass('open');
        }
    });
    
    window.linkCheckboxes = function($container, mainCheckbox,linkedCheckbox){
        if (!$container.length) return;
        mainCheckbox = mainCheckbox || '.selectAll';
        linkedCheckbox = linkedCheckbox || '.checkBtn:not(.selectAll)';
        var $linkedCheckbox = $container.find(linkedCheckbox);
        
        $container
            // Marcar ou Desmarcar a opção de selecionar todos, reflete pra todas as linhas
            .on('check',mainCheckbox,function(){
                $linkedCheckbox.trigger('check.$');
            })
            .on('uncheck.uncheckAll',mainCheckbox,function(){
                $linkedCheckbox.trigger('uncheck');
            })
            .on('check.verifySelected',linkedCheckbox,function(){
                // Todos os checkbox estão marcados, ativa o checkbox da caixa "TODOS"
                if ($linkedCheckbox.length == $linkedCheckbox.filter('.checked').length){
                    $container.find(mainCheckbox).trigger('check.$');
                }
            })
            .on('uncheck',linkedCheckbox,function(){
                $container.find(mainCheckbox).trigger('uncheck.$');            
            });
    }
    
    window.aplicarSelecionarTodos = function(seletorOrigem){
        var $container = $(seletorOrigem);
        if ($container.length) {
            var $selectAllBtns = $container.find('.tabelaPadrao .selectAll');
            if ($selectAllBtns.length){
                for (var i=0,j=$selectAllBtns.length;i<j;i++){
                    var $currentBtn = $($selectAllBtns[i]);
                    (function(){
                        var columnIndex = $currentBtn.parent().index() + 1
                        ,   columnSelector = ':nth-child('+ columnIndex +')'
                        ,   checkboxesSelector = '.tabelaPadrao '+columnSelector+' .checkBtn:not(.selectAll)';

                        linkCheckboxes(
                            $container,
                            columnSelector+' .selectAll',
                            checkboxesSelector
                        );
                    })();
                }
            }
        }
    }


    //====== BLOQUEIO DA ======//
    linkCheckboxes($('.bloqueio-content .lblDatasBloqueio'),'.selectAll','.checkboxList .checkBtn');
    
    linkCheckboxes($('.dialogEditarBloqueios'),'.selectAll','.checkboxList .checkBtn');
    //====== BLOQUEIO DA ======//
    
    //====== EDIÇÃO PM ======//
    aplicarSelecionarTodos('.dialogConfirmarEscalas');
    //====== EDIÇÃO PM ======//

    //====== REPLICAR TURNO ======//
    aplicarSelecionarTodos('.dialogReplicarTurno');
    //====== REPLICAR TURNO ======//
    
    //====== SELECIONAR DATAS - GERAR ESCALA ======//
    aplicarSelecionarTodos('.dialogSelecionarDatas');
    //====== SELECIONAR DATAS - GERAR ESCALA ======//
	


    $('.missao-box, .holiday-content, .cadevento-content, .cadposto-content, .workplan-box, .my-scale-box')
        .on('click','.btnPesquisar',function(){
            $('.main-content').addClass('showResultSet');
        });
	
    $('.disponibilizacao-content, .cadevento-content, .cadposto-content, .cadhorario-content')
        .on('click','.btnSalvarCadastro',function(){
            //$('.main-content').addClass('showResultSet');
			$('.dialogDisponibilizacao').find('.btnSim').on('click',disponibilizarPM);
			$('.dialogDisponibilizacao').find('.btnNao').on('click',disponibilizarPM);			
        });
		function disponibilizarPM(){
			$('.main-content').addClass('showResultSet');
		};

    $('.visualizarescala-content')
        .on('click','.btnSalvarCadastro',function(){
            $('.main-content').addClass('showResultSet');
            $('.btnSalvarAltera').removeClass('hidden'); 
        })       
        .on('click','.excluir',function(){
            $('.main-content').removeClass('showResultSet');
            $('.btnSalvarAltera').addClass('hidden');
        });
    
    $('.cadhorario-content')
        .on('click','.dialogGerarHorario .btnSalvar',function(){
            $('.btnGerarHorario').hide();
            $('.content-gerarHorario').show();
            $('.dialogGerarHorario').modal('hide');
        });
    
    $('.missao-box, .holiday-content')
        .on('click','.btnSalvarCadastro',function(){
            $('.main-content').addClass('showResultSet');
        })
        .on('change','.lblAbrangencia select',function(){
            $('.holiday-content .lblMunicipio')[ $(this).val() == 3 ? 'show' : 'hide']();
            if ($(this).val() == 3){
                //$('.holiday-content .lblDescr').removeClass("col-md-6").addClass("col-md-3");
                $('.holiday-content .lblDescr').removeClass("col-xs-6").addClass("col-xs-3");
            } else { 
                //$('.holiday-content .lblDescr').addClass("col-md-6").removeClass("col-md-3");
                $('.holiday-content .lblDescr').addClass("col-xs-6").removeClass("col-xs-3");
            }
        })
        .on('check','.checkMeioPeriodo',function(){
            $('.holiday-content .lblHorarioEntrada, .holiday-content .lblHorarioSaida').show();
        })
        .on('uncheck','.checkMeioPeriodo',function(){
            $('.holiday-content .lblHorarioEntrada, .holiday-content .lblHorarioSaida').hide();
        });

    if (typeof $.fn.stacktable === 'function') {
        $('.tabelaResultado, .tabelaResultadoFeriado').stacktable({headIndex:0});
    }
    
    $('.dialogEditarFeriado')
        .on('change','.lblAbrangencia select',function(){
            $('.dialogEditarFeriado .lblMunicipio')[ $(this).val() == 3 ? 'show' : 'hide']();
        })
        .on('check','.checkMeioPeriodo',function(){
            $('.dialogEditarFeriado .lblHorarioEntrada, .dialogEditarFeriado .lblHorarioSaida').show();
        })
        .on('uncheck','.checkMeioPeriodo',function(){
            $('.dialogEditarFeriado .lblHorarioEntrada, .dialogEditarFeriado .lblHorarioSaida').hide();
        })
        .on('click','.btnSalvar2',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.lblDataOriginal,.lblDataNova,.btnSalvar2,.btnCancelar2').hide();
         $modal.find('.gridResultado2,.btnFechar').removeClass('hidden');
         $modal.find('.btsome').removeClass('col-xs-6').addClass('col-xs-12');
        })        
        .on('click','.editar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.gridResultado2,.btnFechar').addClass('hidden');
         $modal.find('.lblDataOriginal,.lblDataNova,.btnSalvar2,.btnCancelar2').show();
         $modal.find('.btsome').removeClass('col-xs-12').addClass('col-xs-6');
        })        
        .on('click','.cancelarEvento',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.gridResultado2,.btnFechar').addClass('hidden');
         $modal.find('.lblDataOriginal,.lblDataNova,.btnSalvar2,.btnCancelar2').show();
         $modal.find('.radioInfo').trigger('click');
        });
    $('.radioInfo').on('click',function(){
        var $modal = $(this).parents('.modal');
        $modal.find('[data-camada]').addClass('hidden');
        $modal.find('[data-camada="informacao"]').removeClass('hidden');
        $modal.find('.btnSalvar,.btnCancelar').show();
        $modal.find('.btsome').addClass('hidden');
    })
    $('.radioAdir').on('click',function(){
        var $modal = $(this).parents('.modal');
        $modal.find('[data-camada]').addClass('hidden');
        $modal.find('[data-camada="adiar"]').removeClass('hidden');
        $modal.find('.btnSalvar,.btnCancelar').hide();
        $modal.find('.btsome').removeClass('hidden');
    });

        $('.dialogRetirarFolga')
        .on('click','.btn-primary,.btnCancelar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.dualListBox, .btsome').removeClass('hidden');
        })                      
        .on('click','.btnSalvar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('[data-camada="Filtros1"], .btsome3').removeClass('hidden');
        })        
        .on('click','.dualListBox-addAll, .dualListBox-add',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('[data-camada="Filtros1"], [data-natureza="porNatureza"], .btsome3').removeClass('hidden');
        })        
        .on('click','.glyphicon, .btnFechar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('[data-camada="Filtros1"], [data-natureza="porNatureza"], .gridResultado, .btsome2, .btsome3, .dualListBox, .btsome').addClass('hidden');
        })                
        .on('click','.btnConfirmar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('[data-camada="Filtros1"], [data-natureza="porNatureza"], .dualListBox, .btsome3').addClass('hidden');
         $modal.find('.gridResultado, .btsome2').removeClass('hidden');
        }) 
        .on('click','.cancelarEvento',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.gridResultado, .btsome2').addClass('hidden');
        });

        $('.selectConOcr').on('change',function() {
            var $modal = $(this).parents('.modal');
            if($(this).val() == 'buscarNatureza') {
                $modal.find('[data-natureza]').addClass('hidden');
                $modal.find('[data-natureza="porNatureza"]').removeClass('hidden');
                $modal.find('.lblNatureza').removeClass('hidden');
        }
            if($(this).val() == 'buscarOcorrencia') {
                $modal.find('[data-natureza]').removeClass('hidden');
                $modal.find('[data-natureza="porOcorrencia"]').removeClass('hidden');                
                $modal.find('.lblNatureza').addClass('hidden');
        }
        });

        $('.dialogIncluirFolga')
        .on('click','.btn-primary, .btnCancelar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.dualListBox,.btsome').removeClass('hidden');
        })                      
        .on('click','.btnSalvar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.gridResultado,.btsome2').removeClass('hidden');
         $modal.find('.dualListBox,.btsome').addClass('hidden');
        })        
        .on('click','.glyphicon, .btnFechar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.gridResultado, .dualListBox, .btsome2, .btsome').addClass('hidden');
        })        
        .on('click','.cancelarEvento',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.gridResultado, .btsome2').addClass('hidden');
        });        

        $('.dialogReverter')
        .on('click','.btn-primary, .btnCancelar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.lblObservacoes,.dualListBox,.btsome').removeClass('hidden');
        })                      
        .on('click','.btnSalvar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.gridResultado,.btsome2').removeClass('hidden');
         $modal.find('.lblObservacoes,.dualListBox,.btsome').addClass('hidden');
        })        
        .on('click','.glyphicon, .btnFechar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.lblObservacoes, .gridResultado, .dualListBox, .btsome2, .btsome').addClass('hidden');
        })         
        .on('click','.folgar',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.lblObservacoes, .gridResultado, .dualListBox, .btsome2, .btsome').addClass('hidden');
        })        
        .on('click','.cancelarEvento',function(){
         var $modal = $(this).parents('.modal');
         $modal.find('.lblObservacoes, .gridResultado, .btsome2').addClass('hidden');
        });

    var $pesquisaEscala = $('.pesquisarescala-content');
    $pesquisaEscala
        .on('click','.radioDiaria,.radioAmbas',function(){
            $pesquisaEscala.find('.lblEvento').hide();
            $pesquisaEscala.find('.lblOpm').removeClass('col-sm-3').addClass('col-sm-6');
        })
        .on('click','.radioExtra',function(){
            $pesquisaEscala.find('.lblEvento').show();
            $pesquisaEscala.find('.lblOpm').removeClass('col-sm-6').addClass('col-sm-3');
        })
        .on('check','.checkLote',function(){
            $pesquisaEscala.find('.lblStatus select').attr('disabled','disabled');
        })
        .on('uncheck','.checkLote',function(){
            $pesquisaEscala.find('.lblStatus select').removeAttr('disabled');
        });

    $('.editarpm-content')
        .on('check','.checkNaoCompareceu',function(){
            $('.lblMotivo').show();
        })
        .on('uncheck','.checkNaoCompareceu',function(){
            $('.lblMotivo').hide();
        });
    $('.workplan-box')
        .on('change','.lblTipoRegime select',function(){
            var $tipoRegimeForm = $('.tipoRegimeForm')
            ,   value = $(this).val();
            $tipoRegimeForm.hide();
            if (value){
                $tipoRegimeForm.filter('[data-regime='+value+']').show();
            }
        })
        .on('click','.radioSim',function(){
            var $box = $('.workplan-box');
            $box.find('.lblVincularRegime, .lblComando, .lblSubordinados, .lblDescrOpm, .dualListBox, .btnIcoPesquisar').hide();
        })
        .on('click','.radioNao',function(){
            var $box = $('.workplan-box');
            $box.find('.lblVincularRegime, .lblComando, .lblSubordinados, .lblDescrOpm, .dualListBox, .btnIcoPesquisar').show();
        });
    $('.dialogEditarRegime')
        .on('click','.radioSim',function(){
            var $dialog = $('.dialogEditarRegime');
            $dialog.find('.lblVincularRegime, .lblComando, .lblSubordinados, .lblDescrOpm, .dualListBox, .btnIcoPesquisar').hide();
        })
        .on('click','.radioNao',function(){
            var $dialog = $('.dialogEditarRegime');
            $dialog.find('.lblVincularRegime, .lblComando, .lblSubordinados, .lblDescrOpm, .dualListBox, .btnIcoPesquisar').show();
        });
    $('.minhaescala-content, .visualizarescala-content, .pesquisarescala-content, .dialogConfirmarMovimentacao, .relatorio-content')
        .on('click','.statusMenu .open',function(){
            $(this).toggleClass('closed');
        });
    
//    var $editDataBox = $('.edit-data-box')
//    ,   $lblPlaca = $editDataBox.find('.lblPlaca')
//    ,   $lblPrefixo = $editDataBox.find('.lblPrefixo');
//    $editDataBox
//        .on('change','.lblViatura select',function(){
//            var value = Number($(this).val()) || 0;
//            switch(value){
//                case 0:
//                    $lblPlaca.hide();
//                    $lblPrefixo.hide();
//                    break;
//                case 2:
//                    $lblPlaca.show();
//                    $lblPrefixo.hide();
//                    break;
//                case 3:
//                    $lblPlaca.hide();
//                    $lblPrefixo.show();
//                    break;
//            }    
//        });
    
    var availableTags = ["36301", "36302", "36303", "36304"];
//    $('.adjust-scale-resultSet .txtAgrupamento').autocomplete({
//        minLength: 0,
//        source: function (request, response) {
//            // delegate back to autocomplete, but extract the last term
//            response(arrayDiff(
//                availableTags,
//                extractLast(request.term)
//            ));
//        },
//        focus: function () {
//            // prevent value inserted on focus
//            return false;
//        },
//        select: function (event, ui) {
//            var terms = split(this.value);
//            // remove the current input
//            terms.pop();
//            // add the selected item
//            terms.push(ui.item.value);
//            // add placeholder to get the comma-and-space at the end
//            terms.push("");
//            this.value = terms.join(",");
//            return false;
//        }
//    });
    function arrayDiff(arrA,arrB){
        var diff = [];
        outerLoop:
        for (var i=0,j=arrA.length;i<j;i++){
            for (var x=0,y=arrB.length;x<y;x++){
                if (arrA[i] === arrB[x]) continue outerLoop;
            }
            diff.push(arrA[i]);
        }
        return diff;
    }
    function extractLast(term) {
        //term = term.replace(/\s/g, "")
        var newList = split(term);
        newList.pop();
        return newList;
    }
    function split(val) {
        return val.split(',');
    }
    
	//upload de arquivo
	$(".uploadFileSimple").change(function() {
    $(this).prev().html($(this).val().replace(/C:\\fakepath\\/i, ''));
    });

	
});


(function(w,$){
    var o = {};
    o.datePickerDefaultConfig = {
        changeMonth: true,
        changeYear: true,
        modal: true,
        dateFormat: 'dd/mm/yy',
        dayNames: ['Dom','Seg','Ter','Quar','Qui','Sex','Sáb'],
        dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
        dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
        nextText: 'Próximo',
        prevText: 'Anterior'
	};

   o.timePickerDefaultConfig = {
        // Opções
        timeSeparator: ':',           // Caracter usado para separar horas e minutos. (padrão: ':') 
        showLeadingZero: true,        // Define se deve ou não exibir o 0 a esquerda para horas < 10.(padrão: true)
        showMinutesLeadingZero: true, // Define se deve ou não exibir o 0 a esquerda para minutos < 10.(padrão: true)
        showPeriod: false,            // Define se deve ou não exibir o AM/PM junto a hora. (padrão: false)
        showPeriodLabels: true,       // Define se o label AM/PM à esqueda é exibido. (padrão: true)
        periodSeparator: ' ',         // O caracter usado para separar a hora do perído (AM/PM).

        // Opções de disparo (trigger)
        showOn: 'focus',              // Define qunado o timepicker é exibido.
                                    // 'focus': quando o input ganha o foco, 
                                    // 'button': quando o botão de disparo é clicado,
                                    // 'both': quando o input ganha foco e quando o botão é clicado.
        button: null,                 // Seletor jQuery que age como botão de disparo (trigger). ex: '#trigger_button'

        // Localização
        hourText: 'Horas',             // Define o texto local para "Horas"
        minuteText: 'Minutos',         // Define o texto local para "Minutos"
        amPmText: ['', ''],       // Define o texto local para os períodos (AM/PM)

        // Posição
        myPosition: 'left top',       // Borda da janela para posicionar, usado com o utilitário jQuery UI Position se estiver disponível.
        atPosition: 'left bottom',    // Borda do input para posicionar

        // Customização de Horas e Minutos
        hours: {
            starts: 0,                // Primeira hora exibida 
            ends: 23                  // Última hora exibida
        },
        minutes: {
            starts: 0,                // Primeiro minuto exibido
            ends: 55,                 // Último minuto exibido
            interval: 5,              // Intervalo de minutos exibido
            manual: []                // Entradas extras opcionais para minutos
        },
        defaultTime: '',
        rows: 4,                      // Número de linhas para a tabela de inputs, mínimo de 2, faz mais sentido se utilizar múltiplo de 2
        showHours: true,              // Define se a seção de horas é exibida ou não. Se definido como false gera uma janela somente de minutos.
        showMinutes: true,            // Define se a seção de minutos é exibida ou não. Se definido como false gera uma janela somente de horas.
   };




//     o.timePickerDefaultConfig = {
//         show_meridian : false,
//         min_hour_value : 0,
//         max_hour_value : 23,
//         overflow_minutes : true,
//         increase_direction : 'up'
// //        disable_keyboard_mobile : true
//     };
    
    o.validateViaturaDialog = function(){
        var $dialog = $('.viaturaDialog')
        ,   $selectTipoViatura = $dialog.find('.selectTipoViatura')
        ,   $selectViatura = $dialog.find('.selectViatura')
        ,   $txtViatura = $dialog.find('.txtViatura')
        ,   $txtPlacaViatura  = $dialog.find('.txtPlacaViatura')
        ,   isValid = false;
        switch ($selectTipoViatura.val()){
            case '1':
                // Há preenchimento no select ?
                isValid = $.trim($selectViatura.val()) != '';
                break;
            case '2':
                // Há preenchimento de PLACA E a placa é válida ?
                isValid = $txtPlacaViatura.val() != '' && Boolean($txtPlacaViatura.val().match(/[a-zA-Z]{3}[0-9]{4}/));
                break;
            case '3':
                // Há preenchimento do Prefixo ?
                isValid = $.trim($txtViatura.val()) != '';
                break;
        }
        return isValid;
    }

    o.setImprimirDialogEvents = function(){
        var $dialog = $(this);
        $dialog
            .off('*')
            .on('click','.btnImprimir, .btnCancelar',function(){
                $dialog.dialog('close');
            });
    }

    o.scrollToElement = function($element){
        $('html, body').animate({
            scrollTop: $($element).offset().top
        }, 800);
        
    }
    
    function filterTable (input, tableID){
        var words = input.value.toLowerCase().split(" ")
        ,   table = document.getElementById(tableID)
        ,   elem;
        for (var r = 1; r < table.rows.length; r++){
            elem = table.rows[r].innerHTML.replace(/<[^>]+>/g,"");
            var displayStyle = 'none';
            for (var i = 0; i < words.length; i++) {
                if (elem.toLowerCase().indexOf(words[i])>=0)
                    displayStyle = '';
                else {
                    displayStyle = 'none';
                    break;
                }
            }
            table.rows[r].style.display = displayStyle;
        }
    }


    w.Escala = o;
})(window,jQuery);


// -------------------------------------------------------------
//   Cycle By Pages
// -------------------------------------------------------------
(function () {
    if (!$.fn.sly) {
        return;
    }
    
    var $frame = $('#cyclepages');
    var $wrap  = $frame.parent();

    // Call Sly on frame
    $frame.sly({
        activateOn: 'click',
        activatePageOn: 'click',
        clickBar: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        easing: 'easeOutExpo',
        elasticBounds: 1,
        horizontal: 1,
        itemNav: 'basic',
        mouseDragging: 1,
        smart: 1,
        startAt: 0,
        releaseSwing: 1,
//        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        speed: 300,
        touchDragging: 1,
        // Cycling
        cycleBy: 'pages',
        cycleInterval: 1000,
        pauseOnHover: 1,
        startPaused: 1,
        // Buttons
        prevPage: $wrap.find('.prevPage'),
        nextPage: $wrap.find('.nextPage')
    });
}());


//onclick="$('#md1').modal('show');"
$(document).on('click','.btn-add-viatura', function(){
		//$('.dialogInclusao.p1').show();
		$(this).addClass('changeThis');
		/*var viatura = $('.tipoViatura option:selected').text();
		$('.btn-add-viatura').html(viatura);*/
});

$(document).on('click','.btn-add-viatura-modal', function(){
		//$('.dialogInclusao.p1').show();
		var viatura = $('.tipoViatura option:selected').text();
		$('.changeThis').html(viatura);
		$('.changeThis').removeClass('changeThis');
});

// INICIO
$(document).on('keyup', 'input.filtro-select', function(){

	var $rows = $(this).siblings('div');
   var val = $.trim(this.value).toUpperCase();
   if (val === ""){
	   $rows.show();
   }
   else {
	   $rows.hide();
	   //$rows.has("span:contains(" + val + ")").show();
	   
	   $rows.filter(function() {
			return -1 != $(this).text().toUpperCase().indexOf(val);
		}).show();
   }
});

var x, i, j, selElmnt, a, b, c;
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  
  finput = document.createElement("input");
  finput.setAttribute("class","filtro-select")
  finput.setAttribute("placeholder","Filtro...")
  b.append(finput);
  for (j = 1; j < selElmnt.length; j++) {
    c = document.createElement("DIV");
	c.setAttribute('value', selElmnt.options[j].value);
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
	  e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/*click outside da box*/
document.addEventListener("click", function(e){
	if($(e.target).closest(".filtro-select").length == 0){
		closeAllSelect();
	}
	});
// FIM	

var valueselect = 8;
$(document).on('click','.btnadd', function(){
		var valueselect = valueselect + 1;
		var texto = $('.addfuncao').val();
		//console.log('sage');
		var x = document.getElementById("selectfuncoes");
		var optionx = document.createElement("option");
		optionx.text = texto;
		x.add(optionx);
});
$(document).on('click','#saveQtdeF',function(){
	//console.log('sage');
	$('.qtde-vagas label').remove();
	$('.dualListBox-target option').each(function(){
		let nome = $(this).html();
		$('.qtde-vagas').append('<label class="col-xs-12 qtdeLabel">'+nome+'<input class="formField qtdeInput" type="text" /></label>');
	});
	
});

$(document).on('click','.changeTab button',function(){
	$('.changeTab button').removeClass('active');
	$(this).addClass('active');
	console.log('_'+$(this).html()+'_');
	switch($(this).html()){
		case "Aguardando Aprovação":
			$('.wrap-grid').css('display','none');
			$('.tblAprovar').css('display','block');
			break;
			
		case "Aprovadas":
			$('.wrap-grid').css('display','none');
			$('.tblFinalizar').css('display','block');
			break;
			
		case "Finalizados":
			$('.wrap-grid').css('display','none');
			$('.tblFinalizados').css('display','block');
			break;
			
		case "Todos":
			$('.wrap-grid').css('display','none');
			$('.tblTodos').css('display','block');
			break;
			
		default:
			break;
	}
	/*
	if($(this).html() == "Aguardando Aprovação"){
		$('.wrap-grid').css('display','none');
		$('.tblAprovar').css('display','block');
	}
	
	else{
		$('.wrap-grid').css('display','none');
		$('.tblFinalizar').css('display','block');
	}*/
	
});


$(document).on('click','.changeGrid',function(){
		$('.changeGrid2').removeClass('active');
		$('.changeGrid3').removeClass('active')
		$(this).addClass('active');
		$('.wrap-grid').removeClass('doubleGrid2');
		$('.wrap-grid').removeClass('doubleGrid');
		$('.changeTab').show();
		$('.wrap-grid').hide();
		$('.tblAprovar').show();
});

$(document).on('click','.changeGrid2',function(){
		$('.changeGrid').removeClass('active');
		$('.changeGrid3').removeClass('active')
		$(this).addClass('active');
		$('.wrap-grid').removeClass('doubleGrid2');
		$('.wrap-grid').addClass('doubleGrid');
		$('.changeTab').hide();
		$('.wrap-grid').show();
});

$(document).on('click','.changeGrid3',function(){
		$('.changeGrid').removeClass('active');
		$('.changeGrid2').removeClass('active');
		$(this).addClass('active');
		$('.wrap-grid').removeClass('doubleGrid');
		$('.wrap-grid').addClass('doubleGrid2');
		$('.changeTab').hide();
		$('.wrap-grid').show();
		$('.tblTodos').hide();
});
$(document).on('click','label.checkBtn',function(){
		$(this).parent().parent().toggleClass('selected');
});

$(document).on('click','.gridCustomTit .sel',function(){
		$('label.checkBtn').click();
});

$(document).on('click','.listaOpm ul li.expandir', function(){
	//$(this).parent().children('ul').toggle();
	
	if($(this).html() == '+'){
		$(this).html('-');
		where = $(this).parent();
		$(this).parent().children('ul').show();
		//loadData('http://esb.dp.intranet.policiamilitar.sp.gov.br:8283/consultarsubordinadasqpo/v1', $(this).attr('id'), where);
	}
	else{
		$(this).html('+');
		$(this).parent().children('ul').hide();
	}
});



$(document).on('click','.opms li span', function(){
		console.log('teste');
		if($(this).html() == '-'){
			$(this).html('+');
		}
		else{
			$(this).html('-');
		}
		$(this).toggleClass('hideOPM');
		$(this).parent().next().toggle();
		
		/*if($(this).children('span').html() == '-'){
			$(this).children('span').html('+');
		}
		else{
			$(this).children('span').html('-');
		}
		$(this).children('span').toggleClass('hideOPM');
		$(this).next().toggle();
		*/
		//loadDataX('http://esb.dp.intranet.policiamilitar.sp.gov.br:8283/consultarsubordinadasqpo/v1',$(this).attr('for'),$(this).next('ul'));
});


// $.get("header.html", function (data) {
// 	$("body").prepend(data);
// });