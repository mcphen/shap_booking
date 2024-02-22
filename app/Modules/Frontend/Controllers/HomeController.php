<?php
/**
 * Created by PhpStorm.
 * User: JreamOQ ( jreamoq@gmail.com )
 * Date: 12/8/20
 * Time: 17:37
 */

namespace App\Modules\Frontend\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
use Zepson\Dpo\Dpo;
class HomeController extends Controller
{
    public function index()
    {
        return view('Frontend::page.home');
    }

    public function zpo_test(){
        $datas=[
            'montant'=>'10.00',
            'currency'=>'XOF',
            'firstname'=>'test',
            'name'=>'enock',
            'address'=>'Grand dakar',
            'city'=>'dakar',
            'country'=>'SN',
            'phone'=>'1234789',
            'email'=>'test@shapcompany.com',
        ];
        $token = create_token_dpo($datas);
        return Redirect::to('https://secure.3gdirectpay.com/payv2.php?ID='.$token['transToken']);

    }
}