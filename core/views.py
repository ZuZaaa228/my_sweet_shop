from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from core.serializers import CustomUserSerializer, LoginRequestSerializer
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@permission_classes([AllowAny])
def my_login(request: Request):
    serializer = LoginRequestSerializer(data=request.data)
    if serializer.is_valid():
        authenticated_user = authenticate(**serializer.validated_data)
        if authenticated_user is not None:
            login(request, authenticated_user)
            return Response({'status': 'Success'})
        else:
            return Response({'error': 'Invalid credentials'}, status=403)
    else:
        return Response(serializer.errors, status=400)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def my_logout(request: Request):
    print(request.auth, request.user)
    refresh_token = request.COOKIES.get(
        'refresh_token')
    token = tokens.RefreshToken(refresh_token)
    token.blacklist()
    res = Response()
    res.delete_cookie('refresh_token')
    return res


@api_view()
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def user(request: Request):
    return Response({
        'data': CustomUserSerializer(request.user).data
    })
