from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('shop.urls')),        # Let shop control /
    path('admin/', admin.site.urls),
    path('api/', include('shop.api_urls')),  # Optional: split API into `api_urls.py`
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
