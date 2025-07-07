<?php

namespace App\Tests\Controller;

use App\Tests\Utils\BaseTestCase;
use Symfony\Component\HttpFoundation\Response;

class TareaControllerTest extends BaseTestCase
{
    public function testCrearTarea(): void
    {
        $this->crearPrioridad('Alta');
        $this->crearEstado('Pendiente');
        $this->crearCategoria('Trabajo');

        $payload = [
            'titulo' => 'Tarea de prueba',
            'contenido' => 'Contenido de la tarea',
            'orden' => 1,
            'estadoId' => 1,
            'prioridadId' => 1,
            'categoriasId' => [1],
            'subtareas' => [
                [
                    'titulo' => 'Subtarea 1',
                    'contenido' => 'Contenido subtarea',
                    'orden' => 1,
                    'estadoId' => 1,
                    'prioridadId' => 1,
                    'categoriasId' => [1]
                ]
            ]
        ];

        $this->client->request(
            'POST',
            '/api/tareas',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testListarTareas(): void
    {
        $this->client->request('GET', '/api/tareas');
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testObtenerTareaExistente(): void
    {
        $this->testCrearTarea();

        $this->client->request('GET', '/api/tareas/1');
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testObtenerTareaInexistente(): void
    {
        $this->client->request('GET', '/api/tareas/9999');
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testActualizarTareaExistente(): void
    {
        $this->testCrearTarea();

        $payload = [
            'titulo' => 'Tarea actualizada',
            'contenido' => 'Contenido actualizado',
            'orden' => 2,
            'estadoId' => 1,
            'prioridadId' => 1,
            'categoriasId' => [1],
            'subtareas' => [
                [
                    'id' => 1,
                    'titulo' => 'Subtarea actualizada',
                    'contenido' => 'Contenido actualizado',
                    'orden' => 1,
                    'estadoId' => 1,
                    'prioridadId' => 1,
                    'categoriasId' => [1]
                ]
            ]
        ];

        $this->client->request(
            'PUT',
            '/api/tareas/1',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testActualizarTareaInexistente(): void
    {
        $payload = [
            'titulo' => 'Tarea no encontrada',
            'contenido' => '...',
            'orden' => 1,
            'estadoId' => 1,
            'prioridadId' => 1,
            'categoriasId' => [1]
        ];

        $this->client->request(
            'PUT',
            '/api/tareas/9999',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testCambiarOrdenTarea(): void
    {
        $this->testCrearTarea();

        $this->client->request(
            'PUT',
            '/api/tareas/1/cambiarOrden',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['orden' => 5])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testCambiarOrdenTareaInexistente(): void
    {
        $this->client->request(
            'PUT',
            '/api/tareas/9999/cambiarOrden',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['orden' => 5])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testEliminarTareaExistente(): void
    {
        $this->testCrearTarea();

        $this->client->request(
            'DELETE',
            '/api/tareas/1'
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testEliminarTareaInexistente(): void
    {
        $this->client->request(
            'DELETE',
            '/api/tareas/9999'
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
