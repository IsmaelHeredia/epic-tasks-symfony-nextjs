<?php

namespace App\Tests\Controller;

use App\Tests\Utils\BaseTestCase;
use Symfony\Component\HttpFoundation\Response;

class UsuarioControllerTest extends BaseTestCase
{
    public function testLoginExitoso(): void
    {
        $payload = [
            'nombre' => 'admin',
            'clave' => 'Admin1234!'
        ];

        $this->client->request(
            'POST',
            '/api/usuario/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJson($this->client->getResponse()->getContent());

        $data = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $data);
    }

    public function testLoginFallido(): void
    {
        $payload = [
            'nombre' => 'usuario_inexistente',
            'clave' => 'clave_incorrecta'
        ];

        $this->client->request(
            'POST',
            '/api/usuario/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testActualizarCuenta(): void
    {
        $this->client->disableReboot();

        $this->client->request(
            'POST',
            '/api/usuario/actualizar-cuenta',
            [
                'nombre' => 'admin2',
                'clave' => 'Admin123456!',
                'currentPassword' => 'Admin1234!'
            ],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $this->token,
                'CONTENT_TYPE' => 'multipart/form-data',
            ]
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJson($this->client->getResponse()->getContent());
        $this->assertStringContainsString('Cuenta actualizada', $this->client->getResponse()->getContent());
    }
}
