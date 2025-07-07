<?php

namespace App\Tests\Utils;

use Symfony\Bundle\FrameworkBundle\KernelBrowser;

class AuthHelper
{
    public static function loginAndGetToken(KernelBrowser $client): ?string
    {
        $nombre = $nombre ?? $_ENV['TEST_USER'];
        $clave = $clave ?? $_ENV['TEST_PASS'];

        $client->request(
            'POST',
            '/api/usuario/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nombre' => $nombre,
                'clave' => $clave,
            ])
        );

        $response = $client->getResponse();
        if ($response->getStatusCode() !== 200) {
            return null;
        }

        $data = json_decode($response->getContent(), true);
        return $data['token'] ?? null;
    }
}
