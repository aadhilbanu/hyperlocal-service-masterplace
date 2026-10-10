from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='booking.listing.title', read_only=True)
    customer_name = serializers.CharField(source='booking.customer.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'booking', 'listing_title', 'customer_name',
                  'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']

    def validate_booking(self, value):
        user = self.context['request'].user
        if value.customer_id != user.id:
            raise serializers.ValidationError('You can only review your own bookings.')
        if value.status != 'completed':
            raise serializers.ValidationError('You can only review a completed booking.')
        return value
