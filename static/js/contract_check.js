// static/js/check-budget.js
function checkContractBudget(contract_code, additional_amount = 0, callback = null) {
    if (!contract_code) {
        Swal.fire('خطا', 'کد قرارداد وارد نشده!', 'error');
        return;
    }

    const fmt = (num) => Number(num || 0).toLocaleString('fa-IR') + ' ریال';

    // URL رو از data-attribute دکمه بگیر (یا هر المنت دیگه)
    const btn = document.getElementById('check_btn');
    const ajaxUrl = btn.getAttribute('data-ajax-url');

    $.ajax({
        url: ajaxUrl,  // اینجا از data-ajax-url استفاده می‌کنه
        type: 'POST',
        data: JSON.stringify({
            contract_code: contract_code,
            additional_invoice_amount: additional_amount
        }),
        contentType: 'application/json',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        success: function(res) {
            // همون کد موفقیت قبلی (کپی کن از قبل)
            if (!res.success) {
                Swal.fire('خطا', res.error || 'خطا در دریافت اطلاعات', 'error');
                return;
            }

            const totalInvoicedNew = res.total_invoiced + additional_amount;
            const remainingNew = res.contract_price_total - totalInvoicedNew;

            let html = `
                <div class="text-right" dir="rtl" style="line-height: 2.2;">
                    <p><strong>مبلغ کل قرارداد:</strong> 
                        <span class="badge badge-info fs-15">${fmt(res.contract_price_total)}</span>
                    </p>
                    <p><strong>جمع فاکتورهای فعلی:</strong> 
                        <span class="badge badge-warning fs-15">${fmt(res.total_invoiced)}</span>
                    </p>`;

            if (additional_amount > 0) {
                html += `
                    <p><strong>فاکتور جدید:</strong> 
                        <span class="badge badge-dark fs-15">${fmt(additional_amount)}</span>
                    </p>
                    <p><strong>جمع فاکتورها (با این فاکتور):</strong> 
                        <span class="badge badge-purple fs-15">${fmt(totalInvoicedNew)}</span>
                    </p>`;
            }

            html += `
                    <p><strong>جمع پرداخت شده:</strong> 
                        <span class="badge badge-success fs-15">${fmt(res.total_paid)}</span>
                    </p>
                    <p><strong>باقیمانده بودجه:</strong> 
                        <span class="badge badge-primary fs-15">${fmt(res.remaining)}</span>
                    </p>`;

            if (additional_amount > 0) {
                const color = remainingNew >= 0 ? 'badge-success' : 'badge-danger';
                html += `
                    <p><strong>باقیمانده پس از این فاکتور:</strong> 
                        <span class="badge ${color} fs-15">${fmt(remainingNew)}</span>
                    </p>`;
            }

            html += `</div>`;
            const style = `<style>.fs-15{font-size:1.15rem!important;}.badge-purple{background:#6f42c1!important;}</style>`;

            if (res.over_budget || remainingNew < 0) {
                const overBy = Math.abs(remainingNew);
                Swal.fire({
                    icon: 'error',
                    title: '⚠️ سقف بودجه رد شد!',
                    html: style + html + `<hr><p class="text-danger fs-16"><strong>اضافه بر بودجه: ${fmt(overBy)}</strong></p>`,
                    showCancelButton: true,
                    confirmButtonText: 'لغو',
                    cancelButtonText: 'ذخیره اجباری',
                    reverseButtons: true,
                    width: '650px'
                }).then(r => callback(r.isDismissed));
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '✅ بودجه کافی است',
                    html: style + html,
                    confirmButtonText: 'تایید',
                    width: '650px'
                }).then(() => callback(true));
            }
        },
        error: function() {
            Swal.fire('خطا', 'ارتباط با سرور قطع است!', 'error');
            callback(false);
        }
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}