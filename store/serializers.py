from rest_framework import serializers

from .models import Product, Cart, CartItem, Order, OrderItem


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = ['product', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['user', 'items']

    def get_items(self, obj):
        cart_items = obj.cartitem_set.all()
        serializer = CartItemSerializer(cart_items, many=True)
        return serializer.data


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['pk', 'user', 'items', 'status']

    def get_items(self, obj):
        order_items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(order_items, many=True)
        return serializer.data
