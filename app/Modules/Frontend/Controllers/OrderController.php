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
        return $this->paiement_dpo($request);
        if($request->payment_method=="paydunia"){

        }else{
            $response = $this->service->checkOut($request);
            return response()->json($response);
        }

    }

    public function paiement_dpo(Request $request)
    {
        $cart = \Cart::inst()->getCart();
        $datas = $request->all();
        dd($cart,$datas);
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
        dd($request->all());
        $token = $_GET['token'];
        $invoice = new CheckoutInvoice();
        if ($invoice->confirm($token)) {//we test if we have the right token before saving in the payment table
            if($invoice->getStatus() == 'completed')
            {
                $datas = $invoice->getCustomData('datas');
                $request = $datas;
                //dd($datas);
                $response = $this->service->checkOutPaydunia($datas,$token);
               // dd($response);
               // $response_decode = json_decode($response) ;
              //  $url = $response_decode->redirect;

                if(isset( $response['redirect'] )){
                    return \redirect()->to($response['redirect']) ;
                }else{
                    return \redirect()->to('/') ;
                }


                //echo 1;
            }else{
                echo "echec";
            }
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

}