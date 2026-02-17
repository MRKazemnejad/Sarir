from datetime import datetime, date
from persiantools.jdatetime import JalaliDateTime

def dateTimeToJalali(edate):
    if not edate:
        return "-"

    try:
        # اگر date بود
        if isinstance(edate, date) and not isinstance(edate, datetime):
            edate = datetime.combine(edate, datetime.min.time())

        # 👈 نکته طلایی: حذف میکروثانیه
        edate = edate.replace(microsecond=0)

        jdt = JalaliDateTime(edate)

        result = (
            f"{jdt.year}/{jdt.month:02d}/{jdt.day:02d}"
            f" - {jdt.hour:02d}:{jdt.minute:02d}"
        )

        persian_digits = str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹')
        return result.translate(persian_digits)

    except Exception as e:
        print(f"[jalali_error] {e} | input={edate}")
        return "-"

def dateToJalali(edate):
    if not edate:
        return "-"

    try:
        # اگر date بود
        if isinstance(edate, date) and not isinstance(edate, datetime):
            edate = datetime.combine(edate, datetime.min.time())

        edate = edate.replace(microsecond=0)

        jdt = JalaliDateTime(edate)

        result = f"{jdt.year}/{jdt.month:02d}/{jdt.day:02d}"

        persian_digits = str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹')
        return result.translate(persian_digits)

    except Exception as e:
        print(f"[jalali_date_error] {e} | input={edate}")
        return "-"

def timeToJalali(edate):
    if not edate:
        return "-"

    try:
        # اگر فقط time بود → به datetime تبدیل می‌کنیم
        if isinstance(edate, datetime):
            dt = edate
        else:
            dt = datetime.combine(date.today(), edate)

        dt = dt.replace(microsecond=0)

        jdt = JalaliDateTime(dt)

        result = f"{jdt.hour:02d}:{jdt.minute:02d}"

        persian_digits = str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹')
        return result.translate(persian_digits)

    except Exception as e:
        print(f"[jalali_time_error] {e} | input={edate}")
        return "-"
def to_persian_digits(text):
    if text is None:
        return "-"

    text = str(text)

    persian_digits = str.maketrans(
        '0123456789',
        '۰۱۲۳۴۵۶۷۸۹'
    )

    return text.translate(persian_digits)

def to_persian_number(value, decimals=3):
    """
    تبدیل عدد انگلیسی به فارسی
    با جداکننده هزارگان و تعداد اعشار دلخواه (پیش‌فرض 3)
    """

    if value is None:
        return "۰"

    try:
        number = float(value)
    except (ValueError, TypeError):
        return str(value)

    # فرمت با جداکننده هزارگان و اعشار
    formatted = f"{number:,.{decimals}f}"

    # نگاشت اعداد انگلیسی به فارسی
    persian_digits = str.maketrans(
        "0123456789.",
        "۰۱۲۳۴۵۶۷۸۹٫"
    )

    return formatted.translate(persian_digits)

