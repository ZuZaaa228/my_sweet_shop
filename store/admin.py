from django.contrib import admin
from store.models import Order, OrderItem, CartItem, Cart, Product
# Register your models here.
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(CartItem)
admin.site.register(Cart)
admin.site.register(Product)