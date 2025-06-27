from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            return obj.image.url  # ✅ returns full Cloudinary URL
        return None

    class Meta:
        model = ProductImage
        fields = ['image', 'thumbnail']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    thumbnail = serializers.SerializerMethodField()

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url  # ✅ returns full Cloudinary URL
        return None

    class Meta:
        model = Product
        fields = '__all__'
