from django.urls import path
from .views import product_list, product_page

urlpatterns = [
    path('products/', product_list),   # API Endpoint
    path('', product_page),            # Optional frontend HTML
]