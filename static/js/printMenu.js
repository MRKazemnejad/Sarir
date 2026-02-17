 function printTable() {
            document.getElementById('searchArea').style.display = 'none';
            // غیرفعال کردن اسکرول و محدودیت ارتفاع قبل از پرینت
            const tableContainer = document.querySelector('.table-container');
            const containerFluid = document.querySelector('.container-fluid');
            const rows = document.querySelectorAll('.row');
            const col12 = document.querySelector('.col-12');
            const card = document.querySelector('.card');
            const cardBody = document.querySelector('.card-body');
            const my4 = document.querySelector('.my-4');

            // ذخیره استایل‌های اولیه
            const tableContainerStyle = tableContainer.style.cssText;
            const containerFluidStyle = containerFluid.style.cssText;
            const col12Style = col12.style.cssText;
            const cardStyle = card ? card.style.cssText : '';
            const cardBodyStyle = cardBody ? cardBody.style.cssText : '';
            const my4Style = my4 ? my4.style.cssText : '';
            const rowStyles = Array.from(rows).map(row => row.style.cssText);

            // تنظیم استایل‌ها برای پرینت
            tableContainer.style.maxHeight = 'none';
            tableContainer.style.overflowY = 'visible';
            tableContainer.style.width = '100%';
            tableContainer.style.margin = '0';
            tableContainer.style.padding = '0';
            tableContainer.style.position = 'static';

            containerFluid.style.margin = '0';
            containerFluid.style.padding = '0';
            containerFluid.style.height = 'auto';

            rows.forEach(row => {
                row.style.margin = '0';
                row.style.padding = '0';
            });

            col12.style.margin = '0';
            col12.style.padding = '0';

            if (card) {
                card.style.margin = '0';
                card.style.padding = '0';
            }

            if (cardBody) {
                cardBody.style.margin = '0';
                cardBody.style.padding = '0';
            }

            if (my4) {
                my4.style.margin = '0';
                my4.style.padding = '0';
            }

            // پرینت
            window.print();

            document.getElementById('searchArea').style.display = '';

            // بازگرداندن استایل‌ها به حالت اولیه
            tableContainer.style.cssText = tableContainerStyle;
            containerFluid.style.cssText = containerFluidStyle;
            col12.style.cssText = col12Style;
            if (card) card.style.cssText = cardStyle;
            if (cardBody) cardBody.style.cssText = cardBodyStyle;
            if (my4) my4.style.cssText = my4Style;
            rows.forEach((row, index) => {
                row.style.cssText = rowStyles[index];
            });
        }

        function exportToExcel(fileName = 'table_export.csv') {
            const table = document.querySelector('.table-container table');
            if (!table) {
                console.error('Table not found');
                return;
            }

            const rows = table.querySelectorAll('tr');
            if (rows.length === 0) {
                console.error('Table is empty');
                return;
            }

            let csvContent = [];

            // پردازش هدرها (ستون آخر حذف می‌شود)
            const headers = Array.from(rows[0].querySelectorAll('th'))
                .slice(0, -1) // حذف آخرین ستون
                .map(th => `"${th.textContent.trim().replace(/"/g, '""')}"`);
            csvContent.push(headers.join(','));

            // پردازش ردیف‌ها (ستون آخر حذف می‌شود)
            for (let i = 1; i < rows.length; i++) {
                const cols = Array.from(rows[i].querySelectorAll('td'))
                    .slice(0, -1) // حذف آخرین ستون
                    .map(td => `"${td.textContent.trim().replace(/"/g, '""')}"`);
                csvContent.push(cols.join(','));
            }

            const csvString = csvContent.join('\n');
            const utf8Bom = '\uFEFF';
            const csvFile = utf8Bom + csvString;

            const blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function exportToPDF() {
            const {jsPDF} = window.jspdf;
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const element = document.querySelector('.table-container');
            const originalStyle = element.style.cssText;
            element.style.maxHeight = 'none';
            element.style.overflowY = 'visible';
            element.style.height = 'auto';

            html2canvas(element, {
                scale: 2,
                useCORS: true,
                scrollY: 0
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 297;
                const pageHeight = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;

                let position = 0;
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                doc.save('table_export.pdf');
                element.style.cssText = originalStyle;
            }).catch(error => {
                console.error('Error generating PDF:', error);
                element.style.cssText = originalStyle;
            });
        }