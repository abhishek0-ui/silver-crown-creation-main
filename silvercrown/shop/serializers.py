from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    thumbnail = serializers.ImageField(use_url=True)

    class Meta:
        model = ProductImage
        fields = ['image', 'thumbnail']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    thumbnail = serializers.ImageField(use_url=True)  # ✅ ensures full URL

    class Meta:
        model = Product
        fields = '__all__'
