import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sarir.settings")
# ↑↑↑ اسم پروژه‌ت دقیقاً همینه (sarir)

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import navgan.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(navgan.routing.websocket_urlpatterns)
    ),
})
