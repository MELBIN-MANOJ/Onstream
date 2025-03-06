from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import datetime, timedelta

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    def is_valid(self):
        # Token is valid for 24 hours
        expiry_time = self.created_at + timedelta(hours=24)
        return not self.is_used and datetime.now().astimezone() < expiry_time