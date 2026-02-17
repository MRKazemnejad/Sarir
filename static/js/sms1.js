$(document).ready(function () {

    let mainServiceData = [];
    let subServicesData = [];
    let selectedOpration = [];
    let companiesData = [];
    let companiesDataAll = [];
    let selectedCompany = [];
    let depotsData = [];
    // let operationsData = {};
    // let subServicesData = {};
    // let companiesData = [];
    // let locomotivesData = {};
    // let depotsData = [];


    $.ajax({
        url: '/smsDashboard/smsLoadRawData',
        method: 'GET',
        dataType: 'json',
        success: function (data) {

            mainServiceData = data.mainServices;
            subServicesData = data.subServices;
            companiesData = data.companies_uniqe;
            companiesDataAll = data.companies_all;
            depotsData = data.depots;


        },
        error: function (xhr, status, error) {
            console.error('Error loading initial data:', error);
        }
    });

//***************************************************************************************************************
    function populateSelect(selectElement, data, selectedId = null) {
        selectElement.innerHTML = '';
        const option1 = document.createElement('option');
        option1.value='';
        option1.text='...';
        selectElement.appendChild(option1);
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.code;
            option.textContent = item.name;
            if (item.code == selectedId) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });

    }

//***************************************************************************************************************
    function populateSelect1(selectElement, data, selectedId = null) {
        selectElement.innerHTML = '';
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.loco;
            option.textContent = item.loco;

            if (item.loco == selectedId) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

//***************************************************************************************************************
    function loadEditServices(itemId, selectedCategory, selectedOperation) {
        const $editServiceSelect = $('#categorySelect');
        const $editServiceTypeSelect = $('#operationSelect');


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
                'service': JSON.stringify(selectedCategory),
                'service_type': JSON.stringify(selectedOperation),
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

//***************************************************************************************************************

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

//***************************************************************************************************************
    $('.edit-btn').on('click', function () {
        const row = $(this).closest('tr');
        const itemId = row.find('input[name="item_id"]').val();


        $.ajax({
            url: `/smsDashboard/smsLoadEditData/${itemId}/`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                document.getElementById('categorySelect').innerHTML = ''
                document.getElementById('operationSelect').innerHTML = '';
                document.getElementById('editCompany').innerHTML = '';
                const serviceSelect = document.getElementById('categorySelect');
                const operationSelect = document.getElementById('operationSelect');
                const companySelect = document.getElementById('editCompany');
                const locomotiveSelect = document.getElementById('editLoco');
                document.getElementById('editFromDate').value = data.start_date;
                const depotSelect = document.getElementById('editPlace');
                document.getElementById('editTypeNumber').value = data.count;

                selectedOpration = [];
                selectedCompany = [];

                for (var i = 0; i < subServicesData.length; i++) {
                    if (subServicesData[i]['mainsevice_code'] == data.category_id) {
                        selectedOpration.push(subServicesData[i])
                    }
                }

                for (var i = 0; i < companiesDataAll.length; i++) {
                    if (companiesDataAll[i]['code'] == data.company_id) {
                        selectedCompany.push(companiesDataAll[i])
                    }
                }


                populateSelect(serviceSelect, mainServiceData, data.category_id);
                populateSelect(operationSelect, selectedOpration, data.operation_id);
                populateSelect(companySelect, companiesData, data.company_id);
                populateSelect1(locomotiveSelect, selectedCompany, data.locomotive_id);
                populateSelect(depotSelect, depotsData, data.depot_id);

                loadEditServices(itemId, data.category_id, data.operation_id)

                $('#editModal').modal('show');
            },
            error: function (xhr, status, error) {
                console.error('Error fetching item data:', error);
            }
        });
    });


//***************************************************************************************************************
// Submit edit form via AJAX
function submitEdit() {
    var itemId = $('#editItemId').val();
    var service = $('#categorySelect').val();
    var serviceType = $('#operationSelect').val();
    var company = $('#editCompany').val();
    var loco = $('#editLoco').val();
    var place = $('#editPlace').val();
    var typeNumber = $('#editTypeNumber').val();
    var fromDate = $('#editFromDate').val();
    var selectedServices = $('.edit-service-checkbox:checked').map(function () {
        return this.value;
    }).get();

    if (service === '0' || serviceType === '0' || !company || !loco || !place || !typeNumber || !fromDate || selectedServices.length === 0) {
        alert('لطفاً تمام فیلدها را پر کنید و حداقل یک خدمت را انتخاب کنید');
        return;
    }


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
//***************************************************************************************************************
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
                    data.subitems.forEach(function (subitem, index) {
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
//***************************************************************************************************************
    $('#categorySelect').on('change', function () {
        selectedOpration = [];
        const selectedCategoryId = $(this).val();
        for (var i = 0; i < subServicesData.length; i++) {
            if (subServicesData[i]['mainsevice_code'] == selectedCategoryId) {
                selectedOpration.push(subServicesData[i])
            }
        }
        populateSelect(document.getElementById('operationSelect'), selectedOpration);

    });
//**********************************************************************************************************************
    $('#operationSelect').on('change', function () {
        const itemId = $('#editItemId').val();
        const selectedCategory = $('#categorySelect').val();
        const selectedOperationId = $(this).val();

        loadEditServices(itemId, selectedCategory, selectedOperationId)

    });


});