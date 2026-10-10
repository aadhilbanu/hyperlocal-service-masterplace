from django.db.models import Avg
from rest_framework import serializers
from .models import ServiceListing, ServiceCategory


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'description']


class ServiceListingSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ServiceCategory.objects.all(), source='category', write_only=True
    )
    provider_name = serializers.CharField(source='provider.username', read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = ServiceListing
        fields = ['id', 'title', 'description', 'price', 'category', 'category_id',
                  'provider_name', 'is_active', 'average_rating', 'review_count']

    def get_average_rating(self, obj):
        from reviews.models import Review
        average = Review.objects.filter(booking__listing=obj).aggregate(value=Avg('rating'))['value']
        return round(float(average), 1) if average is not None else None

    def get_review_count(self, obj):
        from reviews.models import Review
        return Review.objects.filter(booking__listing=obj).count()
