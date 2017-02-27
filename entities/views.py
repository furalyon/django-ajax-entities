import json

from django.shortcuts import render
from django.apps import apps
from django.http import HttpResponse
from django.core.exceptions import PermissionDenied
from django.db import IntegrityError

def ajax_add(request):
    """
    usually done through entity modal box interface on other forms
    """
    if request.method=='POST' and request.is_ajax() and (
        request.user.is_staff or request.user.is_superuser):
        try:
            Model = apps.get_model(request.POST['app'], request.POST['model'])
            name = request.POST['name']
            if not name:
                raise Exception('Name cannot be empty')
            obj = Model.objects.create(name=name)
        except IntegrityError:
            return_dict = {
                'error_message':'This %s exists already'%request.POST['model'],
            }
        except KeyError:
            return_dict = {
                'error_message':'Logic Error. Contact Admin',
            }
        except Exception as e:
            return_dict = {
                'error_message':'%s'%e,
            }
        else:
            return_dict = {
                'success':'1',
            }
        data = json.dumps(return_dict)
        return HttpResponse(data, content_type='application/javascript')
    raise PermissionDenied
