from django.contrib import admin
from .models import Product, ProductImage

class ProductImageInline(admin.TabularInline):  # Allows inline image upload
    model = ProductImage
    extra = 1  # Show one empty form by default

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ("name", "price", "stock", "color")  # You can still keep this
    search_fields = ("name", "color")

admin.site.register(Product, ProductAdmin)
