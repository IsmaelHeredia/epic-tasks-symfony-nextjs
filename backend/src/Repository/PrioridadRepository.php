<?php

namespace App\Repository;

use App\Entity\Prioridad;
use App\DTO\PrioridadDTO;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Serializer\PrioridadSerializer;

class PrioridadRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Prioridad::class);
    }

    public function listar()
    {
        $prioridades = $this->findAll();
        $datos = array_filter($prioridades);
        $datos = array_map([PrioridadSerializer::class, 'serialize'], $datos);
        return $datos;
    }

    public function obtener(int $id)
    {
        $prioridad = $this->find($id);

        if (!$prioridad) {
            return null;
        }

        $datos = PrioridadSerializer::serialize($prioridad);
        return $datos;
    }

    public function crear(PrioridadDTO $dto)
    {
        $prioridad = new Prioridad();
        $prioridad->setNombre($dto->nombre);

        $em = $this->getEntityManager();
        $em->persist($prioridad);
        $em->flush();

        $datos = PrioridadSerializer::serialize($prioridad);

        return $datos;
    }

    public function actualizar(int $id, PrioridadDTO $dto)
    {
        $prioridad = $this->find($id);

        if (!$prioridad) {
            return null;
        }

        $em = $this->getEntityManager();

        $prioridad->setNombre($dto->nombre);

        $em->flush();

        $datos = PrioridadSerializer::serialize($prioridad);

        return $datos;
    }

    public function eliminar(int $id)
    {
        $prioridad = $this->find($id);
        
        if (!$prioridad) {
            return false;
        }

        $em = $this->getEntityManager();

        $em->remove($prioridad);
        $em->flush();

        return true;
    }
}