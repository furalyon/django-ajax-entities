from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^ajax-add$', views.ajax_add, name='ajax-add'),
]
