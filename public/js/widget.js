(function ($) {
    'use strict';

    Object.size = function (obj) {
        return Object.keys(obj).length;
    };

    window.GmzWidget = {
        init: function () {
            var base = this;
            $(document).ready(function () {
                base.initGetWidget();
            });
        },
        dateFormat: function(date){
            d = date.split("-");

            var d = new Date(d[0], d[1], d[2]);
            var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
            var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
            var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
            return `${da} ${mo} ${ye}`;
        },
        currencyFormat: function(price ,symbol, position = null){
            if(position === 'right'){
                return price + symbol;
            }else if(position === 'right_space'){
                return price + ' ' + symbol;
            }else if(position === 'left_space'){
                return symbol + ' ' + price;
            }else{
                return symbol + price;
            }
        },
        initGetWidget: function(){
            var base = this;
            $(".getWidget").each(function () {
                var t = $(this),
                    widget = t.data('widget'),
                    userID = t.data('id'),
                    params = t.data('params'),
                    action = t.data('action');
                params = (params === "undefined")? null : params;

                $.ajax({
                    method: "GET",
                    url: action,
                    data: {
                        widget: widget,
                        userID: userID,
                        params: params,
                    }
                }).done(function (data, status) {
                    t.after(data);
                    t.hide();
                    base.callbackAfterDoneAjax(widget,action,userID);
                }).fail(function (status) {
                    var context = this;
                    $.ajax(context).done(function (data, status) {
                        t.after(data);
                        t.hide();
                        base.callbackAfterDoneAjax(widget, action, userID);
                    });
                });
            });
        },
        callbackAfterDoneAjax: function(widget,action,userID){
            console.log(widget);
            switch (widget) {
                case 'widgetRevenue':
                    this.widgetRevenue(widget,action,userID);
                    break;
                case 'widgetIncomeStatistics':
                    this.widgetIncomeStatistics(widget,action,userID);
                    break;
                case 'widgetTransactions':
                    break;
                case 'widgetTotalOrders':
                    this.widgetTotalOrders(widget,action,userID);
                    break;
                case 'widgetTotalEarnings':
                    this.widgetTotalEarnings(widget,action,userID);
                    break;
                case 'widgetTotalCommission':
                    this.widgetTotalCommission(widget,action,userID);
                    break;
                case 'widgetNetEarnings':
                    this.widgetNetEarnings(widget,action,userID);
                    break;
                default:
                    break;
            }
        },
        widgetRevenue: function(widget,action,userID, idActive = false){
            var numberOfOrder, text, money;
            var base = this;
            var t = $('#widgetRevenue');
            var data = t.data('json');
            var subtitle = t.data('subtitle');
            var symbolType = t.data('symbol');

            var options1 = {
                chart: {
                    fontFamily: 'Nunito, sans-serif',
                    height: 365,
                    type: 'area',
                    zoom: {
                        enabled: false
                    },
                    dropShadow: {
                        enabled: true,
                        opacity: 0.3,
                        blur: 5,
                        left: -7,
                        top: 22
                    },
                    toolbar: {
                        show: false
                    },
                },
                colors: ['#1b55e2', '#e7515a'],
                dataLabels: {
                    enabled: false
                },
                markers: {
                    discrete: [{
                        seriesIndex: 0,
                        dataPointIndex: 7,
                        fillColor: '#000',
                        strokeColor: '#000',
                        size: 5
                    }, {
                        seriesIndex: 2,
                        dataPointIndex: 11,
                        fillColor: '#000',
                        strokeColor: '#000',
                        size: 4
                    }]
                },
                subtitle: {
                    text: subtitle,
                    align: 'left',
                    margin: 0,
                    offsetX: -10,
                    offsetY: 35,
                    floating: false,
                    style: {
                        fontSize: '14px',
                        color:  '#888ea8'
                    }
                },
                title: {
                    text: data.total,
                    align: 'left',
                    margin: 0,
                    offsetX: -10,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '25px',
                        color:  '#0e1726'
                    },
                },
                stroke: {
                    show: true,
                    curve: 'smooth',
                    width: 2,
                    lineCap: 'square'
                },
                series: data.series,
                labels: data.labels,
                xaxis: {
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    crosshairs: {
                        show: true
                    },
                    labels: {
                        offsetX: 0,
                        offsetY: 5,
                        style: {
                            fontSize: '10px',
                            fontFamily: 'Nunito, sans-serif',
                            cssClass: 'apexcharts-xaxis-title',
                        },
                    },
                },
                yaxis: {
                    opposite: false,
                    labels: {
                        formatter: function (value) {
                            return base.currencyFormat(value,symbolType.symbol,symbolType.position)
                        },
                        offsetX: -22,
                        offsetY: 0,
                        style: {
                            fontSize: '12px',
                            fontFamily: 'Nunito, sans-serif',
                            cssClass: 'apexcharts-yaxis-title',
                        },
                    }
                },
                grid: {
                    borderColor: '#e0e6ed',
                    strokeDashArray: 5,
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },
                    yaxis: {
                        lines: {
                            show: false,
                        }
                    },
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: -10
                    },
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    offsetY: -50,
                    fontSize: '16px',
                    fontFamily: 'Nunito, sans-serif',
                    markers: {
                        width: 10,
                        height: 10,
                        strokeWidth: 0,
                        strokeColor: '#fff',
                        fillColors: undefined,
                        radius: 12,
                        onClick: undefined,
                        offsetX: 0,
                        offsetY: 0
                    },
                    itemMargin: {
                        horizontal: 0,
                        vertical: 20
                    }
                },
                tooltip: {
                    theme: 'dark',
                    marker: {
                        show: true,
                    },
                    x: {
                        show: false,
                    },
                    y: {
                        formatter: function(value, opts) {
                            numberOfOrder = opts.w.config.series[opts.seriesIndex].description[opts.dataPointIndex];
                            text = 'orders';
                            if(numberOfOrder === 1){
                                text = 'order'
                            }
                            money =  base.currencyFormat(opts.series[opts.seriesIndex][opts.dataPointIndex],symbolType.symbol,symbolType.position);
                            return (
                                money +
                                '<span class="ml-2 font-weight-light">(' +
                                numberOfOrder + ' ' + text + ')</span>'
                            )
                        }
                    }
                },
                fill: {
                    type:"gradient",
                    gradient: {
                        type: "vertical",
                        shadeIntensity: 1,
                        inverseColors: !1,
                        opacityFrom: .28,
                        opacityTo: .05,
                        stops: [45, 100]
                    }
                },
                responsive: [{
                    breakpoint: 575,
                    options: {
                        legend: {
                            offsetY: -30,
                        },
                    },
                }]
            };
            //check rtl
            if($('body').hasClass("is-rtl")){
                options1.yaxis.opposite = true;
                options1.yaxis.labels.offsetX = 0;
                (options1.series).reverse();
                (options1.labels).reverse();
                options1.title.align = 'right';
                options1.title.offsetX = 0;
                options1.subtitle.align = 'right';
                options1.subtitle.offsetX = 0;
            }

            var chart1 = new ApexCharts(
                document.querySelector("#revenueMonthly"),
                options1
            );
            chart1.render();
            //set active button
            base.searchRangeDate();
            if (idActive){
                $("#" + idActive).addClass("active");
            }else{
                $("#tb_1").addClass("active");
            }


            $('.getChartData', t).on('click', function () {
                var tab = $(this);
                var startDate = tab.data('start');
                var endDate = tab.data('end');
                var idActive = tab.attr('id');
                tab.prepend('<span class="spinner-border text-white loader-xs"></span>');
                $.ajax({
                    method: "GET",
                    url: action,
                    data: {
                        widget: widget,
                        userID: userID,
                        startDate: startDate,
                        endDate: endDate,
                        _token: $('meta[name="csrf-token"]').attr('content')
                    }
                }).done(function (data, status) {
                    t.after(data);
                    t.remove();
                    base.widgetRevenue(widget,action,userID, idActive);
                }).fail(function (status) {
                    console.log(status);
                });
            })
        },
        searchRangeDate: function () {

            var fStartDate = $('#fStartDate');
            var fEndDate = $('#fEndDate');
            var parent = fStartDate.parent();
            var minDate = parent.data('min');
            var maxDate = parent.data('max');
            var defaultDate = parent.data('default');
            var submit = parent.find('#tb_100');
            var minDateEnd, maxDateStart;

            var date1 = fStartDate.flatpickr({
                dateFormat: "Y-m-d",
                minDate: minDate,
                maxDate:maxDate,
                defaultDate:defaultDate,
                onChange: function (selectedDates, dateStr) {
                    submit.attr("data-start",dateStr);
                    date2.set('minDate', dateStr);
                }
            });

            var date2 = fEndDate.flatpickr({
                dateFormat: "Y-m-d",
                minDate: minDate,
                maxDate:maxDate,
                defaultDate:defaultDate,
                onChange: function (selectedDates, dateStr) {
                    submit.attr("data-end",dateStr);
                    date1.set('maxDate', dateStr);
                }
            });

        },
        widgetIncomeStatistics: function(){
            var base = this;
            var t = $('#widgetIncomeStatistics');
            var data = t.data('json');
            var symbolType = t.data('symbol');

            var dataTotal = data.data_total;
            var dataNetEarn = data.data_net_earnings;

            if($('body').hasClass("is-rtl")){
                dataTotal.reverse();
                dataNetEarn.reverse();
            }

            // total-earnings
            var spark1 = {
                chart: {
                    id: 'total-users',
                    group: 'sparks1',
                    type: 'line',
                    height: 80,
                    sparkline: {
                        enabled: true
                    },
                    dropShadow: {
                        enabled: true,
                        top: 3,
                        left: 1,
                        blur: 3,
                        color: '#009688',
                        opacity: 0.6,
                    }
                },
                series: [{
                    data: dataTotal
                }],
                stroke: {
                    curve: 'smooth',
                    width: 2,
                },
                markers: {
                    size: 0
                },
                grid: {
                    padding: {
                        top: 35,
                        bottom: 0,
                        left: 40
                    }
                },
                colors: ['#009688'],
                tooltip: {
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function () {
                                return '';
                            },
                        },
                        formatter: function formatter(val, opts) {
                            return base.currencyFormat(opts.series[opts.seriesIndex][opts.dataPointIndex],symbolType.symbol,symbolType.position);
                        }
                    }
                },
                responsive: [{
                    breakpoint: 1351,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 35,
                                bottom: 0,
                                left: 0
                            }
                        },
                    },
                },
                    {
                        breakpoint: 1200,
                        options: {
                            chart: {
                                height: 80,
                            },
                            grid: {
                                padding: {
                                    top: 35,
                                    bottom: 0,
                                    left: 40
                                }
                            },
                        },
                    },
                    {
                        breakpoint: 576,
                        options: {
                            chart: {
                                height: 95,
                            },
                            grid: {
                                padding: {
                                    top: 35,
                                    bottom: 0,
                                    left: 0
                                }
                            },
                        },
                    }
                ]
            };

            // Net Earning

            var spark2 = {
                chart: {
                    id: 'unique-visits',
                    group: 'sparks2',
                    type: 'line',
                    height: 80,
                    sparkline: {
                        enabled: true
                    },
                    dropShadow: {
                        enabled: true,
                        top: 1,
                        left: 1,
                        blur: 2,
                        color: '#e2a03f',
                        opacity: 0.2,
                    }
                },
                series: [{
                    data: dataNetEarn
                }],
                stroke: {
                    curve: 'smooth',
                    width: 2,
                },
                markers: {
                    size: 0
                },
                grid: {
                    padding: {
                        top: 35,
                        bottom: 0,
                        left: 40
                    }
                },
                colors: ['#e2a03f'],
                tooltip: {
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function formatter(val) {
                                return '';
                            }
                        },
                        formatter: function formatter(val, opts) {
                            return base.currencyFormat(opts.series[opts.seriesIndex][opts.dataPointIndex],symbolType.symbol,symbolType.position);
                        }
                    }
                },
                responsive: [{
                    breakpoint: 1351,
                    options: {
                        chart: {
                            height: 95,
                        },
                        grid: {
                            padding: {
                                top: 35,
                                bottom: 0,
                                left: 0
                            }
                        },
                    },
                },
                    {
                        breakpoint: 1200,
                        options: {
                            chart: {
                                height: 80,
                            },
                            grid: {
                                padding: {
                                    top: 35,
                                    bottom: 0,
                                    left: 40
                                }
                            },
                        },
                    },
                    {
                        breakpoint: 576,
                        options: {
                            chart: {
                                height: 95,
                            },
                            grid: {
                                padding: {
                                    top: 35,
                                    bottom: 0,
                                    left: 0
                                }
                            },
                        },
                    }

                ]
            };

            // total-earnings
            var d_1C_1 = new ApexCharts(document.querySelector("#total-earnings"), spark1);
            d_1C_1.render();

            // Net Earning
            var d_1C_2 = new ApexCharts(document.querySelector("#net-earnings"), spark2);
            d_1C_2.render();
        },
        widgetTotalOrders: function (widget,action,userID) {
            var t = $("#"+widget);
            var data = t.data("json");
            var name = t.data("name");
            if($('body').hasClass("is-rtl")){
                data.reverse();
            }
            var d_2options1 = {
                chart: {
                    id: '#total-orders',
                    type: 'area',
                    height: 260,
                    sparkline: {
                        enabled: true
                    },
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                series: [{
                    name: name,
                    data: data
                }],
                yaxis: {

                },
                grid: {
                    padding: {
                        top: 125,
                        right: 0,
                        bottom: 36,
                        left: 0
                    },
                },
                fill: {
                    type:"gradient",
                    opacity: 1,
                    gradient: {
                        type: "vertical",
                        shadeIntensity: 1,
                        inverseColors: !1,
                        opacityFrom: .40,
                        opacityTo: .05,
                        stops: [45, 100]
                    }
                },
                tooltip: {
                    x: {
                        show: false,
                    },
                    y: {
                        formatter: function formatter(val, opts) {
                            return val;
                        }
                    },
                    theme: 'dark'
                },
                colors: ['#fff']
            };
            var d_2C_2 = new ApexCharts(document.querySelector("#total-orders"), d_2options1);
            d_2C_2.render();
        },
        widgetTotalEarnings: function (widget,action,userID) {
            var t = $("#"+widget);
            var data = t.data("json");
            if($('body').hasClass("is-rtl")){
                data.reverse();
            }
            var name = t.data("name");
            var base = this;
            var symbolType = t.data('symbol');
            var d_2options2 = {
                chart: {
                    id: '#total-earnings',
                    type: 'area',
                    height: 260,
                    sparkline: {
                        enabled: true
                    },
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                series: [{
                    name: name,
                    data: data
                }],
                yaxis: {

                },
                grid: {
                    padding: {
                        top: 125,
                        right: 0,
                        bottom: 36,
                        left: 0
                    },
                },
                fill: {
                    type:"gradient",
                    opacity: 1,
                    gradient: {
                        type: "vertical",
                        shadeIntensity: 1,
                        inverseColors: !1,
                        opacityFrom: .40,
                        opacityTo: .05,
                        stops: [45, 100]
                    }
                },
                tooltip: {
                    x: {
                        show: false,
                    },
                    y: {
                        title: {
                            formatter: function () {
                                return '';
                            },
                        },
                        formatter: function formatter(val, opts) {
                            return base.currencyFormat(opts.series[opts.seriesIndex][opts.dataPointIndex],symbolType.symbol,symbolType.position);
                        }
                    },
                    theme: 'dark'
                },
                colors: ['#fff']
            };
            var d_2C_2 = new ApexCharts(document.querySelector("#total-earnings"), d_2options2);
            d_2C_2.render();
        },
        widgetNetEarnings: function (widget,action,userID) {
            var t = $("#"+widget);
            var data = t.data("json");
            if($('body').hasClass("is-rtl")){
                data.reverse();
            }
            var name = t.data("name");
            var base = this;
            var symbolType = t.data('symbol');
            var d_2options2 = {
                chart: {
                    id: '#total-net-earnings',
                    type: 'area',
                    height: 260,
                    sparkline: {
                        enabled: true
                    },
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                series: [{
                    name: name,
                    data: data
                }],
                yaxis: {

                },
                grid: {
                    padding: {
                        top: 125,
                        right: 0,
                        bottom: 36,
                        left: 0
                    },
                },
                fill: {
                    type:"gradient",
                    opacity: 1,
                    gradient: {
                        type: "vertical",
                        shadeIntensity: 1,
                        inverseColors: !1,
                        opacityFrom: .40,
                        opacityTo: .05,
                        stops: [45, 100]
                    }
                },
                tooltip: {
                    x: {
                        show: false,
                    },
                    y: {
                        title: {
                            formatter: function () {
                                return '';
                            },
                        },
                        formatter: function formatter(val, opts) {
                            return base.currencyFormat(opts.series[opts.seriesIndex][opts.dataPointIndex],symbolType.symbol,symbolType.position);
                        }
                    },
                    theme: 'dark'
                },
                colors: ['#fff']
            };
            var d_2C_2 = new ApexCharts(document.querySelector("#total-net-earnings"), d_2options2);
            d_2C_2.render();
        },
        widgetTotalCommission: function (widget,action,userID) {
            var t = $("#"+widget);
            var data = t.data("json");
            if($('body').hasClass("is-rtl")){
                data.reverse();
            }
            var name = t.data("name");
            var base = this;
            var symbolType = t.data('symbol');
            var d_2options3 = {
                chart: {
                    id: '#total-commission',
                    type: 'area',
                    height: 260,
                    sparkline: {
                        enabled: true
                    },
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                series: [{
                    name: name,
                    data: data
                }],
                yaxis: {

                },
                grid: {
                    padding: {
                        top: 125,
                        right: 0,
                        bottom: 36,
                        left: 0
                    },
                },
                fill: {
                    type:"gradient",
                    opacity: 1,
                    gradient: {
                        type: "vertical",
                        shadeIntensity: 1,
                        inverseColors: !1,
                        opacityFrom: .40,
                        opacityTo: .05,
                        stops: [45, 100]
                    }
                },
                tooltip: {
                    x: {
                        show: false,
                    },
                    y: {
                        title: {
                            formatter: function () {
                                return '';
                            },
                        },
                        formatter: function formatter(val, opts) {
                            return base.currencyFormat(opts.series[opts.seriesIndex][opts.dataPointIndex],symbolType.symbol,symbolType.position);
                        }
                    },
                    theme: 'dark'
                },
                colors: ['#fff']
            };
            var d_2C_2 = new ApexCharts(document.querySelector("#total-commission"), d_2options3);
            d_2C_2.render();
        }
    };

    window.GmzWidget.init();
})(jQuery);