<?php

namespace App\Repository;

use App\Entity\Categoria;
use App\DTO\CategoriaDTO;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Serializer\CategoriaSerializer;
class CategoriaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Categoria::class);
    }

    public function listar()
    {
        $categorias = $this->findBy([], ['nombre' => 'ASC']);
        $datos = array_filter($categorias);
        $datos = array_map([CategoriaSerializer::class, 'serialize'], $datos);
        return $datos;
    }

    public function obtener(int $id)
    {
        $categoria = $this->find($id);

        if (!$categoria) {
            return null;
        }

        $datos = CategoriaSerializer::serialize($categoria);
        return $datos;
    }

    public function crear(CategoriaDTO $dto)
    {
        $categoria = new Categoria();
        $categoria->setNombre($dto->nombre);

        $em = $this->getEntityManager();
        $em->persist($categoria);
        $em->flush();

        $datos = CategoriaSerializer::serialize($categoria);

        return $datos;
    }

    public function actualizar(int $id, CategoriaDTO $dto)
    {
        $categoria = $this->find($id);

        if (!$categoria) {
            return null;
        }

        $em = $this->getEntityManager();

        $categoria->setNombre($dto->nombre);
        
        $em->flush();

        $datos = CategoriaSerializer::serialize($categoria);

        return $datos;
    }

    public function eliminar(int $id)
    {
        $categoria = $this->find($id);

        if (!$categoria) {
            return false;
        }

        $em = $this->getEntityManager();

        $em->remove($categoria);
        $em->flush();

        $datos = CategoriaSerializer::serialize($categoria);

        return $datos;
    }
}
