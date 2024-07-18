<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" type="image/png" href="/images/icono.ico">

        <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <!--<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"/>-->
    <style>
        .loading-page{
            position: fixed !important;
            width: 100%;
            height: 100%;
            text-align: center;
            /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#000000+0,000000+100,000000+100&0+22,0.34+100 */
            background: -moz-radial-gradient(center, ellipse cover,  rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.34) 100%); /* FF3.6-15 */
            background: -webkit-radial-gradient(center, ellipse cover,  rgba(0,0,0,0) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0.34) 100%); /* Chrome10-25,Safari5.1-6 */
            background: radial-gradient(ellipse at center,  rgba(0,0,0,0) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0.34) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#57000000',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
        }

        .animate-loading{
            animation-name: loading_page;
            animation-duration: 1s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }

        @-webkit-keyframes loading_page {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);   
            }
        }

        .loading-page .loading-content{
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) !important; 
        }

        .loading-divider{
            height: 1px;
            background-color: #000; 
            opacity: .3;
            width: 70%;
            margin: 30px auto; 
        }
    </style>
</head>
<body> 
    <div id="fb-root"></div>
    <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v4.0"></script>
    <div id="app">
        <div class="loading-page">
            <div class="loading-content">
                <Image src="/images/logo_xl.png" width="30%" />
                <div class="loading-divider"></div>
                <h2>Cargando <Image class="animate-loading" src="/images/icon_loading.png" width="30px" /></h2>
                <p>Si es la primera vez que ingrea al sitio esto puede durar más de 20 segundos.</p>
            </div>
        </div>
    </div>

    <script>
        let script = document.createElement("script");
        script.src = "<?php echo asset('js/app.js') ?>";
        script.defer = "0";
        document.getElementsByTagName("head")[0].append(script);
    </script>
</body>

</html>
