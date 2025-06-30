from django.db import models
from cloudinary.models import CloudinaryField

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.CharField(max_length=10)
    color = models.CharField(max_length=50)
    description = models.TextField()
    
    thumbnail = CloudinaryField('thumbnail', blank=True, null=True)

    stock = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=20)
    discount = models.CharField(max_length=10, blank=True)
    rating = models.FloatField(default=0)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image', blank=True, null=True)
    thumbnail = CloudinaryField('thumb', blank=True, null=True)

    def __str__(self):
        return f"Image for {self.product.name}"
