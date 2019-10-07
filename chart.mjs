class ExpenseChart{
    constructor(my_chart){
        Chart.defaults.global.defaultFontSize = 16;
        this.my_chart = my_chart;
        this.chart;
    }
    createChart(){
        this.chart = new Chart(this.my_chart, {
            type: 'bar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
                datasets: [{
                    label: 'Amount (zł)',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    borderColor: '#777',
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#000'
                }]
            },
            options: {
                title:{
                    display: true,
                    text: 'Monthly amount of expenses',
                    fontSize: 28
                },
                legend:{
                    display: false
                },
                layout:{
                    padding:{
                        top: 50
                    }
                },
                scales:{
                    yAxes:[{
                        ticks:{
                            beginAtZero: true,
                            fontSize: 20
                        },
                        display: true,
                        scaleLabel:{
                            display: true,
                            labelString: 'Amount (zł)',
                            fontSize: 20
                        }
                    }],
                    xAxes:[{
                        ticks:{
                            fontSize: 18
                        },
                    }]
                }
            }
        })
    }

    updateChart(){
        const table_body = document.querySelector("#expense-table-body");
        let chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        table_body.childNodes.forEach( tr =>{
            if (!tr.classList.contains('d-none')){
                let {amount, month} = this.getAmountAndMonthFromRow(tr);
                chart_data[month-1] += amount;
            };
        });
        
        this.chart.data.datasets.forEach(datasets => datasets.data = chart_data);
        this.chart.update();
    }

    getAmountAndMonthFromRow(tr){
        let amount, month;
        Array.from(tr.children).forEach( children => {
            if (children.classList.contains('exp-amount')){
                amount = parseInt(children.textContent);
            }
            else if(children.classList.contains('exp-date')){
                month = parseInt(children.textContent.split('-')[1]);
            }
        });
        return {
            amount: amount,
            month: month
        };
    }
}


// create chart
const my_chart = document.getElementById('my-chart').getContext('2d');
const bar_chart = new ExpenseChart(my_chart);
export { bar_chart };