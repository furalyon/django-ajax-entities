/**
    ajax-add-entity
    By Ramkishore Manoharan @furalyon
    Add values for Entity fields from within the forms where they are selected

    Note: Created to work with django. May have to make changes 
    to work in other situations.

    Usage: 
    1) Add jquery and this script.
    2) Add modal.scss and ajax-add-entity.scss into phy.scss
    3) Add class 'entity-add__select', attrs data-app (app of model), data-model
        To add on the ModelForm use the syntax in the example below

Eg:

class StudentForm(forms.ModelForm):
    class Meta:
        model = Student

    def __init__(self, *args, **kwargs):
        super(StudentForm,self).__init__(*args, **kwargs)
        self.fields['school'].widget.attrs.update({
            'class':'entity-add__select',
            'data-app':'schools',
            'data-model':'school',
        })
 */

$(function(){
    var select_class = 'entity-add__select',
    $selects = $('.'+select_class),
    link_class = 'entity-add__link',

    create_modal_box = function(model) {
        $('body').append("<div class='entitymodal entity'><h4>Add new "+model+"</h4>" +
        "<form action='' method='POST'>" +
            "<ul class='form-fields'>" +
                "<li>" +
                    "<span class='error' id='entity_error'></span>" +
                "</li>" +
                "<li class='field--required'>" +
                    "<label class='field--required' for='entity_name'>Name</label>" +
                    "<input type='text' id='entity_name' name='name'>" +
                "</li>" +
                "<li class='btn--submit__container'>" +
                    "<input type='submit' value='Add' " +
                    "class='btn--submit btn--submit-entity'>" +
                    "<input type='button' value='Cancel' " +
                    "class='btn--submit btn--cancel-entity'>" +
                "</li>" +
            "</ul>" +
        "</form></div>");
        $('#entity_name').focus();
    },

    close_modal_box = function() {
        $('body').removeClass('entitymodalIsOpen');
        //delay for animation to finish
        setTimeout(function(){
            $('.entitymodal.entity,.entitymodal__overlay').remove();}, 600);
    },

    bind_cancel_button = function() {
        $('.btn--cancel-entity').click(function(event) {
            event.preventDefault();
            close_modal_box();
        });
        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                close_modal_box();
            }
        });
    },

    add_name_to_select = function($select, name) {
        $select.append('<option value=\"'+name+'\">'+name+'</option>')
            .val(name);
    }

    bind_submit_button = function($select, app, model) {
        $('.btn--submit-entity').click(function(event) {
            event.preventDefault();
            var name = $('#entity_name').val(),
                $add_button = $(this);
            if(name!='') {
                $add_button.attr('disabled','true');
                var data = {
                    app:app,
                    model:model,
                    name:name,
                };
                $.post('/entities/ajax-add', data, function(response) {
                    if (response.error_message) {
                        $add_button.attr('disabled','false');
                        $('#entity_error').html(response.error_message);
                    }
                    else {
                        add_name_to_select($select, name);
                        close_modal_box();
                    }
                }, "json");
            }
        });
    },

    bind_add_link = function(event) {
        event.preventDefault();
        var $select = $(this).siblings('.'+select_class),
            app = $select.attr('data-app'),
            model = $select.attr('data-model');

        create_modal_box(model);//create box before adding class to body for animation
        $('body').addClass('entitymodalIsOpen')
                 .append("<span class='entitymodal__overlay'></span>");
        bind_cancel_button();
        bind_submit_button($select, app, model);
    };

    $selects.each(function(){
        var $li = $(this).parent();
        $li.append("<a href='#' class='"+link_class+"'>+</a>");
    });

    $('.'+link_class).click(bind_add_link);
});