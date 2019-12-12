/*!
    Plugin jQuery para adição e extenção de funcionalidades para tabelas.
    - Adiciona coluna adicional à esquerda para seleção da linha via Checkbox;
    - Controla evento de click nas colunas da linha para seleção da linha (e executa o 'check' no checkbox);

*/

;(function($, window, document){
    var pluginName = 'activeTable'
    // Opções de configuração padrão do plugin
    // Caso não sejam informados, o plugin assume esses valores
    ,   defaultOptions = {
        // Retorna o conteúdo que será inserido na primeira coluna de cada linha da tabela
         defaultCheckButton : function(){
            return $('<input type="checkbox"/>');
        }
        // Classe para ser aplicada nas linhas selecionadas
        ,activeRowClass : 'selectedRow'
        // Seletor para indicar elementos que não podem ser considerados alvos para seleção da linha
        // Ex.: Botões/Ícones de ações no Grid
        ,exceptionSelector : '.activeTableControl'
        // Função disparada quando uma linha é selecionada
        ,onRowSelect : function(){
            $(this).find('td:first input[type="checkbox"]')[0].checked = true;
        }
        // Função disparada quando uma linha é desselecionada
        ,onRowDeselect : function(){
            $(this).find('td:first input[type="checkbox"]')[0].checked = false;
        }
    };

    // Plugin factory/construtor
    function Plugin(element, options){
        this.element = element;
        // Sobrescreve as opções padrão com as enviadas
        this.options = $.extend({},defaultOptions, options);
        
        this.init();
    }
    
    // Inicialização do Plugin
    Plugin.prototype.init = function(){
        this.$element = $(this.element);
        // Evita que o plugin de erro, caso seja chamado
        // em um elemento que não seja um TABLE
        if (this.$element.is('table')){
            structureSetup.call(this);
            setEvents.call(this);
        }
    }

    function structureSetup(){
        var $bodyRows = this.$element.find('tbody tr');
        this.$element.find('thead tr').prepend('<th>');
        $bodyRows.prepend('<td>');
        var $containers = $bodyRows.find('td:first');
        for (var i=0,j=$containers.length;i<j;i++){
            var current = $containers[i];
            $(current).append( this.options.defaultCheckButton() );
        }
    };
    
    function setEvents(){
        var _this = this
        ,   $bodyRows = this.$element.find('tbody tr');
        $bodyRows.on('click',function(E){
            if (!$(E.target).is(_this.options.exceptionSelector)){
                $(this).toggleClass(_this.options.activeRowClass);
                if ($(this).hasClass(_this.options.activeRowClass)){
                    _this.options.onRowSelect.call(this);
                } else {
                    _this.options.onRowDeselect.call(this);
                }
            }
            return;
        });
    }

    // Registro do plugin
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Plugin( this, options ));
            }
        });
    }

})(jQuery, window, document);