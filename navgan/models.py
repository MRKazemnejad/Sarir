from django.db import models

class LocoStatus(models.Model):
    diesel_no = models.IntegerField(primary_key=True)

    station_in = models.TextField(null=True, blank=True)
    station_out = models.TextField(null=True, blank=True)
    area = models.TextField(null=True, blank=True)

    status = models.TextField()   # NORMAL | STOP_3H | HOT_DEPOT | COLD
    is_cold = models.BooleanField(null=True, blank=True)

    ent_datetime = models.DateTimeField(null=True, blank=True)
    ext_datetime = models.DateTimeField(null=True, blank=True)

    last_update = models.DateTimeField(null=True, blank=True)
    total_status=models.TextField()

    class Meta:
        db_table = "loco_status"   # 👈 اسم واقعی جدول
        managed = False            # 👈 خیلی مهم
        verbose_name = "وضعیت لکوموتیو"
        verbose_name_plural = "وضعیت لکوموتیوها"

    def __str__(self):
        return f"Diesel {self.diesel_no} - {self.status}"


class TrainInfo(models.Model):
    diesel_no = models.IntegerField()

    nahi_desc = models.TextField(null=True, blank=True)
    station = models.TextField(null=True, blank=True)

    source_station = models.TextField(null=True, blank=True)
    destination_station = models.TextField(null=True, blank=True)

    status = models.TextField(null=True, blank=True)

    train_no = models.IntegerField(null=True, blank=True)
    train_date = models.DateField(null=True, blank=True)
    train_time = models.TimeField(null=True, blank=True)

    t_status1_desc = models.TextField(null=True, blank=True)
    t_status2_desc = models.TextField(null=True, blank=True)
    t_status3_desc = models.TextField(null=True, blank=True)

    ent_st_date = models.DateField(null=True, blank=True)
    ent_st_time = models.TimeField(null=True, blank=True)
    ext_st_date = models.DateField(null=True, blank=True)
    ext_st_time = models.TimeField(null=True, blank=True)

    stop_time = models.IntegerField(null=True, blank=True)
    seir_time = models.IntegerField(null=True, blank=True)
    seir_km = models.IntegerField(null=True, blank=True)

    all_wagon_number = models.IntegerField(null=True, blank=True)
    wagon_transit = models.IntegerField(null=True, blank=True)
    barnameh_status = models.BooleanField(null=True, blank=True)
    isloaded_status = models.TextField(null=True, blank=True)

    train_weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    other_diesel = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "app_alvand_tile_train_info"


class CrewInfo(models.Model):
    diesel_no = models.IntegerField()

    crew_name = models.TextField(null=True, blank=True)
    crew_role = models.TextField(null=True, blank=True)
    crew_code = models.TextField(null=True, blank=True)

    start_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)

    end_date = models.DateField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    class Meta:
        db_table = "app_alvand_tile_crew_info"

class WagonInfo(models.Model):
    diesel_no = models.IntegerField()

    t_toolskind_desc = models.TextField(null=True, blank=True)
    t_toolsno = models.TextField(null=True, blank=True)

    barnameh_no = models.TextField(null=True, blank=True)
    barnameh_kala_desc = models.TextField(null=True, blank=True)

    barnameh_source = models.TextField(null=True, blank=True)
    barnameh_destination = models.TextField(null=True, blank=True)

    barkind_desc = models.TextField(null=True, blank=True)
    isloaded_desc = models.TextField(null=True, blank=True)

    kar_desc = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "app_alvand_tile_wagon_info"



class AlvandDailyDashboardChart(models.Model):
    date_time = models.DateField()
    disel_name = models.IntegerField()
    area_code = models.IntegerField()
    puretonkilo = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=False)

    class Meta:
        db_table = "app_alvand_daily_dashboard_chart"
        managed = False  # خیلی مهم چون جدول از قبل ساخته شده
        unique_together = ("date_time", "disel_name", "area_code")

    def __str__(self):
        return f"{self.date_time} - {self.disel_name} - {self.area_code}"

class AlvandDailyDashboardData(models.Model):
    date_time = models.DateField(unique=True)

    puretonkilo = models.FloatField()
    loadedtonkilo = models.FloatField()
    availability = models.FloatField()
    confidence_factor = models.FloatField()
    efficiency = models.FloatField()

    created_at = models.DateTimeField()

    class Meta:
        db_table = "app_alvand_daily_dashboard_data"
        managed = False  # چون جدول از قبل ساخته شده

    def __str__(self):
        return f"{self.date_time}"

class AlvandDailyDashboardTonkilo(models.Model):
    date_time = models.DateField(unique=True)

    puretonkilo = models.FloatField()
    loadedtonkilo = models.FloatField()

    created_at = models.DateTimeField()

    class Meta:
        db_table = "app_alvand_daily_dashboard_tonkilo"
        managed = False  # چون جدول از قبل داخل دیتابیس هست

    def __str__(self):
        return f"{self.date_time}"