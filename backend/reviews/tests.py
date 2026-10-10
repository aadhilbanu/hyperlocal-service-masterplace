import pytest
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from services.models import ServiceCategory, ServiceListing
from bookings.models import Booking
from .models import Review

User = get_user_model()


def make_booking(status='completed'):
    provider = User.objects.create_user(username='rev_prov', password='Testpass#2026', role='provider')
    customer = User.objects.create_user(username='rev_cust', password='Testpass#2026')
    category = ServiceCategory.objects.create(name='Cleaning')
    listing = ServiceListing.objects.create(
        provider=provider, category=category,
        title='Sofa Clean', description='Deep clean', price=400,
    )
    booking = Booking.objects.create(
        customer=customer, listing=listing,
        scheduled_time=timezone.now() + timedelta(days=1), status=status,
    )
    return provider, customer, booking


def client_for(user):
    client = APIClient()
    client.force_authenticate(user)
    return client


@pytest.mark.django_db
class TestReviewApi:
    def test_customer_can_review_completed_booking(self):
        provider, customer, booking = make_booking()
        response = client_for(customer).post(
            '/api/reviews/', {'booking': booking.id, 'rating': 5, 'comment': 'Great'}, format='json')
        assert response.status_code == 201

    def test_cannot_review_pending_booking(self):
        provider, customer, booking = make_booking(status='pending')
        response = client_for(customer).post(
            '/api/reviews/', {'booking': booking.id, 'rating': 5}, format='json')
        assert response.status_code == 400

    def test_cannot_review_someone_elses_booking(self):
        provider, customer, booking = make_booking()
        other = User.objects.create_user(username='rev_other', password='Testpass#2026')
        response = client_for(other).post(
            '/api/reviews/', {'booking': booking.id, 'rating': 5}, format='json')
        assert response.status_code == 400

    def test_cannot_review_twice(self):
        provider, customer, booking = make_booking()
        client = client_for(customer)
        first = client.post('/api/reviews/', {'booking': booking.id, 'rating': 4}, format='json')
        second = client.post('/api/reviews/', {'booking': booking.id, 'rating': 5}, format='json')
        assert first.status_code == 201
        assert second.status_code == 400

    def test_rating_must_be_between_1_and_5(self):
        provider, customer, booking = make_booking()
        response = client_for(customer).post(
            '/api/reviews/', {'booking': booking.id, 'rating': 6}, format='json')
        assert response.status_code == 400

    def test_provider_cannot_post_review(self):
        provider, customer, booking = make_booking()
        response = client_for(provider).post(
            '/api/reviews/', {'booking': booking.id, 'rating': 5}, format='json')
        assert response.status_code == 403

    def test_listing_shows_average_rating(self):
        provider, customer, booking = make_booking()
        Review.objects.create(booking=booking, rating=4, comment='ok')
        response = client_for(customer).get('/api/services/listings/')
        assert response.status_code == 200
        assert response.data[0]['average_rating'] == 4.0
        assert response.data[0]['review_count'] == 1
