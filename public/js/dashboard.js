(function ($) {
    'use strict';

    Object.size = function (obj) {
        return Object.keys(obj).length;
    };

    function esc_html(unsafe) {
        if (typeof unsafe == 'string') {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        } else {
            return unsafe;
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    var GmzBooking = {
        isValidated: {},
        init: function () {
            this.initGlobal();
            this.initValidation();
            this.initFormFile();
            this.initFormAction();
            this.initFormWizard();
            this.initModal();
            this.initLinkAction();
            this.initCheckAll();
            this.initMenu();
            this.initTableSort();
            this.initTranslation();
            this.initBulkDeleteMedia();
            this.initSidebar();
            this.initWishList();
            this.initSeo();
        },

        _linkActionSuccess: function(t, respon){
            if(typeof respon.button != 'undefined'){
                t.text(respon.button.text);
                t.attr('data-action', respon.button.action);
                if(typeof respon.button.class != 'undefined') {
                    t.removeClass(respon.button.class.remove).addClass(respon.button.class.add);
                }
            }
        },

        initSeo: function(){
            var seoParent = $('.seo-list-separator');
            $('ul li', seoParent).on('click', function(){
               var t = $(this),
                   val = t.data('value'),
                   input = $('input', seoParent);

               seoParent.find('li').removeClass('active');
               t.addClass('active');
               input.val(val);
            });
        },

        initWishList: function(){
            $('[data-toggle="tooltip"]').tooltip();
            $(document).on('click', '.add-wishlist', function(){
                var t = $(this),
                    postID = t.data('id'),
                    postType = t.data('post-type');

                t.addClass('active');

                $.post(t.data('action'), {
                    post_id: postID,
                    post_type: postType,
                    _token: $('meta[name="csrf-token"]').attr('content')
                }, function (respon) {
                    if (respon.status) {
                        console.log(t.closest('.wishlist-item'));
                        t.closest('.wishlist-item').remove();
                        t.parent().html(respon.html);
                        $('.tooltip').hide();
                        $('[data-toggle="tooltip"]').tooltip('update');
                    }
                    t.removeClass('active');
                }, 'json');
            });
        },

        initSortPayment: function () {
            if ($('.gmz-list-payment-box .sortable').length) {
                var options = {
                    handle: 'div',
                    items: 'li',
                    toleranceElement: '> div',
                    maxLevels: 1
                };

                if($('body').hasClass("is-rtl")){
                    options.rtl = true;
                }

                var menuNested = $('.gmz-list-payment-box .sortable').nestedSortable(options);

                $('.gmz-payment-form').on('gmz_form_action_before', function (el) {

                    var currentEl = $(el.currentTarget);

                    var paymentStructure = [];
                    $('.gmz-list-payment-box .sortable li').each(function () {
                        paymentStructure.push($(this).attr('id'));
                    });

                    currentEl.find('input[name="payment_structure"]').attr('value', JSON.stringify(paymentStructure));
                });
            }
        },

        initPlugins: function(){
            var base = this;
            if($('[data-plugin="footable"]').length){
                $('[data-plugin="footable"]').footable({}, function(){
                    base.initCheckAll();
                    base.initLinkAction();
                });
            }
        },

        initBulkDeleteMedia: function () {
            var base = this;
            $('.gmz-bulk-delete-media').on('click', function (e) {
                e.preventDefault();
                var t = $(this);
                var conf = true;
                var target = t.data('custom-target');
                if (t.data('confirm') === true) {
                    conf = confirm('Are you sure want to to it?');
                }
                if (conf) {
                    var action = t.data('action'),
                        inputs = $(target).serializeArray(),
                        data = [];

                    var mediaIDs = [];
                    if (inputs.length) {
                        for (var i = 0; i < inputs.length; i++) {
                            mediaIDs.push(inputs[i].value);
                        }
                    }


                    data.push(
                        {name: '_token', value: $('meta[name="csrf-token"]').attr('content')},
                        {name: 'mediaIDs', value: mediaIDs.join(',')}
                    );

                    $.post(action, data, function (respon) {
                        if (typeof respon === 'object') {
                            base.toast(respon);

                            if (typeof respon.redirect !== 'undefined') {
                                setTimeout(function () {
                                    window.location.href = respon.redirect;
                                }, 1000);
                            }

                            if (typeof respon.reload !== 'undefined') {
                                setTimeout(function () {
                                    window.location.reload();
                                }, 1000);
                            }
                        }
                    }, 'json');
                }
            });
        },

        initTranslation: function () {
            var translationEl = $('#input-search-translation');
            if (translationEl.length) {
                translationEl.keypress(function (event) {
                    if (event.which == '13') {
                        event.preventDefault();
                    }
                });

                translationEl.on('keyup', function () {
                    var t = $(this),
                        val = t.val();
                    filterTableTranslation(val);
                });

                translationEl.parent().find('button').on('click', function () {
                    filterTableTranslation(translationEl.val());
                });

                function filterTableTranslation(val) {
                    var value = val.toLowerCase();
                    $('.table-translations tbody tr').filter(function () {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                    });
                }
            }

            $('#gmz-select-langs').on('change', function () {
                var url = $(this).data('url');
                url += '?lang=' + $(this).val();
                window.location.href = url;
            });
        },

        initTableSort: function () {
            var base = this;
            $('[data-sort="true"]').each(function () {
                var t = $(this);
                t.find('tbody').sortable({
                    update: function (event, ui) {
                        var data = {},
                            order = {};
                        t.find('tbody tr').each(function () {
                            order[$(this).data(t.data('sort-field'))] = $(this).index() + 1;
                        });
                        data['_token'] = $('meta[name="csrf-token"]').attr('content');
                        data['data'] = order;
                        $.post(t.attr('data-sort-action'), data, function (respon) {
                            if (typeof respon == 'object') {
                                base.toast(respon);
                            }
                        }, 'json');
                    }
                });
            });
        },

        initCheckAll: function () {
            $('.gmz-check-all').each(function () {
                var t = $(this),
                    checkAll = $('input', t),
                    parent = t.closest('table'),
                    checkboxItem = $('.gmz-check-all-item', parent),
                    checkboxCheckedItem = $('.gmz-check-all-item:checked', parent),
                    buttonAction = $('.gmz-check-all-button');

                if (checkboxItem.length > 0 && checkboxItem.length === checkboxCheckedItem.length) {
                    checkAll.prop('checked', true);
                }
                checkAll.on('change', function () {
                    if ($(this).is(':checked')) {
                        checkboxItem.prop('checked', true);
                        if (buttonAction.length) {
                            buttonAction.addClass('active');
                        }
                    } else {
                        checkboxItem.prop('checked', false);
                        if (buttonAction.length) {
                            buttonAction.removeClass('active');
                        }
                    }
                });

                checkboxItem.on('change', function () {
                    var checked = $('.gmz-check-all-item:checked', parent).length,
                        total = checkboxItem.length;

                    if (checked === total) {
                        checkAll.prop('checked', true);
                    } else {
                        checkAll.prop('checked', false);
                    }

                    if (buttonAction.length) {
                        if (checked > 0) {
                            buttonAction.addClass('active');
                        } else {
                            buttonAction.removeClass('active');
                        }
                    }
                });
            });
        },

        initValidation: function (addEvent) {
            var base = this;
            $('.gmz-validation').each(function () {
                var _id = $(this).attr('id'),
                    validation = $(this).attr('data-validation');

                bootstrapValidate('#' + _id, validation, function (isValid) {
                    if (isValid) {
                        if (typeof base.isValidated[_id] !== 'undefined') {
                            delete base.isValidated[_id];
                        }
                    } else {
                        base.isValidated[_id] = 1;
                    }
                });
                if (addEvent) {
                    if ($(this).val() === '') {
                        $(this).trigger('focus').trigger('blur');
                    }
                }
            });
        },

        initLinkAction: function () {
            var base = this;
            $('.gmz-link-action').unbind();
            $('.gmz-link-action').on('click', function (e) {
                e.preventDefault();
                var t = $(this);
                var conf = true;
                if (t.data('confirm') === true) {
                    conf = confirm('Are you sure want to to it?');
                }
                if (conf) {
                    var action = t.attr('data-action'),
                        params = t.data('params'),
                        data = [],
                        loader = $('#load_screen'),
                        removeEl = t.data('remove-el');

                    data.push(
                        {name: '_token', value: $('meta[name="csrf-token"]').attr('content')},
                        {name: 'params', value: params}
                    );

                    loader.addClass('show');

                    $.post(action, data, function (respon) {
                        if (typeof respon === 'object') {

                            if (typeof respon.redirect !== 'undefined') {
                                setTimeout(function () {
                                    window.location.href = respon.redirect;
                                }, 1000);
                            }

                            if(typeof removeEl !== 'undefined'){
                                t.closest(removeEl).remove();
                            }else {
                                if (typeof respon.reload !== 'undefined') {
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 1000);
                                }
                            }

                            base.toast(respon);

                            loader.removeClass('show');

                            base._linkActionSuccess(t, respon);
                        }
                    }, 'json');
                }
            });
        },

        initModal: function () {
            var base = this;
            $('.table, .widget-header, .gmz-all-media, .gmz-field-heading').on('click', '.gmz-open-modal', function (e) {
                e.preventDefault();
                var t = $(this),
                    modal = t.data('target'),
                    action = t.data('action'),
                    params = t.data('params'),
                    needSaving = t.data('need-saving'),
                    data = [];

                if(needSaving){
                    if($('#gmz-settings-page').length){
                        $('#gmz-settings-page #icon-pills-tabContent .tab-pane.active.show form').trigger('submit');
                    }
                }

                data.push(
                    {name: '_token', value: $('meta[name="csrf-token"]').attr('content')},
                    {name: 'params', value: params}
                );

                $.post(action, data, function (respon) {
                    if (typeof respon === 'object') {
                        if (!respon.status) {
                            base.toast(respon);
                        } else {
                            $(modal).modal('show');
                            $(modal).find('.render').html(respon.html);
                            window.GmzOption.initIconPicker();
                            base.initValidation();
                            window.GmzOption.initMultiLanguages();
                            window.GmzOption.initFlagTranslation();
                            base.initLinkAction();
                            window.GmzOption.initDatePicker();
                            setTimeout(function(){
                                window.GmzOption.initMapbox();
                            }, 1000);

                            base.initSortPayment();

                        }
                    }
                }, 'json');
            });

            $('#gmzEditTermModal').on('shown.bs.modal', function (e) {

            })
        },

        initFormWizard: function () {
            $('[data-plugin="wizard-circle"]').each(function () {
                $('[data-plugin="wizard-circle"]').steps({
                    headerTag: "h3",
                    bodyTag: "section",
                    transitionEffect: "slideLeft",
                    autoFocus: true,
                    cssClass: 'circle wizard',
                    enableAllSteps: true,
                    labels:{
                        finish: gmz_params.i18n.finishText,
                        next: gmz_params.i18n.nextText,
                        previous: gmz_params.i18n.previousText,
                    },
                    onStepChanging: function (event, currentIndex, newIndex) {
                        $(this).find('section.current .gmz-form-action').trigger('submit');
                        if ($(this).find('section.current .gmz-form-action .gmz-validation.is-invalid').length) {
                            return false;
                        }
                        return true;
                    },
                    onFinishing: function (event, currentIndex) {
                        if ($(this).find('section.current .gmz-form-action .gmz-validation.is-invalid').length) {
                            return false;
                        }
                        $(this).find('section.current .gmz-form-action').append('<input type="hidden" name="finish" id="gmz-finish" value="1"/>');
                        $(this).find('section.current .gmz-form-action').trigger('submit');
                        return true;
                    },
                    onStepChanged: function (event, currentIndex, priorIndex) {
                        var parent = $('.gmz-form-wizard-wrapper'),
                            content = $('.content .current .gmz-field-location', parent),
                            contentGallery = $('.content .current .gmz-field-gallery', parent),
                            contentMultiSelect2 = $('[data-plugin="select2"]', parent);

                        if (content.length) {
                            window.GmzOption.initMapbox();
                        }
                        if (contentGallery.length) {
                            window.GmzOption.initSortGallery();
                        }
                        if (contentMultiSelect2.length) {
                            window.GmzOption.initSelect2();
                        }

                        window.GmzOption.initDatePicker();


                    },
                    onInit: function (event, currentIndex) {
                        window.GmzOption.initMultiLanguages();
                    }
                });
            });

            $('.gmz-form-wizard-wrapper').each(function () {
                $($(this).find('.action '))
            });
        },

        initFormAction: function () {
            var base = this;
            if($('.gmz-addon-form').length){
                var addonForm = $('.gmz-addon-form');
                $('button', addonForm).on('click', function(){
                    if($(this).attr('name') == 'remove'){
                        $('input[name="action"]', addonForm).val('remove');
                    }else if($(this).attr('name') == 'update'){
                        $('input[name="action"]', addonForm).val('update');
                    }
                });
            }

            $(document).on('submit', '.gmz-form-action', function (e) {
                e.preventDefault();

                var form = $(this),
                    action = form.attr('action'),
                    loader = $('.gmz-loader', form),
                    message = $('.gmz-message', form),
                    dataEncode = form.data('encode');

                base.initValidation(form, true);
                if (Object.size(base.isValidated)) {
                    var invalidEl = $('.gmz-validation.is-invalid', form).first();
                    if (invalidEl.length) {
                        $("html, body").animate({scrollTop: invalidEl.offset().top}, 500);
                        invalidEl.focus();
                    }
                    return false;
                }

                //Begin for settings page
                if (form.closest('#gmz-settings-page').length) {
                    loader = form.closest('#gmz-settings-page').find('.gmz-loader');
                }
                //End for settings page

                //Begin for meta page
                if (form.closest('.gmz-form-wizard-wrapper').length) {
                    loader = form.closest('.gmz-form-wizard-wrapper').find('.gmz-loader');
                }
                //End for meta page

                form.trigger('gmz_form_action_before', [form]);

                var data = [];

                if (dataEncode) {
                    var postFields = form.serializeArray();
                    data.push({
                        name: 'fields',
                        value: JSON.stringify(postFields)
                    });
                } else {
                    data = form.serializeArray();
                }

                data.push({
                    name: '_token',
                    value: $('meta[name="csrf-token"]').attr('content')
                });

                loader.show();

                if (message.length > 0) {
                    message.empty();
                }

                $.post(action, data, function (respon) {

                    if (typeof respon === 'object') {
                        if (message.length > 0) {
                            var classMessage = '';
                            if (respon.status) {
                                classMessage = 'alert alert-success';
                            } else {
                                classMessage = 'alert alert-danger';
                            }
                            message.html(respon.message);
                        } else {
                            base.toast(respon);
                            if(respon['permalink']){
                                $('#post-preview').attr('href',respon['permalink']);
                            }
                        }
                    }

                    if (typeof respon.redirect !== 'undefined') {
                        setTimeout(function () {
                            window.location.href = respon.redirect;
                        }, 1000);
                    }

                    if (typeof respon.reload !== 'undefined') {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    }

                    loader.hide();
                }, 'json');
            });
        },

        initFormFile: function () {
            $(".form-file-action").on('submit', (function (e) {
                e.preventDefault();

                var form = $(this),
                    formData = new FormData(this),
                    url = form.attr('action'),
                    loading = $('.gmz-loader', form);

                formData.append('_token', $('meta[name="csrf-token"]').attr('content'));

                $.ajax({
                    url: url,
                    type: "POST",
                    data: formData,
                    contentType: false,
                    cache: false,
                    processData: false,
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (respon) {
                        if ($('.form-message', form).length) {
                            $('.form-message', form).html(respon.message);
                        }

                        if (typeof respon.reload !== 'undefined') {
                            setTimeout(function () {
                                //window.location.reload();
                            }, 1500);
                        }

                        loading.hide();
                    },
                    error: function (e) {
                        loading.hide();
                    }
                });
            }));
        },

        initGlobal: function () {
            var base = this;
            $(document).ready(function () {
                base.initPlugins();

                //Click to tab settings
                var settingElement = $('#gmz-settings-page');
                if (settingElement.length) {
                    settingElement.find('.nav-pills .nav-link').click(function () {
                        settingElement.find('.tab-content .tab-pane.active .gmz-form-action').trigger('submit');
                    })
                }
            });

            $('#gmz-import-data-form').on('submit', function(e){
                var conf = confirm('Are you sure want to do it?');
                if(!conf){
                    e.preventDefault();
                }
            });

            $("#gmz-dropdown-notification").on('show.bs.dropdown', function () {
                var t = $(this),
                    data = {};
                data['_token'] = $('meta[name="csrf-token"]').attr('content');
                data['params'] = t.data('params');

                $.post(t.data('action'), data, function (respon) {
                    if (typeof respon == 'object') {
                        t.find('.badge').remove();
                    }
                }, 'json');
            });
        },

        initMenu: function () {
            $(document).on('click', '.gmz-add-menu-box h5.title', function () {
                var t = $(this),
                    parent = t.parent();

                t.closest('.gmz-add-menu-box-wrapper').find('.gmz-add-menu-box').not(parent).removeClass('active');
                parent.toggleClass('active');
            });

            $(document).on('click', '.gmz-btn-add-menu-item', function (e) {
                e.preventDefault();

                if ($('.gmz-list-menu-box .sortable').length) {
                    var t = $(this),
                        parent = t.closest('.gmz-add-menu-box');

                    if (t.hasClass('custom-link')) {
                        var menuName = parent.find('.menu-name');
                        var menuURL = parent.find('.menu-url');
                        var menuData = {
                            name: menuName.val() != '' ? esc_html(menuName.val()) : 'Menu title',
                            type: 'custom',
                            id: '0',
                            url: menuURL.val() != '' ? esc_html(menuURL.val()) : '#'
                        };
                        gmzRenderMenuItem(menuData);
                        menuName.val('');
                        menuURL.val('');
                    } else {
                        var menuItem = $('.gmz-add-menu-item', parent);
                        var iMenuItem = 0;
                        menuItem.each(function () {
                            if ($(this).is(':checked')) {
                                iMenuItem++;
                                var dataMenuItem = $(this).data();
                                gmzRenderMenuItem(dataMenuItem);
                            }
                        });
                        if(iMenuItem === 0){
                            alert('Please select at least one menu item');
                        }
                        menuItem.prop('checked', false);
                    }
                }else{
                    alert('Please select at least a menu before doing this action');
                }
            });

            function gmzRenderMenuItem(data) {
                var menuBox = $('.gmz-list-menu-box .sortable'),
                    numberMenuItems = menuBox.find('li').length,
                    newID = 'gmz-mn-' + (numberMenuItems + 1);

                var typeName = data['type'].replace('_', ' ');
                var timeStp = $.now();

                var te = '<li id="' + newID + '" data-type="' + esc_html(data['type']) + '" data-post_id="' + esc_html(data['id']) + '" data-post_title="' + esc_html(data['name']) + '">';
                te += '<div class="item type-' + esc_html(data['type']) + '">';
                te += '<div class="item-header d-flex align-items-center justify-content-between">';
                te += '<span class="name">' + esc_html(data['name']) + '</span>';
                te += '<span class="gmz-delete-menu-item ml-3"><svg height="24px" viewBox="-47 0 512 512" width="24px"><path d="m416.875 114.441406-11.304688-33.886718c-4.304687-12.90625-16.339843-21.578126-29.941406-21.578126h-95.011718v-30.933593c0-15.460938-12.570313-28.042969-28.027344-28.042969h-87.007813c-15.453125 0-28.027343 12.582031-28.027343 28.042969v30.933593h-95.007813c-13.605469 0-25.640625 8.671876-29.945313 21.578126l-11.304687 33.886718c-2.574219 7.714844-1.2695312 16.257813 3.484375 22.855469 4.753906 6.597656 12.445312 10.539063 20.578125 10.539063h11.816406l26.007813 321.605468c1.933594 23.863282 22.183594 42.558594 46.109375 42.558594h204.863281c23.921875 0 44.175781-18.695312 46.105469-42.5625l26.007812-321.601562h6.542969c8.132812 0 15.824219-3.941407 20.578125-10.535157 4.753906-6.597656 6.058594-15.144531 3.484375-22.859375zm-249.320312-84.441406h83.0625v28.976562h-83.0625zm162.804687 437.019531c-.679687 8.402344-7.796875 14.980469-16.203125 14.980469h-204.863281c-8.40625 0-15.523438-6.578125-16.203125-14.980469l-25.816406-319.183593h288.898437zm-298.566406-349.183593 9.269531-27.789063c.210938-.640625.808594-1.070313 1.484375-1.070313h333.082031c.675782 0 1.269532.429688 1.484375 1.070313l9.269531 27.789063zm0 0"></path><path d="m282.515625 465.957031c.265625.015625.527344.019531.792969.019531 7.925781 0 14.550781-6.210937 14.964844-14.21875l14.085937-270.398437c.429687-8.273437-5.929687-15.332031-14.199219-15.761719-8.292968-.441406-15.328125 5.925782-15.761718 14.199219l-14.082032 270.398437c-.429687 8.273438 5.925782 15.332032 14.199219 15.761719zm0 0"></path><path d="m120.566406 451.792969c.4375 7.996093 7.054688 14.183593 14.964844 14.183593.273438 0 .554688-.007812.832031-.023437 8.269531-.449219 14.609375-7.519531 14.160157-15.792969l-14.753907-270.398437c-.449219-8.273438-7.519531-14.613281-15.792969-14.160157-8.269531.449219-14.609374 7.519532-14.160156 15.792969zm0 0"></path><path d="m209.253906 465.976562c8.285156 0 15-6.714843 15-15v-270.398437c0-8.285156-6.714844-15-15-15s-15 6.714844-15 15v270.398437c0 8.285157 6.714844 15 15 15zm0 0"></path></svg></span>';
                te += '</div>';
                te += '<div class="item-content-wrapper">';
                te += '<div class="item-content">';
                te += '<div class="form-group name">';
                te += '<label>' + menuBox.parent().data('menu-name') + '</label>';
                te += '<input type="text" class="form-control form-control-sm menu_name" value="' + esc_html(data['name']) + '">';
                te += '</div>';
                te += '<div class="form-group url">';
                te += '<label>' + menuBox.parent().data('menu-url') + '</label>';
                te += '<input type="text" class="form-control form-control-sm menu_url" value="' + esc_html(data['url']) + '">';
                te += '</div>';
                te += '<div class="form-group target">\n' +
                    '<div class="checkbox checkbox-success">\n' +
                    '<input type="checkbox" class="menu_target" value="1" id="target-checkbox-' + timeStp + '">\n' +
                    '<label for="target-checkbox-' + timeStp + '">' + menuBox.parent().data('menu-target') + '</label>\n' +
                    '</div>\n' +
                    '</div>';
                te += '<div class="menu-info">';
                if(data.type === 'custom'){
                    te += '<p class="menu-type">Type: '+ capitalizeFirstLetter(data.type) +'</p>';
                }else{
                    te += '<p class="menu-origin-link">' + capitalizeFirstLetter(typeName) + ': <a href="' + esc_html(data['url']) + '">' + esc_html(data['name']) + '</a></p>';
                }
                te += '</div>';
                te += '</div>';
                te += '</div>';
                te += '</div>';
                te += '</li>';

                menuBox.append(te);
            }

            if ($('.gmz-list-menu-box .sortable').length) {
                var options1 = {
                    handle: 'div',
                    items: 'li',
                    toleranceElement: '> div',
                };
                if($('body').hasClass("is-rtl")){
                    options1.rtl = true;
                }

                var menuNested = $('.gmz-list-menu-box .sortable').nestedSortable(options1);

                $('.gmz-menu-form').on('gmz_form_action_before', function (el) {

                    var currentEl = $(el.currentTarget);

                    var i = 1;
                    $('.gmz-list-menu-box .sortable li').each(function () {
                        $(this).attr('id', 'gmz-mn-' + i);
                        i++;
                    });

                    var menuStruture = $('.gmz-list-menu-box .sortable').nestedSortable("toArray");
                    currentEl.find('input[name="menu_structure"]').attr('value', JSON.stringify(menuStruture));
                });

                $(document).on('click', '.gmz-list-menu-box .sortable .item .item-header', function (e) {
                    if (e.target.className !== 'fe-trash-2') {
                        var t = $(this),
                            parent = t.parent(),
                            contentWrapper = parent.find('.item-content-wrapper');

                        t.closest('.gmz-list-menu-box').find('.item .item-content-wrapper').not(contentWrapper).removeClass('active');
                        contentWrapper.toggleClass('active');
                    }
                });

                $(document).on('keyup', '.gmz-list-menu-box .sortable .item .item-content input.menu_name', function () {
                    $(this).closest('.item').find('.item-header .name').text($(this).val());
                });
            }
            $(document).on('click', '.gmz-delete-menu-item', function (e) {
                e.preventDefault();
                var conf = confirm('Are you sure want to delete it?');
                if (conf) {
                    var t = $(this),
                        liEl = t.closest('li'),
                        liElPrev = liEl.prev(),
                        olEl = t.closest('ol'),
                        liChild = liEl.find('ol').first().clone();

                    if (liElPrev.length > 0) {
                        if (liChild.length > 0) {
                            $(liChild[0].innerHTML).insertAfter(liElPrev);
                        }

                    } else {
                        if (liChild.length > 0) {
                            olEl.prepend(liChild[0].innerHTML);
                        }
                    }
                    liEl.remove();
                }
            });
        },

        toast: function (data) {
            var toastOptions = {
                timeOut: 1500,
                closeButton: true
            };
            if (!data.status) {
                toastr.error(data.message, '', toastOptions);
            }else{
                toastr.success(data.message, '', toastOptions);
            }
        },

        initSidebar: function () {
            $(document).ready(function () {
                var menuDiv = $(".menu-categories");
                if(menuDiv.length) {
                    var elementDiv = $(".menu.active", menuDiv);
                    if(typeof elementDiv.offset() !== 'undefined' && typeof menuDiv.offset() !== 'undefined') {
                        menuDiv.animate({scrollTop: menuDiv.scrollTop() + (elementDiv.offset().top - menuDiv.offset().top) - 50}, 1);
                    }
                }
            });
        }

    };

    GmzBooking.init();
})(jQuery);

function selectText(containerid) {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }

    setTimeout(function() {
        var el = document.createElement('textarea');
        el.value = document.getElementById(containerid).textContent;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }, 100);

    var t = $('#' + containerid);
    var parent = t.closest('.seo-variable');
    var textCopied = parent.data('text-copied');
    var textCopy = parent.data('text-copy');

    t.attr('data-original-title', textCopied);
    t.tooltip('hide').tooltip('show');

    t.on("mouseleave", function () {
        $(this).attr('data-original-title', textCopy);
    })
}