<div class="widget-content widget-content-area">
    <div id="circle-basic" class="gmz-form-wizard-wrapper" data-plugin="wizard-circle">
        @include('Backend::components.loader')
        @if(!empty($settings))
            @foreach($settings as $key => $val)
                <h3>{{__($val['label'])}}</h3>
                <section class="mt-4">
                    @php


                        /*if($val['id']=="pricing_settings"){
                          //  echo "pricing";
                         //   $val['fields'][] = ['id'=>"price_one_hour",'label'=>"Prix pour une heure",'type'=>"number",'layout'=>"col-lg-4 col-md-6 col-sm-6 col-12",'std'=>"",'break'=>1];
                            // [id] => base_price [label] => Base Price [type] => text [std] => [break] => 1 [validation] => required [layout] => col-lg-4 col-md-6 col-sm-6 col-12
                        }print_r($val);*/
                    @endphp
                    <form class="gmz-form-action form-translation" action="{{$action}}" method="POST" data-loader="body">
                        <input type="hidden" name="post_id" value="{{$serviceData['id']}}" />
                        @php
                            if (!isset($item['translation']) || (isset($item['translation']) && $item['translation'])) {
                                render_flag_option();
                            }
                            $default_field = get_option_default_fields();
                            $current_options = [];
                        @endphp
                        <div class="row">
                        @foreach($val['fields'] as $_key => $_val)
                            @php
                          //  print_r($_val);
                                if($_val['id'] == 'post_description'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'is_featured'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'booking_form'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'highlight'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'itinerary'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'faq'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'nearby_common'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'nearby_education'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'nearby_health'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'nearby_top_attractions'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'nearby_restaurants_cafes'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'nearby_natural_beauty'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'nearby_airports'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'extra_services'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'external_booking'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'video'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'adult_price'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'children_price'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'infant_price'){
                                   $_val['layout']='d-none';
                                }
                                if($_val['id'] == 'discount_by_day'){
                                   $_val['layout']='d-none';
                                }
                                $_val = array_merge( $default_field, $_val );

                                if(isset($serviceData[$_val['id']])){
                                    $_val['value'] = $serviceData[$_val['id']];
                                }
                                if($_val['type'] == 'location'){
                                    $_val['value'] = [
                                        'lat' => $serviceData['location_lat'],
                                        'lng' => $serviceData['location_lng'],
                                        'address' => $serviceData['location_address'],
                                        'zoom' => $serviceData['location_zoom'],
                                        'postcode' => $serviceData['location_postcode'],
                                        'country' => $serviceData['location_country'],
                                        'city' => $serviceData['location_city'],
                                        'state' => $serviceData['location_state']
                                    ];
                                }
                                if($_val['type'] == 'list_item'){
                                    $data = [];
                                    if(isset($serviceData[$_val['id']])){
                                        $data = $serviceData[$_val['id']];
                                    }
                                    $data = maybe_unserialize($data);
                                    $_val['value'] = $data;
                                }

                                if($_val['type'] == 'checkbox'){
                                    $data = isset($serviceData[$_val['id']]) ? $serviceData[$_val['id']] : '';
                                    if(!empty($data)){
                                        $data = explode(',', $data);
                                    }else{
                                        $data = [];
                                    }
                                    $_val['value'] = $data;
                                }

                                if($_val['type'] == 'term_price'){
                                    $data = $serviceData[$_val['id']];
                                    $data = maybe_unserialize($data);
                                    $_val['value'] = $data;
                                }
                                if($_val['type'] == 'custom_price'){
                                    $_val['post_id'] = $serviceData['id'];
                                    $_val['post_type'] = $serviceData['post_type'];
                                }
                            @endphp
                                @include('Backend::settings.fields.render', [
                                    'field' => $_val
                                ])

                            @php
                                $current_options[] = $_val;
                            @endphp
                        @endforeach
                            @action('gmz_' . $serviceData['post_type'] . '_' . $key . '_meta_tab', $serviceData)
                        </div>
                        <input type="hidden" name="current_options" value="{{base64_encode(json_encode($current_options))}}" />
                    </form>
                </section>
            @endforeach
        @endif
    </div>
</div>