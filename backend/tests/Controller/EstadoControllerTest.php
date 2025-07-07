<?php

namespace App\Tests\Controller;

use App\Tests\Utils\BaseTestCase;
use Symfony\Component\HttpFoundation\Response;

class EstadoControllerTest extends BaseTestCase
{
    public function testCrearEstado(): void
    {
        $this->client->request(
            'POST',
            '/api/estados/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'En progreso'])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testListarEstados(): void
    {
        $this->client->request('GET', '/api/estados/');

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testObtenerEstadoExistente(): void
    {
        $this->client->request(
            'POST',
            '/api/estados/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Activo'])
        );

        $this->client->request('GET', '/api/estados/1');
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testObtenerEstadoInexistente(): void
    {
        $this->client->request('GET', '/api/estados/9999');
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testActualizarEstadoExistente(): void
    {
        $this->client->request(
            'POST',
            '/api/estados/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Pendiente'])
        );

        $this->client->request(
            'PUT',
            '/api/estados/1',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Finalizado'])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testActualizarEstadoInexistente(): void
    {
        $this->client->request(
            'PUT',
            '/api/estados/9999',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Cancelado'])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testEliminarEstadoExistente(): void
    {
        $this->client->request(
            'POST',
            '/api/estados/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Para borrar'])
        );

        $this->client->request('DELETE', '/api/estados/1');

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testEliminarEstadoInexistente(): void
    {
        $this->client->request('DELETE', '/api/estados/9999');
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
