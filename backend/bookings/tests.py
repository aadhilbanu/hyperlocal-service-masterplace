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


from rest_framework.test import APIClient


def make_listing():
    provider = User.objects.create_user(username='p_api', password='Testpass#2026', role='provider')
    category = ServiceCategory.objects.create(name='Repairs')
    listing = ServiceListing.objects.create(
        provider=provider, category=category,
        title='AC Repair', description='Fix AC', price=900,
    )
    return provider, listing


def make_booking(listing, customer):
    return Booking.objects.create(
        customer=customer, listing=listing,
        scheduled_time=timezone.now() + timedelta(days=2),
    )


@pytest.mark.django_db
class TestBookingApi:
    def test_customer_can_book_future_slot(self):
        provider, listing = make_listing()
        customer = User.objects.create_user(username='c_api', password='Testpass#2026')
        client = APIClient()
        client.force_authenticate(customer)
        when = (timezone.now() + timedelta(days=2)).isoformat()
        response = client.post('/api/bookings/', {'listing': listing.id, 'scheduled_time': when}, format='json')
        assert response.status_code == 201
        assert response.data['status'] == 'pending'

    def test_cannot_book_in_the_past(self):
        provider, listing = make_listing()
        customer = User.objects.create_user(username='c_past', password='Testpass#2026')
        client = APIClient()
        client.force_authenticate(customer)
        when = (timezone.now() - timedelta(days=1)).isoformat()
        response = client.post('/api/bookings/', {'listing': listing.id, 'scheduled_time': when}, format='json')
        assert response.status_code == 400

    def test_provider_cannot_create_booking(self):
        provider, listing = make_listing()
        client = APIClient()
        client.force_authenticate(provider)
        when = (timezone.now() + timedelta(days=2)).isoformat()
        response = client.post('/api/bookings/', {'listing': listing.id, 'scheduled_time': when}, format='json')
        assert response.status_code == 403

    def test_provider_can_confirm_then_complete(self):
        provider, listing = make_listing()
        customer = User.objects.create_user(username='c_flow', password='Testpass#2026')
        booking = make_booking(listing, customer)
        client = APIClient()
        client.force_authenticate(provider)
        first = client.patch('/api/bookings/' + str(booking.id) + '/status/', {'status': 'confirmed'}, format='json')
        assert first.status_code == 200
        second = client.patch('/api/bookings/' + str(booking.id) + '/status/', {'status': 'completed'}, format='json')
        assert second.status_code == 200
        assert second.data['status'] == 'completed'

    def test_stranger_cannot_change_status(self):
        provider, listing = make_listing()
        customer = User.objects.create_user(username='c_owner', password='Testpass#2026')
        stranger = User.objects.create_user(username='c_stranger', password='Testpass#2026')
        booking = make_booking(listing, customer)
        client = APIClient()
        client.force_authenticate(stranger)
        response = client.patch('/api/bookings/' + str(booking.id) + '/status/', {'status': 'cancelled'}, format='json')
        assert response.status_code == 404

    def test_customer_cannot_confirm_own_booking(self):
        provider, listing = make_listing()
        customer = User.objects.create_user(username='c_self', password='Testpass#2026')
        booking = make_booking(listing, customer)
        client = APIClient()
        client.force_authenticate(customer)
        response = client.patch('/api/bookings/' + str(booking.id) + '/status/', {'status': 'confirmed'}, format='json')
        assert response.status_code == 400
