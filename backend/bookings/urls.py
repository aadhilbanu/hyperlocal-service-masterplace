from django.urls import path
from .views import BookingListCreateView, BookingStatusView

urlpatterns = [
    path('', BookingListCreateView.as_view(), name='booking-list-create'),
    path('<int:pk>/status/', BookingStatusView.as_view(), name='booking-status'),
]
