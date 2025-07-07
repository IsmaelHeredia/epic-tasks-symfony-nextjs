<?php

namespace App\Tests\Controller;

use App\Tests\Utils\BaseTestCase;
use Symfony\Component\HttpFoundation\Response;

class CategoriaControllerTest extends BaseTestCase
{
    public function testCrearCategoria(): void
    {
        $this->client->request(
            'POST',
            '/api/categorias/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Nueva Categoria'])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testListarCategorias(): void
    {
        $this->client->request('GET', '/api/categorias/');
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJson($this->client->getResponse()->getContent());
    }

    public function testObtenerCategoriaExistente(): void
    {
        $this->client->request(
            'POST',
            '/api/categorias/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Categoria test'])
        );

        $this->client->request('GET', '/api/categorias/1');
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testObtenerCategoriaInexistente(): void
    {
        $this->client->request('GET', '/api/categorias/9999');
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testActualizarCategoriaExistente(): void
    {
        $this->client->request(
            'POST',
            '/api/categorias/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Categoria original'])
        );

        $this->client->request(
            'PUT',
            '/api/categorias/1',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Categoria Actualizada'])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testActualizarCategoriaInexistente(): void
    {
        $this->client->request(
            'PUT',
            '/api/categorias/9999',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Intento de actualización'])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testEliminarCategoriaExistente(): void
    {
        $this->client->request(
            'POST',
            '/api/categorias/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => 'Para borrar'])
        );

        $this->client->request('DELETE', '/api/categorias/1');
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testEliminarCategoriaInexistente(): void
    {
        $this->client->request(
            'DELETE',
            '/api/categorias/9999',
            [],
            [],
            ['HTTP_AUTHORIZATION' => 'Bearer ' . $this->token]
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
