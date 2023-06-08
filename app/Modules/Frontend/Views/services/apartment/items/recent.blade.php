@if(is_enable_service(GMZ_SERVICE_APARTMENT))
    @php
        enqueue_scripts('match-height');
        $list_apartments = get_posts([
            'post_type' => GMZ_SERVICE_APARTMENT,
            'posts_per_page' => 6,
            'status' => 'publish',
            'is_featured' => 'on'
        ]);
        $search_url = url('apartment-search');
    @endphp
    @if(!$list_apartments->isEmpty())
        <section class="list-apartment list-apartment--grid py-40 bg-gray-100">
            <div class="container">
                <h2 class="section-title mb-20">{{__('List Of Apartments')}}</h2>
                <div class="d-none d-sm-block">
                    <div class="row">
                        <div class="owl-carousel">
                            @foreach($list_apartments as $item)
                                <div class="">
                                    @include('Frontend::services.apartment.items.grid-item')
                                </div>
                            @endforeach
                        </div>
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
                            @foreach($list_apartments as $item)
                                @if ($loop->first)
                                    <div class="carousel-item active">
                                        @include('Frontend::services.apartment.items.grid-item')
                                    </div>
                                @endif
                                <div class="carousel-item">
                                    @include('Frontend::services.apartment.items.grid-item')
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