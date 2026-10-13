from django.urls import path
from .views import ServiceListingListCreateView, ServiceListingDetailView, ServiceCategoryListView

urlpatterns = [
    path('listings/', ServiceListingListCreateView.as_view(), name='service-listings'),
    path('listings/<int:pk>/', ServiceListingDetailView.as_view(), name='service-listing-detail'),
    path('categories/', ServiceCategoryListView.as_view(), name='service-categories'),
]
