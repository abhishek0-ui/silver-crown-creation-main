from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>Welcome to Silver Crown Creation</h1><p>Visit <a href='/api/products/'>Products</a></p>")

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include('shop.urls')),  # 👈 this should point to shop.urls
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
