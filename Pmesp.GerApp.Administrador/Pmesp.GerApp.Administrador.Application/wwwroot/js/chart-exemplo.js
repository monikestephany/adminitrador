$(function(){
    var myChart = new Chart($('#chartQtdPMXPosto'), {
        type: 'bar',
        data: {
            labels: ["CEL", "TEN. CEL", "MAJ", "CAP", "1º TEN", "2º TEN","ASP OFICIAL", "SUB TEN", "1º SGT", "2º SGT", "3º SGT", "CB", "SD"],
            datasets: [{
                label: 'Administrativo',
                data: [5,8,12, 19, 3, 5, 15 ,2, 10 ,20, 40, 60, 70],
                backgroundColor: [
                    '#1e61a7',
                    '#1e61a7',
                    '#1e61a7',
                    '#1e61a7',
                    '#1e61a7',
                    '#1e61a7',
                    '#1e61a7',
                    '#10a9d5',
                    '#10a9d5',
                    '#10a9d5',
                    '#10a9d5',                    
                    '#10a9d5',
                    '#10a9d5'
                ]
            },{
                label: 'Operacional',
                data: [10,20,8, 15, 4, 9, 15 ,4, 10 ,10, 50, 70, 90],
                backgroundColor: [
                    '#f89f11',
                    '#f89f11',
                    '#f89f11',
                    '#f89f11',
                    '#f89f11',
                    '#f89f11',
                    '#f89f11',
                    '#f5b655',
                    '#f5b655',
                    '#f5b655',
                    '#f5b655',                    
                    '#f5b655',
                    '#f5b655'
                ]
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero:true
                    }
                }],
                xAxes: [{
                    stacked: true
                }]
            },
            legend: {
//                display: false
                position: 'bottom'
            }

        }
    });    
    
    
    var myChart = new Chart($('#chartQtdViatura'), {
        type: 'doughnut',
        data: {
            labels: ["Administrativo", "Operacional"],
            datasets: [{
                label: 'Quantidade',
                data: [19, 40],
                backgroundColor: [
//                    '#118df1',
                    '#f2ce2c',
//                    '#f89f11'
                    '#33b998'
                ]
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend:{
                position: 'bottom',
                onClick: function(){
                    return true;
                }
            }
        }
    });


    if ($('#chartQtdEfetivo').length){
        var myChart = new Chart($('#chartQtdEfetivo'), {
            type: 'pie',
            data: {
                labels: [
                    "Administrativo Em Serviço", 
                    "Administrativo Folga", 
                    "Administrativo Afastamento", 
                    "Operacional Em Serviço",
                    "Operacional Folga",
                    "Operacional Afastamento"
                ],
                datasets: [{
                    label: 'Quantidade',
                    data: [15, 10, 5, 45, 20, 5],
                    backgroundColor: [
                        '#1a8ff6',
                        '#81c2f8',
                        '#c7e1f8',
                        '#f89f11',
                        '#f5b655',
                        '#f2c87e'
                    ]
                }]
            },
            options: {
                maintainAspectRatio: false,
                legend:{
                    position: 'bottom',
                    onClick: function(){
                        return true;
                    }
                }
            }
        });

    }

    var lineChartCfg = {
        fill: false,
        lineTension: 0.1,
        borderColor: "#4bc0c0",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "#4bc0c0",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#4bc0c0",
        pointHoverBorderColor: "#dcdcdc",
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
    }
    var myChart = new Chart($('#chartQtdPMXTempo'), {
        type: 'line',
        data: {
            labels: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
            datasets: [
                $.extend(
                    {},
                    lineChartCfg,
                    {
                        label: 'Administrativo',
                        data: [65, 59, 80, 81, 56, 55, 40, 50] 
                    }
                ),
                $.extend(
                    {},
                    lineChartCfg,
                    {
                        label: 'Operacional',
                        borderColor: "#f89f11",
                        pointBorderColor: "#f89f11",
                        pointHoverBackgroundColor: "#f89f11",
                        data: [null,5,10, 45, 30, 65, 20, 35, 35]            
                    }
                )
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }],
                xAxes: [{
                    gridLines: { display: false }
                }]
            },
            legend:{
                position: 'bottom'
            }
        }
    });

    
    
    
})