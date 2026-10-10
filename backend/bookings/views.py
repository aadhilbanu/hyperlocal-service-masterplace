from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from .serializers import BookingSerializer

ALLOWED_TRANSITIONS = {
    'provider': {
        'pending': ['confirmed', 'cancelled'],
        'confirmed': ['completed', 'cancelled'],
    },
    'customer': {
        'pending': ['cancelled'],
        'confirmed': ['cancelled'],
    },
}


class CustomerOnlyCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method == 'POST':
            return request.user.role == 'customer'
        return True


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [CustomerOnlyCreate]

    def get_queryset(self):
        user = self.request.user
        queryset = Booking.objects.select_related('listing', 'customer')
        if user.role == 'provider':
            queryset = queryset.filter(listing__provider=user)
        else:
            queryset = queryset.filter(customer=user)
        return queryset.order_by('-created_at')


class BookingStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.select_related('listing', 'customer').get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)

        user = request.user
        if booking.listing.provider_id == user.id:
            actor = 'provider'
        elif booking.customer_id == user.id:
            actor = 'customer'
        else:
            return Response({'detail': 'Not found.'}, status=404)

        new_status = request.data.get('status')
        allowed = ALLOWED_TRANSITIONS[actor].get(booking.status, [])
        if new_status not in allowed:
            return Response(
                {'detail': 'Cannot change from ' + booking.status + ' to ' + str(new_status) + '.'},
                status=400,
            )

        booking.status = new_status
        booking.save()
        return Response(BookingSerializer(booking).data)
