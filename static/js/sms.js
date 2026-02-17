function selectService() {
    var service = document.getElementById('service').value;
    var service_type = document.getElementById('service_type').value;
    $.ajax({

        url: "/smsDashboard/smsGetInfo",
        data: {
            'service': JSON.stringify(service),
            'service_type': JSON.stringify(service_type),
        },
        success: function (data) {

            alert('data recived')

        }
    });
}

// ***********************************************************************************************************************
function smsContractorList(id) {

    $.ajax({

        url: "/smsDashboard/smsContractorDataList",
        data: {
            'code': JSON.stringify(id),
        },
        success: function (data) {
            var name = 'con' + id
            optionSelect = document.getElementById(name).options.length;

            if (optionSelect == 0) {

                for (var i = 0; i < data.contractor.length; i++) {
                    systemSelect = document.getElementById(name);
                    systemSelect.options[systemSelect.options.length] = new Option(data.contractor[i], data.contractor_code[i]);
                }
            }
        }

    });
}

// ********************************************************************************************************************
function submitForm(formId, formAction) {

    const form = document.getElementById('form-' + formId);
    if (form) {

        form.action = formAction;
        form.method = 'post';
        form.submit();
    }
}

//***********************************************************************************************************************
// $(document).ready(function () {
//     $.ajax({
//         url: "/smsDashboard/smsGetCompanyLocoList",
//         success: function (data) {
//             systemSelect = document.getElementById('company');
//             systemSelect.options[systemSelect.options.length] = new Option('...', 0);
//             var index = data.selected_company;
//             for (var i = 0; i < data.company.length; i++) {
//                 systemSelect = document.getElementById('company');
//                 systemSelect.options[systemSelect.options.length] = new Option(data.company[i], data.company_code[i]);
//                 if (index == data.company[i]) {
//                     document.getElementById("company").selectedIndex = (i + 1);
//                 }
//             }
//
//             locodata();
//         }
//     });
// });

// ********************************************************************************************************************
function locodata() {
    document.getElementById('loco1').innerHTML = ''
    var value = document.getElementById('company1').value;


    $.ajax({

        url: "/smsDashboard/smsGetLocoList",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {

            systemSelect = document.getElementById('loco1');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            var index = data.selecteddloco;
            for (var i = 0; i < data.loco.length; i++) {
                systemSelect = document.getElementById('loco1');
                systemSelect.options[systemSelect.options.length] = new Option(data.loco[i], data.loco[i]);
                if (index == data.loco[i]) {
                    document.getElementById("loco1").selectedIndex = (i + 1);
                }
            }

        }
    });
}

//*******************************************************************************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'register') {
        $.ajax({
            url: "/smsDashboard/smsGetCompanyLocoList",
            success: function (data) {
                systemSelect = document.getElementById('company1');
                systemSelect.options[systemSelect.options.length] = new Option('...', 0);
                var index = data.selected_company;
                for (var i = 0; i < data.company.length; i++) {
                    systemSelect = document.getElementById('company1');
                    systemSelect.options[systemSelect.options.length] = new Option(data.company[i], data.company_code[i]);
                    if (index == data.company[i]) {
                        document.getElementById("company1").selectedIndex = (i + 1);
                    }
                }

                locodata();
            }
        });
    }
});

// ********************************************************************************************************************

//
// $(document).ready(function () {
//     if ($('body').data('page') === 'register') {
//         // main service table
//         $.ajax({
//             url: "/smsDashboard/smsGetMainService",
//             success: function (data) {
//                 if (data.success) {
//                     var serviceSelect = $('#categorySelect');
//                     serviceSelect.empty();
//
//                     serviceSelect.append($('<option>', {value: '0', text: '...'}));
//                     $.each(data.category, function (index, category) {
//                         serviceSelect.append($('<option>', {
//                             value: category.service_code,
//                             text: category.service_name,
//                         }));
//                     });
//
//
//                 }
//
//             }
//         });
//
//     }
// });

// function to load sub services
// function loadSubServices() {
//
//     var value = document.getElementById('categorySelect').value;
//
//     $.ajax({
//         url: "/smsDashboard/smsGetSubService1",
//         data: {
//             'message': JSON.stringify(value),
//         },
//         success: function (data) {
//             if (data.success) {
//                 let operationSelect = $('#operationSelect');
//                 operationSelect.empty();
//                 operationSelect.append($('<option>', {value: '0', text: '...'}));
//                 $.each(data.category, function (index, category) {
//                     operationSelect.append($('<option>', {
//                         value: category.sub_service_code,
//                         text: category.sub_service_name,
//                     }));
//                 });
//                 operationSelect.prop('disabled', false);
//             }
//         }
//     });
// }


$(document).ready(function () {
    if ($('body').data('page') === 'register') {
        // const $serviceSelect = $('#categorySelect');
        const $serviceTypeSelect = $('#operationSelect');
        const $servicesTableBody = $('#services-table-body');
        const $selectAllCheckbox = $('#select-all');

// load service details on select change
        function loadServices() {
            const service = $serviceSelect.val();
            const serviceType = $serviceTypeSelect.val();

            if (service === '0' || serviceType === '0') {
                $servicesTableBody.html('');
                $selectAllCheckbox.prop('checked', false);
                return;
            }

            $.ajax({
                url: '/smsDashboard/smsGetInfo/',
                type: 'GET',
                data: {
                    'service': JSON.stringify(service),
                    'service_type': JSON.stringify(serviceType),
                },
                headers: {
                    'X-CSRF-Token': '{{ csrf_token }}'
                },
                beforeSend: function () {
                    $servicesTableBody.html('<tr><td colspan="3" class="text-center p-4">در حال بارگذاری...</td></tr>');
                },
                success: function (data) {
                    $servicesTableBody.html('');
                    if (data.services.length === 0) {
                        $servicesTableBody.html('<tr><td colspan="3" class="text-center p-4">هیچ خدمتی یافت نشد</td></tr>');
                        return;
                    }
                    $.each(data.services, function (index, service) {
                        const row = `
                                <tr class="hover:bg-gray-100">
                                    <td class="border-b">${index + 1}</td>
                                    <td class="border-b">${service.service}</td>
                                    <td class="border-b">
                                        <input type="checkbox" name="selected_services" value="${service.id}" class="h-5 w-5 service-checkbox">
                                    </td>
                                </tr>`;
                        $servicesTableBody.append(row);
                    });


                    updateCheckboxEvents();
                },
                error: function (xhr, status, error) {
                    console.error('Error fetching services:', error);
                    $servicesTableBody.html('<tr><td colspan="3" class="text-center p-4">خطا در بارگذاری خدمات</td></tr>');
                }
            });
        }


        $serviceTypeSelect.on('change', loadServices);


        function updateCheckboxEvents() {
            const $serviceCheckboxes = $('.service-checkbox');
            $selectAllCheckbox.off('change').on('change', function () {
                $serviceCheckboxes.prop('checked', $(this).prop('checked'));
            });

            $serviceCheckboxes.off('change').on('change', function () {
                const allChecked = $serviceCheckboxes.length > 0 && $serviceCheckboxes.toArray().every(cb => cb.checked);
                const someChecked = $serviceCheckboxes.toArray().some(cb => cb.checked);
                $selectAllCheckbox.prop('checked', allChecked);
                $selectAllCheckbox.prop('indeterminate', someChecked && !allChecked);
            });
        }


        $('form').on('submit', function (e) {
            const service = $serviceSelect.val();
            const serviceType = $serviceTypeSelect.val();
            const $selectedServices = $('.service-checkbox:checked');
            if (service === '0') {
                e.preventDefault();
                alert('لطفاً یک دسته‌بندی خدمت انتخاب کنید.');
            } else if (serviceType === '0') {
                e.preventDefault();
                alert('لطفاً یک نوع خدمت انتخاب کنید.');
            } else if ($selectedServices.length === 0) {
                e.preventDefault();
                alert('لطفاً حداقل یک خدمت را انتخاب کنید.');
            }
        });
    }
});

//********************************************************************************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'register' || $('body').data('page') === 'company') {
        document.getElementById('place1').innerHTML = '';
        $.ajax({
            url: "/smsDashboard/smsGetDepotList",
            success: function (data) {
                systemSelect = document.getElementById('place1');
                systemSelect.options[systemSelect.options.length] = new Option('...', 0);
                for (var i = 0; i < data.depot.length; i++) {
                    systemSelect = document.getElementById('place1');
                    systemSelect.options[systemSelect.options.length] = new Option(data.depot[i], data.depot_code[i]);

                }

            }
        });
    }
});

//**********************************************************************************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'company') {

        $.ajax({
            url: "/smsDashboard/smsGetCompanyLocoList",
            success: function (data) {

                systemSelect0 = document.getElementById('delcompany1');

                systemSelect1 = document.getElementById('addcompanylist1');
                systemSelect2 = document.getElementById('delcompanylist');
                systemSelect0.options[systemSelect0.options.length] = new Option('...', 0);
                systemSelect1.options[systemSelect1.options.length] = new Option('...', 0);
                systemSelect2.options[systemSelect2.options.length] = new Option('...', 0);


                for (var i = 0; i < data.company.length; i++) {
                    systemSelect0 = document.getElementById('delcompany1');
                    systemSelect1 = document.getElementById('delcompanylist');
                    systemSelect2 = document.getElementById('addcompanylist1');
                    systemSelect0.options[systemSelect0.options.length] = new Option(data.company[i], data.company_code[i]);
                    systemSelect1.options[systemSelect1.options.length] = new Option(data.company[i], data.company_code[i]);
                    systemSelect2.options[systemSelect2.options.length] = new Option(data.company[i], data.company_code[i]);


                }
            }
        });
    }
});

//********************************************************************************************************************

function companyToggleFields() {

    const action = document.getElementById('action').value;
    const addDiv = document.getElementById('add-company');
    const deleteDiv = document.getElementById('delete-company');
    const applyBtn = document.getElementById('apply-btn');

    addDiv.classList.add('hidden');
    deleteDiv.classList.add('hidden');
    applyBtn.disabled = true;

    if (action === 'add') {
        addDiv.classList.remove('hidden');
        applyBtn.disabled = false;
    } else if (action === 'delete') {
        deleteDiv.classList.remove('hidden');
        applyBtn.disabled = false;
    }

}

//*****************************************************************************************************************


function locoToggleFields() {

    const action = document.getElementById('action4').value;
    const addDiv = document.getElementById('select_part');
    const deleteDiv = document.getElementById('edit_part');


    addDiv.classList.add('hidden');
    deleteDiv.classList.add('hidden');

    if (action === 'add') {
        addDiv.classList.remove('hidden');
    } else if (action === 'delete') {
        deleteDiv.classList.remove('hidden');
    }


}

//******************************************************************************************************************
function locodatainfo1(value) {
    document.getElementById('dellocolist').innerHTML = '';
    $.ajax({

        url: "/smsDashboard/smsGetLocoList",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {

            systemSelect0 = document.getElementById('dellocolist');
            systemSelect0.options[systemSelect0.options.length] = new Option('...', 0);


            for (var i = 0; i < data.loco.length; i++) {
                systemSelect0 = document.getElementById('dellocolist');
                systemSelect0.options[systemSelect0.options.length] = new Option(data.loco[i], data.loco[i]);
            }

        }
    });

}

// ********************************************************************************************************************

function depotToggleFields() {

    const action = document.getElementById('action6').value;
    const addDiv = document.getElementById('add-depot');
    const deleteDiv = document.getElementById('delete-depot');
    const applyBtn = document.getElementById('apply-btn6');

    addDiv.classList.add('hidden');
    deleteDiv.classList.add('hidden');
    applyBtn.disabled = true;

    if (action === 'add') {
        addDiv.classList.remove('hidden');
        applyBtn.disabled = false;
    } else if (action === 'delete') {
        deleteDiv.classList.remove('hidden');
        applyBtn.disabled = false;
    }
}

//********************************************************************************************************************

$(document).ready(function () {

    if ($('body').data('page') === 'service') {

        $.ajax({
            url: "/smsDashboard/smsGetMainService",
            success: function (data) {
                if (data.success) {
                    var serviceSelect = $('#categorySelect5');
                    serviceSelect.empty();
                    serviceSelect.append($('<option>', {value: '0', text: '...'}));
                    $.each(data.category, function (index, category) {
                        serviceSelect.append($('<option>', {
                            value: category.service_code,
                            text: category.service_name,
                        }));
                    });


                }

            }
        });


        // Function to validate all fields and toggle submit button
        function validateForm() {
            let category = $('#categorySelect5').val();
            let operation = $('#operationSelect5').val();
            let action = $('#actionSelect').val();
            let newService = $('#newService').val();
            let checkedServices = $('input[name="selectedServices"]:checked').length;
            let isValid = false;

            if (action === 'add') {
                isValid = category && operation && action && newService;
            } else if (action === 'delete') {
                isValid = category && operation && action && checkedServices > 0;
            }

            $('#submitButton').prop('disabled', !isValid);
        }

        // Function to load services for selected category and operation
        function loadServices(categoryId, operationId) {
            let serviceTable = $('#serviceTable');
            let serviceTableBody = $('#serviceTableBody');
            serviceTableBody.empty();

            $.ajax({
                url: "/smsDashboard/smsGetServiceItem",
                data: {
                    'main_service': JSON.stringify(categoryId),
                    'sub_service': JSON.stringify(operationId),
                },
                success: function (data) {
                    if (data.success) {
                        serviceTable.show();
                        data.category.forEach(function (service, index) {
                            let row = `<tr>
                                    <td>${index + 1}</td>
                                    <td>${service.item}</td>
                                    <td><input type="checkbox" name="selectedServices" value="${service.id}"></td>
                                </tr>`;
                            serviceTableBody.append(row);
                        });
                    }
                }
            });

            $('#selectAll').prop('checked', false);
            validateForm();
        }

        // Function to update form based on action
        function updateFormAction(action) {
            if (action === 'add') {
                $('#newServiceGroup').show();
                $('#serviceTable').show();
            } else if (action === 'delete') {
                $('#newServiceGroup').hide();
                $('#newService').val('');
                $('#serviceTable').show();
            } else {
                $('#newServiceGroup').hide();
                $('#newService').val('');
                $('#serviceTable').hide();
            }
            validateForm();
        }

        // Populate operation select when category is selected
        $('#categorySelect5').change(function () {
            let operationSelect = $('#operationSelect');
            let actionSelect = $('#actionSelect');
            operationSelect.empty();
            actionSelect.empty();
            actionSelect.append('<option value="">انتخاب کنید</option>');
            if ($(this).val()) {
                $.ajax({
                    url: "/smsDashboard/smsGetSubService",
                    success: function (data) {
                        if (data.success) {
                            operationSelect.append($('<option>', {value: '0', text: '...'}));
                            $.each(data.category, function (index, category) {
                                operationSelect.append($('<option>', {
                                    value: category.sub_service_code,
                                    text: category.sub_service_name,
                                }));
                            });
                        }
                    }
                });

                operationSelect.prop('disabled', false);
            } else {
                operationSelect.prop('disabled', true);
                actionSelect.prop('disabled', true);
                $('#serviceTable').hide();
                $('#newServiceGroup').hide();
                $('#newService').val('');
            }
            validateForm();
        });

        // Enable action select when operation is selected
        $('#operationSelect5').change(function () {
            let categoryId = $('#categorySelect5').val();
            let operationId = $(this).val();
            let actionSelect = $('#actionSelect');
            actionSelect.empty();
            actionSelect.append('<option value="">انتخاب کنید</option>');
            if ($(this).val()) {
                actionSelect.append(`
                        <option value="add">افزودن</option>
                        <option value="delete">حذف</option>
                    `);
                actionSelect.prop('disabled', false);
                loadServices(categoryId, operationId);
            } else {
                actionSelect.prop('disabled', true);
                $('#serviceTable').hide();
                $('#newServiceGroup').hide();
                $('#newService').val('');
            }
            validateForm();
        });

        // Update form when action is selected
        $('#actionSelect').change(function () {
            updateFormAction($(this).val());
        });

        // Validate form when new service input changes
        $('#newService').on('input', function () {
            validateForm();
        });

        // Validate form when checkboxes are toggled
        $(document).on('change', 'input[name="selectedServices"]', function () {
            let allChecked = $('input[name="selectedServices"]').length === $('input[name="selectedServices"]:checked').length;
            $('#selectAll').prop('checked', allChecked);
            validateForm();
        });

        // Handle select all checkbox
        $('#selectAll').change(function () {
            $('input[name="selectedServices"]').prop('checked', $(this).is(':checked'));
            validateForm();
        });

        // Handle form submission
        $('#serviceForm').submit(function (e) {
            let action = $('#actionSelect').val();
            let categoryId = $('#categorySelect5').val();
            let operationId = $('#operationSelect5').val();

            if (action === 'delete') {
                let checkedServices = $('input[name="selectedServices"]:checked').map(function () {
                    return $(this).val();
                }).get();

                if (checkedServices.length > 0) {
                    // درخواست AJAX برای حذف
                    $.ajax({
                        url: "/smsDashboard/smsAddServiceItem/",
                        type: 'POST',
                        data: $(this).serialize(),
                        success: function () {
                            loadServices(categoryId, operationId);
                            $('#actionSelect').val(''); // تنظیم به "انتخاب کنید"
                            updateFormAction('');
                        }
                    });
                    e.preventDefault(); // جلوگیری از ارسال فرم
                }
            } else if (action === 'add') {
                let newService = $('#newService').val();
                if (newService) {
                    // درخواست AJAX برای افزودن
                    $.ajax({
                        url: "/smsDashboard/smsAddServiceItem/",
                        type: 'POST',
                        data: $(this).serialize(),
                        success: function () {
                            loadServices(categoryId, operationId);
                            $('#newService').val('');
                            $('#actionSelect').val(''); // تنظیم به "انتخاب کنید"
                            updateFormAction('');
                        }
                    });
                    e.preventDefault(); // جلوگیری از ارسال فرم
                }
            }
        });


        $.ajax({
            url: "/smsDashboard/smsGetMainService",
            success: function (data) {
                if (data.success) {
                    var serviceSelect = $('#delservice');
                    var serviceSelect2 = $('#servicesel1');
                    var serviceSelect3 = $('#servicesel2');
                    serviceSelect.empty();

                    serviceSelect.append($('<option>', {value: '0', text: '...'}));
                    serviceSelect2.append($('<option>', {value: '0', text: '...'}));
                    serviceSelect3.append($('<option>', {value: '0', text: '...'}));
                    $.each(data.category, function (index, category) {
                        serviceSelect.append($('<option>', {
                            value: category.code,
                            text: category.name,
                        }));

                        serviceSelect2.append($('<option>', {
                            value: category.code,
                            text: category.name,
                        }));
                        serviceSelect3.append($('<option>', {
                            value: category.code,
                            text: category.name,
                        }));
                    });


                }

            }
        });


    }
});

// تابع برای بارگذاری زیرخدمات
function loadSubServices1() {
    var value = document.getElementById('categorySelect5').value;
    document.getElementById('operationSelect5').innerHTML = '';

    $.ajax({
        url: "/smsDashboard/smsGetSubService1",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {
            if (data.success) {
                let operationSelect = $('#operationSelect5');
                operationSelect.empty();
                operationSelect.append($('<option>', {value: '0', text: '...'}));
                $.each(data.category, function (index, category) {
                    operationSelect.append($('<option>', {
                        value: category.sub_service_code,
                        text: category.sub_service_name,
                    }));
                });
                operationSelect.prop('disabled', false);

                $('#actionSelect').prop('disabled', false);
                $('#actionSelect').val(''); // تنظیم به "انتخاب کنید"


            }
        }
    });
}

//********************************************************************************************************************
function oprationLoad(id) {


    $.ajax({
        url: "/smsDashboard/smsGetSubService1",
        data: {
            'message': JSON.stringify(id),
        },
        success: function (data) {
            if (data.success) {
                let operationSelect = $('#delopration');
                operationSelect.empty();
                operationSelect.append($('<option>', {value: '0', text: '...'}));
                $.each(data.category, function (index, category) {
                    operationSelect.append($('<option>', {
                        value: category.sub_service_code,
                        text: category.sub_service_name,
                    }));
                });
                operationSelect.prop('disabled', false);
            }
        }
    });
}

//*********************************************************************************************************************
$(document).ready(function () {

    if ($('body').data('page') === 'contractor') {

        $.ajax({
            url: '/smsDashboard/smsGetContractor',
            method: 'GET',
            success: function (data) {
                let companySelect = $('#companySelect');
                let delcompanySelect = $('#delcompany8');
                let scoreCompanySelect = $('#scoreCompanySelect');
                companySelect.empty();
                delcompanySelect.empty();
                scoreCompanySelect.empty();
                companySelect.append('<option value="">انتخاب کنید</option>');
                delcompanySelect.append('<option value="">انتخاب کنید</option>');
                scoreCompanySelect.append('<option value="">انتخاب کنید</option>');
                data.contractor.forEach(function (contractor, index) {
                    let option = `<option value="${data.contractor_code[index]}">${contractor}</option>`;
                    companySelect.append(option);
                    delcompanySelect.append(option);
                    scoreCompanySelect.append(option);
                });

            },
            error: function () {
                alert('خطا در بارگذاری لیست پیمانکاران. لطفاً دوباره تلاش کنید.');
            }
        });


        // Enable warranty input when operation is selected
        $('#operationSelect').change(function () {
            if ($(this).val()) {
                $('#warranty').prop('disabled', false);
            } else {
                $('#warranty').prop('disabled', true).val(0);
            }
            validateForm2();
        });


        // Enable and populate category select when company is selected
        $('#companySelect').change(function () {
            let categorySelect = $('#categorySelect');
            categorySelect.empty();
            categorySelect.prop('disabled', false);
            validateForm2();
        });


        //******************************** Score part *********************************************************

        // Load contractor score and stats when scoreCompanySelect changes
        $('#scoreCompanySelect').change(function () {
            let contractorCode = $(this).val();
            if (contractorCode) {
                $('#scoreContainer').hide();
                $('#scoreActions').hide();
                $('#statsContainer').hide();
                $.ajax({
                    url: '/smsDashboard/smsGetContractorScore',
                    method: 'GET',
                    data: {contractor_code: contractorCode},
                    success: function (data) {
                        if (data.success) {
                            $('#currentScoreInput').val(data.score || 0);
                            $('#warrantyIssues').text(data.warranty_issues || 0);
                            $('#poorRepairs').text(data.poor_repairs || 0);
                            $('#nonCommitments').text(data.non_commitments || 0);
                            $('#scoreContainer').fadeIn();
                            $('#scoreActions').fadeIn();
                            $('#statsContainer').fadeIn();
                        } else {
                            alert('امتیازی برای این پیمانکار یافت نشد.');
                            $('#scoreContainer').hide();
                            $('#scoreActions').hide();
                            $('#statsContainer').hide();
                        }
                    },
                    error: function () {
                        alert('خطا در دریافت امتیاز پیمانکار.');
                        $('#scoreContainer').hide();
                        $('#scoreActions').hide();
                        $('#statsContainer').hide();
                    }
                });
            } else {
                $('#scoreContainer').hide();
                $('#scoreActions').hide();
                $('#statsContainer').hide();
            }
        });

        // Handle score increase
        $('#increaseScore').click(function () {
            let contractorCode = $('#scoreCompanySelect').val();
            if (contractorCode) {
                $.ajax({
                    url: '/smsDashboard/smsUpdateContractorScore/',
                    method: 'POST',
                    data: {
                        contractor_code: contractorCode,
                        action: 'increase',
                        csrfmiddlewaretoken: '{{ csrf_token }}'
                    },
                    success: function (data) {
                        if (data.success) {
                            $('#currentScoreInput').val(data.new_score);
                        } else {
                            alert('خطا در افزایش امتیاز: ' + (data.message || 'لطفاً دوباره تلاش کنید.'));
                        }
                    },
                    error: function () {
                        alert('خطا در ارتباط با سرور.');
                    }
                });
            } else {
                alert('لطفاً ابتدا یک پیمانکار انتخاب کنید.');
            }
        });

        // Handle score decrease
        $('#decreaseScore').click(function () {
            let contractorCode = $('#scoreCompanySelect').val();
            if (contractorCode) {
                $.ajax({
                    url: '/smsDashboard/smsUpdateContractorScore/',
                    method: 'POST',
                    data: {
                        contractor_code: contractorCode,
                        action: 'decrease',
                        csrfmiddlewaretoken: '{{ csrf_token }}'
                    },
                    success: function (data) {
                        if (data.success) {
                            $('#currentScoreInput').val(data.new_score);
                        } else {
                            alert('خطا در کاهش امتیاز: ' + (data.message || 'لطفاً دوباره تلاش کنید.'));
                        }
                    },
                    error: function () {
                        alert('خطا در ارتباط با سرور.');
                    }
                });
            } else {
                alert('لطفاً ابتدا یک پیمانکار انتخاب کنید.');
            }
        });

        // Handle warranty details click
        $('#warrantyDetails').click(function () {
            let contractorCode = $('#scoreCompanySelect').val();
            if (contractorCode) {
                alert('نمایش جزئیات خرابی‌های گارانتی برای پیمانکار: ' + contractorCode);
            }
        });

        // Handle poor repair click
        $('#poorRepair').click(function () {
            let contractorCode = $('#scoreCompanySelect').val();
            if (contractorCode) {
                alert('نمایش جزئیات خرابی‌های گارانتی برای پیمانکار: ' + contractorCode);
            }
        });

        // Handle nonfulfillment click
        $('#nonFulfillment').click(function () {
            let contractorCode = $('#scoreCompanySelect').val();
            if (contractorCode) {
                alert('نمایش جزئیات خرابی‌های گارانتی برای پیمانکار: ' + contractorCode);
            }
        });


    }
});

//********************************************************************************************************************

function loadSubServices2(itemId, selectedIndex, oprationType) {

    var value = selectedIndex;
    document.getElementById('operationSelect').innerHTML = '';

    $.ajax({
        url: "/smsDashboard/smsGetSubService1",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {
            if (data.success) {
                let operationSelect = $('#operationSelect');
                operationSelect.empty();
                operationSelect.append($('<option>', {value: '', text: '...'}));
                $.each(data.category, function (index, category) {
                    operationSelect.append($('<option>', {
                        value: category.sub_service_code,
                        text: category.sub_service_name,
                    }));
                    if (category.sub_service_name == oprationType) {
                        operationSelect.prop('selectedIndex',category.sub_service_code);


                    }
                });
                operationSelect.prop('disabled', false);
                // validateForm2();


                let selectedOperation = $('#operationSelect').val()
                loadEditServices(itemId, value, selectedOperation);

            }
        }
    });
}
//******************************************************************************************************************
// function loadSubServices3() {
//
//     var value=document.getElementById('categorySelect').value;
//     document.getElementById('operationSelect').innerHTML = '';
//
//     $.ajax({
//         url: "/smsDashboard/get_main_services",
//         data: {
//             'message': JSON.stringify(value),
//         },
//         success: function (data) {
//             if (data.success) {
//                 let operationSelect = $('#operationSelect');
//                 operationSelect.empty();
//                 operationSelect.append($('<option>', {value: '', text: '...'}));
//                 $.each(data.category, function (index, category) {
//                     operationSelect.append($('<option>', {
//                         value: category.sub_service_code,
//                         text: category.sub_service_name,
//                     }));
//
//                 });
//                 operationSelect.prop('disabled', false);
//                 validateForm2();
//
//             }
//         }
//     });
// }



//*******************************************************************************************************************
function validateForm2() {
    let company = $('#companySelect').val();
    let category = $('#categorySelect').val();
    let operation = $('#operationSelect').val();
    let warranty = parseInt($('#warranty').val());
    let isValid = company && category && operation && !isNaN(warranty) && warranty >= 0;
    $('#submitButton').prop('disabled', !isValid);
}

//******************************************************************************************************************
// function loadServiceItem() {
//
//
//     $.ajax({
//         url: "/smsDashboard/smsGetMainService",
//         success: function (data) {
//             if (data.success) {
//                 var serviceSelect = $('#categorySelect');
//                 serviceSelect.empty();
//                 serviceSelect.append($('<option>', {value: '', text: '...'}));
//                 $.each(data.category, function (index, category) {
//                     serviceSelect.append($('<option>', {
//                         value: category.service_code,
//                         text: category.service_name,
//                     }));
//                 });
//
//             }
//         }
//     });
//
//
// }



//*******************************************************************************************************************
$(document).ready(function () {

    if ($('body').data('page') === 'checkfail') {

        loadServiceItem();
        checkfailCompanyList();


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

    }
});
// *********************************************************************************************************************
// Load services for edit modal
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

//********************************************************************************************************************
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

//*********************************************************************************************************************
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

//***********************************************************************************************************
// Open edit modal and populate fields with row data
function openEditModal(itemId, service, serviceType, editCompany, loco, place, number, fromDate, desc) {
    $('#editItemId').val(itemId);

    $("#categorySelect option").filter(function () {
        return $(this).text() === service;
    }).prop("selected", true);


    let selectedIndex = $('#categorySelect option:selected').index();
    loadSubServices2(itemId, selectedIndex, serviceType);

    checkfailCompanyList(editCompany, loco);
    checkfailDepot(place);

    $('#editPlace').val(place || '1');
    $('#editTypeNumber').val(number || '');
    $('#editFromDate').val(fromDate || '');
    $('#editDesc').val(desc || '');
    $('#editModal').modal('show');
}

//***********************************************************************************************************
function checkfailCompanyList(selectedCompany, loco) {
        document.getElementById('editCompany').innerHTML = '';
    $.ajax({
        url: "/smsDashboard/smsGetCompanyLocoList",
        success: function (data) {
            systemSelect = document.getElementById('editCompany');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.company.length; i++) {
                systemSelect = document.getElementById('editCompany');
                systemSelect.options[systemSelect.options.length] = new Option(data.company[i], data.company_code[i]);
                if (selectedCompany == data.company_code[i]) {
                    $('#editCompany').prop('selectedIndex', data.company_code[i])
                }
            }

            checkfailLocoData(selectedCompany, loco);
        }
    });
}

//******************************************************************************************************************
function checkfailLocoData(selectedCompany, loco) {
    document.getElementById('editLoco').innerHTML = '';
    $.ajax({

        url: "/smsDashboard/smsGetLocoList",
        data: {
            'message': JSON.stringify(selectedCompany),
        },
        success: function (data) {

            systemSelect = document.getElementById('editLoco');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.loco.length; i++) {
                systemSelect = document.getElementById('editLoco');
                systemSelect.options[systemSelect.options.length] = new Option(data.loco[i], data.loco[i]);

                if (loco == data.loco[i]) {
                    $('#editLoco').prop('selectedIndex', i + 1);
                }
            }

        }
    });
}
//*****************************************************************************************************************
function checkfailDepot(place){

     document.getElementById('editPlace').innerHTML = '';
        $.ajax({
            url: "/smsDashboard/smsGetDepotList",
            success: function (data) {
                systemSelect = document.getElementById('editPlace');
                systemSelect.options[systemSelect.options.length] = new Option('...', 0);
                for (var i = 0; i < data.depot.length; i++) {
                    systemSelect = document.getElementById('editPlace');
                    systemSelect.options[systemSelect.options.length] = new Option(data.depot[i], data.depot_code[i]);
                    if(place == data.depot[i]){
                        $('#editPlace').prop('selectedIndex',i);
                    }

                }

            }
        });
}

