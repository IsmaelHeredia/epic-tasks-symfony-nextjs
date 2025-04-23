<?php

namespace App\Repository;

use App\Entity\Estado;
use App\DTO\EstadoDTO;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Serializer\EstadoSerializer;

class EstadoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Estado::class);
    }

    public function listar()
    {
        $estados = $this->findAll();
        $datos = array_filter($estados);
        $datos = array_map([EstadoSerializer::class, 'serialize'], $datos);
        return $datos;
    }

    public function obtener(int $id)
    {
        $estado = $this->find($id);

        if (!$estado) {
            return null;
        }

        $datos = EstadoSerializer::serialize($estado);
        return $datos;
    }

    public function crear(EstadoDTO $dto)
    {
        $estado = new Estado();
        $estado->setNombre($dto->nombre);

        $em = $this->getEntityManager();
        $em->persist($estado);
        $em->flush();

        $datos = EstadoSerializer::serialize($estado);

        return $datos;
    }

    public function actualizar(int $id, EstadoDTO $dto)
    {
        $estado = $this->find($id);

        if (!$estado) {
            return null;
        }

        $em = $this->getEntityManager();

        $estado->setNombre($dto->nombre);
        
        $em->flush();

        $datos = EstadoSerializer::serialize($estado);

        return $datos;
    }

    public function eliminar(int $id)
    {
        $estado = $this->find($id);

        if (!$estado) {
            return false;
        }

        $em = $this->getEntityManager();

        $em->remove($estado);
        $em->flush();

        return true;
    }
}
