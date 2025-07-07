<?php

namespace App\Tests\Controller;

use App\Tests\Utils\BaseTestCase;
use Symfony\Component\HttpFoundation\Response;

class PrioridadControllerTest extends BaseTestCase
{
    public function testCrearPrioridad(): void
    {
        $this->client->request(
            'POST',
            '/api/prioridades/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'nombre' => 'Alta',
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testListarPrioridades(): void
    {
        $this->client->request('GET', '/api/prioridades/');

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testObtenerPrioridadExistente(): void
    {
        $this->client->request(
            'POST',
            '/api/prioridades/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Baja'])
        );

        $this->client->request('GET', '/api/prioridades/1');
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testObtenerPrioridadInexistente(): void
    {
        $this->client->request('GET', '/api/prioridades/9999');
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testActualizarPrioridadExistente(): void
    {
        $this->client->request(
            'POST',
            '/api/prioridades/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Media'])
        );

        $this->client->request(
            'PUT',
            '/api/prioridades/1',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Alta'])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testActualizarPrioridadInexistente(): void
    {
        $this->client->request(
            'PUT',
            '/api/prioridades/9999',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Inexistente'])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testEliminarPrioridadExistente(): void
    {
        $this->client->request(
            'POST',
            '/api/prioridades/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Temporal'])
        );

        $this->client->request('DELETE', '/api/prioridades/1');

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testEliminarPrioridadInexistente(): void
    {
        $this->client->request('DELETE', '/api/prioridades/9999');
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
