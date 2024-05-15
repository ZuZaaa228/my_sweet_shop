from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Product, Cart, CartItem, Order, OrderItem
from .serializers import ProductSerializer, CartSerializer, OrderSerializer


@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def add_to_cart(request, product_id):
    try:
        product = Product.objects.get(pk=product_id)
        user = request.user
        cart, created = Cart.objects.get_or_create(user=user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            quantity = request.data.get('quantity')
            cart_item.quantity += quantity
            cart_item.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def update_cart_item(request, product_id):
    try:
        product = Product.objects.get(pk=product_id)
        user = request.user
        cart = Cart.objects.get(user=user)
        cart_item = CartItem.objects.get(cart=cart, product=product)
        quantity = request.data.get('quantity')
        cart_item.quantity = quantity
        cart_item.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except (Product.DoesNotExist, Cart.DoesNotExist, CartItem.DoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def remove_from_cart(request, product_id):
    try:
        product = Product.objects.get(pk=product_id)
        user = request.user
        cart = Cart.objects.get(user=user)
        cart_item = CartItem.objects.get(cart=cart, product=product)
        cart_item.delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except (Product.DoesNotExist, Cart.DoesNotExist, CartItem.DoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def checkout(request):
    user = request.user
    cart = Cart.objects.get(user=user)
    cartItem = CartItem.objects.filter(cart=cart)
    order = Order.objects.create(user=user, status='pending')
    for cart_item in cartItem:
        OrderItem.objects.create(order=order, product=cart_item.product, quantity=cart_item.quantity)
    cart.items.clear()
    serializer = OrderSerializer(order)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def view_cart(request):
    user = request.user
    print(user)
    try:
        cart = Cart.objects.get(user=user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Cart.DoesNotExist:
        return Response({'message': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def view_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
