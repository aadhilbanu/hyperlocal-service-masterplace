import pytest
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from services.models import ServiceCategory, ServiceListing
from bookings.models import Booking

User = get_user_model()


def client_for(user):
    client = APIClient()
    client.force_authenticate(user)
    return client


def make_admin():
    return User.objects.create_superuser(username='boss', password='Testpass#2026')


def make_listing(username='adm_prov', active=True):
    provider = User.objects.create_user(username=username, password='Testpass#2026', role='provider')
    category = ServiceCategory.objects.create(name='Cat ' + username)
    listing = ServiceListing.objects.create(
        provider=provider, category=category,
        title='Job', description='d', price=100, is_active=active,
    )
    return provider, listing


@pytest.mark.django_db
class TestAdminApi:
    def test_customer_cannot_see_stats(self):
        customer = User.objects.create_user(username='adm_cust0', password='Testpass#2026')
        response = client_for(customer).get('/api/admin/stats/')
        assert response.status_code == 403

    def test_admin_sees_platform_stats(self):
        provider, listing = make_listing()
        customer = User.objects.create_user(username='adm_cust1', password='Testpass#2026')
        Booking.objects.create(
            customer=customer, listing=listing,
            scheduled_time=timezone.now() + timedelta(days=1),
        )
        response = client_for(make_admin()).get('/api/admin/stats/')
        assert response.status_code == 200
        assert response.data['users']['providers'] == 1
        assert response.data['users']['customers'] == 1
        assert response.data['listings']['total'] == 1
        assert response.data['bookings']['pending'] == 1

    def test_admin_listing_overview_includes_paused_listings(self):
        make_listing(active=False)
        response = client_for(make_admin()).get('/api/admin/listings/')
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_admin_can_pause_any_listing(self):
        provider, listing = make_listing()
        response = client_for(make_admin()).patch(
            '/api/admin/listings/' + str(listing.id) + '/', {'is_active': False}, format='json')
        assert response.status_code == 200
        listing.refresh_from_db()
        assert listing.is_active is False

    def test_provider_cannot_create_category(self):
        provider = User.objects.create_user(username='adm_prov2', password='Testpass#2026', role='provider')
        response = client_for(provider).post('/api/services/categories/', {'name': 'Gardening'}, format='json')
        assert response.status_code == 403

    def test_admin_can_create_category(self):
        response = client_for(make_admin()).post('/api/services/categories/', {'name': 'Gardening'}, format='json')
        assert response.status_code == 201

    def test_duplicate_category_name_is_rejected(self):
        ServiceCategory.objects.create(name='Gardening')
        response = client_for(make_admin()).post('/api/services/categories/', {'name': 'gardening'}, format='json')
        assert response.status_code == 400
