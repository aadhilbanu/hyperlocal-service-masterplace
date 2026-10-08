import pytest
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from services.models import ServiceCategory, ServiceListing
from .models import Booking

User = get_user_model()

@pytest.mark.django_db
class TestBookingModel:
    def test_new_booking_is_pending(self):
        customer = User.objects.create_user(username='cust1', password='Testpass#2026')
        provider = User.objects.create_user(username='prov2', password='Testpass#2026', role='provider')
        category = ServiceCategory.objects.create(name='Cleaning')
        listing = ServiceListing.objects.create(
            provider=provider, category=category,
            title='Deep Clean', description='Full home clean', price=500,
        )
        booking = Booking.objects.create(
            customer=customer, listing=listing,
            scheduled_time=timezone.now() + timedelta(days=1),
        )
        assert booking.status == 'pending'
        assert booking.customer == customer
