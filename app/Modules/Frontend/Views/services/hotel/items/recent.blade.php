@if(is_enable_service(GMZ_SERVICE_HOTEL))
    @php
        enqueue_scripts('match-height');
        $list_hotels = get_posts([
            'post_type' => GMZ_SERVICE_HOTEL,
            'posts_per_page' => 3,
            'status' => 'publish'
        ]);
        $search_url = url('hotel-search');
    @endphp
    @if(!$list_hotels->isEmpty())
        <section class="list-hotel list-hotel--grid py-40 bg-gray-100">
            <div class="container">
                <h2 class="section-title mb-20">{{__('List Of Hotels')}}</h2>
                <div class="d-none d-sm-block">
                    <div class="row">
                        @foreach($list_hotels as $item)
                            <div class="col-lg-4 col-md-4 col-sm-12">
                                @include('Frontend::services.hotel.items.grid-item')
                            </div>
                        @endforeach
                    </div>
                </div>
                <div class="d-xl-none">
                    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                        <ol class="carousel-indicators">
                            <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                        </ol>
                        <div class="carousel-inner">
                            @foreach($list_hotels as $item)
                                @if ($loop->first)
                                    <div class="carousel-item active">
                                        @include('Frontend::services.hotel.items.grid-item')
                                    </div>
                                @endif
                                <div class="carousel-item">
                                    @include('Frontend::services.hotel.items.grid-item')
                                </div>
                            @endforeach
                        </div>
                        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>
                </div>

            </div>
        </section>
    @endif
@endif