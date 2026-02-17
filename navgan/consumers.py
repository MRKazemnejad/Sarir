import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Max
from navgan.utility import dateTimeToJalali


class LocoStatusConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.running = True
        self.last_seen_update = None
        self.task = asyncio.create_task(self.poll_db())

    async def disconnect(self, close_code):
        self.running = False
        if self.task:
            self.task.cancel()

    async def poll_db(self):
        while self.running:
            latest, data = await self.fetch_data()

            if latest and latest != self.last_seen_update:
                self.last_seen_update = latest
                await self.send(text_data=json.dumps(data, default=str))

            await asyncio.sleep(20)

    @database_sync_to_async
    def fetch_data(self):
        from navgan.models import LocoStatus
        from django.db.models import Max

        latest = LocoStatus.objects.aggregate(
            m=Max("last_update")
        )["m"]

        if not latest:
            return None, []

        data = [
            {
                "number": l.diesel_no,
                "station": l.station_in,
                "type": l.area,
                "entry": dateTimeToJalali(l.ent_datetime),
                "exit": dateTimeToJalali(l.ext_datetime),
                "status": l.status,
                "last_update":dateTimeToJalali(latest),
                "total_status":l.total_status,
            }
            for l in LocoStatus.objects.all()
        ]

        return dateTimeToJalali(latest), data

