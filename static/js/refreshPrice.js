 // تابع برای دریافت قیمت دلار و زمان با AJAX
        function fetchDollarPrice() {
            $.ajax({
                url: '/contractDashboard/api/get-dollar-price',
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (data.error) {
                        $('#dollarPrice').val('خطا در دریافت قیمت');
                        $('#timestamp').val('خطا در دریافت زمان');
                        return;
                    }

                    // به‌روزرسانی قیمت دلار
                    const dollarPrice = parseInt(data.price.replace(/,/g, ''));
                    $('#dollarPrice').val(`${dollarPrice}`);

                    const datetime=data.timestamp.toLocaleString('fa-IR');
                    // تبدیل زمان به تقویم هجری شمسی
                   $('#timestamp').val(datetime);
                },
                error: function(xhr, status, error) {
                    console.error('خطا در دریافت قیمت دلار:', error);
                    $('#dollarPrice').val('خطا در دریافت قیمت');
                    $('#timestamp').val('خطا در دریافت زمان');
                }
            });
        }

        // تابع برای دکمه رفرش
        function refreshPrice() {
            $('#dollarPrice').val('در حال بارگذاری...');
            $('#timestamp').val('در حال بارگذاری...');
            fetchDollarPrice();
        }

        // دریافت قیمت هنگام لود صفحه
        $(document).ready(function() {
            fetchDollarPrice();
        });