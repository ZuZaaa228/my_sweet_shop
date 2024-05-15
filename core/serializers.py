from rest_framework.serializers import Serializer, ModelSerializer, CharField

from core.models import CustomUser


class CustomUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'email', 'phoneNumber', 'date_joined']


class LoginRequestSerializer(Serializer):
    username = CharField(required=True)
    password = CharField(required=True)
