/* 
 * Author: @senthil2rajan
 * plugin: timepicker
 * website: senthilraj.github.io/Timepicki
 */
(function ($) {

    $.fn.timepicki = function (options) {

        var defaults = {
            format_output: function (tim, mini, meri) {
                if (settings.show_meridian) {
                    return tim + ":" + mini + " : " + meri;
                } else {
                    return tim + ":" + mini;
                }
            },
            increase_direction: 'down',
            custom_classes: '',
            min_hour_value: 1,
            max_hour_value: 12,
            show_meridian: true,
            step_size_hours: '1',
            step_size_minutes: '1',
            overflow_minutes: false,
            disable_keyboard_mobile: false,
            reset: false

        };

        var settings = $.extend({}, defaults, options);

        return this.each(function () {

            var ele = $(this);

            $(ele).wrap("<div class='time_pick'>");
            var ele_par = $(this).parents(".time_pick");

            // developer can specify which arrow makes the numbers go up or down
            var top_arrow_button = (settings.increase_direction === 'down') ?
				"<div class='prev action-prev'></div>" :
				"<div class='prev action-next'></div>";
            var bottom_arrow_button = (settings.increase_direction === 'down') ?
				"<div class='next action-next'></div>" :
				"<div class='next action-prev'></div>";

            var new_ele = $(
				"<div class='timepicker_wrap " + settings.custom_classes + "'>" +
					"<div class='arrow_top'></div>" +
					"<div class='time'>" +
						top_arrow_button +
						"<div class='ti_tx'><input type='text' class='timepicki-input'" + (settings.disable_keyboard_mobile ? "readonly" : "") + "></div>" +
						bottom_arrow_button +
					"</div>" +
					"<div class='mins'>" +
						top_arrow_button +
						"<div class='mi_tx'><input type='text' class='timepicki-input'" + (settings.disable_keyboard_mobile ? "readonly" : "") + "></div>" +
						bottom_arrow_button +
					"</div>");
            if (settings.show_meridian) {
                new_ele.append(
					"<div class='meridian'>" +
						top_arrow_button +
						"<div class='mer_tx'><input type='text' class='timepicki-input' readonly></div>" +
						bottom_arrow_button +
					"</div>");
            }
            if (settings.reset) {
                new_ele.append(
					"<div><a href='#' class='reset_time'>Reset</a></div>");
            }
            ele_par.append(new_ele);
            var ele_next = $(this).next(".timepicker_wrap");
            var ele_next_all_child = ele_next.find("div");
            var inputs = ele_par.find('input');

            $('.reset_time').on("click", function (event) {
                ele.val("");
                close_timepicki();
            });
            $(".timepicki-input").keydown(function (keyevent) {
                var len = $(this).val().length;

                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(keyevent.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    (keyevent.keyCode == 65 && keyevent.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (keyevent.keyCode >= 35 && keyevent.keyCode <= 39)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((keyevent.shiftKey || (keyevent.keyCode < 48 || keyevent.keyCode > 57)) &&
                (keyevent.keyCode < 96 || keyevent.keyCode > 105) || len == 2) {
                    keyevent.preventDefault();
                }

            });

            // open or close time picker when clicking
            $(document).on("click", function (event) {

                if (!$(event.target).is(ele_next) && ele_next.css("display") == "block" && !$(event.target).is($('.reset_time'))) {

                    if (!$(event.target).is(ele)) {

                        set_value(event, !is_element_in_timepicki($(event.target)));
                    } else {
                        var ele_lef = 0;

                        ele_next.css({
                            "top": (ele.outerHeight() + 10) + "px",
                            "left": ele_lef + "px"
                        });
                        open_timepicki();
                    }
                }
            });

            // open the modal when the user focuses on the input
            ele.on('focus', open_timepicki);

            //// select all text in input when user focuses on it
            inputs.on('focus', function () {

                var input = $(this);
                if (!input.is(ele)) {
                    input.select();
                }
            });


            inputs.on('keypress', function (evt) {

                var charCode = (evt.which) ? evt.which : event.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57) || evt === "NaN") {
                    return false;
                }

                var $this = $(this)
                , v = $this.val();
                if (v.length == 2) {
                    v += ':';
                }
                $this.val(v);

                return true;

            });


            // allow user to increase and decrease numbers using arrow keys
            inputs.on('keydown', function (e) {

                var direction, input = $(this);

                // UP
                if (e.which === 38) {
                    if (settings.increase_direction === 'down') {
                        direction = 'prev';
                    } else {
                        direction = 'next';
                    }
                    // DOWN
                } else if (e.which === 40) {
                    if (settings.increase_direction === 'down') {
                        direction = 'next';
                    } else {
                        direction = 'prev';
                    }
                }

                if (input.closest('.timepicker_wrap .time').length) {
                    change_time(null, direction);
                } else if (input.closest('.timepicker_wrap .mins').length) {
                    change_mins(null, direction);
                } else if (input.closest('.timepicker_wrap .meridian').length && settings.show_meridian) {
                    change_meri(null, direction);
                }

                if (input.closest('.timePicker').length) {

                    //valida quantidade de caracteres
                    if (input.val().length === 5 && (e.key !== "Del" && e.key !== "Backspace" && e.key !== "Left" && e.key !== "Right")) {
                        return false;
                    }

                    //separa hora de minuto
                    var hora = input.val() + e.key;
                    var horaSplit = hora.split(":");

                    var cur_cli = "";
                    var valida = "";

                    //bloqueia as teclas abaixo quando não tem nada na caixa de texto do formulário
                    if ((e.key === "Left" || e.key === "Up" || e.key === "Down" || e.key === "Right" || e.key === "Home" || e.key === "Enter") && input.val() === "") {
                        return false;
                    }

                    //Só deixa usar o del quando todos os campos foram selecionados
                    if (e.key === "Del") {
                        if (e.delegateTarget.selectionStart === 0 && e.delegateTarget.selectionEnd === 5) {

                        } else {
                            return false;
                        }
                    }

                    if (hora.length < 3) {

                        cur_cli = "time";

                        if (horaSplit[0].length < 2) {
                            //valida primeiro número da hora
                            valida = Number(horaSplit[0]) < 3 ? horaSplit[0] + "0" : "00";

                        } else {
                            //valida primeiro e segundo número
                            valida = valida_hora(horaSplit[0]);

                        }
                        ele_next.find("." + cur_cli + " .ti_tx input").val(valida);
                    }
                    else if (hora.length === 3) {
                        //Utiliza na primeira vez insere o primeiro número do minuto, porque vem sem o dois ponto(:)
                        cur_cli = "mins";

                        valida = Number(horaSplit[0].substring(2)) < 6 ? horaSplit[0].substring(2) + "0" : "00";
                        ele_next.find("." + cur_cli + " .mi_tx input").val(valida);

                    } else if (hora.length > 3 && hora.length < 6) {
                        cur_cli = "mins";
                        if (horaSplit[1].length < 2) {
                            //Valida o primeiro número do minuto
                            valida = Number(horaSplit[1]) < 6 ? horaSplit[1] + "0" : "00";

                        } else {
                            //valida primeiro e segundo número
                            valida = valida_minuto(horaSplit[1]);
                        }

                        ele_next.find("." + cur_cli + " .mi_tx input").val(valida);
                    }

                    //Valida quando insere zeros
                    if (valida === "00" && horaSplit[0] !== "0" && (horaSplit[0].substring(2) !== undefined && horaSplit[0].substring(2) !== "0")
                       && horaSplit[0] !== "00" && (horaSplit[1] === undefined || (horaSplit[1] !== undefined && (horaSplit[1] !== "00" && horaSplit[1] !== "0")))) {

                        return false;
                    } else {
                        return true;
                    }

                } else {

                    set_value();
                }

            });

            // close the modal when the time picker loses keyboard focus
            inputs.on('blur', function () {

                if (ele.val() === "") {
                    ele_next.find(".ti_tx input").val("00");
                    ele_next.find(".mi_tx input").val("00");
                }

                setTimeout(function () {
                    var focused_element = $(document.activeElement);
                    if (focused_element.is(':input') && !is_element_in_timepicki(focused_element)) {

                        set_value();
                        close_timepicki();
                    }
                }, 0);
            });

            inputs.on("setTime", function (e, hora, minuto, tipo) {

                var array = [hora, minuto, tipo];
                set_date(array);
            });

            function valida_time(regex, time, tipo, input) {
                if (time.length === 1) {
                    time = time + "0";
                }

                var valida = regex.exec(time);

                var value = "";
                var tx = "ti_tx";

                if (tipo !== "time") {
                    tx = "mi_tx";
                }

                if (valida == null) {
                    value = input.length === 1 ? input + "0" : input;
                    ele_next.find("." + tipo + " ." + tx + "input").val(value);
                    return false;

                } else {
                    value = time;
                    ele_next.find("." + tipo + " ." + tx + "input").val(value);
                    return true;
                }
            }

            function valida_hora(hora) {
                var ele_st = Number(settings.min_hour_value);
                var ele_en = Number(settings.max_hour_value);

                if (Number(hora) > ele_en || Number(hora) < ele_st) {
                    return "00";
                } else {
                    return hora;
                }
            }

            function valida_minuto(minuto) {

                if (Number(minuto) >= "0" && Number(minuto) < "60") {
                    return minuto;
                } else {
                    return "00";
                }
            }

            function is_element_in_timepicki(jquery_element) {
                return $.contains(ele_par[0], jquery_element[0]) || ele_par.is(jquery_element);
            }

            function set_value(event, close) {

                // use input values to set the time
                var tim = ele_next.find(".ti_tx input").val();
                var mini = ele_next.find(".mi_tx input").val();
                var meri = "";
                if (settings.show_meridian) {
                    meri = ele_next.find(".mer_tx input").val();
                }

                if (tim !== undefined && mini !== undefined && tim.length !== 0 && mini.length !== 0 && (!settings.show_meridian || meri.length !== 0)) {
                    // store the value so we can set the initial value
                    // next time the picker is opened

                    if (tim == "00" && mini == "00" && (close == undefined || close)) {

                        if (ele.val() != "") {
                            ele.val("00:00");
                        }

                        close_timepicki();
                        return;
                    }

                    ele.attr('data-timepicki-tim', tim);
                    ele.attr('data-timepicki-mini', mini);

                    if (settings.show_meridian) {
                        ele.attr('data-timepicki-meri', meri);
                        // set the formatted value
                        ele.val(settings.format_output(tim, mini, meri));
                    } else {

                        ele.val(settings.format_output(tim, mini));
                    }
                    ele.trigger('timeChange');
                }

                if (close) {
                    close_timepicki();
                }
            }

            function open_timepicki() {

                //set_date(settings.start_time);
                ele_next.fadeIn();
                // focus on the first input and select its contents

                var first_input = ele_next.find('input:visible').first();
                //first_input.focus();

                // if the user presses shift+tab while on the first input,
                // they mean to exit the time picker and go to the previous field
                var first_input_exit_handler = function (e) {

                    if (e.which === 9 && e.shiftKey) {
                        first_input.off('keydown', first_input_exit_handler);
                        var all_form_elements = $(':input:visible:not(.timepicki-input)');
                        var index_of_timepicki_input = all_form_elements.index(ele);
                        var previous_form_element = all_form_elements.get(index_of_timepicki_input - 1);
                        previous_form_element.focus();
                    }
                };
                first_input.on('keydown', first_input_exit_handler);
            }

            function close_timepicki() {
                ele_next.fadeOut();

            }

            function set_date(start_time) {
                var d, ti, mi, mer;

                if (typeof start_time === 'object') {
                    ti = Number(start_time[0]);
                    mi = Number(start_time[1]);
                    if (settings.show_meridian) {
                        mer = start_time[2];
                    }
                    // default is we will use the current time
                } else {
                    d = new Date();
                    ti = d.getHours();
                    mi = d.getMinutes();
                    mer = "AM";
                    if (12 < ti && settings.show_meridian) {
                        ti -= 12;
                        mer = "PM";
                    }
                }

                if (ti < 10) {
                    ele_next.find(".ti_tx input").val("0" + ti);
                } else {
                    ele_next.find(".ti_tx input").val(ti);
                }
                if (mi < 10) {
                    ele_next.find(".mi_tx input").val("0" + mi);
                } else {
                    ele_next.find(".mi_tx input").val(mi);
                }
                if (settings.show_meridian) {
                    if (mer < 10) {
                        ele_next.find(".mer_tx input").val("0" + mer);
                    } else {
                        ele_next.find(".mer_tx input").val(mer);
                    }
                }
            }

            function change_time(cur_ele, direction) {
                var cur_cli = "time";
                var cur_time = Number(ele_next.find("." + cur_cli + " .ti_tx input").val());
                var ele_st = Number(settings.min_hour_value);
                var ele_en = Number(settings.max_hour_value);
                var step_size = Number(settings.step_size_hours);
                if ((cur_ele && cur_ele.hasClass('action-next')) || direction === 'next') {
                    if (cur_time + step_size > ele_en) {
                        var min_value = ele_st;
                        if (min_value < 10) {
                            min_value = '0' + min_value;
                        } else {
                            min_value = String(min_value);
                        }
                        ele_next.find("." + cur_cli + " .ti_tx input").val(min_value);
                    } else {
                        cur_time = cur_time + step_size;
                        if (cur_time < 10) {
                            cur_time = "0" + cur_time;
                        }
                        ele_next.find("." + cur_cli + " .ti_tx input").val(cur_time);
                    }
                } else if ((cur_ele && cur_ele.hasClass('action-prev')) || direction === 'prev') {
                    if (cur_time - step_size <= 0) {
                        var max_value = ele_en;
                        if (max_value < 10) {
                            max_value = '0' + max_value;
                        } else {
                            max_value = String(max_value);
                        }
                        ele_next.find("." + cur_cli + " .ti_tx input").val(max_value);
                    } else {
                        cur_time = cur_time - step_size;
                        if (cur_time < 10) {
                            cur_time = "0" + cur_time;
                        }
                        ele_next.find("." + cur_cli + " .ti_tx input").val(cur_time);
                    }
                }
            }

            function change_mins(cur_ele, direction) {
                var cur_cli = "mins";
                var cur_mins = Number(ele_next.find("." + cur_cli + " .mi_tx input").val());
                var ele_st = 0;
                var ele_en = 59;
                var step_size = Number(settings.step_size_minutes);
                if ((cur_ele && cur_ele.hasClass('action-next')) || direction === 'next') {
                    if (cur_mins + step_size > ele_en) {
                        ele_next.find("." + cur_cli + " .mi_tx input").val("00");
                        if (settings.overflow_minutes) {
                            change_time(null, 'next');
                        }
                    } else {
                        cur_mins = cur_mins + step_size;
                        if (cur_mins < 10) {
                            ele_next.find("." + cur_cli + " .mi_tx input").val("0" + cur_mins);
                        } else {
                            ele_next.find("." + cur_cli + " .mi_tx input").val(cur_mins);
                        }
                    }
                } else if ((cur_ele && cur_ele.hasClass('action-prev')) || direction === 'prev') {
                    if (cur_mins - step_size <= -1) {
                        ele_next.find("." + cur_cli + " .mi_tx input").val(ele_en + 1 - step_size);
                        if (settings.overflow_minutes) {
                            change_time(null, 'prev');
                        }
                    } else {
                        cur_mins = cur_mins - step_size;
                        if (cur_mins < 10) {
                            ele_next.find("." + cur_cli + " .mi_tx input").val("0" + cur_mins);
                        } else {
                            ele_next.find("." + cur_cli + " .mi_tx input").val(cur_mins);
                        }
                    }
                }
            }

            function change_meri(cur_ele, direction) {
                var cur_cli = "meridian";
                var ele_st = 0;
                var ele_en = 1;
                var cur_mer = null;
                cur_mer = ele_next.find("." + cur_cli + " .mer_tx input").val();
                if ((cur_ele && cur_ele.hasClass('action-next')) || direction === 'next') {
                    if (cur_mer == "AM") {
                        ele_next.find("." + cur_cli + " .mer_tx input").val("PM");
                    } else {
                        ele_next.find("." + cur_cli + " .mer_tx input").val("AM");
                    }
                } else if ((cur_ele && cur_ele.hasClass('action-prev')) || direction === 'prev') {
                    if (cur_mer == "AM") {
                        ele_next.find("." + cur_cli + " .mer_tx input").val("PM");
                    } else {
                        ele_next.find("." + cur_cli + " .mer_tx input").val("AM");
                    }
                }
            }

            // handle clicking on the arrow icons
            var cur_next = ele_next.find(".action-next");
            var cur_prev = ele_next.find(".action-prev");
            $(cur_prev).add(cur_next).on("click", function () {
                var cur_ele = $(this);
                if (cur_ele.parent().attr("class") == "time") {
                    change_time(cur_ele);
                } else if (cur_ele.parent().attr("class") == "mins") {
                    change_mins(cur_ele);
                } else {
                    if (settings.show_meridian) {
                        change_meri(cur_ele);
                    }
                }
            });

        });
    };

}(jQuery));
