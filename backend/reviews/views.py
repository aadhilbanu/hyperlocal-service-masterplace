from rest_framework import generics
from bookings.views import CustomerOnlyCreate
from .models import Review
from .serializers import ReviewSerializer


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [CustomerOnlyCreate]

    def get_queryset(self):
        user = self.request.user
        queryset = Review.objects.select_related('booking__listing', 'booking__customer')
        listing_id = self.request.query_params.get('listing')
        if listing_id:
            queryset = queryset.filter(booking__listing_id=listing_id)
        elif user.role == 'provider':
            queryset = queryset.filter(booking__listing__provider=user)
        else:
            queryset = queryset.filter(booking__customer=user)
        return queryset.order_by('-created_at')
