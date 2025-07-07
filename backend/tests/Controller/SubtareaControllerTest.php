<?php

namespace App\Tests\Controller;

use App\Tests\Utils\BaseTestCase;
use Symfony\Component\HttpFoundation\Response;

class SubtareaControllerTest extends BaseTestCase
{
    public function testCrearSubtarea(): void
    {
        $this->crearPrioridad('Alta');
        $this->crearEstado('Pendiente');
        $this->crearCategoria('Trabajo');

        $this->client->request(
            'POST',
            '/api/tareas',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'titulo' => 'Tarea base',
                'contenido' => 'Contenido',
                'orden' => 1,
                'estadoId' => 1,
                'prioridadId' => 1,
                'categoriasId' => [1],
                'subtareas' => []
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $payload = [
            'titulo' => 'Subtarea de prueba',
            'contenido' => 'Contenido de prueba',
            'orden' => 1,
            'estadoId' => 1,
            'prioridadId' => 1,
            'categoriasId' => [1],
            'tareaId' => 1
        ];

        $this->client->request(
            'POST',
            '/api/subtareas',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testListarSubtareas(): void
    {
        $this->client->request('GET', '/api/subtareas');
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testObtenerSubtareaExistente(): void
    {
        $this->testCrearSubtarea();
        $this->client->request('GET', '/api/subtareas/1');
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testObtenerSubtareaInexistente(): void
    {
        $this->client->request('GET', '/api/subtareas/9999');
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testActualizarSubtareaExistente(): void
    {
        $this->testCrearSubtarea();

        $payload = [
            'titulo' => 'Subtarea actualizada',
            'contenido' => 'Contenido actualizado',
            'orden' => 2,
            'estadoId' => 1,
            'prioridadId' => 1,
            'categoriasId' => [1],
            'tareaId' => 1
        ];

        $this->client->request(
            'PUT',
            '/api/subtareas/1',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testActualizarSubtareaInexistente(): void
    {
        $payload = [
            'titulo' => 'No existe',
            'contenido' => '...',
            'orden' => 99,
            'estadoId' => 1,
            'prioridadId' => 1,
            'categoriasId' => [],
            'tareaId' => 1
        ];

        $this->client->request(
            'PUT',
            '/api/subtareas/9999',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testEliminarSubtareaExistente(): void
    {
        $this->testCrearSubtarea();

        $this->client->request(
            'DELETE',
            '/api/subtareas/1'
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testEliminarSubtareaInexistente(): void
    {
        $this->client->request(
            'DELETE',
            '/api/subtareas/9999'
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
