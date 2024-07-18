@component('mail::message')

<p style="text-align: justify;">Se ha registrado una nueva cuenta de usuario con este correo electrónico en nuestro sistema para la recuperación de la memoria oral de las víctimas del conflicto armado en Colombia.
Para activar la nueva cuenta de usuario debe seguir los siguientes pasos:<p>

<ol>
<li>Haga clic en el botón que aparece debajo de este mensaje.</li>
<li>Será redirigido a la pantalla de activación de cuenta.</li>
<li>Ingrese su contraseña en el campo con la etiqueta "Ingrese su contraseña".</li>
<li>Haga clic en el botón enviar.</li>
</ol>

<p style="text-align: justify;">Si la información es correcta el sistema tomará unos segundos en iniciar su sesión.</p>

<p style="text-align: justify;">Recuerde que, por la seguridad de su información, la pantalla de activación de cuenta tiene una caducidad de <strong>2 semanas</strong>, por lo tanto,
si usted intenta ingresar después de la fecha de caducidad no podrá activar su cuenta.</p>

@if($generatePassword)
<p><strong>Su contraseña de ingreso es: </strong>{{ $pass }}</p>
@endif

@component('mail::button', ['url' => url('/account_activation/'.$user->id.'/'.$user->token_),'color'=>'success'])
Activar de cuenta
@endcomponent

<small style="text-align: justify;">Si no ha podido igresar a la pantalla de activación de cuenta con el botón anterior, puede hacer click en <a href="<?php echo url('/account_activation/'.$user->id.'/'.$user->token_) ?>">este enlace</a> para ser redirigido al sistema.</small>
@endcomponent
