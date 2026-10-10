from django.urls import path
from .views import ServiceListingListCreateView, ServiceCategoryListView

urlpatterns = [
    path('listings/', ServiceListingListCreateView.as_view(), name='service-listings'),
    path('categories/', ServiceCategoryListView.as_view(), name='service-categories'),
]
