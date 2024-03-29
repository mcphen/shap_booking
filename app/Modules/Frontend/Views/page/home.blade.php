@extends('Frontend::layouts.master')

@section('title', __('Home Page'))

@php
    enqueue_styles([
        'slick',
        'daterangepicker'
    ]);
    enqueue_scripts([
        'slick',
        'moment',
        'daterangepicker'
    ]);
@endphp
@section('content')
    @include('Frontend::page.home.slider')
    @action('gmz_homepage_after_slider')



    @include('Frontend::services.hotel.items.recent')

    @include('Frontend::services.apartment.items.recent')


    @include('Frontend::services.tour.items.recent')

    @include('Frontend::services.space.items.recent')

    @include('Frontend::page.home.destination')

@stop

