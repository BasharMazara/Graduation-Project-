
const now = new Date();
const oneWeekAgo = new Date();
oneWeekAgo.setDate(now.getDate() - 7);

const oneMonthAgo = new Date();
oneMonthAgo.setMonth(now.getMonth() - 1);

const oneYearAgo = new Date();
oneYearAgo.setFullYear(now.getFullYear() - 1);

function daily_chart(context, range) {

    $.getJSON("http://localhost/GP/php/get_daily_sales.php", function (data) {

        const parsedData = data.map(item => ({ day: new Date(item.day), total: parseFloat(item.total) }));
        const filtered = filterData(range, parsedData);
        const labels = filtered.map(item => item.day.toLocaleDateString());
        const salesData = filtered.map(item => item.total);

        new Chart(context, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Sales',
                    data: salesData,
                    borderColor: '#F67F20',
                    backgroundColor: 'rgba(246, 127, 32, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: { size: 16 },
                            color: '#333'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Daily Sales Report',
                        font: { size: 22 },
                        color: '#111'
                    }
                },
                scales: {
                    x: {
                        ticks: { font: { size: 14 } },
                        title: {
                            display: true,
                            text: 'Date',
                            font: { size: 16 }
                        }
                    },
                    y: {
                        ticks: { font: { size: 14 } },
                        title: {
                            display: true,
                            text: 'Sales ($)',
                            font: { size: 16 }
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    });
}


function income_chart(context) {
    $.getJSON("http://localhost/GP/php/get_income.php", function (data) {
        const labels = data.map(item => item.category);
        const values = data.map(item => parseFloat(item.total_amount));


        const totalIncome = values.reduce((sum, val) => sum + val, 0);

        new Chart(context, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Income Breakdown',
                    data: values,
                    backgroundColor: [
                        '#F67F20', // dish
                        '#FF3B3B', // drink
                        '#007BFF', // entree
                        '#28A745', // pizza
                        '#343A40', // sandwich
                        '#6C757D'  // others
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 16 },
                            color: '#333'
                        }
                    },
                    title: {
                        display: true,
                        text: `Total Income: $${totalIncome.toFixed(2)}`,
                        font: { size: 22 },
                        color: '#111'
                    }
                }
            }
        });
    });
}

function best_selling_table(tBody) {
    $.getJSON("http://localhost/GP/php/get_best_selling.php", function (data) {
        let tableBody = tBody;
        tableBody.innerHTML = "";

        data.forEach((item, index) => {
            let row = `<tr>
                <td>${index + 1}</td>
                <td><img class="food-image" src="images/products/${item.id}.jpg" alt="${item.product_name}"></td>
                <td>${item.product_name}</td>
                <td>${item.category}</td>
                <td>${item.total_sold}</td>
                <td>$${parseFloat(item.total_income).toFixed(2)}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    });
}

function filterData(range, parsedData) {
    if (range === "week") {
        return parsedData.filter(item => item.day >= oneWeekAgo);
    } else if (range === "month") {
        return parsedData.filter(item => item.day >= oneMonthAgo);
    } else if (range === "year") {
        return parsedData.filter(item => item.day >= oneYearAgo);
    }
    return parsedData;
}




