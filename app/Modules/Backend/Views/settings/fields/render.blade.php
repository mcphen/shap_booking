@if(!empty($field))
    @if(\Illuminate\Support\Facades\View::exists('Backend::settings.fields.' . $field['type']))
        @php //echo $field['type'];
            extract($field); @endphp
        @include('Backend::settings.fields.' . $field['type'])
    @else
        @include('Backend::settings.fields.not-exists')
    @endif
@endif