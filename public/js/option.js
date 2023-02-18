(function ($) {
    'use strict';

    Object.size = function (obj) {
        return Object.keys(obj).length;
    };

    var body = $('body');
    window.GmzOption = {
        quill: [],
        fontIcons: [],
        fontCategories: [],
        allFonts: [],
        fontRender: {},
        fontCurrentPage: 1,
        init: function () {
            this.initDocumentReady();
            this.initFieldConditionEvent();
            this.initListItemField();
            this.initSortGallery();
            this.initFlagTranslation();
            this.initDatePicker();
            //this.initSelect2();

            this.initListMedia();
            this.initIconPicker();
            this.initUploadMedia();
            //this.initEditor();
            this.initColorPicker();
            //this.initListItems();
            this.initUploadFontIcon();
            this.initFlagIcon();
            this.initFieldSelectWithMetadata();
            this.initFilterIcon();
            this.initSwitcher();
        },

        initSwitcher: function () {
            var base = this;
            $(document).on('change', '.gmz-switcher input[type="checkbox"]', function (e) {
                var t = $(this),
                    parent = t.parent(),
                    input = parent.find('input[type="hidden"]');

                if (t.is(':checked')) {
                    input.val('on').change();
                } else {
                    input.val('off').change();
                }

                if (parent.hasClass('gmz-switcher-action')) {
                    var conf = true;
                    if (parent.data('confirm') === true) {
                        conf = confirm('Are you sure want to to it?');
                    }
                    if (conf) {

                        var action = parent.data('action'),
                            params = parent.data('params'),
                            approve = 'no',
                            data = [];

                        if (t.is(':checked')) {
                            approve = 'yes';
                        }

                        data.push(
                            {name: '_token', value: $('meta[name="csrf-token"]').attr('content')},
                            {name: 'params', value: params},
                            {name: 'approve', value: approve}
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
                    }else{
                        if(t.is(':checked')) {
                            t.prop('checked', false);
                        }else{
                            t.prop('checked', true);
                        }
                    }
                }
            });
        },

        initFieldSelectWithMetadata: function(){
            $('.gmz-field-select_with_metadata_term').each(function () {
                var field = $(this);
                var formControl = $('.form-control', field);
                formControl.on("change", function () {
                    $(".__term-meta",field).each(function () {
                        if (Number($(this).data('term-id')) === Number(formControl.val())){
                            $(this).css("display", "block");
                        }else {
                            $(this).css("display", "none");
                        }
                    });
                }).change();
            });
        },

        initFlagIcon: function (el) {
            var base = this;
            $('[data-plugin="flagicon"]', el).each(function () {
                var t = $(this),
                    parent = t.parent(),
                    flags = t.data('flags'),
                    assetURL = t.data('flag-url') + '/',
                    inputFlag = $('.flag-code', parent);

                parent.css('position', 'relative');
                if ($('.gmz-icon-wrapper', parent).length) {
                    $('.gmz-icon-wrapper', parent).remove();
                }

                var flags_items = '';
                flags.map(function (item) {
                    flags_items += '<span data-code="' + item.alpha2 + '" data-name="' + item.name + '" class="item-flag" style="margin: 0px 5px;">' +
                        '<img src="' + assetURL + item.alpha2 + '.png"/>' +
                        '</span>';
                });

                parent.append('<div class="gmz-icon-wrapper">' +
                    '<input type="text" name="search" autocomplete="off">' +
                    '<div class="result">' +
                    '<div class="render" style="margin-left: -7px; margin-right: -7px;">' + flags_items + '</div>' +
                    '<div class="hh-loading">\n' +
                    '    <div class="lds-ellipsis">\n' +
                    '        <div></div>\n' +
                    '        <div></div>\n' +
                    '        <div></div>\n' +
                    '        <div></div>\n' +
                    '    </div>\n' +
                    '</div>' +
                    '</div>' +
                    '</div>');

                t.focus(function () {
                    $('.gmz-icon-wrapper', parent).show();
                    $('.gmz-icon-wrapper .render', parent).show();
                    if (t.val() === '') {
                        $('.gmz-icon-wrapper input', parent).focus();
                    }
                });
                $('body').click(function (ev) {
                    if ($(ev.target).closest('.gmz-icon-wrapper').length === 0 && !$(ev.target).is('.gmz-icon-input')) {
                        $('.gmz-icon-wrapper .render', parent).hide();
                        $('.gmz-icon-wrapper', parent).hide();
                    }
                });
                $('.gmz-icon-wrapper input', parent).on('keyup', function () {
                    var text = $(this).val();

                    var temp = flags.filter(function (item) {
                        return item.name.toLowerCase().indexOf(text.toLowerCase()) >= 0;
                    });

                    if (temp.length) {
                        $('.render .item-flag', parent).hide();
                        $('.render #no-flags', parent).remove();
                        temp.map(function (item) {
                            $('.render .item-flag[data-code="' + item.alpha2 + '"]', parent).show();
                        });
                    } else {
                        $('.render .item-flag', parent).hide();
                        if (!$('.render', parent).find('#no-flags').length) {
                            $('.render', parent).append('<span id="no-flags" style="margin: 20px 10px 10px 10px;">' + t.data('no-flags') + '</span>');
                        }
                    }
                });

                $('.render .item-flag', parent).click(function () {
                    t.val($(this).attr('data-name')).trigger('change').focus();
                    $('.flag-display', parent).html('<span><img src="' + assetURL + $(this).attr('data-code') + '.png" /></span>');
                    $('.flag-display', parent).find('span').css({'display': 'block'});
                    $('.gmz-icon-wrapper', parent).hide();
                    inputFlag.val($(this).attr('data-code'));
                    t.blur();
                });
            });
        },

        initUploadFontIcon: function(){
            var base = this;
            $(".gmz-import-font-wrapper button").on('click', (function (e) {
                e.preventDefault();

                var t = $(this),
                    form = t.closest('form'),
                    formData = new FormData(document.getElementsByClassName('gmz-form-action')[0]),
                    url = t.data('action'),
                    loading = $('.gmz-import-font-wrapper .gmz-loader', form);

                if($('#gmz-settings-page').length){
                    var data = new FormData();
                    formData = new FormData(form[0]);
                }

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

                        if (typeof respon.icons !== 'undefined' && Object.keys(respon.icons).length) {
                            var html = '';
                            for(var i = 0; i < Object.keys(respon.icons).length; i++){
                                html += '<div class="icon-wrapper" data-name="'+ Object.keys(respon.icons)[i] +'">';
                                html += '<i class="gmz-icon">'+ respon.icons[Object.keys(respon.icons)[i]] +'</i>';
                                html += '<p class="icon-delete" data-name="'+ Object.keys(respon.icons)[i] +'" data-action="'+ respon.delete_action +'">+</p>';
                                html += '</div>';
                            }
                            $('.gmz-list-font-wrapper .gmz-list-font-inner').append(html);
                        }

                        loading.hide();
                    },
                    error: function (e) {
                        loading.hide();
                    }
                });
            }));

            $('.gmz-list-font-inner').on('click', '.icon-wrapper', function(){
                var t = $(this),
                    icon = t.data('name'),
                    svg = t.find('svg').clone(),
                    wrapper = t.closest('.gmz-field-icon_picker');

                $('.input-icon', wrapper).val(icon);
                $('.icon-display [data-text]', wrapper).html(svg);
                $('.icon-display .icon-remove', wrapper).show();
                t.closest('.gmz-field-icon_picker').removeClass('focus');
            }).on('click','.icon-delete', function(e) {
                var conf = confirm('Are you want to do it?');
                if (conf) {
                    var t = $(this),
                        wrapper = t.closest('.gmz-list-font-wrapper'),
                        loading = $('.gmz-loader', wrapper),
                        iconKey = t.data('name'),
                        action = t.data('action');

                    $.ajax({
                        url: action,
                        type: "POST",
                        data: {
                            iconKey: iconKey,
                            _token: $('meta[name="csrf-token"]').attr('content')
                        },
                        beforeSend: function () {
                            loading.show();
                        },
                        success: function (respon) {
                            base.toast(respon);
                            t.closest('.icon-wrapper').remove();
                            loading.hide();
                        },
                        error: function (e) {
                            loading.hide();
                        }
                    });
                }
                return false;
            });

            $('.icon-picker-box .heading .svg-font span').on('click', function(){
                $('.icon-picker-box .heading .svg-font span').removeClass('active');
                $(this).addClass('active');
                if($(this).hasClass('b-font')){
                    $('.icon-type-font').removeClass('d-none');
                    $('.icon-type-svg').addClass('d-none');
                }else{
                    $('.icon-type-font').addClass('d-none');
                    $('.icon-type-svg').removeClass('d-none');
                }
            });
        },

        initListItems: function(){
            var base = this;
            $('.gmz-field-list_item').on('click', '.add-list-item', function(e){
                e.preventDefault();
                var t = $(this);

                $.post($(this).data('action'), {
                    id: t.data('id'),
                    fields: t.data('fields'),
                    _token: $('meta[name="csrf-token"]').attr('content')
                }, function (respon) {
                    if (respon.status) {
                        if (respon.html !== '') {
                            t.prev().append(respon.html);
                            var parentItems = t.closest('.gmz-field-list_item');
                            var allListItemWrapper = $('.gmz-field-list_item');
                            allListItemWrapper.find('[data-toggle="collapse"]').addClass('collapsed');
                            allListItemWrapper.find('.collapse').removeClass('show');
                            parentItems.find('[data-toggle="collapse"]').addClass('collapsed');
                            parentItems.find('.collapse').removeClass('show');
                            parentItems.find('.card:last-child .collapse').addClass('show');
                            parentItems.find('.card:last-child .collapsed').removeClass('collapsed');
                            $('html, body').animate({
                                scrollTop:  parentItems.find('.card:last-child').offset().top - 80
                            }, 'slow');
                            parentItems.find('.card:last-child input[type="text"]').first().focus();
                            base.initListItemField();
                            base.initFlagTranslation();
                            base.initIconPicker();
                            base.initSelect2();
                            base.initUploadFontIcon();
                            base._initUploadInputChanged();
                            base.initDatePicker();
                        }
                    }
                }, 'json');
            });

            $('.gmz-list-item').on('show.bs.collapse', function () {
                var allListItemWrapper = $('.gmz-field-list_item');
                allListItemWrapper.find('[data-toggle="collapse"]').addClass('collapsed');
                allListItemWrapper.find('.collapse').removeClass('show');
                var t = $(this);
                setTimeout(function(){
                    t.find('.collapse.show input[type="text"]').first().focus();
                }, 500);

            });
        },

        initColorPicker: function(){
            $('.gmz-color-picker').each(function () {
                var t = $(this);
                t.spectrum({
                    color: t.val(),
                    showInput: true,
                    preferredFormat: "hex",
                    clickoutFiresChange: true
                });
            });
        },

        initEditor: function(){
            var base = this;
            var toolbarOptions = {
                container: [
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],
                    ['bold', 'italic', 'underline', 'strike', 'link'],
                    ['blockquote', 'code-block', 'image', 'video'],

                    [{'list': 'ordered'}, {'list': 'bullet'}],

                    [{ 'color': [] }, { 'background': [] }],
                    [{'align': []}]
                ],
                handlers: { image: quill_img_handler }
            };

            function quill_img_handler(){
                $('.gmz-editor-media').first().trigger('click');
            }


            $('.gmz-quill-editor').each(function () {
                var t = $(this);
                base.quill[t.attr('id')] = new Quill('#' + t.attr('id'), {
                    modules: {
                        imageResize: {
                            displaySize: true
                        },
                        toolbar: toolbarOptions
                    },
                    placeholder: 'Compose an epic...',
                    theme: 'snow',  // or 'bubble'
                });

                base.quill[t.attr('id')].on('text-change', function (delta, oldDelta, source) {
                    var content = t.find('.ql-editor').html();
                    t.parent().find('.gmz-editor-content').val(content).change();
                });
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

        initUploadMedia: function () {
            var base = this;
            $(document).ready(function () {
                $('.gmz-dropzone').each(function () {
                    var form = $(this),
                        container = form.parent(),
                        previewNode = $('#gmz-dropzone-template', container);

                    previewNode.remove();
                    var gmzDropzone = new Dropzone(form.get(0), {
                        url: form.attr('action'),
                        maxFilesize: 300,
                        acceptedFiles: ".jpeg,.jpg,.png,.gif,.svg",
                        previewTemplate: '<div></div>',
                        previewsContainer: $('#previews', container).get(0),
                        clickable: true,
                        createImageThumbnails: false,
                        dictDefaultMessage: "Drop files here to upload.",
                        dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
                        dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
                        dictInvalidFileType: "You can't upload files of this type.",
                        dictResponseError: "Server responded with {{statusCode}} code.",
                        dictCancelUpload: "Cancel upload.",
                        dictUploadCanceled: "Upload canceled.",
                        dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
                        dictRemoveFile: "Remove file",
                        dictRemoveFileConfirmation: null,
                        dictMaxFilesExceeded: "You can not upload any more files.",
                        dictFileSizeUnits: {tb: "TB", gb: "GB", mb: "MB", kb: "KB", b: "b"},
                        sending: function (file, xhr, formData) {
                            formData.append('_token', $('meta[name="csrf-token"]').attr('content'));
                            form.find('.gmz-loader').show();
                        }
                    });

                    Dropzone.autoDiscover = false;

                    gmzDropzone.on('dragenter', function () {
                        form.addClass("hover");
                    });
                    gmzDropzone.on('dragleave', function () {
                        form.removeClass("hover");
                    });
                    gmzDropzone.on('drop', function () {
                        form.removeClass("hover");
                    });

                    gmzDropzone.on("success", function (file, response) {
                        if (typeof response == 'string') {
                            response = JSON.parse(response);
                        }
                        if (typeof response === 'object') {
                            base.toast(response);
                            setTimeout(function () {
                                if (response.status == 2) {
                                    if (typeof response.html !== 'undefined') {
                                        $('#gmzMediaModal .modal-body .no-media').remove();
                                        $('#gmzMediaModal .modal-body').prepend(response.html);
                                        var uploadArea = $('.gmz-media-upload-area');
                                        uploadArea.hide();
                                        $('.gmz-loader', uploadArea).hide();
                                    } else {
                                        window.location.reload();
                                    }
                                }
                            }, 1500);
                        }
                    });
                    gmzDropzone.on("queuecomplete", function () {

                    });
                    gmzDropzone.on('error', function (file, response) {
                        if (typeof response === 'string') {
                            $(file.previewElement).find('.dz-error-message').text(response);
                            base.toast({
                                status: 0,
                                message: response
                            });
                        } else {
                            base.toast(response);
                        }
                    });
                });
            });
        },

        initFilterIcon: function () {
            var base = this;
            var inputFilterSVG = $('#gmz-filter-icon');
            if (inputFilterSVG.length) {
                inputFilterSVG.keypress(function (event) {
                    if (event.which == '13') {
                        event.preventDefault();
                    }
                });

                inputFilterSVG.on('keyup', function () {
                    var t = $(this),
                        val = t.val();
                    filterSVG(val);
                });

                function filterSVG(val) {
                    var value = val.toLowerCase();
                    $('.gmz-list-font-wrapper .gmz-list-font-inner .icon-wrapper').filter(function () {
                        $(this).toggle($(this).data('name').toLowerCase().indexOf(value) > -1)
                    });
                }
            }
        },

        _getIconPageNumber: function(){
            return Math.ceil(this.allFonts.length / 200);
        },

        _changePageIcons: function(page){
            var base = this;
            var iconsHtml = '';
            base.fontCurrentPage = page;

            for (var i = (page-1) * 200; i < (page * 200); i++) {
                iconsHtml += '<div class="icon-item">';
                iconsHtml += '<i class="' + base.allFonts[i] + '"></i>';
                iconsHtml += '</div>';
            }

            base.fontRender.html(iconsHtml);
            base.fontRender.animate({ scrollTop: 0 }, "fast");

            if (page == 1) {
                $('.icon-prev-page').hide();
            } else {
                $('.icon-prev-page').show();
            }

            if (page == base._getIconPageNumber()) {
                $('.icon-next-page').hide();
            } else {
                $('.icon-next-page').show();
            }
        },

        _runProcessIcons: function(icons, categories, iconType, searchText, render, loader){
            var base = this;
            var FontIcons = icons[0];
            var IconCategories = categories[0];
            var searchTokens = {};

            function addToFinalObject(searchTerm, icon) {
                if (!Array.isArray(searchTokens[searchTerm])) {
                    searchTokens[searchTerm] = [];
                }
                searchTokens[searchTerm].push(icon);
            }

            for (const category in IconCategories) {
                if (IconCategories.hasOwnProperty(category)) {
                    IconCategories[category]["icons"].forEach(icon => {
                        addToFinalObject(category, icon);
                    });
                }
            }

            for (const icon in FontIcons) {
                if (FontIcons.hasOwnProperty(icon)) {
                    searchTokens[icon] = icon;
                    searchTokens[FontIcons[icon]["label"].toLowerCase()] = FontIcons[icon][
                        "label"
                        ]
                        .toLowerCase()
                        .split(" ")
                        .join("-");
                    FontIcons[icon]["search"]["terms"].forEach(searchTerm => {
                        addToFinalObject(searchTerm, icon);
                    });
                }
            }

            function getRegex(query) {
                let regex = query.charAt(0);
                for (let i = 1; i < query.length; i++) {
                    const character = query.charAt(i);
                    regex = `${regex}[^${character}]*${character}`;
                }
                return new RegExp(`${regex}`, "i");
            }

            function search(configObject = {
                fontStyles: ["regular", "solid", "brands", "duotone", "light"]
            }) {
                return function (searchQuery = "") {
                    const {
                        fontStyles
                    } = configObject;
                    if (!Array.isArray(fontStyles)) {
                        throw new Error("Invalid Argument passed! Expected an Array.");
                    }
                    const searchResults = new Set();
                    const regex = getRegex(searchQuery);
                    const filteredResult = Object.keys(searchTokens).filter(item =>
                        regex.test(item)
                    );

                    const addToResult = item => {
                        if (FontIcons[item] !== undefined) {
                            FontIcons[item]["styles"].forEach((style) => {
                                if (fontStyles.toString().indexOf(style) === -1) {
                                    return;
                                }
                                searchResults.add(`fa${style.charAt(0)} fa-${item}`);
                            });
                        }
                    }

                    filteredResult.forEach(item => {
                        if (Array.isArray(searchTokens[item])) {
                            searchTokens[item].forEach(itemClass => {
                                addToResult(itemClass);
                            });
                        } else {
                            addToResult(item);
                        }
                    });
                    return [...searchResults];
                }
            }

            var iconAfterFilter = [];

            if (iconType.length) {
                iconAfterFilter = search({
                    fontStyles: iconType
                })(searchText);
            } else {
                iconAfterFilter = search()(searchText);
            }

            base.allFonts = iconAfterFilter;
            base.fontRender = render;
            base._changePageIcons( 1);
            loader.hide();
        },

        _initIconFilter: function(t){
            var base = this,
                loader = $('.gmz-loader', t),
                render = $('.render', t),
                searchText = $('[name="icon_search"]', t).val().trim(),
                iconType = [];

            loader.show();

            $('[name="icon_type[]"]', t).each(function(){
                if($(this).is(':checked')){
                    iconType.push($(this).val());
                }
            });

            //Icon Initialize
            if(base.fontIcons.length && base.fontCategories.length){
                var icons = base.fontIcons;
                var categories = base.fontCategories;
                base._runProcessIcons(icons, categories, iconType, searchText, render, loader);
            }else {
                var iconJSON = t.data('json-icon');
                var cateJSON = t.data('json-category');
                $.when(
                    $.getJSON(iconJSON),
                    $.getJSON(cateJSON)
                ).done(function (icons, categories) {
                    base.fontIcons = icons;
                    base.fontCategories = categories;
                    base._runProcessIcons(icons, categories, iconType, searchText, render, loader);
                });
            }
            //End Icon Initialize
        },

        initIconPicker: function () {
            var base = this;
            $('.gmz-field-icon_picker').each(function () {
                var t = $(this),
                    input = $('>input', t),
                    inputFilterIcon = $('.icon-search input', t);

                if (inputFilterIcon.length) {
                    inputFilterIcon.keypress(function (event) {
                        if (event.which == '13') {
                            event.preventDefault();
                        }
                    });

                    inputFilterIcon.on('keyup', function () {
                        base._initIconFilter(t);
                    });
                }

                input.click(function () {
                    t.addClass('focus');
                    base._initIconFilter(t);
                });

                $('.icon-picker-box .icon-close').click(function(){
                    t.removeClass('focus');
                });

                $('[name="icon_type[]"]', t).change(function(){
                    base._initIconFilter(t);
                });

                t.on('click', '.icon-item', function () {
                    t.find('>input.form-control[type="text"]').val($(this).find('i').attr('class'));
                    t.find('.icon-display span[data-text]').html($(this).find('i'));
                    t.find('.icon-remove').show();
                    t.removeClass('focus');
                });

                t.on('click', '.icon-remove', function () {
                    $(this).hide();
                    $('.input-icon', t).val('');
                    $('[data-text]', t).html($('[data-text]', t).data('text'));
                });

                t.on('click', '.icon-next-page', function(){
                    if (base.fontCurrentPage < base._getIconPageNumber()) {
                        var nextPage = parseInt(base.fontCurrentPage) + 1;
                        base._changePageIcons(nextPage);
                    }
                });

                t.on('click', '.icon-prev-page', function(){
                    if (base.fontCurrentPage > 1) {
                        var prevPage = parseInt(base.fontCurrentPage) - 1;
                        base._changePageIcons(prevPage);
                    }
                });
            });
        },

        initListMedia: function () {
            var base = this;
            $('.gmz-all-media').each(function () {
                var t = $(this),
                    form = $('form.form-all-media', t),
                    url = form.attr('action'),
                    loading = $('.gmz-loader', t);

                form.submit(function (ev) {
                    ev.preventDefault();
                    var data = form.serializeArray();
                    data.push({
                        name: '_token',
                        value: $('meta[name="csrf-token"]').attr('content')
                    });
                    loading.show();
                    $.post(url, data, function (respon) {
                        if (typeof respon === 'object') {
                            if (respon.status === 0) {
                                base.toast(respon);
                            }
                            if (respon.html !== '') {
                                $('.gmz-all-media-render .render', t).append(respon.html);
                            }
                        }
                        loading.hide();
                    }, 'json');
                });
                form.submit();
            });

            var mediaModal = $('#gmzMediaModal');
            mediaModal.on('hide.bs.modal', function (e) {
                $('.gmz-istarget').removeClass('gmz-istarget');
            });
            mediaModal.on('show.bs.modal', function (e) {
                var target = $(e.relatedTarget),
                    t = $(this),
                    loading = $('.gmz-loader', t);

                target.addClass('gmz-istarget');

                var data = {
                    attachment_id: target.attr('data-attachment-id'),
                    _token: $('meta[name="csrf-token"]').attr('content'),
                    page: 1
                };
                $('.modal-body', t).empty();
                loading.show();
                $.post(target.attr('data-url'), data, function (respon) {
                    if (typeof respon === 'object') {
                        if (respon.status === 0) {
                            base.toast(respon);
                        }
                        if(respon.html) {
                            $('.modal-body .no-media', t).remove();
                            $('.modal-body', t).html(respon.html);
                        }else if(respon.message){
                            $('.modal-body', t).html('<p class="no-media text-center font-weight-bold mt-3">'+ respon.message + '</p>');
                        }
                    }
                    loading.hide();
                }, 'json');

                var btnSelect = '#gmzMediaModal .btn-select';
                var btnDelete = '#gmzMediaModal .btn-delete';
                $(btnSelect).hide();
                $(btnDelete).hide();

                var xhrScroll = null;

                $('.gmz-media-modal .modal-body').on('scroll', function () {
                    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 50) {
                        var me = $(this),
                            lastItem = me.find('li').last(),
                            totalPage = lastItem.data('total'),
                            currentPage = lastItem.data('page');
                        if (currentPage < totalPage) {
                            currentPage++;
                            var nextPage = currentPage;
                            loading.show();
                            data.page = nextPage;
                            if (xhrScroll !== null) {
                                return false;
                            }
                            xhrScroll = $.post(target.attr('data-url'), data, function (respon) {
                                if (typeof respon === 'object') {
                                    if (respon.status === 0) {
                                        base.toast(respon);
                                    }
                                    $('.modal-body', t).append(respon.html);
                                    xhrScroll = null;
                                }
                                loading.hide();
                            }, 'json');
                        }
                    }
                });
            });

            var mediaItem = '#gmzMediaModal .gmz-media-item';
            var btnSelect = '#gmzMediaModal .btn-select';
            var btnDelete = '#gmzMediaModal .btn-delete';
            var isTarget = '.gmz-istarget';

            $(document).on('click', mediaItem, function () {
                var is_multi = $(isTarget).data('multi');
                if (is_multi === undefined) {
                    $(mediaItem).removeClass('selected');
                    $(this).addClass('selected');
                } else {
                    $(this).toggleClass('selected');
                }
                if ($(mediaItem + '.selected').length) {
                    $(btnSelect).show();
                    $(btnDelete).show();
                } else {
                    $(btnSelect).hide();
                    $(btnDelete).hide();
                }
            });

            $(document).on('click', btnSelect, function () {
                if ($(mediaItem + '.selected').length) {
                    var inEditor = false;
                    if($(isTarget).hasClass('gmz-editor-media')){
                        inEditor = true;
                    }
                    var is_multi = $(isTarget).data('multi');
                    var mediaWrapper = $('.gmz-istarget').closest('.media-wrapper');
                    mediaWrapper.addClass('has-media');
                    if (is_multi === undefined) {
                        var mediaID = $(mediaItem + '.selected').find('.link').data('media-id'),
                            mediaURL = $(mediaItem + '.selected').find('.link').data('media-url');
                        $('.thumbnail', mediaWrapper).find('img').remove();
                        $('.thumbnail', mediaWrapper).append('<img src="' + mediaURL + '" />');
                        $('input[type="hidden"]', mediaWrapper).val(mediaID).change();
                    } else {
                        $('.thumbnail', mediaWrapper).find('img').remove();
                        $('.thumbnail.appended', mediaWrapper).remove();

                        var ids = [];
                        var imageEditor = [];
                        $(mediaItem + '.selected').each(function (index) {
                            var mediaID = $(this).find('.link').data('media-id'),
                                mediaURL = $(this).find('.link').data('media-url');

                            if(inEditor){
                                var mediaURLFull = mediaURL.replace('-120x120', '');
                                imageEditor.push(mediaURLFull);
                            }
                            if (index === 0) {
                                $('.thumbnail', mediaWrapper).append('<img src="' + mediaURL + '" />');
                                $('.thumbnail', mediaWrapper).attr('data-id', mediaID);
                            } else {
                                var te = '<div class="thumbnail appended" data-id="' + mediaID + '"><img src="' + mediaURL + '" /></div>';
                                $(te).insertAfter($('.thumbnail', mediaWrapper).last());
                            }
                            ids.push(mediaID);
                        });

                        $('input[type="hidden"]', mediaWrapper).val(ids.toString()).change();

                        if(inEditor){
                            if($('.gmz-language-action ').length > 0){
                                var editorField = $(isTarget).next('.gmz-field-editor');
                                var activeLanguage = $('.gmz-language-action .item.active', editorField).data('code');
                                var range = base.quill['gmz-field-' + $(isTarget).data('name') + '_' + activeLanguage].getSelection(true);
                                if(imageEditor.length){
                                    for(var i = 0; i < imageEditor.length; i++){
                                        base.quill['gmz-field-' + $(isTarget).data('name') + '_' + activeLanguage].insertEmbed(range.index, 'image', imageEditor[i]);
                                    }
                                }
                            }else{
                                var range = base.quill['gmz-field-' + $(isTarget).data('name')].getSelection(true);
                                if(imageEditor.length){
                                    for(var i = 0; i < imageEditor.length; i++){
                                        base.quill['gmz-field-' + $(isTarget).data('name')].insertEmbed(range.index, 'image', imageEditor[i]);
                                    }
                                }
                            }
                        }
                    }

                    $(mediaItem).removeClass('selected');
                    base.initSortGallery();
                }
                mediaModal.modal('hide');
            });

            $(document).on('click', btnDelete, function () {
                var tdel = $(this);
                if ($(mediaItem + '.selected').length) {
                    var conf = confirm(gmz_params.i18n.confirmText);
                    if (conf) {
                        var is_multi = $(isTarget).data('multi');
                        var mediaIDs = [];
                        $(mediaItem + '.selected').each(function (index) {
                            mediaIDs.push($(this).find('.link').data('media-id'));
                        });
                        if (mediaIDs.length) {
                            var delModal = tdel.closest('.gmz-media-modal'),
                                loading = $('.gmz-loader', delModal);

                            var data = {
                                mediaIDs: mediaIDs.join(','),
                                _token: $('meta[name="csrf-token"]').attr('content'),
                            };

                            loading.show();

                            $.post(tdel.attr('data-url'), data, function (respon) {
                                if (typeof respon === 'object') {
                                    base.toast(respon);
                                    if (respon.status) {
                                        $(mediaItem + '.selected').parent().remove();
                                    }
                                }
                                loading.hide();
                            }, 'json');
                        }
                    }
                }
            });

            $('.gmz-media-modal .btn-addnew').unbind('click');
            $(document).on('click', '.gmz-media-modal .btn-addnew', function () {
                var tadd = $(this),
                    modalHeader = tadd.closest('.modal-header');

                $('.gmz-media-upload-area', modalHeader).slideToggle();
            });

            $(document).on('dblclick', mediaItem, function () {
                var is_multi = $(isTarget).data('multi');
                if (is_multi === undefined) {
                    $(btnSelect).trigger('click');
                }
            });

            $(document).on('click', '.gmz-field-image .btn-remove', function (e) {
                e.preventDefault();
                var mediaWrapper = $(this).closest('.media-wrapper');
                mediaWrapper.removeClass('has-media');
                $('.thumbnail', mediaWrapper).find('img').remove();
                $('input[type="hidden"]', mediaWrapper).val('').change();
            });

            $(document).on('click', '.gmz-field-gallery .btn-remove', function (e) {
                e.preventDefault();
                var mediaWrapper = $(this).closest('.media-wrapper');
                mediaWrapper.removeClass('has-media');
                $('.thumbnail', mediaWrapper).find('img').remove();
                $('.thumbnail.appended', mediaWrapper).remove();
                $('input[type="hidden"]', mediaWrapper).val('').change();
            });
        },

        initSelect2: function(){
            $('[data-plugin="select2"]').each(function () {
                var args = {};
                if(typeof $(this).data('placeholder')){
                    args = {placeholder: $(this).data('placeholder')};
                }
                $(this).select2(args);
            });
        },

        initTab: function(){
            if($('.nav-pills').length){
                var hash = location.hash.replace(/^#/, '');
                if (hash) {
                    $('.nav-pills a[data-target="' + hash + '"]').tab('show');
                }

                $('.nav-pills a').on('shown.bs.tab', function (e) {
                    window.location.hash = '#' + $(e.target).attr('data-target');
                });
            }
        },

        initCustomCSS: function(){
            $('[data-plugin="acejs"]').each(function () {
                var editor = ace.edit($(this).attr('id'));
                editor.setTheme("ace/theme/monokai");
                editor.session.setMode("ace/mode/css");
                let parent = $(this).closest('.form-group');
                let input = $('input', parent);
                let value = $(this).data('value');
                if (typeof value != 'undefined') {
                    editor.session.setValue(value);
                }
                editor.on("change", function () {
                    let code = editor.getValue();
                    input.val(JSON.stringify(code));
                });

            });
        },

        initDatePicker: function(){
          $('[data-plugin="date-picker"]').each(function(){
             var t = $(this),
                 options;
             if(t.data('only-time') === 1){
                 var defaultDate = t.data('default-date');
                 options = {
                     enableTime: true,
                     noCalendar: true,
                     dateFormat: "H:i",
                     defaultDate: defaultDate,
                     minuteIncrement: 15,
                     time_24hr: true,
                     onChange: function (dstr, dobjs, fp) {

                             const d = fp.latestSelectedDateObj;
                             const mins = d.getMinutes();
                             if (mins % 15)
                                 d.setMinutes(15*Math.ceil(d.getMinutes() / 15));
                             fp.setDate(d, false);
                             t.attr("data-default-date", t.val());
                     }
                 };
             }else {
                 options = {dateFormat: 'Y-m-d'};
             }
             t.flatpickr(options);
          });
        },

        initMultiLanguages: function () {
            var divLangAction = $('.gmz-language-action');
            if(divLangAction.length) {
                $('.item', divLangAction).unbind();
                $('.item', divLangAction).on('click', function(){
                    $(this).closest('.gmz-language-action').find('.item').removeClass('active');
                    $(this).addClass('active');
                    var code = $(this).data('code');
                    var fieldWrapper = $(this).closest('.gmz-field');

                    $('[data-lang]', fieldWrapper).addClass('hidden');
                    $('[data-lang="' + code + '"]', fieldWrapper).removeClass('hidden');
                });
            }
        },

        initFlagTranslation: function(){
            var base = this;
            var fieldTranslation = $('.gmz-field-has-translation');
            if(fieldTranslation.length){
                fieldTranslation.each(function(){
                    var t = $(this);
                    if(t.find('.gmz-language-action ').length <= 0) {
                        $('#gmz-language-action').clone().show().insertAfter(t.find('label'));
                        base.initMultiLanguages();
                    }
                })
            }
        },

        initSortGallery: function(){
            $('.gmz-field-gallery').each(function() {
                var fieldGallery = $(this);
                $('.media-wrapper.has-media', fieldGallery).sortable({
                    update: function (event, ui) {
                        var ids = [];
                        $('.media-wrapper .thumbnail', fieldGallery).each(function (i, item) {
                            ids.push($(item).attr('data-id'));
                        });
                        $('.media-wrapper input[type="hidden"]', fieldGallery).val(ids.join(',')).change();
                    }
                });
            });
        },

        initListItemField: function(){
            $('.gmz-field-list_item').each(function(){
                var t = $(this),
                    bindingField = t.data('binding');
                t.on('input', '.gmz-field input[id^="'+ bindingField +'"]', function(){
                    $(this).closest('.card').find('.card-header .item-title').text($(this).val());
                });
            });

            if ($('.gmz-list-item.sortable').length) {
                var options1 = {
                    handle: 'div',
                    items: 'div.card',
                    listType: 'div',
                    toleranceElement: '> div'
                };
                if ($('body').hasClass("is-rtl")) {
                    options1.rtl = true;
                }

                $('.gmz-list-item.sortable').nestedSortable(options1);
            }
        },

        initFieldConditionEvent: function(){
            var base = this;
            $(document).ready(function() {
                $(document).on('change keyup', '.gmz-field [id^="gmz-field-"]', function(){
                    base.initFieldCondition();
                });
                base.initFieldCondition();
            });
        },

        initFieldCondition: function(){
            $('[data-condition]').each(function(){
                var t = $(this),
                    condition = t.data('condition');

                var conditionArr = condition.split(':');
                if(conditionArr.length > 0){
                    var fieldName = conditionArr[0],
                        fieldValue = conditionArr[1],
                        fieldEl = $('#gmz-field-' + fieldName),
                        fieldTag = fieldEl.prop('tagName');

                    var check = false;
                    if(fieldTag === "INPUT"){
                        var fieldType = fieldEl.attr('type');
                        if(fieldType === 'checkbox'){
                            if(fieldEl.val() === fieldValue){
                                if(fieldEl.is(':checked')){
                                    check = true;
                                }else{
                                    check = false;
                                }
                            }else{
                                if(fieldEl.is(':checked')){
                                    check = false;
                                }else{
                                    check = true;
                                }
                            }
                        }
                    }else if(fieldTag === "SELECT"){
                        if(fieldEl.val() === fieldValue){
                            check = true;
                        }else{
                            check = false;
                        }
                    }

                    if(check){
                        t.animate({opacity: 'show', height: 'show'}, 200);
                    }else{
                        t.animate({opacity: 'hide', height: 'hide'}, 200);
                    }
                }
            });
        },

        _initUploadInputChanged: function(){
            var importFontElWrapper = $('.gmz-import-font-wrapper');
            importFontElWrapper.on('change', 'input[type="file"]', function(){
                var t = $(this),
                    h3El = t.parent().find('h3'),
                    h3Origin = h3El.data('text-origin'),
                    h3Uploaded = h3El.data('text-uploaded');

                $('.form-message', importFontElWrapper).empty();
                if (t.val() !== '') {
                    var filePath = t.val();
                    filePath = filePath.split('\\');
                    var fileName = filePath[filePath.length - 1];
                    importFontElWrapper.addClass('uploaded');
                    h3El.text(h3Uploaded.replace('#_#', fileName));
                } else {
                    importFontElWrapper.removeClass('uploaded');
                    h3El.text(h3Origin);
                }
            });
        },

        initDocumentReady: function(){
            var base = this;
            $(document).ready(function(){
                if($('.gmz-form-wizard-wrapper').length <= 0) {
                    base.initMapbox();
                    base.initCustomCSS();
                    base.initTab();
                }

                base._initUploadInputChanged();
                base.initListItems();
                base.initEditor();

                $(document).on('click', '.gmz-list-item .delete-item', function (e) {
                    var conf = confirm('Are you sure want to delete it?');
                    if (conf) {
                        $(this.closest('.card')).remove();
                    }
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
        },

        initMapbox: function () {
            var base = this;
            if (typeof mapboxgl == 'object' && gmz_params.mapbox_token !== '') {
                mapboxgl.accessToken = gmz_params.mapbox_token;
                $('[data-plugin="mapbox-geocoder"]').each(function () {
                    var t = $(this),
                        container = t.closest('.gmz-field-location'),
                        mapbox = $('.mapbox-content', container),
                        zoom = parseInt($('.gmz-zoom', container).val()),
                        lat = parseFloat($('.gmz-lat', container).val()),
                        lng = parseFloat($('.gmz-lng', container).val()),
                        markers = [];

                    var geocoder = new MapboxGeocoder({
                        accessToken: mapboxgl.accessToken,
                        mapboxgl: mapboxgl,
                        language: t.data('lang'),
                        placeholder: t.data().placeholder
                    });

                    var map = new mapboxgl.Map({
                            style: 'mapbox://styles/mapbox/light-v10',
                            container: mapbox.get(0),
                            center: [lng, lat],
                            zoom: zoom,
                        });

                    map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'bottom-right');
                    //scroll zoom with ctrl
                    map.scrollZoom.disable();
                    map.scrollZoom.setWheelZoomRate(0.02); // Default 1/450
                    map.on("wheel", event => {
                        if (event.originalEvent.ctrlKey) { // Check if CTRL key is pressed
                            event.originalEvent.preventDefault(); // Prevent chrome/firefox default behavior
                            if (!map.scrollZoom._enabled) map.scrollZoom.enable(); // Enable zoom only if it's disabled
                        } else {
                            if (map.scrollZoom._enabled) map.scrollZoom.disable(); // Disable zoom only if it's enabled
                        }
                    });
                    // disable map rotation using right click + drag
                    map.dragRotate.disable();
                    // disable map rotation using touch rotation gesture
                    map.touchZoomRotate.disableRotation();

                    // Add geolocate control to the map.
                    map.addControl(
                        new mapboxgl.GeolocateControl({
                            positionOptions: {
                                enableHighAccuracy: true
                            },
                            trackUserLocation: true
                        }), 'bottom-right'
                    );

                    var el = document.createElement('div');
                    el.className = 'gmz-marker';

                    var marker = new mapboxgl.Marker(el, {
                        offset: {
                            x: 0,
                            y: -8
                        },
                    })
                        .setLngLat([lng, lat])
                        .addTo(map);

                    markers.push(marker);

                    if ($('.mapboxgl-ctrl-geocoder--input', t).length === 0) {
                        t.get(0).appendChild(geocoder.onAdd(map));
                    }

                    map.on('load', function () {
                        container.on('keyup', '.mapboxgl-ctrl-geocoder--input', function () {
                            $('.gmz-address', container).attr('value', $(this).val()).trigger('change');
                        });
                        geocoder.on('result', function (ev) {
                            var result = ev.result;
                            if (typeof result.context == 'object') {
                                $.each(result.context, function (index, geo) {
                                    $('.gmz-country', container).attr('value', '').trigger('change');
                                    $('.gmz-city', container).attr('value', '').trigger('change');
                                    $('.gmz-state', container).attr('value', '').trigger('change');
                                    $('.gmz-postcode', container).attr('value', '').trigger('change');
                                    if (geo.id.indexOf('country') !== -1) {
                                        $('.gmz-country', container).attr('value', geo.text).trigger('change');
                                    }
                                    if (geo.id.indexOf('region') !== -1) {
                                        $('.gmz-city', container).attr('value', geo.text).trigger('change');
                                        $('.gmz-state', container).attr('value', geo.text).trigger('change');
                                    }
                                    if (geo.id.indexOf('postcode') !== -1) {
                                        $('.gmz-postcode', container).attr('value', geo.text).trigger('change');
                                    }
                                });
                            }
                            if (result.place_name) {
                                $('.gmz-address', container).attr('value', result.place_name).trigger('change');
                            }
                            if (typeof result.geometry.coordinates == 'object') {
                                $('.gmz-lat', container).attr('value', result.geometry.coordinates[1]).trigger('change');
                                $('.gmz-lng', container).attr('value', result.geometry.coordinates[0]).trigger('change');
                                if (typeof markers == 'object') {
                                    $.each(markers, function (index, marker) {
                                        marker.remove();
                                    });
                                    markers = [];
                                }
                                var marker = new mapboxgl.Marker(el, {
                                    offset: {
                                        x: 0,
                                        y: -8
                                    }
                                })
                                    .setLngLat([result.geometry.coordinates[0], result.geometry.coordinates[1]])
                                    .addTo(map);
                                markers.push(marker);
                                map.flyTo({center: [result.geometry.coordinates[0], result.geometry.coordinates[1]]});
                            }
                        });

                        var oldVal = t.data().value;
                        if (typeof oldVal === 'string') {
                            if(typeof geocoder !== 'undefined') {
                                geocoder.setInput(oldVal);
                            }
                        }
                    });

                    map.on('click', function (e) {
                        var location = e.lngLat;
                        if (typeof location == 'object') {
                            $('.gmz-lat', container).attr('value', location.lat).trigger('change');
                            $('.gmz-lng', container).attr('value', location.lng).trigger('change');

                            if (typeof markers == 'object') {
                                $.each(markers, function (index, marker) {
                                    marker.remove();
                                });
                                markers = [];
                            }
                            var marker = new mapboxgl.Marker(el, {
                                offset: {
                                    x: 0,
                                    y: -8
                                }
                            })
                                .setLngLat([location.lng, location.lat])
                                .addTo(map);
                            markers.push(marker);

                        }
                    });

                    map.on('moveend', function (ev) {
                        $('.gmz-zoom', container).attr('value', ev.target.getZoom()).trigger('change');
                    });

                    $('body').on('gmz_dashboard_submit_tab', function (ev) {
                        setTimeout(function () {
                            if (map) {
                                map.resize();
                            }
                        }, 500);
                    });
                });
            }

        }
    };

    window.GmzOption.init();
})(jQuery);