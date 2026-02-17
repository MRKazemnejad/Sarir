function attachfile() {

    var value = document.getElementById('status').value;


    if (value == 'RJCT') {
        document.getElementById('attach').style.display = '';
    } else {
        document.getElementById('attach').style.display = 'none';
    }

}

//*********************************************************************************************************************
//  clicking serial input make disable number of material and vice versa
$(document).ready(function () {

    $("#serial")
        .on('input', function () {
            var activeFee = (this.value !== '') ? true : false;
            $('#typeNumber').prop('disabled', activeFee);
        })
        .trigger('input');
});

$(document).ready(function () {
    $("#typeNumber")
        .on('input', function () {
            var activeFee = (this.value > 0) ? true : false;
            $('#serial').prop('disabled', activeFee);
        })
        .trigger('input');
});

// ********************************************************************************************************************
function proccess() {
    var value = document.getElementById('function').value;

    if (value == 1) {
        document.getElementById('ordercompany').style.display = 'none';
        document.getElementById('montagecompany').style.display = '';
        // document.getElementById('montageloco').style.display='';
        // document.getElementById('montagestatus').style.display='';
        document.getElementById('status').value = 'DAMG';
        document.getElementById('status').disabled = false;
        document.getElementById("loco").disabled = false;


    } else if (value == 2) {
        document.getElementById('ordercompany').style.display = '';
        document.getElementById('montagecompany').style.display = 'none';
        // document.getElementById('montageloco').style.display='none';
        document.getElementById("loco").disabled = true;
        // document.getElementById('montagestatus').style.display='none';
        document.getElementById('status').value = 'DEFLT';
        document.getElementById('status').disabled = true;

    }

}

// ********************************************************************************************************************
$(document).ready(function () {
    $.ajax({
        url: "/pmsDashboard/companyLocoList",
        success: function (data) {
            systemSelect = document.getElementById('company');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            var index = data.selected_company;
            for (var i = 0; i < data.company.length; i++) {
                systemSelect = document.getElementById('company');
                systemSelect.options[systemSelect.options.length] = new Option(data.company[i], data.company_code[i]);
                if (index == data.company[i]) {
                    document.getElementById("company").selectedIndex = (i + 1);
                }
            }

            locodata();
        }
    });
});

// ********************************************************************************************************************
function locodata() {
    document.getElementById('loco').innerHTML = ''
    var value = document.getElementById('company').value;


    $.ajax({

        url: "/pmsDashboard/locoDataList", data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {

            systemSelect = document.getElementById('loco');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            var index = data.selecteddloco;
            for (var i = 0; i < data.loco.length; i++) {
                systemSelect = document.getElementById('loco');
                systemSelect.options[systemSelect.options.length] = new Option(data.loco[i], data.loco[i]);
                if (index == data.loco[i]) {
                    document.getElementById("loco").selectedIndex = (i + 1);
                }
            }

        }
    });
}

//*******************************************************************************************************************
$(document).ready(function () {
    $.ajax({
        url: "/pmsDashboard/systemList",
        success: function (data) {

            for (var i = 0; i < data.system.length; i++) {
                systemSelect = document.getElementById('system');
                systemSelect.options[systemSelect.options.length] = new Option(data.system[i], data.system_code[i]);

            }
            var index = data.selected;
            document.getElementById('system');
            for (var i = 0; i < data.depot.length; i++) {
                systemSelect = document.getElementById('place');
                systemSelect.options[systemSelect.options.length] = new Option(data.depot[i], data.depot[i]);
                if (index == data.system_code[i]) {
                    document.getElementById("system").selectedIndex = (i + 1);
                }

            }
            systemdata();
        }
    });
});

// **********************************************************************************************************************

function systemdata() {
    document.getElementById('part').innerHTML = ''
    var value = document.getElementById('system').value;

    $.ajax({

        url: "/pmsDashboard/partList",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {
            systemSelect = document.getElementById('part');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            var selected = data.selectedpart;
            for (var i = 0; i < data.part.length; i++) {
                systemSelect = document.getElementById('part');
                systemSelect.options[systemSelect.options.length] = new Option(data.part[i], data.part_code[i]);
                if (selected == data.part_code[i]) {
                    document.getElementById("part").selectedIndex = (i + 1);
                }
            }

        }
    });

}

// ********************************************************************************************************************
function serialList() {
    var options = '';
    document.getElementById('serial').innerHTML = ''
    var value = document.getElementById('part').value;
    var system = document.getElementById('system').value;

    $.ajax({

        url: "/pmsDashboard/serialList",
        data: {
            'message': JSON.stringify(value),
            'system': JSON.stringify(system),
        },
        success: function (data) {

            for (var i = 0; i < data.serial.length; i++) {
                options += '<option>' + data.serial[i] + '</option>';
            }

            document.getElementById('list-timezone').innerHTML = options;

        }
    });


}

// ****************************************************************************************************************
document.addEventListener('DOMContentLoaded', e => {
    $('#serial').autocomplete()
}, false);

// ****************************************************************************************************************
function getcmt_check(id) {
    var value = id
    $.ajax({
        type: "GET",
        url: "/pmsDashboard/pmsCheck_desc",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {

            $("#desc").html(data.montagedesc);
            $("#register").html(data.checkdesc);

        }
    });
}


//*******************************************************************************************************************
function contractorList(id) {

    $.ajax({

        url: "/pmsDashboard/contractorDataList",
        data: {
            'message': JSON.stringify(id),
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

//*********************************************************************************************************************

function getcmt_maintenance(id) {
    var stat = 'repair'
    $.ajax({
        type: "GET",
        url: "/pmsDashboard/pmsMaintenance_desc",
        data: {
            'message': JSON.stringify(id),
            'stat': JSON.stringify(stat),

        },
        success: function (data) {
            $("#desc").html(data.montagedesc);
            $("#register").html(data.checkdesc);
        }
    });
}

//*******************************************************************************************************************

function getcmt_montage(id) {
    var stat = 'montage'
    $.ajax({
        type: "GET",
        url: "/pmsDashboard/pmsMaintenance_desc",
        data: {
            'message': JSON.stringify(id),
            'stat': JSON.stringify(stat),

        },
        success: function (data) {
            $("#desc").html(data.montagedesc);
            $("#register").html(data.checkdesc);
        }
    });
}

//********************************************************************************************************************
function getcmt_warehouse(id) {
    var stat = $('.desc_but').attr('stat');

    $.ajax({
        type: "GET",
        url: "/pmsDashboard/pmsWarehouse_descEnter",
        data: {
            'message': JSON.stringify(id),
            'stat': JSON.stringify(stat),

        },
        success: function (data) {

            $("#desc").html(data.montagedesc);
            $("#register").html(data.checkdesc);
        }
    });

}

//*******************************************************************************************************************
function getcmt_underrepair(id) {
    var stat = 'repairwait'
    $.ajax({
        type: "GET",
        url: "/pmsDashboard/pmsUnderRepair_desc",
        data: {
            'message': JSON.stringify(id),
            'stat': JSON.stringify(stat),

        },
        success: function (data) {

            $("#desc").html(data.montagedesc);
            $("#register").html(data.checkdesc);
        }
    });

}

//*******************************************************************************************************************
function getcmt_senttowarehouse(id) {
    var stat = 'sendtowarehouse'
    $.ajax({
        type: "GET",
        url: "/pmsDashboard/pmsSentToWarehouse_desc",
        data: {
            'message': JSON.stringify(id),
            'stat': JSON.stringify(stat),

        },
        success: function (data) {

            $("#desc").html(data.montagedesc);
            $("#register").html(data.checkdesc);
        }
    });
}

//****************************************************************************************************************
function getcmt_qc(id) {
    var stat = 'qc'
    $.ajax({
        type: "GET",
        url: "/pmsDashboard/pmsQc_desc",
        data: {
            'message': JSON.stringify(id),
            'stat': JSON.stringify(stat),

        },
        success: function (data) {

            $("#desc").html(data.montagedesc);
            $("#register").html(data.checkdesc);
        }
    });
}

//*************************************************************************************************************
$(document).ready(function () {
    $.ajax({

        url: "/pmsDashboard/settingscompany_list",
        success: function (data) {


            systemSelect = document.getElementById('company_name');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.company.length; i++) {
                systemSelect = document.getElementById('company_name');
                systemSelect.options[systemSelect.options.length] = new Option(data.company[i], data.id[i]);
            }

        }
    });
});

//***********************************************************************************************************

$(document).ready(function () {


    $.ajax({

        url: "/pmsDashboard/pmsSettingsContractorList",

        success: function (data) {


            systemSelect = document.getElementById('contractorsel');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.contractor.length; i++) {
                systemSelect = document.getElementById('contractorsel');
                systemSelect.options[systemSelect.options.length] = new Option(data.contractor[i], data.contractor_code[i]);
            }


            systemSelect = document.getElementById('contractorname');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.contractor.length; i++) {
                systemSelect = document.getElementById('contractorname');
                systemSelect.options[systemSelect.options.length] = new Option(data.contractor[i], data.contractor_code[i]);
            }
            document.getElementById("system_list").disabled = false;
            systemlistfunc();


            systemSelect = document.getElementById('contractorname1');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.contractor.length; i++) {
                systemSelect = document.getElementById('contractorname1');
                systemSelect.options[systemSelect.options.length] = new Option(data.contractor[i], data.contractor_code[i]);
            }
        }

    });
})


//*********************************************************************************************************
function editContractorPart() {
    var value = document.getElementById('contractorname1').value;

    $.ajax({

        url: "/pmsDashboard/pmsSettingsContractorPartEdit",
        data: {
            'contractor_code': JSON.stringify(value),
        },
        success: function (data) {

            const rows = data.rows;
            document.getElementById("table_visibility1").style.display = '';

            //clear table content
            const tbody = document.getElementById('schedule-table1');
            tbody.innerHTML = '';


            const table = document.getElementById('schedule-table1');


            rows.forEach(row => {
                const tr = document.createElement('tr');


                row.forEach(schedule => {


                    const tdCheckbox = document.createElement('td');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    // checkbox.checked = schedule.is_selected;
                    checkbox.checked = true;
                    checkbox.name = 'is_selected_chekbox_' + schedule.part_code;
                    tdCheckbox.appendChild(checkbox);
                    tr.appendChild(tdCheckbox);


                    const tdPeriod = document.createElement('td');
                    tdPeriod.textContent = schedule.part;
                    tr.appendChild(tdPeriod);


                    const tdDash = document.createElement('td');
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.name = 'text_field_edit_' + schedule.part;
                    input.className = 'form-control';
                    input.setAttribute('style', 'width: 8rem;')
                    input.placeholder = 'گارانتی';
                    input.min = '0';
                    input.max = '2000';
                    input.step = '30';
                    input.value = schedule.warranty;
                    tdDash.appendChild(input);
                    tr.appendChild(tdDash);


                });


                if (row.length < 3) {
                    for (let i = row.length; i < 3; i++) {
                        const tdCheckbox = document.createElement('td');
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.disabled = true;
                        tdCheckbox.appendChild(checkbox);
                        tr.appendChild(tdCheckbox);

                        const tdDash = document.createElement('td');
                        tdDash.textContent = '-';
                        tr.appendChild(tdDash);

                        const tdPeriod = document.createElement('td');
                        tdPeriod.textContent = '-';
                        tr.appendChild(tdPeriod);
                    }
                }

                table.appendChild(tr);
            });

        }
    });

}


//*********************************************************************************************************
function getcontractdatapms(id) {
    var value = id;
    $.ajax({
        url: "/pmsDashboard/settingscontract_data",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {
            document.getElementById('contract_title').value = data.contractdata.contract_title;
            document.getElementById('contractor').value = data.contractdata.contract_contractor;
            document.getElementById('contract_type').value = data.contractdata.contract_type;
            document.getElementById('startdate').value = data.contractdata.contract_startdate;
            document.getElementById('project_name').value = data.contractdata.contract_projectname;
            document.getElementById('contract_code1').value = data.contractdata.contract_code;
            document.getElementById('contract_priode').value = data.contractdata.contract_period;
            document.getElementById('enddate').value = data.contractdata.contract_enddate;
            document.getElementById('warranty').value = data.contractdata.contract_warranty;
            document.getElementById('contract_number').value = data.contractdata.contract_number;
            document.getElementById('rundate').value = data.contractdata.contract_rundate;
        }

    });
}

//*******************************************************************************************************************
function systemlistfunc() {
    $.ajax({
        url: "/pmsDashboard/systemList",
        success: function (data) {
            systemSelect = document.getElementById('system_list');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.system.length; i++) {
                systemSelect = document.getElementById('system_list');
                systemSelect.options[systemSelect.options.length] = new Option(data.system[i], data.system_code[i]);

            }
        }
    });
};

//********************************************************************************************************************
function loadContractsByContractor() {
    const contractorName = $('#contractorname').val();
    const $contractSelect = $('#contract_list');

    $contractSelect.html('<option value="">در حال بارگذاری...</option>').prop('disabled', true);

    if (!contractorName) {
        $contractSelect.html('<option value="">ابتدا پیمانکار را انتخاب کنید</option>');
        return;
    }

    $.ajax({
        url: "/pmsDashboard/contracts-by-contractor/",
        type: "GET",
        data: { contractor: contractorName },
        dataType: "json",
        timeout: 10000,
        beforeSend: function() {
            $contractSelect.html('<option value="">در حال بارگذاری قراردادها...</option>');
        },
        success: function(response) {
            $contractSelect.empty();

            if (response.contracts && response.contracts.length > 0) {
                $contractSelect.append('<option value="">یک قرارداد انتخاب کنید</option>');
                $contractSelect.append('<option value="00">بدون قرارداد</option>');

                response.contracts.forEach(function(contract) {
                    const code = contract.code;
                    const title = contract.title || code;
                    $contractSelect.append(`<option value="${code}">${title}</option>`);
                });

                $contractSelect.prop('disabled', false);
            } else {
                $contractSelect.html('<option value="">هیچ قراردادی برای این پیمانکار یافت نشد</option>');
                $contractSelect.append('<option value="00">بدون قرارداد</option>');
                $contractSelect.prop('disabled', false);
            }
        },
        error: function(xhr, status, error) {
            console.error("خطا در دریافت قراردادها:", error);
            $contractSelect.html('<option value="">خطا در بارگذاری قراردادها</option>');

            let errorMsg = 'خطا در ارتباط با سرور';
            if (status === 'timeout') errorMsg = 'زمان درخواست به پایان رسید';
            else if (xhr.status === 404) errorMsg = 'آدرس یافت نشد';
            else if (xhr.status === 500) errorMsg = 'خطای سرور';

            Swal.fire({
                icon: 'error',
                title: 'خطا',
                text: errorMsg,
                confirmButtonText: 'باشه'
            });
        }
    });
}

// اعتبارسنجی قبل از ارسال فرم
$('#assign-form').on('submit', function(e) {
    const selectedValue = $('#contract_list').val();

    // فقط اگر خالی باشه یا گزینه پیش‌فرض باشه → جلوی ارسال رو بگیر
    if (!selectedValue || selectedValue === '') {
        e.preventDefault();

        $('#contract_list').focus();
        Swal.fire({
            icon: 'warning',
            title: 'قرارداد انتخاب نشده',
            text: 'لطفاً یک قرارداد یا گزینه "بدون قرارداد" را انتخاب کنید.',
            confirmButtonText: 'باشه'
        });
        return false;
    }

    // اگر "00" یا کد قرارداد باشه → اجازه بده
    return true;
});

// وقتی پیمانکار عوض شد
$(document).on('change', '#contractorname', function() {
    $('#contract_list').val(''); // قرارداد قبلی رو پاک کن
    loadContractsByContractor();
});

// بعد از لود صفحه
$(document).ready(function() {
    if ($('#contractorname').val()) {
        loadContractsByContractor();
    }

    // اگر قبلاً قرارداد انتخاب شده بود، دوباره اعتبارسنجی رو فعال کن
    $('#contract_list').on('change', function() {
        // فقط برای UX بهتر — خطا رو پاک کن
        if ($(this).val()) {
            $(this).removeClass('is-invalid');
        }
    });
});




// function loadContractsByContractor() {
//     const contractorName = $('#contractorname').val();
//     const $contractSelect = $('#contract_list');
//
//     // وضعیت اولیه
//     $contractSelect.html('<option value="">در حال بارگذاری...</option>').prop('disabled', true);
//
//     if (!contractorName) {
//         $contractSelect.html('<option value="">ابتدا پیمانکار را انتخاب کنید</option>');
//         return;
//     }
//
//     $.ajax({
//         url: "/pmsDashboard/contracts-by-contractor/",
//         type: "GET",
//         data: {
//             contractor: contractorName
//         },
//         dataType: "json",
//         timeout: 10000, // 10 ثانیه
//         beforeSend: function() {
//             // اختیاری: لودینگ نشون بده
//             $contractSelect.html('<option value="">در حال بارگذاری قراردادها...</option>');
//         },
//         success: function(response) {
//             $contractSelect.empty();
//
//             if (response.contracts && response.contracts.length > 0) {
//                 $contractSelect.append('<option value="">یک قرارداد انتخاب کنید</option>');
//                 $contractSelect.append('<option value="00">بدون قرارداد</option>');
//
//                 response.contracts.forEach(function(contract) {
//                     const code = contract.code ;
//                     const title = contract.title;
//
//                     $contractSelect.append(
//                         `<option value="${code}">${title}</option>`
//                     );
//                 });
//
//                 $contractSelect.prop('disabled', false);
//             } else {
//                 $contractSelect.html('<option value="">هیچ قراردادی برای این پیمانکار یافت نشد</option>');
//             }
//         },
//         error: function(xhr, status, error) {
//             console.error("خطا در دریافت قراردادها:", error);
//             $contractSelect.html('<option value="">خطا در بارگذاری قراردادها</option>');
//
//             let errorMsg = 'خطا در ارتباط با سرور';
//             if (status === 'timeout') {
//                 errorMsg = 'زمان درخواست به پایان رسید';
//             } else if (xhr.status === 404) {
//                 errorMsg = 'آدرس یافت نشد';
//             } else if (xhr.status === 500) {
//                 errorMsg = 'خطای سرور';
//             }
//
//             Swal.fire({
//                 icon: 'error',
//                 title: 'خطا',
//                 text: errorMsg,
//                 confirmButtonText: 'باشه'
//             });
//         },
//         complete: function() {
//             // همیشه اجرا میشه
//             // می‌تونی لودینگ رو اینجا مخفی کنی
//         }
//     });
// }
//
// // وقتی کاربر پیمانکار رو عوض کرد
// $(document).on('change', '#contractorname', function() {
//     loadContractsByContractor();
// });
//
// // اگر قبلاً مقداری انتخاب شده بود، دوباره لود کن (مثلاً بعد از رفرش)
// $(document).ready(function() {
//     if ($('#contractorname').val()) {
//         loadContractsByContractor();
//     }
// });

//********************************************************************************************************************


function getpartlist() {
    var value = document.getElementById('system_list').value;

    $.ajax({
        url: "/pmsDashboard/schedule_data",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {
            const rows = data.rows;
            document.getElementById("table_visibility").style.display = '';


            const tbody = document.getElementById('schedule-table');
            tbody.innerHTML = '';

            const table = document.getElementById('schedule-table');

            rows.forEach(row => {
                const tr = document.createElement('tr');

                row.forEach(schedule => {
                    const tdCheckbox = document.createElement('td');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = schedule.is_selected;
                    checkbox.name = 'is_selected_' + schedule.part_code;
                    checkbox.className = 'part-checkbox';
                    tdCheckbox.appendChild(checkbox);
                    tr.appendChild(tdCheckbox);

                    const tdPeriod = document.createElement('td');
                    tdPeriod.textContent = schedule.part;
                    tr.appendChild(tdPeriod);

                    const tdDash = document.createElement('td');
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.name = 'text_field_' + schedule.part_code;
                    input.className = 'form-control';
                    input.setAttribute('style', 'width: 8rem;');
                    input.placeholder = 'گارانتی';
                    input.min = '0';
                    input.max = '2000';
                    input.step = '30';
                    tdDash.appendChild(input);
                    tr.appendChild(tdDash);
                });


                if (row.length < 3) {
                    for (let i = row.length; i < 3; i++) {
                        const tdCheckbox = document.createElement('td');
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.disabled = true;
                        tdCheckbox.appendChild(checkbox);
                        tr.appendChild(tdCheckbox);

                        const tdDash = document.createElement('td');
                        tdDash.textContent = '-';
                        tr.appendChild(tdDash);

                        const tdPeriod = document.createElement('td');
                        tdPeriod.textContent = '-';
                        tr.appendChild(tdPeriod);
                    }
                }

                table.appendChild(tr);
            });


            updateSelectAllCheckbox();
        }
    });
}


$(document).on('change', '#select-all', function () {
    const isChecked = this.checked;

    $('.part-checkbox:not(:disabled)').prop('checked', isChecked);
});


function updateSelectAllCheckbox() {
    const allCheckboxes = $('.part-checkbox:not(:disabled)');
    const checkedCount = allCheckboxes.filter(':checked').length;
    const selectAllCheckbox = $('#select-all');

    if (allCheckboxes.length === 0) {
        selectAllCheckbox.prop('checked', false).prop('disabled', true);
    } else {
        selectAllCheckbox.prop('disabled', false);
        selectAllCheckbox.prop('checked', checkedCount === allCheckboxes.length);
    }
}


$(document).on('change', '.part-checkbox', function () {
    updateSelectAllCheckbox();
});

//*******************************************************************************************************************
$(document).ready(function () {

    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', function () {
            rows.forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

});

// ****************************************************************************************************************
function submitForm(formId, formAction) {

    const form = document.getElementById('form-' + formId);
    if (form) {

        form.action = formAction;
        form.method = 'post';
        form.submit();
    }
}

// ********************************************************************************************************************
$(document).ready(function () {
    $.ajax({
        url: "/pmsDashboard/companyLocoList",
        success: function (data) {
            systemSelect = document.getElementById('editcompany');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            var index = data.selected_company;
            for (var i = 0; i < data.company.length; i++) {
                systemSelect = document.getElementById('editcompany');
                systemSelect.options[systemSelect.options.length] = new Option(data.company[i], data.company_code[i]);
                if (index == data.company[i]) {
                    document.getElementById("editcompany").selectedIndex = (i + 1);
                }
            }

            locodata();
        }
    });
});

//********************************************************************************************************************
$(document).ready(function () {

    $.ajax({
        url: "/pmsDashboard/companyLocoList",
        success: function (data) {
            systemSelect0 = document.getElementById('delcompany');
            // systemSelect4 = document.getElementById('editcompany1');
            systemSelect1 = document.getElementById('delcompanylist');
            systemSelect2 = document.getElementById('addcompanylist');
            // systemSelect3 = document.getElementById('editcompanylist');
            systemSelect0.options[systemSelect0.options.length] = new Option('...', 0);
            // systemSelect4.options[systemSelect4.options.length] = new Option('...', 0);
            systemSelect1.options[systemSelect1.options.length] = new Option('...', 0);
            systemSelect2.options[systemSelect2.options.length] = new Option('...', 0);
            // systemSelect3.options[systemSelect3.options.length] = new Option('...', 0);

            for (var i = 0; i < data.company.length; i++) {
                systemSelect0 = document.getElementById('delcompany');
                // systemSelect4 = document.getElementById('editcompany1');
                systemSelect1 = document.getElementById('delcompanylist');
                systemSelect2 = document.getElementById('addcompanylist');
                // systemSelect3 = document.getElementById('editcompanylist');
                systemSelect0.options[systemSelect0.options.length] = new Option(data.company[i], data.company_code[i]);
                // systemSelect4.options[systemSelect4.options.length] = new Option(data.company[i], data.company_code[i]);
                systemSelect1.options[systemSelect1.options.length] = new Option(data.company[i], data.company_code[i]);
                systemSelect2.options[systemSelect2.options.length] = new Option(data.company[i], data.company_code[i]);
                // systemSelect3.options[systemSelect3.options.length] = new Option(data.company[i], data.company_code[i]);

            }
        }
    });
});

// ********************************************************************************************************************
function locodatainfo1(value) {

    $.ajax({

        url: "/pmsDashboard/locoDataList",
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
function locodatainfo2(value) {

    $.ajax({

        url: "/pmsDashboard/locoDataList",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {

            systemSelect0 = document.getElementById('editlocolist');
            systemSelect0.options[systemSelect0.options.length] = new Option('...', 0);


            for (var i = 0; i < data.loco.length; i++) {
                systemSelect0 = document.getElementById('editlocolist');
                systemSelect0.options[systemSelect0.options.length] = new Option(data.loco[i], data.loco[i]);
            }

        }
    });

}

//*******************************************************************************************************************
$(document).ready(function () {
    $.ajax({
        url: "/pmsDashboard/systemList",
        success: function (data) {

            systemSelect0 = document.getElementById('deldepot');
            // systemSelect1 = document.getElementById('editdepot');
            systemSelect0.options[systemSelect0.options.length] = new Option('...', 0);
            // systemSelect1.options[systemSelect1.options.length] = new Option('...', 0);

            for (var i = 0; i < data.depot.length; i++) {
                systemSelect0 = document.getElementById('deldepot');
                // systemSelect1 = document.getElementById('editdepot');
                systemSelect0.options[systemSelect0.options.length] = new Option(data.depot[i], data.depot[i]);
                // systemSelect1.options[systemSelect1.options.length] = new Option(data.depot[i], data.depot[i]);

            }

        }
    });
});
//******************************************************************************************************************
$(document).ready(function () {
    $.ajax({
        url: "/pmsDashboard/locodetailslist",
        success: function (data) {

            systemSelect0 = document.getElementById('dieselsel');
            systemSelect0.options[systemSelect0.options.length] = new Option('شماره لکوموتیو', 0);

            for (var i = 0; i < data.loco.length; i++) {
                systemSelect0 = document.getElementById('dieselsel');
                systemSelect0.options[systemSelect0.options.length] = new Option(data.loco[i], data.loco[i]);
            }
        }
    });
});


// *************************************************** show details modal code ********************************************

$(document).ready(function () {
    $('.image-link').click(function (event) {
        event.preventDefault();
        var imageId = $(this).data('image-id');
        var action = $(this).data('action');

        fetchImage(imageId, action);

    });
});


function fetchImage(imageId, action) {

    $.ajax({
        url: "/pmsDashboard/getimage",
        data: {
            'id': JSON.stringify(imageId),
            'stat': JSON.stringify(action),
        },
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        success: function (data) {
            if (data.image_data) {
                openFileModal(data.image_data);
            } else {
                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'خطا',
                    text: "فایل مجوز وجود ندارد.",
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'تأیید',
                    customClass: {
                        popup: 'account',
                        title: 'account',
                        content: 'account',
                        confirmButton: 'account'
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            // Show error message
            Swal.fire({
                icon: 'error',
                title: 'خطا',
                text: "خطایی رخ داده است!",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'تأیید',
                customClass: {
                    popup: 'account',
                    title: 'account',
                    content: 'account',
                    confirmButton: 'account'
                }
            });
        }
    });
}


function openFileModal(base64Data) {
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById('modalImage');
    modal.style.display = 'flex';
    modalImg.src = 'data:image/jpeg;base64,' + base64Data;
}


function closeFileModal() {
    var modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}


function saveFileImage() {
    var modalImg = document.getElementById('modalImage');
    var link = document.createElement('a');
    link.href = modalImg.src;
    link.download = 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function printFileImage() {
    var modalImg = document.getElementById('modalImage');
    var printWindow = window.open('');
    printWindow.document.write('<html><body><img src="' + modalImg.src + '" style="width:100%;"></body></html>');
    printWindow.document.close();
    printWindow.print();
}


window.onclick = function (event) {
    var modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeFileModal();
    }
};

// ************************************************************ qc image modal *********************************************


$(document).ready(function () {
    $('.qc-pic').click(function (event) {
        event.preventDefault();
        var imageId = $(this).data('image-id');
        var action = $(this).data('action');
        qcImage(imageId, action);
    });
});


function qcImage(imageId, action) {
    $.ajax({
        url: "/pmsDashboard/openFile",
        data: {
            'id': JSON.stringify(imageId),
            'stat': JSON.stringify(action),
        },
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        success: function (data) {
            if (data.image_data) {
                openFileModal(data.image_data);
            } else {
                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'خطا',
                    text: "فایل مجوز وجود ندارد.",
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'تأیید',
                    customClass: {
                        popup: 'account',
                        title: 'account',
                        content: 'account',
                        confirmButton: 'account'
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            // Show error message
            Swal.fire({
                icon: 'error',
                title: 'خطا',
                text: "خطایی رخ داده است!",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'تأیید',
                customClass: {
                    popup: 'account',
                    title: 'account',
                    content: 'account',
                    confirmButton: 'account'
                }
            });
        }
    });
}


// *******************************************************************************************************************

function goToDetail(event, id) {

    if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
        event.stopPropagation();
        return;
    }
    window.location.href = '/pmsDashboard/pmsShowDetails/' + id;
}

//********************************************************************************************************************
function getSystemListDis(id) {
    $.ajax({
        url: "/pmsDashboard/pmsDisSystemList",
        data: {
            'message': JSON.stringify(id),
        },
        success: function (data) {
            document.getElementById('systemdis').innerHTML = ''
            document.getElementById('placedis').innerHTML = ''
            var index = data.selected;
            for (var i = 0; i < data.system.length; i++) {
                systemSelect = document.getElementById('systemdis');
                systemSelect.options[systemSelect.options.length] = new Option(data.system[i], data.system_code[i]);
                if (index == data.system_code[i]) {
                    document.getElementById("systemdis").selectedIndex = i;
                }
            }
            var index1 = data.selectedDepot;
            for (var i = 0; i < data.depot.length; i++) {
                systemSelect = document.getElementById('placedis');
                systemSelect.options[systemSelect.options.length] = new Option(data.depot[i], data.depot[i]);

                if (index1 === data.depot[i]) {

                    document.getElementById("placedis").selectedIndex = i;
                }

            }
            getPartListDis(id);
        }
    });
};

// ******************************************************** Edit modal part select **************************************
function getSystemPartSelect(id) {

    $.ajax({
        url: "/pmsDashboard/pmsGetPartSelect",
        data: {
            'id': JSON.stringify(id),
        },
        success: function (data) {
            if (data.logPart && !data.monPart && !data.qcPart && !data.warPart) {
                $('#logPart').removeClass('hidden');
            } else if (data.logPart && !data.monPart && !data.qcPart && data.warPart) {
                $('#logPart').removeClass('hidden');
                $('#warPart').removeClass('hidden');
            } else if (data.logPart && !data.monPart && data.qcPart && data.warPart) {
                $('#logPart').removeClass('hidden');
                $('#warPart').removeClass('hidden');
                $('#qcPart').removeClass('hidden');
            } else if (data.logPart && data.monPart && data.qcPart && data.warPart) {

                $('#logPart').removeClass('hidden');
                $('#warPart').removeClass('hidden');
                $('#qcPart').removeClass('hidden');
                $('#monPart').removeClass('hidden');
            }


        }
    });
};

// **********************************************************************************************************************

function getPartListDis(id) {
    document.getElementById('partdis').innerHTML = ''
    var value = document.getElementById('systemdis').value;

    $.ajax({

        url: "/pmsDashboard/pmsDisPartList",
        data: {
            'message': JSON.stringify(value),
            'id': JSON.stringify(id),
        },
        success: function (data) {
            systemSelect = document.getElementById('partdis');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            var selected = data.selectedpart;
            for (var i = 0; i < data.part.length; i++) {
                systemSelect = document.getElementById('partdis');
                systemSelect.options[systemSelect.options.length] = new Option(data.part[i], data.part_code[i]);
                if (selected == data.part_code[i]) {
                    document.getElementById("partdis").selectedIndex = (i + 1);
                }
            }

        }

    });

}

// ********************************************************************************************************************

function getPartListGeneral() {
    document.getElementById('partdis').innerHTML = ''
    var value = document.getElementById('systemdis').value;

    $.ajax({

        url: "/pmsDashboard/pmsDisPartListGeneral",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {
            systemSelect = document.getElementById('partdis');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.part.length; i++) {
                systemSelect = document.getElementById('partdis');
                systemSelect.options[systemSelect.options.length] = new Option(data.part[i], data.part_code[i]);
            }

        }
    });

}

// ********************************************************************************************************************
function getAllInfoDis(id) {

    $.ajax({
        url: "/pmsDashboard/pmsDisAllData",
        data: {
            'id': JSON.stringify(id),
        },
        success: function (data) {
            document.getElementById('serialdis').value = data.serial;
            document.getElementById('demontagedatedis').value = data.demontage_date;
            document.getElementById('numberdis').value = data.number;
            document.getElementById('startrepairdate').value = data.sendToContractor;
            document.getElementById('endrepairdate').value = data.repairEndDate;
            document.getElementById('sendtowar').value = data.sendToWarehouse;
            document.getElementById('warexitdate').value = data.warexitdate;
            document.getElementById('warenterdate').value = data.warenterdate;
            document.getElementById('qcdate').value = data.qcdate;
            document.getElementById('montagedate').value = data.montagedate;


        }
    })

}

// *******************************************************************************************************************
function getLocoListDis(id) {
    document.getElementById('locodis').innerHTML = ''
    var company_code = 1;
    $.ajax({

        url: "/pmsDashboard/pmsDisLocoList",
        data: {
            'id': JSON.stringify(id),
        },
        success: function (data) {
            systemSelect = document.getElementById('locodis');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            var index = data.selecteddloco;
            for (var i = 0; i < data.loco.length; i++) {
                systemSelect = document.getElementById('locodis');
                systemSelect.options[systemSelect.options.length] = new Option(data.loco[i], data.loco[i]);
                if (index == data.loco[i]) {
                    document.getElementById("locodis").selectedIndex = (i + 1);
                }
            }

        }
    });
}

// *********************************************************************************************************************
function getContractorListDis(id) {
    document.getElementById('contractordis').innerHTML = ''
    $.ajax({

        url: "/pmsDashboard/pmsDisContractorList",
        data: {
            'id': JSON.stringify(id),
        },
        success: function (data) {
            systemSelect = document.getElementById('contractordis');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            var index = data.selectedContractor;
            for (var i = 0; i < data.contractor.length; i++) {
                systemSelect = document.getElementById('contractordis');
                systemSelect.options[systemSelect.options.length] = new Option(data.contractor[i], data.contractor_code[i]);

                if (index == data.contractor_code[i]) {
                    document.getElementById("contractordis").selectedIndex = (i + 1);
                }
            }

        }

    });
}

// *******************************************************************************************************************
function getLocoMontageListDis(id) {
    document.getElementById('montlocodis').innerHTML = ''

    $.ajax({

        url: "/pmsDashboard/pmsDisMontageLocoList",
        data: {
            'id': JSON.stringify(id),
        },
        success: function (data) {
            systemSelect = document.getElementById('montlocodis');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            var index = data.selecteddloco;
            for (var i = 0; i < data.loco.length; i++) {
                systemSelect = document.getElementById('montlocodis');
                systemSelect.options[systemSelect.options.length] = new Option(data.loco[i], data.loco[i]);
                if (index == data.loco[i]) {
                    document.getElementById("montlocodis").selectedIndex = (i + 1);
                }
            }

        }
    });
}

// ***********************************************************************************************************************


$(document).ready(function () {
    $.ajax({
        url: "/pmsDashboard/pmsSettingsContractorScore",
        success: function (data) {
            let scoreCompanySelect = $('#scoreCompanySelect1');
            scoreCompanySelect.empty();
            scoreCompanySelect.append('<option value="">انتخاب کنید</option>');
            data.contractor.forEach(function (contractor, index) {
                let option = `<option value="${data.contractor_code[index]}">${contractor}</option>`;
                scoreCompanySelect.append(option);
            });

        },
        error: function () {
            console.log('خطا در بارگذاری لیست پیمانکاران. لطفاً دوباره تلاش کنید.');
        }
    });


    // Load contractor score and stats when scoreCompanySelect changes
    $('#scoreCompanySelect1').change(function () {
        let contractorCode = $(this).val();
        if (contractorCode) {
            $('#scoreContainer1').hide();
            $('#scoreActions1').hide();
            $('#statsContainer1').hide();
            $.ajax({
                url: '/pmsDashboard/pmsSettingsContractorGetScore',
                method: 'GET',
                data: {contractor_code: contractorCode},
                success: function (data) {
                    if (data.success) {
                        $('#currentScoreInput1').val(data.score || 0);
                        $('#warrantyIssues1').text(data.warranty_issues || 0);
                        $('#poorRepairs1').text(data.poor_repairs || 0);
                        $('#nonCommitments1').text(data.non_commitments || 0);
                        $('#scoreContainer1').fadeIn();
                        $('#scoreActions1').fadeIn();
                        $('#statsContainer1').fadeIn();
                    } else {
                        alert('امتیازی برای این پیمانکار یافت نشد.');
                        $('#scoreContainer1').hide();
                        $('#scoreActions1').hide();
                        $('#statsContainer1').hide();
                    }
                },
                error: function () {
                    alert('خطا در دریافت امتیاز پیمانکار.');
                    $('#scoreContainer1').hide();
                    $('#scoreActions1').hide();
                    $('#statsContainer1').hide();
                }
            });
        } else {
            $('#scoreContainer1').hide();
            $('#scoreActions1').hide();
            $('#statsContainer1').hide();
        }
    });


    // Handle score increase
    $('#increaseScore1').click(function () {
        let contractorCode = $('#scoreCompanySelect1').val();
        if (contractorCode) {
            $.ajax({
                url: '/pmsDashboard/pmsSettingsContractorScoreUpdate/',
                method: 'POST',
                data: {
                    contractor_code: contractorCode,
                    action: 'increase',
                    csrfmiddlewaretoken: '{{ csrf_token }}'
                },
                success: function (data) {
                    if (data.success) {
                        $('#currentScoreInput1').val(data.new_score);
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
    $('#decreaseScore1').click(function () {
        let contractorCode = $('#scoreCompanySelect1').val();
        if (contractorCode) {
            $.ajax({
                url: '/pmsDashboard/pmsSettingsContractorScoreUpdate/',
                method: 'POST',
                data: {
                    contractor_code: contractorCode,
                    action: 'decrease',
                    csrfmiddlewaretoken: '{{ csrf_token }}'
                },
                success: function (data) {
                    if (data.success) {
                        $('#currentScoreInput1').val(data.new_score);
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
    $('#warrantyDetails1').click(function () {
        let contractorCode = $('#scoreCompanySelect1').val();
        if (contractorCode) {
            alert('نمایش جزئیات خرابی‌های گارانتی برای پیمانکار: ' + contractorCode);
        }
    });

    // Handle poor repair click
    $('#poorRepair1').click(function () {
        let contractorCode = $('#scoreCompanySelect1').val();
        if (contractorCode) {
            alert('نمایش جزئیات خرابی‌های گارانتی برای پیمانکار: ' + contractorCode);
        }
    });

    // Handle nonfulfillment click
    $('#nonFulfillment1').click(function () {
        let contractorCode = $('#scoreCompanySelect1').val();
        if (contractorCode) {
            alert('نمایش جزئیات خرابی‌های گارانتی برای پیمانکار: ' + contractorCode);
        }
    });


})


// *********************************************************************************************************************
function toggleFields() {
    const action = document.getElementById('action').value;
    const addDiv = document.getElementById('add-contractor');
    const deleteDiv = document.getElementById('delete-contractor');
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

// *********************************************************************************************************************
function selectFields() {
    const action = document.getElementById('action1').value;
    const addDiv = document.getElementById('select_part');
    const deleteDiv = document.getElementById('edit_part');


    addDiv.classList.add('hidden');
    deleteDiv.classList.add('hidden');

    if (action === 'select') {
        addDiv.classList.remove('hidden');
    } else if (action === 'edit') {
        deleteDiv.classList.remove('hidden');
    }
}

// *********************************************************************************************************************
function partToggleFields() {
    const action = document.getElementById('action2').value;
    const addDiv = document.getElementById('add-part');
    const deleteDiv = document.getElementById('delete-part');
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

// *****************************************************************************************************************

$(document).ready(function () {
    $.ajax({
        url: "/pmsDashboard/systemList",
        success: function (data) {
            systemSelect = document.getElementById('partsel');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.system.length; i++) {
                systemSelect = document.getElementById('partsel');
                systemSelect.options[systemSelect.options.length] = new Option(data.system[i], data.system_code[i]);
            }

            systemSelect = document.getElementById('system_list');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.system.length; i++) {
                systemSelect = document.getElementById('system_list');
                systemSelect.options[systemSelect.options.length] = new Option(data.system[i], data.system_code[i]);
            }

            systemSelect = document.getElementById('system_list1');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.system.length; i++) {
                systemSelect = document.getElementById('system_list1');
                systemSelect.options[systemSelect.options.length] = new Option(data.system[i], data.system_code[i]);
            }

        }
    });
})

//******************************************************************************************************************
function selectPartFields() {
    const action = document.getElementById('action3').value;
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

//*******************************************************************************************************************
function enableField() {
    const part = document.getElementById('part');
    part.disabled = false;

}

//******************************************************************************************************************
function getSettingsPartList() {
    document.getElementById('part_list').innerHTML = ''
    var value = document.getElementById('system_list1').value;

    $.ajax({

        url: "/pmsDashboard/partList",
        data: {
            'message': JSON.stringify(value),
        },
        success: function (data) {
            systemSelect = document.getElementById('part_list');
            systemSelect.options[systemSelect.options.length] = new Option('...', 0);
            for (var i = 0; i < data.part.length; i++) {
                systemSelect = document.getElementById('part_list');
                systemSelect.options[systemSelect.options.length] = new Option(data.part[i], data.part_code[i]);
            }

        }
    });
}

//*****************************************************************************************************************
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

//*****************************************************************************************************************88
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
    $.ajax({
        url: "/pmsDashboard/pmsSettingsContractorList",
        success: function (data) {
            systemSelect = document.getElementById('contractor10');
            systemSelect.options[systemSelect.options.length] = new Option(' پیمانکار', 0);
            var index = data.selected_contractor;
            for (var i = 0; i < data.contractor.length; i++) {
                systemSelect = document.getElementById('contractor10');
                systemSelect.options[systemSelect.options.length] = new Option(data.contractor[i], data.contractor_code[i]);
                if (index == data.contractor_code[i]) {
                    document.getElementById("contractor10").selectedIndex = (i + 1);
                }

            }

        }
    });
})

//******************************************************************************************************************

function loadMontageLoco(id) {
    $.ajax({
        url: "/pmsDashboard/pmsMontageLocoList",
        success: function (data) {
            var mloco = 'mon' + id
            systemSelect = document.getElementById(mloco);
            systemSelect.options[systemSelect.options.length] = new Option(' لکوموتیو', 0);

            for (var i = 0; i < data.loco.length; i++) {
                systemSelect = document.getElementById(mloco);
                systemSelect.options[systemSelect.options.length] = new Option(data.loco[i], data.loco[i]);
            }

        }
    });
}

// **************************************************** PMS SEARCH ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmsSearch') {


        let sortDir = {}; // Track sort direction for each column

        // Handle status dropdown checkbox selection
        $('.dropdown-item input[type="checkbox"]').on('change', function () {
            const $selectAll = $('#select-all-status');
            const $checkboxes = $('.dropdown-menu input[name="status"]');
            const $dropdownButton = $('#statusDropdown');

            if ($(this).attr('id') === 'select-all-status') {
                $checkboxes.prop('checked', $(this).prop('checked'));
            } else {
                // Uncheck "Select All" if any individual checkbox is unchecked
                if (!$(this).prop('checked')) {
                    $selectAll.prop('checked', false);
                }
                // Check "Select All" if all individual checkboxes are checked
                if ($checkboxes.length === $checkboxes.filter(':checked').length) {
                    $selectAll.prop('checked', true);
                }
            }

            // Update dropdown button text
            const selected = $checkboxes.filter(':checked').map(function () {
                return $(this).next('label').text();
            }).get();
            $dropdownButton.text(selected.length > 0 ? selected.join(', ') : 'وضعیت');
        });

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
                        aVal = parseInt($a.find('td').eq(0).text()) || 0;
                        bVal = parseInt($b.find('td').eq(0).text()) || 0;
                        break;
                    case 1:
                        aVal = $a.find('td').eq(2).text().trim();
                        bVal = $b.find('td').eq(2).text().trim();
                        break;
                    case 2:
                        aVal = parseJalaliDate($a.find('td').eq(3).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(3).text().trim());
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

// **************************************************** PMS CHECK ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmscheck') {


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
                        aVal = parseInt($a.find('td').eq(0).text()) || 0;
                        bVal = parseInt($b.find('td').eq(0).text()) || 0;
                        break;
                    case 1:
                        aVal = $a.find('td').eq(2).text().trim();
                        bVal = $b.find('td').eq(2).text().trim();
                        break;
                    case 2:
                        aVal = parseJalaliDate($a.find('td').eq(3).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(3).text().trim());
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

// **************************************************** PMS MAINTENANCE ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmsmaintenance') {


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
                        aVal = parseInt($a.find('td').eq(0).text()) || 0;
                        bVal = parseInt($b.find('td').eq(0).text()) || 0;
                        break;
                    case 1:
                        aVal = parseJalaliDate($a.find('td').eq(7).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(7).text().trim());
                        break;
                    case 2:
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
// **************************************************** PMS WAREHOUSE EXIT ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmswarexit') {


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
                        aVal = parseInt($a.find('td').eq(2).text()) || 0;
                        bVal = parseInt($b.find('td').eq(2).text()) || 0;
                        break;
                    case 1:
                         aVal = parseJalaliDate($a.find('td').eq(7).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(7).text().trim());
                        break;

                    case 2:
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

// **************************************************** PMS WAREHOUSE ENTER ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmswarenter') {


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
                        aVal = parseInt($a.find('td').eq(2).text()) || 0;
                        bVal = parseInt($b.find('td').eq(2).text()) || 0;
                        break;
                    case 1:
                         aVal = parseJalaliDate($a.find('td').eq(7).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(7).text().trim());
                        break;

                    case 2:
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
// **************************************************** PMS UNDER REPAIR ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmsunderrepair') {


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
                         aVal = parseJalaliDate($a.find('td').eq(7).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(7).text().trim());
                        break;

                    case 2:
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

// **************************************************** PMS QC ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmsqc') {


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
                        aVal = parseJalaliDate($a.find('td').eq(5).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(5).text().trim());
                        break;

                    case 1:
                         aVal = parseJalaliDate($a.find('td').eq(6).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(6).text().trim());
                        break;

                    case 2:
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

// **************************************************** PMS SENDTO WAREHOUSE ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmssendtowar') {


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
                         aVal = parseJalaliDate($a.find('td').eq(5).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(5).text().trim());
                        break;

                    case 2:
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

// **************************************************** PMS MONTAGE ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmsmontage') {


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
                         aVal = parseJalaliDate($a.find('td').eq(6).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(6).text().trim());
                        break;

                    case 2:
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

// **************************************************** PMS CHECK REJECT ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmscheckreject') {


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
                         aVal = parseJalaliDate($a.find('td').eq(4).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(4).text().trim());
                        break;

                    case 2:
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
// **************************************************** PMS DISAGREEMENT ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmsdisagreement') {


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
                         aVal = parseJalaliDate($a.find('td').eq(4).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(4).text().trim());
                        break;

                    case 2:
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

// **************************************************** PMS QC WAIT ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmsqcwait') {


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
                        aVal = parseInt($a.find('td').eq(1).text()) || 0;
                        bVal = parseInt($b.find('td').eq(1).text()) || 0;
                        break;
                    case 1:
                         aVal = parseJalaliDate($a.find('td').eq(5).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(5).text().trim());
                        break;

                    case 2:
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

// **************************************************** PMS LOGISTIC EXIT ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmslogisticexit') {


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
                        aVal = parseInt($a.find('td').eq(1).text()) || 0;
                        bVal = parseInt($b.find('td').eq(1).text()) || 0;
                        break;
                    case 1:
                         aVal = parseJalaliDate($a.find('td').eq(6).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(6).text().trim());
                        break;

                    case 2:
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

// **************************************************** PMS LOGISTIC BARNAMEH ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmslogisticbarnameh') {


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
                        aVal = parseInt($a.find('td').eq(1).text()) || 0;
                        bVal = parseInt($b.find('td').eq(1).text()) || 0;
                        break;
                    case 1:
                         aVal = parseJalaliDate($a.find('td').eq(6).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(6).text().trim());
                        break;

                    case 2:
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

// **************************************************** PMS QC END REPAIR ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmsqcendrepair') {


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
                         aVal = parseJalaliDate($a.find('td').eq(7).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(7).text().trim());
                        break;

                    case 2:
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

// **************************************************** PMS SEND TO WAREHOUSE QC ****************************************************
$(document).ready(function () {
    if ($('body').data('page') === 'pmssendtowarehouseqc') {


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
                        aVal = parseInt($a.find('td').eq(1).text()) || 0;
                        bVal = parseInt($b.find('td').eq(1).text()) || 0;
                        break;
                    case 1:
                         aVal = parseJalaliDate($a.find('td').eq(5).text().trim());
                        bVal = parseJalaliDate($b.find('td').eq(5).text().trim());
                        break;

                    case 2:
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