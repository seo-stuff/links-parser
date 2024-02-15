function scrapeData() {
    const rows = document.querySelectorAll('.union-row');
    if (!rows || rows.length === 0) {
        console.error('Не найдены данные для извлечения.');
        return [];
    }

    const data = [];
    
    rows.forEach(row => {
        const siteElement = row.querySelector('.search-result__link');
        const drElement = row.querySelectorAll('.s-table__cell')[1];
        const ixElement = row.querySelectorAll('.s-table__cell')[2];
        const googleIndexElement = row.querySelectorAll('.s-table__cell')[3];
        const yandexIndexElement = row.querySelectorAll('.s-table__cell')[4];
        const trafficElement = row.querySelector('.search-result__traffic');
        const priceElement = row.querySelectorAll('.s-table__cell.nowrap');

        if (!siteElement || !drElement || !ixElement || !googleIndexElement || !yandexIndexElement || !trafficElement || !priceElement) {
            console.error('Не удалось извлечь данные из строки.');
            return;
        }

        const site = siteElement.innerText.trim();
        const dr = drElement.innerText.trim();
        const ix = ixElement.innerText.trim();
        const googleIndex = googleIndexElement.innerText.trim();
        const yandexIndex = yandexIndexElement.innerText.trim();
        const traffic = trafficElement.innerText.split(' ')[0].trim();
        const price = priceElement[0].innerText.trim(); // Получаем полное значение из элемента цены
        
        data.push(`${site};${dr};${ix};${googleIndex};${yandexIndex};${traffic};${price}`);
    });

    return data;
}

function saveToCSV(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Добавляем заголовки столбцов
    const headers = ['Сайт', 'DR', 'IX', 'Индекс Google', 'Индекс Яндекс', 'Трафик', 'Цена'];
    csvContent += headers.join(';') + '\n';

    // Добавляем данные
    csvContent += data.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
}

function scrapeAllPages(maxPages, collectedData = []) {
    if (maxPages === 0) {
        console.log('Достигнуто максимальное количество страниц.');
        if (collectedData.length > 0) {
            saveToCSV(collectedData.flat()); // Сохраняем данные в CSV файле
        }
        return;
    }

    const data = scrapeData(); // Извлекаем данные перед переходом на следующую страницу
    collectedData.push(data);

    const nextButton = document.querySelector('.s-pagination__row .s-pagination__next-btn'); // Находим кнопку "Следующая страница"
    if (nextButton) {
        nextButton.click(); // Нажимаем на кнопку "Следующая страница"
        setTimeout(() => scrapeAllPages(maxPages - 1, collectedData), 5000); // Запускаем скрапинг следующей страницы через 5 секунд
    } else {
        if (collectedData.length > 0) {
            saveToCSV(collectedData.flat()); // Сохраняем данные в CSV файле
        }
    }
}

// Установите здесь значение максимального числа страниц, например, 10
const maxPages = 10;
scrapeAllPages(maxPages);
