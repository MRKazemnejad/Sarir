from django.urls import path

from navgan import views

app_name = 'navgan'
urlpatterns = [

    path('', views.managmentDashboard, name='managmentDashboard'),
    path('dailyDashboard/', views.dailyDashboard, name='dailyDashboard'),
    path('fleetControl/', views.fleetControl, name='fleetControl'),
    path('reports/', views.reports, name='reports'),
    path('messages_view/', views.messages_view, name='messages_view'),
    path('settings/', views.settings, name='settings'),

    path("locomotive/<str:loco_id>/", views.locomotive_detail, name="locomotive_detail"),
    path('wagon_detail/<str:number>/', views.wagon_detail, name='wagon_detail'),

    #Report
    path('dailyReport/', views.dailyReport, name='dailyReport'),

    #tonkilo chart
    path('daily-chart', views.dailychart, name='daily-chart'),
    path('daily-chartline/', views.daily_chartline, name='daily_chartline'),

    #daily chart
    path('get-dashboard-data/', views.get_dashboard_data, name='get_dashboard_data'),


]
