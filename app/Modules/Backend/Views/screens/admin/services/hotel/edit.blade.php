@extends('Backend::layouts.master')

@section('title', $title)

@php
    admin_enqueue_styles('gmz-steps');
    admin_enqueue_scripts('gmz-steps');
    admin_enqueue_styles('gmz-custom-tab');
@endphp

@section('content')

    <div class="layout-top-spacing">
        <div class="statbox widget box box-shadow">

            <div class="widget-header">
                <div class="row">
                    <div class="col-xl-12 col-md-12 col-sm-12 col-12">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <h4 class="mb-0">{{$title}}</h4>
                                @if(!$new)
                                    @php
                                        if($serviceData['status'] == 'pending'){
                                            $class_status = 'text-warning';
                                        }elseif($serviceData['status'] == 'draft'){
                                            $class_status = 'text-danger';
                                        }else{
                                            $class_status = 'text-success';
                                        }
                                    @endphp
                                    <p class="mb-0 {{$class_status}} ml-1">({{ucfirst($serviceData['status'])}})</p>
                                @endif
                            </div>
                            <div>
                                <a href="{{dashboard_url('all-rooms?hotel_id='. $serviceData['id'])}}" class="btn btn-warning btn-sm">{{__('Manage Rooms')}}</a>
                                <a href="{{get_hotel_permalink($serviceData['post_slug'])}}" id="post-preview" class="btn btn-primary btn-sm" target="_blank">{{__('Preview')}}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            @php
                $settings = admin_config('settings', GMZ_SERVICE_HOTEL);
                $settings[2]['fields'][] = ['id'=>"price_one_hour",'label'=>"Prix pour une heure",'type'=>"number",'layout'=>"col-lg-4 col-md-6 col-sm-6 col-12",'std'=>"",'break'=>true];
                //$settings[2]['fields'][]= ['id'=>"price_two_hour",'label'=>"Prix pour deux heures",'type'=>"number",'layout'=>"col-lg-4 col-md-6 col-sm-6 col-12",'std'=>"",'break'=>true];
                //$settings[2]['fields'][] = ['id'=>"price_three_hour",'label'=>"Prix pour trois heures",'type'=>"number",'layout'=>"col-lg-4 col-md-6 col-sm-6 col-12",'std'=>"",'break'=>true];
                //$settings[2]['fields'][] = ['id'=>"price_four_hour",'label'=>"Prix pour quatres heures",'type'=>"number",'layout'=>"col-lg-4 col-md-6 col-sm-6 col-12",'std'=>"",'break'=>true];
               // $settings[2]['fields'][] = ['id'=>"price_five_hour",'label'=>"Prix pour cinq heures",'type'=>"number",'layout'=>"col-lg-4 col-md-6 col-sm-6 col-12",'std'=>"",'break'=>true];
                //dd($settings[2]);
                $action = dashboard_url('save-hotel');
            @endphp

            @include('Backend::settings.meta')

        </div>
        @php
            $post_type = GMZ_SERVICE_HOTEL;
        @endphp
        @include('Backend::screens.admin.seo.components.append')
    </div>
@stop