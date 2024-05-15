from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
from core import views as core_view
from store import views as store_view

urlpatterns = [
    path('api/csrf_token', core_view.get_csrf_token, name='get_csrf_token'),
    path('admin', admin.site.urls),
    path('api/user', core_view.user, name='user'),
    path('api/token/obtain', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout', core_view.my_logout, name="logout"),
    path('api/products', store_view.get_products, name='products'),
    path('api/products/<int:product_id>/add_to_cart', store_view.add_to_cart, name='add_to_cart'),
    path('api/products/<int:product_id>/update_cart_item', store_view.update_cart_item, name='update_cart_item'),
    path('api/products/<int:product_id>/remove_from_cart', store_view.remove_from_cart, name='remove_from_cart'),
    path('api/checkout', store_view.checkout, name='checkout'),
    path('api/cart', store_view.view_cart, name='view_cart'),
    path('api/orders', store_view.view_orders, name='view_orders'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_URL)
