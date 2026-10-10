from django.utils import timezone
from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    customer_name = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'listing', 'listing_title', 'customer_name',
                  'scheduled_time', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

    def validate_scheduled_time(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError('Scheduled time must be in the future.')
        return value

    def validate_listing(self, value):
        if not value.is_active:
            raise serializers.ValidationError('This service is not available.')
        return value

    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)
