let currentPage = 1;
const maxPages = 5; // Установите максимальное количество страниц для перехода
let csvContent = "URL;CF;TF;DR;gMR;DA;Статейность;В индексе;Скорость;Размещение;Написание;Трафик;Статей;Тематика\n";

const extractData = () => {
    const catalogWrapper = document.querySelector('[class="dataTables_wrapper"]');
    if (catalogWrapper) {
        const catalogId = catalogWrapper.id.split('_')[1]; // Получаем значение {id} из ID элемента
        const rows = document.querySelectorAll(`#Catalog_${catalogId} tbody tr`);
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            const urlElement = row.querySelector("p.title-wrapper a.popover-holder");
            const URL = urlElement ? urlElement.textContent : ''; // Получаем текст URL
            // Пропускаем сайт, если в URL содержится "Адрес скрыт" или он отсутствует
            if (URL === "Адрес скрыт" || !URL.trim()) {
                return; // Пропускаем текущий сайт
            }

            const rowData = [
                URL, // URL
                cells[2]?.textContent, // CF
                cells[3]?.textContent, // TF
                cells[4]?.textContent, // DR
                cells[5]?.textContent, // gMR
                cells[6]?.textContent, // DA
                cells[7]?.textContent, // Статейность
                cells[8]?.textContent, // В индексе
                cells[9]?.textContent, // Скорость
                cells[10]?.textContent.replace(/\D/g,''), // Размещение
                cells[11]?.textContent.replace(/\D/g,''), // Написание
                cells[12]?.textContent, // Трафик
                cells[13]?.textContent, // Статей
                cells[14]?.textContent.trim(), // Тематика
            ].join(';');
            csvContent += rowData + "\n";
        });
    }
};

const navigateToNextPage = async () => {
    if (currentPage >= maxPages) return false; // Проверка на превышение максимального количества страниц
    const nextButton = document.querySelector('li.next a.next');
    if (nextButton) {
        nextButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000)); // Ожидание загрузки страницы
        currentPage++;
        return true;
    }
    return false;
};

extractData(); // Извлечение данных с первой страницы
while (await navigateToNextPage()) {
    extractData(); // Извлечение данных с каждой новой страницы
}

// Создаем объект Blob с указанием кодировки
const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

// Создаем ссылку для скачивания CSV файла
const link = document.createElement("a");
link.setAttribute("href", window.URL.createObjectURL(csvBlob));
link.setAttribute("download", "data.csv");
document.body.appendChild(link);

link.click(); // Инициируем скачивание файла
