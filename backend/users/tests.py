import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestUserModel:
    def test_default_role_is_customer(self):
        user = User.objects.create_user(username='alice', password='Testpass#2026')
        assert user.role == 'customer'

    def test_provider_role(self):
        user = User.objects.create_user(username='bob', password='Testpass#2026', role='provider')
        assert user.role == 'provider'

    def test_password_is_hashed(self):
        user = User.objects.create_user(username='carol', password='Testpass#2026')
        assert user.password != 'Testpass#2026'
        assert user.check_password('Testpass#2026')
