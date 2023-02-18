(function ($) {
    'use strict';

    Object.size = function (obj) {
        return Object.keys(obj).length;
    };

    window.GmzTable = {
        init: function () {
            this.initSetActiveMenuPostType();
            this.initChangeStatusAction();
            this.initWithdrawalFormRequest();
            this.initModalWithdrawal();
        },
        getUrlVars: function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
        initSetActiveMenuPostType: function () {
            var menu = $("#menu_post_type");
            var postType = menu.data("active");
            menu.find("#post_type_" + postType).addClass("text-primary font-weight-bold");
        },

        initChangeStatusAction: function () {
            var base = this,
                btnChangeStatus = $('.btnChangeStatus'),
                currentStatus,
                statusOrder,
                currentPaymentType,
                status;

            $('.table').on('click', '.btnChangeStatus' , function () {
                var t = $(this),
                    isConfirm = t.data('confirm');
                //if show popup confirm
                if (isConfirm === 1) {
                    swal({
                        title: t.data('confirm-title'),
                        text: t.data('confirm-text'),
                        showCancelButton: true,
                        confirmButtonText: t.data('confirm-button'),
                        confirmButtonClass: 'button-danger',
                        padding: '2em'
                    }).then(function (result) {
                        if (result.value) {
                            base.updateStatus(t);
                        }
                    })
                } else {
                    //if not show popup confirm
                    base.updateStatus(t);
                }
            });
        },

        updateStatus: function (t) {
            // t is button has just been pressed
            var base = this,
                action = t.data('action'),
                params = t.data('params'),
                newStatus = t.data('change-status'),
                isConfirm = t.data('confirm');

            $.post(action, {
                status: newStatus,
                params: params,
                _token: $('meta[name="csrf-token"]').attr('content')

            }).done(function (data, status) {
                if (data.status === 1) {
                    var listStatus = data.listStatus,
                        btnAction = t.data('action'),
                        btnParams = t.data('params'),
                        parentBox = t.closest('.dropdown-menu');

                    t.closest('tr').find('.order-status').html(data.statusHtml);
                    parentBox.find('.btnChangeStatus').remove();
                    Object.entries(listStatus).forEach(([key, val]) => {
                        parentBox.prepend('<a class="dropdown-item btnChangeStatus" href="javascript:void(0);" data-action="'+ btnAction +'" data-params="'+ btnParams +'" data-change-status="'+ key +'">'+ val +'</a>');
                    });

                    Swal.fire({
                        type: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 1000
                    });
                } else {
                    console.log(data.message);
                    swal(data.message, '', 'error');
                }
            }).fail(function (data, status) {
                swal('Request failed', '', 'error');
            });
        },

        initWithdrawalFormRequest: function () {
            var base = this;
            $("#btnWithdrawal").on("click", function () {
                var t = $(this),
                    action = t.data('action'),
                    balance = t.data('balance'),
                    title = t.data('title'),
                    desc = t.data('desc');
                swal({
                    title: title,
                    text: desc,
                    input: 'number',
                    inputValue: balance,
                    inputAttributes: {
                        min: 0,
                        max: balance,
                        required: true,
                    },
                    confirmButtonText: 'Submit',
                    showCancelButton: true,
                    padding: '2em',
                }).then(function (result) {
                    if (result.value) {
                        if (result.value <= balance) {
                            $.post(action, {
                                withdrawal: result.value,
                                _token: $('meta[name="csrf-token"]').attr('content')
                            }).done(function (data, status) {
                                var message = (!data.message)? 'Error!' : data.message;
                                var dataStatus = data.status;
                                console.log(dataStatus);
                                swal({
                                    text: message,
                                    type: data.status,
                                    onClose: function () {
                                        if(dataStatus === 'success'){
                                            location.reload();
                                        }
                                    }
                                });
                            }).fail(function () {
                                swal('Error! Connection failed', '', 'warning');
                            });
                        } else if (result.value > balance) {
                            swal('', 'You have entered more than the maximum amount you can withdraw', 'error');
                        }
                    }else {
                        swal('', 'The amount you entered is incorrect', 'error');
                    }
                })
            })
        },

        initModalWithdrawal: function () {
            $(".table").on("click", ".gmzModalWithdrawal" , function () {
                var t = $(this);
                $.ajax({
                    method: "get",
                    url: t.data('action'),
                    data: {
                        id: t.data('params'),
                    }
                }).done(function (data, status) {
                    $("#gmzWithdrawalDetailModal .modal-body").html(data);
                });
            })
        }
    };

    window.GmzTable.init();
})(jQuery);