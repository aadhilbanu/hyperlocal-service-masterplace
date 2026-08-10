from rest_framework import serializers
from .models import ServiceListing, ServiceCategory

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'description']

class ServiceListingSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    provider_name = serializers.CharField(source='provider.username', read_only=True)

    class Meta:
        model = ServiceListing
        fields = ['id', 'title', 'description', 'price', 'category', 'provider_name', 'is_active']
        