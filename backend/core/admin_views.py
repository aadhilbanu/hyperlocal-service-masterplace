from django.db.models import Avg, Count
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import User
from users.permissions import IsAdminRole
from services.models import ServiceListing
from services.serializers import ServiceListingSerializer
from bookings.models import Booking
from reviews.models import Review


class AdminStatsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        booking_counts = {'pending': 0, 'confirmed': 0, 'completed': 0, 'cancelled': 0}
        for row in Booking.objects.values('status').annotate(total=Count('id')):
            booking_counts[row['status']] = row['total']
        average = Review.objects.aggregate(value=Avg('rating'))['value']
        return Response({
            'users': {
                'customers': User.objects.filter(role='customer', is_superuser=False).count(),
                'providers': User.objects.filter(role='provider').count(),
            },
            'listings': {
                'total': ServiceListing.objects.count(),
                'active': ServiceListing.objects.filter(is_active=True).count(),
            },
            'bookings': booking_counts,
            'reviews': {
                'count': Review.objects.count(),
                'average_rating': round(float(average), 1) if average is not None else None,
            },
        })


class AdminListingListView(generics.ListAPIView):
    queryset = ServiceListing.objects.select_related('provider', 'category').order_by('-created_at')
    serializer_class = ServiceListingSerializer
    permission_classes = [IsAdminRole]


class AdminListingDetailView(generics.UpdateAPIView):
    queryset = ServiceListing.objects.all()
    serializer_class = ServiceListingSerializer
    permission_classes = [IsAdminRole]
    http_method_names = ['patch', 'options']
