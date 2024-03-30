<?php
/**
 * Created by PhpStorm.
 * User: JreamOQ ( jreamoq@gmail.com )
 * Date: 12/21/20
 * Time: 13:00
 */

namespace App\Modules\Frontend\Controllers;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Paydunya\Checkout\CheckoutInvoice;
use Paydunya\Checkout\Store;
use Paydunya\Setup;

Setup::setMasterKey("DrTmuv85-WYI2-UbdK-Dtll-JGo8LIQhMehZ");;
Setup::setPublicKey("test_public_2UPagINQiCuIPGDtsrihO5wWuWv");
Setup::setPrivateKey("test_private_5cpYZQrWZambiLhynGDoE8NsZsN");
Setup::setToken("O8juBuXl0GW8lZ0gJ8Sy");
Setup::setMode("test");// Optionnel. Utilisez cette option pour les paiements tests.
Store::setName("SHAP");
Store::setTagline("SHAP");
Store::setPhoneNumber("336530583");
Store::setPostalAddress("ABIDJAN Plateau");
class OrderController extends Controller
{
    private $service;

    public function __construct()
    {
        $this->service = OrderService::inst();
    }

    public function paymentChecking(Request $request)
    {
        $order_token = $request->get('order_token');
        $status = $request->get('status');

        $response = $this->service->paymentChecking($order_token, $status);

        if ($response && ($response['payment_status'] == 1)) {
            return redirect(route('complete-order') . "?" . http_build_query(['order_token' => $order_token]));
        } else {
            return redirect(url('checkout'))->with([
                'message' => $response['message'],
                'order_token' => $order_token,
                'payment_failed' => 1,
            ]);
        }
    }

    public function completeOrder(Request $request)
    {
        $response = $this->service->completeOrderChecking($request);
        $view = apply_filter('gmz_complete_order_view', 'Frontend::page.complete-order', $response);
        return view($view, $response);
    }

    public function checkoutAction(Request $request)
    {
        $cartVar = \Cart::inst()->getCart();
        $response = $this->service->checkOutPaydunia($request);

        $currency = \Currency::get_inst()->currentCurrency();
        $cart = $cartVar;
        $dataRequest = $request->all();

        //
        $datas=[
            'montant'=>$cart['total'],
            'currency'=>$currency['unit'],
            'firstname'=>$request['first_name'],
            'name'=>$request['last_name'],
            'address'=> $request['address'],
            'city'=>$request['city'],
            'country'=>$request['country'],
            'phone'=>$request['phone'],
            'email'=>$request['email'],
        ];
        $currencies="XOF";
        $datas=[
            'montant'=>$cart['total'],
            'currency'=>$currencies,
            'firstname'=>$request['first_name'],
            'name'=>$request['last_name'],
            'address'=>'Grand dakar',
            'city'=>'dakar',
            'country'=>'SN',
            'phone'=>'1234789',
            'email'=>'test@shapcompany.com',
        ];
        $token = create_token_dpo($datas);// echo $token;dd($dataRequest,$datas);
        return Redirect::to('https://secure.3gdirectpay.com/payv2.php?ID='.$token['transToken']);

       // return $currency['unit'];


    }

    public function paiement_dpo(Request $request,$cartVar)
    {

    }

    public function paiement_paydunia(Request $request){
        $cart = \Cart::inst()->getCart();
        $datas = $request->all();

        //dd($datas);
        //Creation de l'instance CheckoutInvoice()
        $invoice = new CheckoutInvoice();
        $invoice->setTotalAmount($cart['total']);
        //on ajoute le produit avec la méthode addItem // qui prend en paramètre le nom du produit la quantité, le prix unitaire et le prix total
        $invoice->addItem($cart['post_id'], 1, $cart['total'], $cart['total']);

        $invoice->addCustomData("datas",$datas);
        //Création des urls de succès et d'annulation
        $invoice->setReturnUrl(route('success_payment'));
        $invoice->setCancelUrl(route('cancel_payment'));
        if($invoice->create()) {//If the invoice is correctly created
          //  return \redirect()->to('https://stackoverflow.com/questions/28642753/redirect-to-external-url-with-return-in-laravel');
            //echo "good"; //die();
            //echo $invoice->getInvoiceUrl();
            //return header('Location: '.$invoice->getInvoiceUrl());
            $url = $invoice->getInvoiceUrl();
            return \redirect()->to($url);
            return Redirect::to();
        } else { //If invoice is not created display the error
            echo $invoice->response_text;
        }
    }

    public function success_payment(Request $request){
        $postXml = <<<POSTXML
    <?xml version="1.0" encoding="utf-8"?>
    <API3G>
      <CompanyToken>57466282-EBD7-4ED5-B699-8659330A6996</CompanyToken>
      <Request>verifyToken</Request>
      <TransactionToken>72983CAC-5DB1-4C7F-BD88-352066B71592</TransactionToken>
    </API3G>
POSTXML;

        //echo $postXml; die();

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

       // dd($curl);

        if ( $error ) {
            return [
                'success' => false,
                'error'   => $error,
            ];
            exit;
        }

        if ( $response != '' ) {
            $xml= new \SimpleXMLElement($response);
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

    public function cancel_payment(){
        echo "erreur";
    }

    public function checkoutView()
    {

        $order_data = NULL;

        if (session()->has('payment_failed') && (session('payment_failed') == 1)) {

            $order_token = \session('order_token');
            $order_data = $this->service->unsuccessfulPaymentProcessing($order_token);
        }
        $cart = \Cart::inst()->getCart();

        //dd($order_token);
        return view('Frontend::page.checkout')->with('order_data', $order_data);
    }

    public function test_success(){

        $endpoint = "https://secure.3gdirectpay.com/API/v6/";
        $xmlData = "<?xml version=\"1.0\" encoding=\"utf-8\"?>
<API3G>
  <CompanyToken>8D3DA73D-9D7F-4E09-96D4-3D44E7A83EA3</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>72983CAC-5DB1-4C7F-BD88-352066B71592</TransactionToken>
</API3G>";

        $ch = curl_init();

        if (!$ch) {
            die("Couldn't initialize a cURL handle");
        }
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/xml'));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlData);

        $result = curl_exec($ch);

        curl_close($ch);

        return $result;
    }

}