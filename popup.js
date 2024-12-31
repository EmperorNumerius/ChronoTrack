document.addEventListener('DOMContentLoaded', () => {
    const timeList = document.getElementById('time-list');
    const resetButton = document.getElementById('reset-button');
    const sortSelect = document.getElementById('sort-select');
    const filterInput = document.getElementById('filter-input');
    const timeChartCanvas = document.getElementById('time-chart');
    let timeChart;

    function updateList(data){
        timeList.innerHTML = '';
        const sortedData = sortData(data);
        const filteredData = filterData(sortedData);
        for (const [url, time] of Object.entries()) {
            const listItem = document.createElement('li');
            listItem.textContent = `${url}: ${Math.floor(time / 1000 / 60)} minutes`;
            timeList.appendChild(listItem);
        }
        updateChart(filteredData);
    }

    function sortData(data){
        const sortOption = sortSelect.value;
        const entries = Object.entries(data);
        if (sortOption === 'time-desc') {
            return Object.fromEntries(entries.sort((a, b) => b[1] - a[1]));
        }if (sortOption === 'time-asc') {
            return Object.fromEntries(entries.sort((a, b) => a[1] - b[1]));
        }if (sortOption === 'url-asc') {
            return Object.fromEntries(entries.sort((a, b) => a[0].localeCompare(b[0])));
        }if (sortOption === 'url-desc') {
            return Object.fromEntries(entries.sort((a, b) => b[0].localeCompare(a[0])));
        }
        return data;
    }

    function filterData(data){
        const filterText = filterInput.value.toLowerCase();
        return Object.fromEntries(
            Object.entries(data).filter(([url, time]) => url.toLowerCase().includes(filterText))
        );
    }

    function updateChart(data){
        const labels = Object.keys(data);
        const times = Object.values(data).map(time => Math.floor(time / 1000 / 60));

        if (timeChart) {
            timeChart.destroy();
        }

        timeChart = new Chart(timeChartCanvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Time Spent (minutes)',
                    data: times,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    chrome.storage.sync.get(null, (data) => {
        updateList(data);
    });

    resetButton.addEventListener('click', () => {
        chrome.storage.sync.clear(() => {
            timeList.innerHTML = '';
            updateList({});
        });
    });
}







