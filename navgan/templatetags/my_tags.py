from django import template

register = template.Library()


@register.filter(name='to_persian_number')
def to_persian_number(value):
    if value is None:
        return ''

    try:
        # تبدیل به عدد
        num = float(value)
        rounded = round(num)

        # تبدیل عدد به رشته فارسی (اعداد ۰-۹ به معادل فارسی)
        persian_digits = str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹')
        formatted = f"{rounded:,}".translate(persian_digits)

        # جایگزینی کاما انگلیسی با ویرگول فارسی
        formatted = formatted.replace(',', '،')

        return formatted
    except (ValueError, TypeError):
        return str(value)