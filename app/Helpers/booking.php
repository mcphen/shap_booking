<?php

use Carbon\Carbon;
use Carbon\CarbonPeriod;

if(!function_exists('the_order_status')) {
	function the_order_status( $key = '' ) {
		switch ( $key ) {
			case GMZ_STATUS_INCOMPLETE :
				$text    = __( 'Incomplete' );
				$classes = 'badge badge-info';
				break;
			case GMZ_STATUS_COMPLETE :
				$text    = __( 'Completed' );
				$classes = 'badge badge-success';
				break;
			case GMZ_STATUS_CANCELLED :
				$text    = __( 'Cancelled' );
				$classes = 'badge badge-danger';
				break;
			case GMZ_STATUS_REFUNDED :
				$text    = __( 'Refunded' );
				$classes = 'badge badge-warning';
				break;
			default :
				$text    = $key;
				$classes = 'badge badge-info';
		}

		return sprintf( '<span class="%1$s">%2$s</span>', $classes, $text );
	}
}

if(!function_exists('list_order_status')) {
	function list_order_status($status = '') {
	    switch ($status){
            case GMZ_STATUS_COMPLETE:
                return [
                    GMZ_STATUS_CANCELLED  => __( 'Cancel order' ),
                    GMZ_STATUS_REFUNDED   => __( 'Refunded' ),
                    GMZ_STATUS_INCOMPLETE => __( 'Incomplete' )
                ];
                break;
            case GMZ_STATUS_INCOMPLETE:
                return [
                    GMZ_STATUS_CANCELLED  => __( 'Cancel order' ),
                    GMZ_STATUS_COMPLETE   => __( 'Complete' )
                ];
                break;
            case GMZ_STATUS_CANCELLED:
                return [
                    GMZ_STATUS_REFUNDED   => __( 'Refunded' ),
                    GMZ_STATUS_COMPLETE   => __( 'Complete' )
                ];
                break;
            case GMZ_STATUS_REFUNDED:
                return [
                    GMZ_STATUS_COMPLETE   => __( 'Complete' )
                ];
                break;
            default:
                return [
                    GMZ_STATUS_CANCELLED  => __( 'Cancel order' ),
                    GMZ_STATUS_REFUNDED   => __( 'Refunded' ),
                    GMZ_STATUS_COMPLETE   => __( 'Complete' ),
                    GMZ_STATUS_INCOMPLETE => __( 'Incomplete' )
                ];
                break;
        }
	}
}

if(!function_exists('is_order_status')) {
	function is_order_status( $status ) {
		$arr = list_order_status();
		if ( array_key_exists( $status, $arr ) ) {
			return true;
		} else {
			return false;
		}
	}
}

if(!function_exists('get_processing_log')) {
	function get_processing_log( $string ) {
		if ( empty( $string ) ) {
			return null;
		}
		$log = rtrim( $string, "," );
		$log = "[" . $log . "]";

		return json_decode( $log, true );
	}
}

if(!function_exists('get_tax')) {
	function get_tax() {
		$tax_included = get_option( 'tax_included' );
		$tax_percent  = get_option( 'tax_percent' );

		return [
			'included' => $tax_included,
			'percent'  => floatval( $tax_percent )
		];
	}
}

if(!function_exists('get_payment_type')) {
	function get_payment_type( $payment_type ) {
		$gateway = Gateway::inst()->getGateway( $payment_type );
		if ( $gateway ) {
			return $gateway->getName();
		}

		return ucwords( str_replace( '_', ' ', $payment_type ) );
	}
}

if(!function_exists('the_paid')) {
	function the_paid( $payment_status ) {
		return ( empty( $payment_status ) ) ? '<span class="text-warning">' . __( 'Unpaid' ) . '</span>' : '<span class="text-danger">' . __( 'Paid' ) . '</span>';
	}
}

if(!function_exists('get_list_date_form_today')) {
	function get_list_date_form_today( $subDays ) {
		$dt        = Carbon::now();
		$startDate = $dt->today()->subDays( $subDays )->toDateString();
		$endDate   = $dt->today()->toDateString();
		//get list period
		$period = CarbonPeriod::create( $startDate, $endDate );
		//format date
		$dates = array();
		foreach ( $period as $date ) {
			$dates[] = $date->toDateString();
		}

		return $dates;
	}
}




function create_token_dpo($datas){
    $companyToken      = 'D1EABD05-99D3-4589-BAE7-DD7365F2413E';
    $accountType       = '86253';
    $paymentAmount     = $datas['montant'];
    $paymentCurrency   = $datas['currency']?$datas['currency']:"XOF";
    $customerFirstName = $datas['firstname']?$datas['firstname']:"";
    $customerLastName  = $datas['name']?$datas['name']:"";
    $customerAddress   = $datas['address']?$datas['address']:"";
    $customerCity      = $datas['city']?$datas['city']:"";
    $customerCountry   = $datas['country']?$datas['country']:"";
    $customerPhone     = $datas['phone']?$datas['phone']:"";
    $redirectURL       = 'https://shapafrica.com/success_payment';
    $backURL           = 'https://bookings.noworkstoursandtravel.com/subham/pg/backurl.php';
    $customerEmail     = $datas['email'];
    $reference         = 'shapcompany' . '_' .'teston';

    $odate   = date( 'Y/m/d H:i' );
    $postXml = <<<POSTXML
    <?xml version="1.0" encoding="utf-8"?>
    <API3G>
    <CompanyToken>$companyToken</CompanyToken>
    <Request>createToken</Request>
    <Transaction>
        <PaymentAmount>$paymentAmount</PaymentAmount>
        <PaymentCurrency>$paymentCurrency</PaymentCurrency>
        <CompanyRef>$reference</CompanyRef>
        <customerFirstName>$customerFirstName</customerFirstName>
        <customerLastName>$customerLastName</customerLastName>
        <customerAddress>$customerAddress</customerAddress>
        <customerCity>$customerCity</customerCity>
        <customerCountry>$customerCountry</customerCountry>
        <customerPhone>$customerPhone</customerPhone>
        <RedirectURL>$redirectURL</RedirectURL>
        <BackURL>$backURL</BackURL>
        <customerEmail>$customerEmail</customerEmail>
    </Transaction>
    <Services>
        <Service>
            <ServiceType>$accountType</ServiceType>
            <ServiceDescription>$reference</ServiceDescription>
            <ServiceDate>$odate</ServiceDate>
        </Service>
    </Services>
    </API3G>
POSTXML;

    //echo $postXml;

    $curl = curl_init();
    curl_setopt_array( $curl, array(
        CURLOPT_URL            => "https://secure.3gdirectpay.com/API/v6/",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING       => "",
        CURLOPT_MAXREDIRS      => 10,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST  => "POST",
        CURLOPT_POSTFIELDS     => $postXml,
        CURLOPT_HTTPHEADER     => array(
            "cache-control: no-cache",
        ),
    ) );
    $responded = false;
    $attempts  = 0;

    //Try up to 10 times to create token
    while ( !$responded && $attempts < 10 ) {
        $error    = null;
        $response = curl_exec( $curl );
        $error    = curl_error( $curl );

        if ( $response != '' ) {
            $responded = true;

        }
        $attempts++;
    }
    curl_close( $curl );

    if ( $error ) {
        return [
            'success' => false,
            'error'   => $error,
        ];
        exit;
    }

    if ( $response != '' ) {
        $xml= new SimpleXMLElement($response);
        // $xml = new \SimpleXMLElement( $response );

        //Check if token was created successfully
        if ( $xml->xpath( 'Result' )[0] != '000' ) {
            exit();
        } else {
            $transToken        = $xml->xpath( 'TransToken' )[0]->__toString();
            $result            = $xml->xpath( 'Result' )[0]->__toString();
            $resultExplanation = $xml->xpath( 'ResultExplanation' )[0]->__toString();
            $transRef          = $xml->xpath( 'TransRef' )[0]->__toString();

            //echo 'success'.$transToken;

            return [
                'success'           => true,
                'result'            => $result,
                'transToken'        => $transToken,
                'resultExplanation' => $resultExplanation,
                'transRef'          => $transRef,
            ];

        }
    } else {
        var_dump($xml);
        return [
            'success' => false,
            'error'   => $response,
        ];
        exit;
    }
}