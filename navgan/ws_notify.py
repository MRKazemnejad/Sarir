from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def notify_loco_status_change():
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "loco_status_live",
        {
            "type": "loco_status_updated"
        }
    )
