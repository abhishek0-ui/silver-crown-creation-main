from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.CharField(max_length=10)
    color = models.CharField(max_length=50)
    description = models.TextField()
    thumbnail = models.ImageField(
        upload_to='products/thumbnails/',
        default='products/thumbnails/default.jpg'
    )
    stock = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=20)
    discount = models.CharField(max_length=10, blank=True)
    rating = models.FloatField(default=0)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/gallery/')
    thumbnail = models.ImageField(upload_to='products/gallery/thumbnails/', blank=True, null=True)

    def __str__(self):
        return f"Image for {self.product.name}"
