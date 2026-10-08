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
