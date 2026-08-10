from django.urls import path
from .views import ServiceListingListView

urlpatterns = [
    path('listings/', ServiceListingListView.as_view(), name='service-listings'),
]