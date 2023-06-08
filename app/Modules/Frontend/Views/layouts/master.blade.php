<!DOCTYPE html>
<html lang="{{get_current_language()}}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @php
        $favicon = get_favicon();
        if($favicon)
            echo '<link rel="shortcut icon" type="image/png" href="'. $favicon .'"/>';
    @endphp


    @php
        $page_title = seo_page_title();
        if($page_title){
            $title_tag =  $page_title;
        }else{
            $site_name = get_translate(get_option('site_name', 'iBooking'));
            $seo_separator_title = get_seo_title_separator();
            $title_tag = $site_name . ' ' . $seo_separator_title;
        }
    @endphp<title>@php echo $title_tag @endphp @yield('title')</title>

    {!! seo_meta(); !!}
    @php init_header(); @endphp
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" integrity="sha512-tS3S5qG0BlhnQROyJXvNjeEM4UpMXHrQfTGmbQ1gKmelCxlSEBUaxhRBj/EFTzpbP4RVSrpEikbmdJobCvhE3g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css" integrity="sha512-sMXtMNL1zRzolHYKEujM2AqCLUR9F2C4/05cdbxjjLSRvMQIciEPCQZo++nk7go3BtSuK9kfa/s+a4f4i5pLkw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body class="body @yield('class_body') {{rtl_class()}}">
@include('Frontend::components.admin-bar')
@include('Frontend::components.top-bar-1')
@include('Frontend::components.header')
<div class="site-content">
    @yield('content')
</div>
@include('Frontend::components.footer')
@php init_footer(); @endphp
<script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js" integrity="sha512-bPs7Ae6pVvhOSiIcyUClR7/q2OAsRiovw4vAkX+zJbw3ShAeeqezq50RIIcIURq7Oa20rW2n2q+fyXBNcU9lrw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
    $(document).ready(function(){
        $('.owl-carousel').owlCarousel({
            loop:true,
            margin:20,
            responsiveClass:true,

            responsive:{
                0:{
                    items:1,
                    nav:true
                },
                600:{
                    items:3,
                    nav:false
                },
                1000:{
                    items:3,
                    nav:true,
                    loop:false
                }
            }
        })
    });
</script>
</body>
</html>
