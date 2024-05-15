import os

from django.db import models
from django.template.defaultfilters import slugify
from django.utils.crypto import get_random_string

from core.models import CustomUser

ORDER_STATUS_CHOICES = (
    ('pending', 'Ожидание'),
    ('processing', 'Обработка'),
    ('shipped', 'Отправлен'),
    ('delivered', 'Доставлен'),
    ('canceled', 'Отменен'),
)


def upload_to(instance, filename):
    extension = filename.split('.')[-1]
    filename = f'{slugify(instance.name)}_{get_random_string(10)}.{extension}'
    return f'sweets/{filename}'


class Product(models.Model):
    image = models.ImageField(upload_to=upload_to)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)

    def delete(self, *args, **kwargs):
        print(self.image, self.image.name)
        if self.image:
            image_path = os.path.join(self.image.name)
            print(image_path, os.path.isfile(f"media/{image_path}"))
            if os.path.isfile(f"media/{image_path}"):
                os.remove(f"media/{image_path}")
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name


class Cart(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    items = models.ManyToManyField(Product, through='CartItem')

    def __str__(self):
        return f"{self.user.username} - {(self.items.count())} product"


class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} for {self.cart.user.username}"


class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    items = models.ManyToManyField(Product, through='OrderItem')
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
