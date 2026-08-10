from rest_framework import generics, permissions
from .models import ServiceListing
from .serializers import ServiceListingSerializer

class ServiceListingListView(generics.ListAPIView):
    queryset = ServiceListing.objects.filter(is_active=True)
    serializer_class = ServiceListingSerializer
    permission_classes = [permissions.IsAuthenticated]