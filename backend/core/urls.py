from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .admin_views import AdminStatsView, AdminListingListView, AdminListingDetailView


def health(request):
    return JsonResponse({'success': True, 'message': 'OK'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health, name='health'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('users.urls')),
    path('api/services/', include('services.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('api/admin/listings/', AdminListingListView.as_view(), name='admin-listings'),
    path('api/admin/listings/<int:pk>/', AdminListingDetailView.as_view(), name='admin-listing-detail'),
]
