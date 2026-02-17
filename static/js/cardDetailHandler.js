// static/js/contract/cardDetailHandler.js
// === Card Detail Modal: Click card → open modal, Click checkbox → only toggle ===
// 100% fixed: No checkbox toggle on card click
document.addEventListener('click', function (e) {
    const card = e.target.closest('.permission-card');
    if (!card) return;

    const checkbox = card.querySelector('.permission-checkbox');
    if (!checkbox) return;

    const invoiceId = card.dataset.id;
    if (!invoiceId) return;

    // اگر روی چک‌باکس یا ظرفش کلیک شد → فقط تیک بزن
    if (e.target.closest('.checkbox-container, .permission-checkbox')) {
        e.stopPropagation();
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        return;
    }

    // در غیر این صورت → فقط مودال باز کن (بدون تیک زدن)
    e.stopPropagation();
    e.preventDefault();

    // باز کردن مودال (همون کد قبلی)
    const titleEl = document.getElementById('detailModalTitle');
    const subject = card.querySelector('.info-item strong')?.textContent.trim() || 'بدون عنوان';
    titleEl.textContent = `جزئیات فاکتور: ${subject} (${invoiceId})`;

    const bodyEl = document.getElementById('detailModalBody');
    bodyEl.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-primary" style="width: 3.5rem; height: 3.5rem;"></div><p class="mt-3 fw-bold">بارگذاری...</p></div>`;

    const modal = new bootstrap.Modal(document.getElementById('detailModal'));
    modal.show();

    setTimeout(() => {
        bodyEl.innerHTML = `<div class="row g-3">... دمو کامل ...</div>`;
    }, 1200);
});