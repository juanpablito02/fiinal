from django.contrib import admin
from django.urls import path
from core import views as core_views
from Bd_Escatica import views as Bd_views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', core_views.main, name='main'),
    path('tablero/', core_views.tablero, name="tablero"),
    path('menuUser/', core_views.menuUser, name="menuUser"),
    path('nosotros/', core_views.nosotros, name="nosotros"),
    path('login/', Bd_views.login_register, name='login_register'),
    path('logout/', auth_views.LogoutView.as_view(next_page='main'), name='logout'),
    
]
