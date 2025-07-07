<?php

namespace App\Tests\Utils;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Tests\Utils\TestUserHelper;
use App\Tests\Utils\AuthHelper;

abstract class BaseTestCase extends WebTestCase
{
    protected $client;
    protected EntityManagerInterface $em;
    protected UserPasswordHasherInterface $hasher;
    protected string $token;

    protected function setUp(): void
    {
        self::ensureKernelShutdown();
        $this->client = static::createClient();
        $container = self::getContainer();

        $this->em = $container->get(EntityManagerInterface::class);
        $this->hasher = $container->get(UserPasswordHasherInterface::class);

        $this->resetDatabase();
        $this->createAndAuthenticateUser();
    }

    private function resetDatabase(): void
    {
        $schemaTool = new SchemaTool($this->em);
        $metadata = $this->em->getMetadataFactory()->getAllMetadata();

        if (!empty($metadata)) {
            $schemaTool->dropDatabase();
            $schemaTool->createSchema($metadata);
        }
    }

    private function createAndAuthenticateUser(): void
    {
        TestUserHelper::crearUsuario($this->em, $this->hasher);

        $this->token = AuthHelper::loginAndGetToken($this->client);

        if (!empty($this->token)) {
            $this->client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer ' . $this->token);
        }
    }

    protected function crearEstado(string $nombre): void
    {
        $this->client->request(
            'POST',
            '/api/estados/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => $nombre])
        );

        $this->assertResponseStatusCodeSame(201);
    }

    protected function crearPrioridad(string $nombre): void
    {
        $this->client->request(
            'POST',
            '/api/prioridades/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => $nombre])
        );

        $this->assertResponseStatusCodeSame(201);
    }

    protected function crearCategoria(string $nombre): void
    {
        $this->client->request(
            'POST',
            '/api/categorias/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['nombre' => $nombre])
        );

        $this->assertResponseStatusCodeSame(201);
    }

}
