===================
Django Entities App
===================


A simple django app to add values to ``models.ForeignKey`` fields on forms with a single name field (and may be an autopopulated slug field) on the fly ajaxically.


Pre-requisites
==============
    1) This was built for Python 3.x
    2) Django 1.8+
    3) jQuery


Installation
============

Download a copy of the entities app folder in the repo and put it in your project folder.


Initial setup
=============

In your main ``urls.py`` add::

    url(r'^entities/', include('entities.urls', namespace='entities')),


Usage
=====

If your entity is ``school`` field on student form, set up the school field's widget as shown below::

    class StudentForm(forms.ModelForm):
        class Meta:
            model = Student
            fields = '__all__'

        def __init__(self, *args, **kwargs):
            super(StudentForm,self).__init__(*args, **kwargs)
            self.fields['school'].widget.attrs.update({
                'class':'entity-add__select',
                'data-app':'students',
                'data-model':'school',
            })
