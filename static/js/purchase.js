$(document).ready(function () {
    if ($('body').data('page') === 'newrequest') {

        $.ajax({
            url: "/purchaseDashboard/purSystemList",
            success: function (data) {
                systemSelect = document.getElementById('partname');
                systemSelect.options[systemSelect.options.length] = new Option('...', 0);
                for (var i = 0; i < data.part_name.length; i++) {
                    systemSelect = document.getElementById('partname');
                    systemSelect.options[systemSelect.options.length] = new Option(data.part_name[i], data.part_code[i]);
                }

            }
        });
    }

    else if ($('body').data('page') === 'purlogistic') {


        let sortDir = {}; // Track sort direction for each column

        // Parse Jalali date for sorting
        function parseJalaliDate(dateStr) {
            if (!dateStr || dateStr === 'قطعه جدید') {
                return 0;
            }
            const parts = dateStr.replace('-', '/').split('/');
            if (parts.length !== 3) {
                return 0;
            }
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const day = parseInt(parts[2]);
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                return 0;
            }
            return year * 10000 + month * 100 + day;
        }

        // Sort click handler
        $('.sort-arrows i').on('click', function () {
            const column = $(this).data('column');
            const dir = $(this).data('dir');
            const $table = $('#report-table');
            const $rows = $table.find('tbody tr').get();

            if (sortDir[column] === dir) {
                sortDir[column] = null;
                $(this).closest('th').find('.sort-arrows i').removeClass('asc desc');
            } else {
                sortDir[column] = dir;
                $(this).closest('th').find('.sort-arrows i').removeClass('asc desc');
                $(this).addClass(dir);
            }

            $rows.sort(function (a, b) {
                let aVal, bVal;
                const $a = $(a);
                const $b = $(b);
                switch (column) {
                    case 0:
                        //eq(column) number
                        aVal = parseInt($a.find('td').eq(0).text()) || 0;
                        bVal = parseInt($b.find('td').eq(0).text()) || 0;
                        break;
                     case 1:
                        //eq(column) number
                        aVal = parseInt($a.find('td').eq(2).text()) || 0;
                        bVal = parseInt($b.find('td').eq(2).text()) || 0;
                        break;
                    case 2:
                         aVal = parseJalaliDate($a.find('td').eq(3).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(3).text().trim());
                        break;

                    case 3:
                        aVal = $a.find('td').eq(2).text().trim();
                        bVal = $b.find('td').eq(2).text().trim();
                        break;
                    default:
                        return 0;
                }
                if (sortDir[column] === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else if (sortDir[column] === 'desc') {
                    return aVal < bVal ? 1 : -1;
                }
                return 0;
            });

            $.each($rows, function (index, row) {
                $table.find('tbody').append(row);
            });
        });


    }

        else if ($('body').data('page') === 'purcheck') {


        let sortDir = {}; // Track sort direction for each column

        // Parse Jalali date for sorting
        function parseJalaliDate(dateStr) {
            if (!dateStr || dateStr === 'قطعه جدید') {
                return 0;
            }
            const parts = dateStr.replace('-', '/').split('/');
            if (parts.length !== 3) {
                return 0;
            }
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const day = parseInt(parts[2]);
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                return 0;
            }
            return year * 10000 + month * 100 + day;
        }

        // Sort click handler
        $('.sort-arrows i').on('click', function () {
            const column = $(this).data('column');
            const dir = $(this).data('dir');
            const $table = $('#report-table');
            const $rows = $table.find('tbody tr').get();

            if (sortDir[column] === dir) {
                sortDir[column] = null;
                $(this).closest('th').find('.sort-arrows i').removeClass('asc desc');
            } else {
                sortDir[column] = dir;
                $(this).closest('th').find('.sort-arrows i').removeClass('asc desc');
                $(this).addClass(dir);
            }

            $rows.sort(function (a, b) {
                let aVal, bVal;
                const $a = $(a);
                const $b = $(b);
                switch (column) {
                    case 0:
                        //eq(column) number
                        aVal = parseInt($a.find('td').eq(0).text()) || 0;
                        bVal = parseInt($b.find('td').eq(0).text()) || 0;
                        break;
                     case 1:
                        //eq(column) number
                        aVal = parseInt($a.find('td').eq(1).text()) || 0;
                        bVal = parseInt($b.find('td').eq(1).text()) || 0;
                        break;
                    case 2:
                         aVal = parseJalaliDate($a.find('td').eq(4).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(4).text().trim());
                        break;

                    case 3:
                        aVal = $a.find('td').eq(2).text().trim();
                        bVal = $b.find('td').eq(2).text().trim();
                        break;
                    default:
                        return 0;
                }
                if (sortDir[column] === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else if (sortDir[column] === 'desc') {
                    return aVal < bVal ? 1 : -1;
                }
                return 0;
            });

            $.each($rows, function (index, row) {
                $table.find('tbody').append(row);
            });
        });


    }
});
// **********************************************************************************************************************
function serialList() {

    document.getElementById('partnumber').innerHTML = ''
    var part_name = document.getElementById('partname').value;


    $.ajax({

        url: "/purchaseDashboard/purSerialList",
        data: {
            'part_name': JSON.stringify(part_name),
        },
        success: function (data) {

           document.getElementById('partnumber').value = data.partnumber;

        }
    });

}

// ****************************************************************************************************************

