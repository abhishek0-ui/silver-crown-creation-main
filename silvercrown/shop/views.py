from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

# ✅ API JSON Response
@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# ✅ HTML Page Response
def product_page(request):
    products = Product.objects.all()
    return render(request, 'shop/product_page.html', {'products': products})
