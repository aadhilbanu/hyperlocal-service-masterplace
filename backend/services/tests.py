import pytest
from django.contrib.auth import get_user_model
from .models import ServiceCategory, ServiceListing

User = get_user_model()

@pytest.mark.django_db
class TestServiceModels:
    def test_create_category(self):
        category = ServiceCategory.objects.create(name='Cleaning')
        assert str(category) == 'Cleaning'

    def test_create_listing(self):
        provider = User.objects.create_user(username='prov1', password='Testpass#2026', role='provider')
        category = ServiceCategory.objects.create(name='Plumbing')
        listing = ServiceListing.objects.create(
            provider=provider, category=category,
            title='Pipe Repair', description='Fix leaky pipes', price=750,
        )
        assert listing.is_active is True
        assert listing.provider == provider


from rest_framework.test import APIClient


def api_client(user):
    client = APIClient()
    client.force_authenticate(user)
    return client


def make_listing_for(username):
    provider = User.objects.create_user(username=username, password='Testpass#2026', role='provider')
    category = ServiceCategory.objects.create(name='Cat ' + username)
    listing = ServiceListing.objects.create(
        provider=provider, category=category, title='Job', description='d', price=100,
    )
    return provider, listing


@pytest.mark.django_db
class TestListingManagement:
    def test_provider_can_deactivate_own_listing(self):
        provider, listing = make_listing_for('own_prov')
        response = api_client(provider).patch(
            '/api/services/listings/' + str(listing.id) + '/', {'is_active': False}, format='json')
        assert response.status_code == 200
        listing.refresh_from_db()
        assert listing.is_active is False

    def test_deactivated_listing_hidden_from_customers(self):
        provider, listing = make_listing_for('hide_prov')
        listing.is_active = False
        listing.save()
        customer = User.objects.create_user(username='hide_cust', password='Testpass#2026')
        response = api_client(customer).get('/api/services/listings/')
        assert response.data == []

    def test_provider_cannot_edit_another_providers_listing(self):
        provider, listing = make_listing_for('owner_prov')
        other = User.objects.create_user(username='other_prov', password='Testpass#2026', role='provider')
        response = api_client(other).patch(
            '/api/services/listings/' + str(listing.id) + '/', {'is_active': False}, format='json')
        assert response.status_code == 404

    def test_customer_cannot_edit_listing(self):
        provider, listing = make_listing_for('cb_prov')
        customer = User.objects.create_user(username='cb_cust', password='Testpass#2026')
        response = api_client(customer).patch(
            '/api/services/listings/' + str(listing.id) + '/', {'is_active': False}, format='json')
        assert response.status_code == 403


from rest_framework.test import APIClient


def api_client(user):
    client = APIClient()
    client.force_authenticate(user)
    return client


def make_listing_for(username):
    provider = User.objects.create_user(username=username, password='Testpass#2026', role='provider')
    category = ServiceCategory.objects.create(name='Cat ' + username)
    listing = ServiceListing.objects.create(
        provider=provider, category=category, title='Job', description='d', price=100,
    )
    return provider, listing


@pytest.mark.django_db
class TestListingManagement:
    def test_provider_can_deactivate_own_listing(self):
        provider, listing = make_listing_for('own_prov')
        response = api_client(provider).patch(
            '/api/services/listings/' + str(listing.id) + '/', {'is_active': False}, format='json')
        assert response.status_code == 200
        listing.refresh_from_db()
        assert listing.is_active is False

    def test_deactivated_listing_hidden_from_customers(self):
        provider, listing = make_listing_for('hide_prov')
        listing.is_active = False
        listing.save()
        customer = User.objects.create_user(username='hide_cust', password='Testpass#2026')
        response = api_client(customer).get('/api/services/listings/')
        assert response.data == []

    def test_provider_cannot_edit_another_providers_listing(self):
        provider, listing = make_listing_for('owner_prov')
        other = User.objects.create_user(username='other_prov', password='Testpass#2026', role='provider')
        response = api_client(other).patch(
            '/api/services/listings/' + str(listing.id) + '/', {'is_active': False}, format='json')
        assert response.status_code == 404

    def test_customer_cannot_edit_listing(self):
        provider, listing = make_listing_for('cb_prov')
        customer = User.objects.create_user(username='cb_cust', password='Testpass#2026')
        response = api_client(customer).patch(
            '/api/services/listings/' + str(listing.id) + '/', {'is_active': False}, format='json')
        assert response.status_code == 403
