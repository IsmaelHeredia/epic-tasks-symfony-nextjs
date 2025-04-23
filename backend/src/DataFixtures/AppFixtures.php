<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use App\Entity\Categoria;
use App\Entity\Estado;
use App\Entity\Prioridad;
use App\Entity\Subtarea;
use App\Entity\Tarea;
use App\Entity\Usuario;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        $categorias = [];
        for ($i = 1; $i <= 5; $i++) {
            $categoria = new Categoria();
            $categoria->setNombre('Categoria ' . $i);
            $manager->persist($categoria);
            $categorias[] = $categoria;
        }

        $estados = [];
        for ($i = 1; $i <= 5; $i++) {
            $estado = new Estado();
            $estado->setNombre('Estado ' . $i);
            $manager->persist($estado);
            $estados[] = $estado;
        }

        $prioridades = [];
        for ($i = 1; $i <= 5; $i++) {
            $prioridad = new Prioridad();
            $prioridad->setNombre('Prioridad ' . $i);
            $prioridad->setColor('Color ' . $i);
            $manager->persist($prioridad);
            $prioridades[] = $prioridad;
        }

        $usuario = new Usuario();
        $usuario->setNombre('admin');
        $usuario->setImagen('default.png');
        $usuario->setEmail('admin@localhost.com');
        $usuario->setClave($this->hasher->hashPassword($usuario, 'admin123'));
        $usuario->setCreatedAt(new \DateTimeImmutable());
        $usuario->setUpdatedAt(new \DateTime());
        $manager->persist($usuario);

        $tarea = new Tarea();
        $tarea->setTitulo('Tarea de prueba');
        $tarea->setContenido('Contenido de la tarea de prueba');
        $tarea->setOrden(1);
        $tarea->setEstado($estados[0]);
        $tarea->setPrioridad($prioridades[0]);
        $tarea->addCategoria($categorias[0]);
        $tarea->addCategoria($categorias[1]);
        $tarea->setCreatedAt(new \DateTimeImmutable());
        $tarea->setUpdatedAt(new \DateTimeImmutable());
        $manager->persist($tarea);

        $subtarea1 = new Subtarea();
        $subtarea1->setTitulo('Subtarea 1');
        $subtarea1->setContenido('Contenido de la subtarea 1');
        $subtarea1->setOrden(1);
        $subtarea1->setEstado($estados[0]);
        $subtarea1->setPrioridad($prioridades[0]);
        $subtarea1->addCategoria($categorias[0]);
        $subtarea1->addCategoria($categorias[1]);
        $subtarea1->setTarea($tarea);
        $subtarea1->setCreatedAt(new \DateTimeImmutable());
        $subtarea1->setUpdatedAt(new \DateTimeImmutable());
        $manager->persist($subtarea1);

        $subtarea2 = new Subtarea();
        $subtarea2->setTitulo('Subtarea 2');
        $subtarea2->setContenido('Contenido de la subtarea 2');
        $subtarea2->setOrden(2);
        $subtarea2->setEstado($estados[0]);
        $subtarea2->setPrioridad($prioridades[0]);
        $subtarea2->addCategoria($categorias[0]);
        $subtarea2->addCategoria($categorias[1]);
        $subtarea2->setTarea($tarea);
        $subtarea2->setCreatedAt(new \DateTimeImmutable());
        $subtarea2->setUpdatedAt(new \DateTimeImmutable());
        $manager->persist($subtarea2);

        $manager->flush();
    }
}
