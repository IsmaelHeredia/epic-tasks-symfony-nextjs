<?php

namespace App\Repository;

use App\Entity\Tarea;
use App\DTO\TareaDTO;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\EstadoRepository;
use App\Repository\PrioridadRepository;
use App\Repository\CategoriaRepository;

use App\Serializer\TareaSerializer;

class TareaRepository extends ServiceEntityRepository
{
    private EstadoRepository $estadoRepository;
    private PrioridadRepository $prioridadRepository;
    private CategoriaRepository $categoriaRepository;

    public function __construct(
        ManagerRegistry $registry,
        EstadoRepository $estadoRepository,
        PrioridadRepository $prioridadRepository,
        CategoriaRepository $categoriaRepository
    ) {
        parent::__construct($registry, Tarea::class);
        $this->estadoRepository = $estadoRepository;
        $this->prioridadRepository = $prioridadRepository;
        $this->categoriaRepository = $categoriaRepository;
    }

    public function listar()
    {
        $tareas = $this->findAll();
        $datos = array_filter($tareas);
        $datos = array_map([TareaSerializer::class, 'serialize'], $datos);
        return $datos;
    }

    public function obtener(int $id)
    {
        $tarea = $this->find($id);

        if (!$tarea) {
            return null;
        }

        $datos = TareaSerializer::serialize($tarea);
        return $datos;
    }

    public function crear(TareaDTO $dto)
    {
        $tarea = new Tarea();
        $tarea->setTitulo($dto->titulo);
        $tarea->setContenido($dto->contenido);
        $tarea->setOrden($dto->orden);
        $tarea->setCreatedAt(new \DateTimeImmutable());
        $tarea->setUpdatedAt(new \DateTimeImmutable());

        if ($dto->estadoId) {
            $estado = $this->estadoRepository->find($dto->estadoId);
            $tarea->setEstado($estado);
        }

        if ($dto->prioridadId) {
            $prioridad = $this->prioridadRepository->find($dto->prioridadId);
            $tarea->setPrioridad($prioridad);
        }

        foreach ($dto->categoriasId as $categoriaId) {
            $categoria = $this->categoriaRepository->find($categoriaId);
            if ($categoria) {
                $tarea->addCategoria($categoria);
            }
        }

        $em = $this->getEntityManager();
        $em->persist($tarea);
        $em->flush();

        $datos = TareaSerializer::serialize($tarea);

        return $datos;
    }

    public function actualizar(int $id, TareaDTO $dto)
    {
        $tarea = $this->find($id);

        if (!$tarea) {
            return null;
        }

        $em = $this->getEntityManager();

        $tarea->setTitulo($dto->titulo);
        $tarea->setContenido($dto->contenido);
        $tarea->setOrden($dto->orden);
        $tarea->setUpdatedAt(new \DateTimeImmutable());

        $tarea->setEstado($dto->estadoId ? $this->estadoRepository->find($dto->estadoId) : null);
        $tarea->setPrioridad($dto->prioridadId ? $this->prioridadRepository->find($dto->prioridadId) : null);

        $tarea->getCategorias()->clear();

        foreach ($dto->categoriasId as $categoriaId) {
            $categoria = $this->categoriaRepository->find($categoriaId);
            if ($categoria) {
                $tarea->addCategoria($categoria);
            }
        }
        
        $em->flush();

        $datos = TareaSerializer::serialize($tarea);

        return $datos;
    }

    public function eliminar(int $id): bool
    {
        $tarea = $this->find($id);

        if (!$tarea) {
            return false;
        }

        $em = $this->getEntityManager();

        $em->remove($tarea);
        $em->flush();

        return true;
    }
}