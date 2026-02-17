from django.contrib import messages
from navgan.models import LocoStatus,TrainInfo, CrewInfo,WagonInfo
from navgan.utility import dateTimeToJalali,dateToJalali,timeToJalali,to_persian_digits,to_persian_number
from django.db.models import Max , Avg, Sum
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
from django.utils import timezone
from datetime import datetime, timedelta
from collections import defaultdict
import jdatetime
import numpy as np
from khayyam import JalaliDate
from navgan.models import AlvandDailyDashboardChart,AlvandDailyDashboardData



@login_required
def managmentDashboard(request):

    context={'segment':'mdashboard'}
    return render(request,'navgan/home/managmentDahsboard.html',context)



def dailyDashboard(request):

    today = timezone.now().date()
    yesterday = today - timedelta(days=1)

    # -----------------------------
    # داده روز قبل (برای کارت‌ها)
    # -----------------------------
    daily_data = AlvandDailyDashboardData.objects.filter(date_time=yesterday).first()

    puretonkilo = daily_data.puretonkilo if daily_data else 0
    loadedtonkilo = daily_data.loadedtonkilo if daily_data else 0
    efficiency = daily_data.efficiency if daily_data else 0
    availability = daily_data.availability if daily_data else 0
    confidence_factor = daily_data.confidence_factor if daily_data else 0

    # -----------------------------
    # بازه ماه جاری (جلالی)
    # -----------------------------
    j_today = jdatetime.date.fromgregorian(date=today)
    start_of_month_j = jdatetime.date(j_today.year, j_today.month, 1)
    start_of_month = start_of_month_j.togregorian()

    # -----------------------------
    # بازه مشابه سال قبل
    # -----------------------------
    last_year_start_j = jdatetime.date(j_today.year - 1, j_today.month, 1)
    last_year_end_j = jdatetime.date(j_today.year - 1, j_today.month, j_today.day)

    last_year_start = last_year_start_j.togregorian()
    last_year_end = last_year_end_j.togregorian()

    # =========================================================
    # 🔥 میانگین تن کیلومتر (برای mainChart پایین)
    # =========================================================
    this_month_tonkilo = AlvandDailyDashboardData.objects.filter(
        date_time__gte=start_of_month,
        date_time__lte=today
    ).aggregate(avg=Avg('puretonkilo'))

    last_year_tonkilo = AlvandDailyDashboardData.objects.filter(
        date_time__gte=last_year_start,
        date_time__lte=last_year_end
    ).aggregate(avg=Avg('puretonkilo'))

    current_avg_tonkilo = this_month_tonkilo['avg'] or 0
    last_avg_tonkilo = last_year_tonkilo['avg'] or 0

    # -----------------------------
    # میانگین‌ها برای small charts
    # -----------------------------
    this_month_avg = AlvandDailyDashboardData.objects.filter(
        date_time__gte=start_of_month,
        date_time__lte=today
    ).aggregate(
        efficiency_avg=Avg('efficiency'),
        availability_avg=Avg('availability'),
        confidence_avg=Avg('confidence_factor')
    )

    last_year_avg = AlvandDailyDashboardData.objects.filter(
        date_time__gte=last_year_start,
        date_time__lte=last_year_end
    ).aggregate(
        efficiency_avg=Avg('efficiency'),
        availability_avg=Avg('availability'),
        confidence_avg=Avg('confidence_factor')
    )

    context = {

        # کارت‌ها
        "puretonkilo": puretonkilo,
        "loadedtonkilo": loadedtonkilo,
        "efficiency": efficiency,
        "availability": availability,
        "confidence_factor": confidence_factor,

        # 🔽 mainChart averages
        "current_avg_tonkilo": current_avg_tonkilo,
        "last_avg_tonkilo": last_avg_tonkilo,

        # small charts
        "eff_this_month": this_month_avg['efficiency_avg'] or 0,
        "eff_last_year": last_year_avg['efficiency_avg'] or 0,

        "avail_this_month": this_month_avg['availability_avg'] or 0,
        "avail_last_year": last_year_avg['availability_avg'] or 0,

        "conf_this_month": this_month_avg['confidence_avg'] or 0,
        "conf_last_year": last_year_avg['confidence_avg'] or 0,

        'segment': 'ddashboard',
        'selected_date':dateToJalali(yesterday),
    }

    return render(request, "navgan/home/dailyDashboard.html", context)


def dailychart(request):

    loco_list = [
        '7019','7020','7021','7022','7023','7024','7025','7026','7027',
        '7085','7086','7087','7088','7089','7090','7091','7092','7093',
        '7094','7095','7096','7097','7098','7099','7100'
    ]

    chart_date = request.session.get('chart_date', ' ')

    if chart_date == ' ':
        target_date = datetime.now().date() - timedelta(days=1)
    else:
        y, m, d = map(int, chart_date.replace('/', '-').split('-'))
        target_date = jdatetime.date(y, m, d).togregorian()

    rows = AlvandDailyDashboardChart.objects.filter(
        date_time=target_date
    ).values_list('disel_name','puretonkilo','area_code')

    data = defaultdict(lambda: [0]*len(loco_list))

    for disel, tonkilo, area in rows:
        disel = str(disel)
        if disel in loco_list:
            index = loco_list.index(disel)
            data[area][index] = int(tonkilo)

    total_per_loco = [0]*len(loco_list)
    for area_values in data.values():
        for i in range(len(loco_list)):
            total_per_loco[i] += area_values[i]

    sorted_indexes = list(np.argsort(total_per_loco))
    sorted_loco_list = [loco_list[i] for i in sorted_indexes]

    sorted_data = {}
    for area, values in data.items():
        sorted_data[area] = [values[i] for i in sorted_indexes]

    max_number = max(total_per_loco) + 50000 if total_per_loco else 100000

    area_names = {
        19: "یزد", 21: "شرق", 18: "اصفهان", 25: "زاگرس",
        10: "اراک", 11: "لرستان", 12: "جنوب", 17: "خراسان",
        8: "تهران-گرمسار", 16: "شمالشرق", 23: "فارس",
        20: "هرمزگان", 22: "کرمان", 13: "تهران - هشتگرد",
        14: "شمالغرب", 15: "آذربایجان", 9: "تهران - قم",
        26: "قم", 30: "شمال 2", 29: "سمنگان-کرمانشاه",
        28: "غرب", 24: "جنوب شرق"
    }

    regions = []
    for area, values in sorted_data.items():
        regions.append({
            "code": area,
            "name": area_names.get(area, str(area)),
            "data": values
        })

    return JsonResponse({
        "loco_name": sorted_loco_list,
        "regions": regions,
        "max_number": max_number
    })


def daily_chartline(request):

    month_range = [31,31,31,31,31,31,30,30,30,30,30,29]

    today_date_gre = datetime.now().date() - timedelta(days=1)
    today_date = jdatetime.date.fromgregorian(date=today_date_gre)

    year = today_date.year
    month = today_date.month
    day = today_date.day
    last_year = year - 1

    days_in_month = month_range[month-1]

    # سال قبل
    last_start = jdatetime.date(last_year, month, 1).togregorian()
    last_end   = jdatetime.date(last_year, month, days_in_month).togregorian()

    last_qs = AlvandDailyDashboardData.objects.filter(
        date_time__gte=last_start,
        date_time__lte=last_end
    ).values()

    last_dict = {row['date_time']: row for row in last_qs}

    # سال جاری
    current_start = jdatetime.date(year, month, 1).togregorian()
    current_end   = jdatetime.date(year, month, day).togregorian()

    current_qs = AlvandDailyDashboardData.objects.filter(
        date_time__gte=current_start,
        date_time__lte=current_end
    ).values()

    current_dict = {row['date_time']: row for row in current_qs}

    def build_series(data_dict, y, m, max_day, field):
        arr = []
        for d in range(1, max_day + 1):
            g_date = jdatetime.date(y, m, d).togregorian()
            row = data_dict.get(g_date)
            arr.append(float(row.get(field)) if row and row.get(field) is not None else None)
        return arr

    response = {
        "days": list(range(1, days_in_month + 1)),
        "year": year,
        "last_year": last_year,

        "pure": {
            "this": build_series(current_dict, year, month, day, "puretonkilo"),
            "last": build_series(last_dict, last_year, month, days_in_month, "puretonkilo"),
        },
        "eff": {
            "this": build_series(current_dict, year, month, day, "efficiency"),
            "last": build_series(last_dict, last_year, month, days_in_month, "efficiency"),
        },
        "ava": {
            "this": build_series(current_dict, year, month, day, "availability"),
            "last": build_series(last_dict, last_year, month, days_in_month, "availability"),
        },
        "conf": {
            "this": build_series(current_dict, year, month, day, "confidence_factor"),
            "last": build_series(last_dict, last_year, month, days_in_month, "confidence_factor"),
        },
    }

    return JsonResponse(response)


@login_required
def fleetControl(request):


    last_update_raw = (
        LocoStatus.objects.aggregate(Max("last_update"))["last_update__max"]
    )

    last_update=dateTimeToJalali(last_update_raw)

    locos = []
    for l in LocoStatus.objects.all():
        locos.append({
            "number": l.diesel_no,
            "station": l.station_in,
            "status": l.status.lower(),
            "entry": dateTimeToJalali(l.ent_datetime),
            "exit": dateTimeToJalali(l.ext_datetime),
            "type": l.area,
            "total_status":l.total_status,
        })


    context = {'segment': 'live',"locomotives": locos,"last_update": last_update}
    return render(request, 'navgan/home/liveControl.html', context)



@login_required
def reports(request):

    context = {'segment': 'report'}
    return render(request, 'navgan/home/report.html', context)




@login_required
def messages_view(request):

    messages.success(request, "عملیات با موفقیت انجام شد")
    messages.error(request, "خطایی رخ داد")
    messages.warning(request, "این یک هشدار است")
    messages.info(request, "پیام اطلاع‌رسانی")

    context = {'segment': 'msg'}
    return render(request, 'navgan/home/messages.html', context)



@login_required
def settings(request):

    context = {'segment': 'settings'}
    return render(request, 'navgan/home/settings.html', context)





@login_required
def locomotive_detail(request, loco_id):


    wagons = WagonInfo.objects.filter(diesel_no=loco_id)

    total_wagons = wagons.count()

    loaded_count = wagons.filter(isloaded_desc__icontains="بار").count()
    empty_count = wagons.filter(isloaded_desc__icontains="خالی").count()
    transit_count = wagons.filter(
        barkind_desc__icontains="خار"
    ).count()


    loaded_empty_text = (
        f"{to_persian_digits(loaded_count)} باردار / "
        f"{to_persian_digits(empty_count)} خالی"
    )
    transit_wagon_text = to_persian_digits(transit_count)

    train = (
        TrainInfo.objects
        .filter(diesel_no=loco_id)
        .order_by("-created_at")
        .first()
    )

    crews = (
        CrewInfo.objects
            .filter(diesel_no=loco_id)
            .order_by("id")
    )

    no_plan_exists = wagons.filter(
        Q(barnameh_no__isnull=True) | Q(barnameh_no__exact="")
    ).exists()

    drivers = []

    for idx, c in enumerate(crews, start=1):
        drivers.append({
            "index": idx,
            "name": c.crew_name or "-",
            "code": to_persian_digits(c.crew_code) or "-",
            "role": c.crew_role or "-",
        })



    context = {
        "segment": "live",
        "loco": {
            "number": loco_id,

            # لکوموتیو
            "region": train.nahi_desc if train else "-",
            "station": train.station if train else "-",
            "status": train.status if train else "-",

            "entry_date": dateToJalali(train.ent_st_date) if train else "-",
            "entry_time": timeToJalali(train.ent_st_time) if train else "-",
            "exit_date": dateToJalali(train.ext_st_date) if train else "-",
            "exit_time": timeToJalali(train.ext_st_time) if train else "-",
            "stop_time": to_persian_digits(train.stop_time) if train else "-",

            # قطار
            "train_no": to_persian_digits(train.train_no) if train else "-",
            "origin": train.source_station if train else "-",
            "destination": train.destination_station if train else "-",
            "formation_date": dateToJalali(train.train_date) if train else "-",
            "formation_time": timeToJalali(train.train_time) if train else "-",
            "weight": train.train_weight if train else "-",
            "type": train.t_status1_desc if train else "-",


            # بار
            "wagon_count": to_persian_digits(train.all_wagon_number) if train else "-",
            "loaded_empty":  loaded_empty_text,
            "transit_wagon": transit_wagon_text,
            "no_plan": "دارد" if no_plan_exists else "ندارد",
        },
        "drivers": drivers
    }

    return render(
        request,
        "navgan/home/locomotive_detail.html",
        context
    )


@login_required
def wagon_detail(request, number):

    qs = (
        WagonInfo.objects
        .filter(diesel_no=number)
        .order_by("id")
    )

    wagons = []
    for w in qs:
        wagons.append({
            "number": to_persian_digits(w.t_toolsno),
            "wagon_number": to_persian_digits(w.t_toolsno),  # تو دیتابیس نداریم فعلاً
            "contract_number": to_persian_digits(w.barnameh_no),
            "origin": w.barnameh_source or "-",
            "destination": w.barnameh_destination or "-",
            "cargo_type": w.barnameh_kala_desc or "-",
            "domestic_type": w.barkind_desc or "-",
            "wagon_type": w.t_toolskind_desc or "-",
            "operator":  w.isloaded_desc or "-",
            "owner_company": w.kar_desc or "-",  # در جدول نیست
        })

    context = {
        "segment": "live",
        "loco_number": to_persian_digits(number),
        "wagons": wagons,
    }

    return render(
        request,
        "navgan/home/wagon_detail.html",
        context
    )


@login_required
def dailyReport(request):
    context = {
        'segment': 'report',
    }
    return render(request, "navgan/reports/dailyReport.html", context)


def get_dashboard_data(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    date_str = request.GET.get('date')
    if not date_str:
        target_gre = timezone.now().date() - timedelta(days=1)
    else:
        try:
            y, m, d = map(int, date_str.replace('/', '-').split('-'))
            target_j = jdatetime.date(y, m, d)
            target_gre = target_j.togregorian()
        except:
            target_gre = timezone.now().date() - timedelta(days=1)




    # ۱. داده کارت‌ها (روز انتخاب شده)
    daily_data = AlvandDailyDashboardData.objects.filter(date_time=target_gre).first()

    card_data = {
        'puretonkilo': daily_data.puretonkilo if daily_data else 0,
        'loadedtonkilo': daily_data.loadedtonkilo if daily_data else 0,
        'efficiency': daily_data.efficiency if daily_data else 0,
        'availability': daily_data.availability if daily_data else 0,
        'confidence_factor': daily_data.confidence_factor if daily_data else 0,
    }

    # ۲. میانگین‌های ماه جاری و سال قبل
    j_date = jdatetime.date.fromgregorian(date=target_gre)
    start_this_month_j = jdatetime.date(j_date.year, j_date.month, 1)
    start_this_month = start_this_month_j.togregorian()

    last_year_start_j = jdatetime.date(j_date.year - 1, j_date.month, 1)
    last_year_end_j = jdatetime.date(j_date.year - 1, j_date.month, j_date.day)
    last_year_start = last_year_start_j.togregorian()
    last_year_end = last_year_end_j.togregorian()

    this_month_tonkilo = AlvandDailyDashboardData.objects.filter(
        date_time__gte=start_this_month,
        date_time__lte=target_gre
    ).aggregate(avg=Avg('puretonkilo'))['avg'] or 0

    last_month_tonkilo = AlvandDailyDashboardData.objects.filter(
        date_time__gte=last_year_start,
        date_time__lte=last_year_end
    ).aggregate(avg=Avg('puretonkilo'))['avg'] or 0

    this_month_avg = AlvandDailyDashboardData.objects.filter(
        date_time__gte=start_this_month,
        date_time__lte=target_gre
    ).aggregate(
        eff=Avg('efficiency'),
        ava=Avg('availability'),
        conf=Avg('confidence_factor')
    )

    last_year_avg = AlvandDailyDashboardData.objects.filter(
        date_time__gte=last_year_start,
        date_time__lte=last_year_end
    ).aggregate(
        eff=Avg('efficiency'),
        ava=Avg('availability'),
        conf=Avg('confidence_factor')
    )

    avg_data = {
        'current_avg_tonkilo': this_month_tonkilo,
        'last_avg_tonkilo': last_month_tonkilo,
        'eff_this_month': this_month_avg['eff'] or 0,
        'eff_last_year': last_year_avg['eff'] or 0,
        'avail_this_month': this_month_avg['ava'] or 0,
        'avail_last_year': last_year_avg['ava'] or 0,
        'conf_this_month': this_month_avg['conf'] or 0,
        'conf_last_year': last_year_avg['conf'] or 0,
    }

    # لیست کامل لکوموتیوها
    loco_list = [
        '7019','7020','7021','7022','7023','7024','7025','7026','7027',
        '7085','7086','7087','7088','7089','7090','7091','7092','7093',
        '7094','7095','7096','7097','7098','7099','7100'
    ]

    area_names = {
        19: "یزد", 21: "شرق", 18: "اصفهان", 25: "زاگرس",
        10: "اراک", 11: "لرستان", 12: "جنوب", 17: "خراسان",
        8: "تهران-گرمسار", 16: "شمالشرق", 23: "فارس",
        20: "هرمزگان", 22: "کرمان", 13: "تهران - هشتگرد",
        14: "شمالغرب", 15: "آذربایجان", 9: "تهران - قم",
        26: "قم", 30: "شمال 2", 29: "سمنگان-کرمانشاه",
        28: "غرب", 24: "جنوب شرق"
    }

    # ۳. داده Stacked Bar
    rows = AlvandDailyDashboardChart.objects.filter(date_time=target_gre)\
        .values_list('disel_name', 'puretonkilo', 'area_code')

    data = defaultdict(lambda: [0] * len(loco_list))
    for disel, tonkilo, area in rows:
        disel = str(disel)
        if disel in loco_list:
            idx = loco_list.index(disel)
            data[area][idx] = int(tonkilo or 0)

    total_per_loco = [sum(vals[i] for vals in data.values()) for i in range(len(loco_list))]
    sorted_idx = list(np.argsort(total_per_loco))
    sorted_loco = [loco_list[i] for i in sorted_idx]

    regions = []
    for area, vals in data.items():
        sorted_vals = [vals[i] for i in sorted_idx]
        regions.append({
            'code': area,
            'name': area_names.get(area, str(area)),
            'data': sorted_vals
        })

    bar_data = {
        'loco_name': sorted_loco,
        'regions': regions,
        'max_number': max(total_per_loco) + 50000 if total_per_loco else 100000
    }

    # ۴. داده Line charts
    month_days = [31,31,31,31,31,31,30,30,30,30,30,29]
    days_in_month = month_days[j_date.month - 1]

    current_start = start_this_month
    last_start = last_year_start_j.togregorian()
    last_end = jdatetime.date(j_date.year - 1, j_date.month, days_in_month).togregorian()

    last_qs = AlvandDailyDashboardData.objects.filter(
        date_time__gte=last_start,
        date_time__lte=last_end
    ).values()

    current_qs = AlvandDailyDashboardData.objects.filter(
        date_time__gte=current_start,
        date_time__lte=target_gre
    ).values()

    last_dict = {row['date_time']: row for row in last_qs}
    current_dict = {row['date_time']: row for row in current_qs}

    def build_series(data_dict, y, m, max_day, field):
        arr = []
        for d in range(1, max_day + 1):
            g_date = jdatetime.date(y, m, d).togregorian()
            row = data_dict.get(g_date)
            value = row.get(field) if row else None
            arr.append(float(value) if value is not None else None)
        return arr

    line_data = {
        "days": list(range(1, days_in_month + 1)),
        "year": j_date.year,
        "last_year": j_date.year - 1,
        "pure": {
            "this": build_series(current_dict, j_date.year, j_date.month, j_date.day, "puretonkilo"),
            "last": build_series(last_dict, j_date.year - 1, j_date.month, days_in_month, "puretonkilo"),
        },
        "eff": {
            "this": build_series(current_dict, j_date.year, j_date.month, j_date.day, "efficiency"),
            "last": build_series(last_dict, j_date.year - 1, j_date.month, days_in_month, "efficiency"),
        },
        "ava": {
            "this": build_series(current_dict, j_date.year, j_date.month, j_date.day, "availability"),
            "last": build_series(last_dict, j_date.year - 1, j_date.month, days_in_month, "availability"),
        },
        "conf": {
            "this": build_series(current_dict, j_date.year, j_date.month, j_date.day, "confidence_factor"),
            "last": build_series(last_dict, j_date.year - 1, j_date.month, days_in_month, "confidence_factor"),
        },
    }

    # ترکیب نهایی
    return JsonResponse({
        'cards': card_data,
        'averages': avg_data,
        'bar': bar_data,
        'line': line_data,
        'selected_date': date_str or target_gre.strftime('%Y/%m/%d').replace('-', '/')[2:],
    })
