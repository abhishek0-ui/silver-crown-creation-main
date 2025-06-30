from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()

    def get_image(self, obj):
        return obj.image.url if obj.image else None

    def get_thumbnail(self, obj):
        return obj.thumbnail.url if obj.thumbnail else None

    class Meta:
        model = ProductImage
        fields = ['image', 'thumbnail']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    thumbnail = serializers.SerializerMethodField()

    def get_thumbnail(self, obj):
        return obj.thumbnail.url if obj.thumbnail else None

    class Meta:
        model = Product
        fields = '__all__'
