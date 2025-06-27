from django.urls import path
from .views import product_list, product_page

urlpatterns = [
    path('products/', product_list),  # JSON API
    path('', product_page),           # Homepage with product list
]