from rest_framework import serializers
from .models import Booking
from services.models import ServiceListing

class BookingSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'listing', 'listing_title', 'scheduled_time', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)