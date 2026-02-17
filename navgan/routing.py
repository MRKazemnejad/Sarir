from django.urls import path
from navgan.consumers import LocoStatusConsumer

websocket_urlpatterns = [
    path("ws/locos/", LocoStatusConsumer.as_asgi()),
]

