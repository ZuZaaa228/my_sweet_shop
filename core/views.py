import datetime

from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.serializers import CustomUserSerializer, LoginRequestSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['GET'])
def get_csrf_token(request):
    csrf_token = get_token(request)
    response = Response({'csrfToken': csrf_token})
    response.set_cookie('csrftoken', csrf_token)
    return response


from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse


@api_view(['POST'])
@permission_classes([AllowAny])
def my_login(request: Request):
    serializer = LoginRequestSerializer(data=request.data)
    if serializer.is_valid():
        authenticated_user = authenticate(**serializer.validated_data)
        if authenticated_user is not None:
            login(request, authenticated_user)
            refresh = RefreshToken.for_user(authenticated_user)
            response = JsonResponse({'status': 'Success'})
            response.set_cookie(key='access_token', value=refresh.access_token, httponly=True)
            response.set_cookie(key='refresh_token', value=str(refresh), httponly=True)
            return response
        else:
            return Response({'error': 'Invalid credentials'}, status=403)
    else:
        return Response(serializer.errors, status=400)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def my_logout(request: Request):
    print("LOGOUT",
          request.user,
          request.auth,
          request.data,
          datetime.date.today().strftime("%d/%m/%Y, %H:%M:%S"),
          sep="\n")
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
    print("USER",
          request.user,
          request.auth,
          datetime.date.today().strftime("%d/%m/%Y, %H:%M:%S"),
          sep="\n")
    return Response({
        'data': CustomUserSerializer(request.user).data
    })
