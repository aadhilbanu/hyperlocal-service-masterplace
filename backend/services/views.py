from rest_framework import generics, permissions
from .models import ServiceListing, ServiceCategory
from .serializers import ServiceListingSerializer, ServiceCategorySerializer


class IsProviderOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'provider'


class ServiceListingListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceListingSerializer
    permission_classes = [IsProviderOrReadOnly]

    def get_queryset(self):
        if self.request.query_params.get('mine') == 'true':
            return ServiceListing.objects.filter(provider=self.request.user).order_by('-created_at')
        return ServiceListing.objects.filter(is_active=True).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)


class ServiceCategoryListView(generics.ListAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
