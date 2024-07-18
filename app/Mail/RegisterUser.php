<?php
namespace App\Mail;

use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegisterUser extends Mailable
{
    use Queueable, SerializesModels;

    public $user = null;
    public $generatePassword = false;
    public $pass = "";

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user, $generatePassword, $pass = null)
    {
        $this->user = $user;
        $this->generatePassword = $generatePassword;
        $this->pass = $pass;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Registro de usuario")
            ->markdown("emails.RegisterUser.register");
    }
}
