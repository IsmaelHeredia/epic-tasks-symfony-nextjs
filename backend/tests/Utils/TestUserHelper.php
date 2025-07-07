<?php

namespace App\Tests\Utils;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class TestUserHelper
{
    public static function crearUsuario(
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): Usuario {

        $nombre = $nombre ?? $_ENV['TEST_USER'];
        $clave = $clave ?? $_ENV['TEST_PASS'];

        $em->createQuery('DELETE FROM App\Entity\Usuario')->execute();

        $usuario = new Usuario();
        $usuario->setNombre($nombre);
        $usuario->setImagen('default.png');
        $usuario->setEmail("{$nombre}@localhost.com");
        $usuario->setClave($hasher->hashPassword($usuario, $clave));
        $usuario->setCreatedAt(new \DateTimeImmutable());
        $usuario->setUpdatedAt(new \DateTime());

        $em->persist($usuario);
        $em->flush();

        return $usuario;
    }
}
