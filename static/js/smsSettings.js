 if ($('body').data('page') === 'dashboard') {

     const servicelist='{{ labels|safe }}';
    const servicecount='{{ counts|safe }}';
    const contractorlist='{{ contractor_list|safe }}';
    const contractorpoint='{{ contractor_point|safe }}';
    const servicetable='{{ data_list|safe }}';



        // ثبت پلاگین datalabels
        Chart.register(ChartDataLabels);


        const dashboardData = {
            contractor_performance: {
                labels: contractorlist,
                scores: contractorpoint,
            },
            services_distribution: {
                labels:servicelist,
                data: servicecount,
            },
            project_progress: {
                labels: ["فروردین", "اردیبهشت", "خرداد", "تیر"],
                data: [20, 50, 75, 90]
            },
            services: servicetable

        };



        // نمودار میله‌ای: عملکرد پیمانکاران
        const performanceCtx = document.getElementById('performanceChart').getContext('2d');
        // ایجاد گرادیان برای میله‌ها
        const gradient1 = performanceCtx.createLinearGradient(0, 0, 0, 350);
        gradient1.addColorStop(0, '#60a5fa');
        gradient1.addColorStop(1, '#3b82f6');
        const gradient2 = performanceCtx.createLinearGradient(0, 0, 0, 350);
        gradient2.addColorStop(0, '#4ade80');
        gradient2.addColorStop(1, '#22c55e');
        const gradient3 = performanceCtx.createLinearGradient(0, 0, 0, 350);
        gradient3.addColorStop(0, '#f87171');
        gradient3.addColorStop(1, '#ef4444');
        const gradient4 = performanceCtx.createLinearGradient(0, 0, 0, 350);
        gradient4.addColorStop(0, '#fbbf24');
        gradient4.addColorStop(1, '#f59e0b');

        new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: dashboardData.contractor_performance.labels,
                datasets: [{
                    label: 'امتیاز کیفیت',
                    data: dashboardData.contractor_performance.scores,
                    backgroundColor: [gradient1, gradient2, gradient3, gradient4],
                    borderColor: ['#2563eb', '#16a34a', '#dc2626', '#d97706'],
                    borderWidth: 1,
                    borderRadius: 10, // گوشه‌های گرد برای میله‌ها
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // برای هماهنگی با canvas
                scales: {
                    y: {
                        beginAtZero: true,
                        max:100,
                        title: {display: true, text: 'امتیاز', font: {size: 14, weight: 'bold'}},
                        ticks: {font: {size: 12}}
                    },
                    x: {
                        title: {display: true, text: 'پیمانکاران', font: {size: 14, weight: 'bold'}},
                        ticks: {font: {size: 12}}
                    }
                },
                plugins: {
                    legend: {position: 'top', labels: {font: {size: 14}}},
                    datalabels: {
                        color: '#fff',
                        anchor: 'end',
                        align: 'top',
                        formatter: (value) => value.toFixed(1), // نمایش امتیاز روی میله‌ها
                        font: {weight: 'bold', size: 12}
                    }
                },
                animation: {
                    duration: 1500, // انیمیشن نرم‌تر
                    easing: 'easeOutQuart'
                }
            }
        });

        // نمودار دایره‌ای: توزیع خدمات با درصد
        const servicesCtx = document.getElementById('servicesChart').getContext('2d');
        new Chart(servicesCtx, {
            type: 'pie',
            data: {
                labels: dashboardData.services_distribution.labels,
                datasets: [{
                    data: dashboardData.services_distribution.data,
                    backgroundColor: ['#3b82f6', '#22c55e', '#ef4444'],
                    borderColor: ['#2563eb', '#16a34a', '#dc2626'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {position: 'top', labels: {font: {size: 14}}},
                    title: {display: true, text: 'توزیع خدمات (%)', font: {size: 16, weight: 'bold'}},
                    datalabels: {
                        color: '#fff',
                        formatter: (value, ctx) => {
                            let sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            let percentage = Math.round((value / sum) * 100) + '%';
                            return percentage;
                        },
                        font: {weight: 'bold', size: 14}
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });

        // نمودار خطی: روند پیشرفت پروژه‌ها
        const progressCtx = document.getElementById('progressChart').getContext('2d');
        new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: dashboardData.project_progress.labels,
                datasets: [{
                    label: 'پیشرفت پروژه‌ها (%)',
                    data: dashboardData.project_progress.data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {display: true, text: 'درصد پیشرفت', font: {size: 14, weight: 'bold'}}
                    },
                    x: {title: {display: true, text: 'ماه', font: {size: 14, weight: 'bold'}}}
                },
                plugins: {legend: {position: 'top', labels: {font: {size: 14}}}},
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });

        // پر کردن جدول خدمات
        const tableBody = document.getElementById('services-table');
        dashboardData.services.forEach(servicetable => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${servicetable.name}</td>
                <td>${servicetable.contractor}</td>
                <td>${servicetable.status}</td>
                <td>${servicetable.start_date}</td>
                <td>${servicetable.quality_score || 'در انتظار'}</td>
            `;
            tableBody.appendChild(row);
        });

 }

  if ($('body').data('page') === 'checkfail') {

       // Object to store temporary comments and cached server comments
        let temporaryComments = {};
        let cachedComments = {};

        // Open edit modal and populate fields with row data
        function openEditModal(itemId, service, serviceType, company, loco, place, number, fromDate, desc) {
            $('#editItemId').val(itemId);
            $('#editService').val(service || '0');
            $('#editServiceType').val(serviceType || '0');
            $('#editCompany').val(company || '');
            $('#editLoco').val(loco || '');
            $('#editPlace').val(place || '1');
            $('#editTypeNumber').val(number || '');
            $('#editFromDate').val(fromDate || '');
            $('#editDesc').val(desc || '');
            loadEditServices(itemId); // Load services table with selected services
            $('#editModal').modal('show');
        }

        // Load services for edit modal
        function loadEditServices(itemId) {
            const $editServiceSelect = $('#editService');
            const $editServiceTypeSelect = $('#editServiceType');
            const $editServicesTableBody = $('#editServicesTableBody');
            const $editSelectAllCheckbox = $('#editSelectAll');
            itemId = itemId || $('#editItemId').val();

            if ($editServiceSelect.val() === '0' || $editServiceTypeSelect.val() === '0') {
                $editServicesTableBody.html('');
                $editSelectAllCheckbox.prop('checked', false);
                return;
            }

            $.ajax({
                url: '/smsDashboard/smsGetInfo/',
                type: 'GET',
                data: {
                    'service': JSON.stringify($editServiceSelect.val()),
                    'service_type': JSON.stringify($editServiceTypeSelect.val()),
                    'item_id': itemId
                },
                headers: {
                    'X-CSRF-Token': $('input[name=csrfmiddlewaretoken]').val()
                },
                beforeSend: function () {
                    $editServicesTableBody.html('<tr><td colspan="3" class="text-center p-4">در حال بارگذاری...</td></tr>');
                },
                success: function (data) {
                    $editServicesTableBody.html('');
                    if (data.services.length === 0) {
                        $editServicesTableBody.html('<tr><td colspan="3" class="text-center p-4">هیچ خدمتی یافت نشد</td></tr>');
                        return;
                    }
                    $.each(data.services, function (index, service) {
                        const isChecked = data.selected_services && data.selected_services.includes(service.id) ? 'checked' : '';
                        const row = `
                            <tr class="hover:bg-gray-100">
                                <td class="border-b">${index + 1}</td>
                                <td class="border-b">${service.service}</td>
                                <td class="border-b">
                                    <input type="checkbox" name="selected_services" value="${service.id}" class="h-5 w-5 edit-service-checkbox" ${isChecked}>
                                </td>
                            </tr>`;
                        $editServicesTableBody.append(row);
                    });
                    updateEditCheckboxEvents();
                },
                error: function (xhr, status, error) {
                    console.log('Error fetching services:', error);
                    $editServicesTableBody.html('<tr><td colspan="3" class="text-center p-4">خطا در بارگذاری خدمات</td></tr>');
                }
            });
        }

        // Update checkbox events for edit modal
        function updateEditCheckboxEvents() {
            const $editServiceCheckboxes = $('.edit-service-checkbox');
            const $editSelectAllCheckbox = $('#editSelectAll');
            $editSelectAllCheckbox.off('change').on('change', function () {
                $editServiceCheckboxes.prop('checked', $(this).prop('checked'));
            });
            $editServiceCheckboxes.off('change').on('change', function () {
                const allChecked = $editServiceCheckboxes.length > 0 && $editServiceCheckboxes.toArray().every(cb => cb.checked);
                const someChecked = $editServiceCheckboxes.toArray().some(cb => cb.checked);
                $editSelectAllCheckbox.prop('checked', allChecked);
                $editSelectAllCheckbox.prop('indeterminate', someChecked && !allChecked);
            });
        }

        // Submit edit form via AJAX
        function submitEdit() {
            var itemId = $('#editItemId').val();
            var service = $('#editService').val();
            var serviceType = $('#editServiceType').val();
            var company = $('#editCompany').val();
            var loco = $('#editLoco').val();
            var place = $('#editPlace').val();
            var typeNumber = $('#editTypeNumber').val();
            var fromDate = $('#editFromDate').val();
            var desc = $('#editDesc').val().trim();
            var selectedServices = $('.edit-service-checkbox:checked').map(function() { return this.value; }).get();

            if (service === '0' || serviceType === '0' || !company || !loco || !place || !typeNumber || !fromDate || selectedServices.length === 0) {
                alert('لطفاً تمام فیلدها را پر کنید و حداقل یک خدمت را انتخاب کنید');
                return;
            }

            console.log('Submitting edit - Item ID:', itemId, 'Data:', {
                service, service_type: serviceType, company, loco, place, typeNumber, from_date: fromDate, desc, selected_services: selectedServices
            });

            $.ajax({
                url: '/smsDashboard/smsServiceUpdate/' + itemId + '/',
                method: 'POST',
                data: {
                    service: service,
                    service_type: serviceType,
                    company: company,
                    loco: loco,
                    place: place,
                    typeNumber: typeNumber,
                    from_date: fromDate,
                    desc: desc,
                    selected_services: JSON.stringify(selectedServices),
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                },
                success: function (response) {
                    console.log('Edit saved:', response);
                    if (response.status === 'success') {
                        location.reload();
                    }
                },
                error: function (xhr, status, error) {
                    console.log('Error saving edit:', xhr, status, error);
                    alert('خطا در ذخیره تغییرات');
                }
            });
        }

        $(document).ready(function () {
            // Handle details modal
            $('.details-icon i[data-bs-toggle="modal"]').click(function () {
                var itemId = $(this).data('item-id');
                $.ajax({
                    url: '/smsDashboard/smsServiceDetails/' + itemId + '/',
                    method: 'GET',
                    timeout: 5000,
                    success: function (data) {
                        $('#itemName').text(data.name);
                        $('#itemDescription').text(data.description);
                        var tableBody = $('#subItemTableBody');
                        tableBody.empty();
                        if (data.subitems && data.subitems.length > 0) {
                            data.subitems.forEach(function(subitem, index) {
                                tableBody.append(
                                    `<tr><td>${index + 1}</td><td>${subitem.title}</td></tr>`
                                );
                            });
                        } else {
                            tableBody.append('<tr><td colspan="2">زیرآیتمی یافت نشد</td></tr>');
                        }
                    },
                    error: function (xhr, status, error) {
                        console.log('Details error:', xhr, status, error);
                        alert('خطا در دریافت اطلاعات');
                    }
                });
            });
        });
  }