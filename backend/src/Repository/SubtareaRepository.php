<?php

namespace App\Repository;

use App\Entity\Subtarea;
use App\DTO\SubTareaDTO;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

use App\Serializer\SubtareaSerializer;

class SubtareaRepository extends ServiceEntityRepository
{
    private EstadoRepository $estadoRepository;
    private PrioridadRepository $prioridadRepository;
    private CategoriaRepository $categoriaRepository;
    private TareaRepository $tareaRepository;

    public function __construct(
        ManagerRegistry $registry,
        EstadoRepository $estadoRepository,
        PrioridadRepository $prioridadRepository,
        CategoriaRepository $categoriaRepository,
        TareaRepository $tareaRepository
    ) {
        parent::__construct($registry, Subtarea::class);
        $this->estadoRepository = $estadoRepository;
        $this->prioridadRepository = $prioridadRepository;
        $this->categoriaRepository = $categoriaRepository;
        $this->tareaRepository = $tareaRepository;
    }

    public function listar()
    {
        $subtareas = $this->findAll();
        $datos = array_filter($subtareas);
        $datos = array_map([SubtareaSerializer::class, 'serialize'], $datos);
        return $datos;
    }

    public function obtener(int $id)
    {
        $subtarea = $this->find($id);

        if (!$subtarea) {
            return null;
        }

        $datos = SubtareaSerializer::serialize($subtarea);
        return $datos;
    }

    public function crear(SubTareaDTO $dto)
    {
        $subtarea = new Subtarea();
        $subtarea->setTitulo($dto->titulo);
        $subtarea->setContenido($dto->contenido);
        $subtarea->setOrden($dto->orden);
        $subtarea->setCreatedAt(new \DateTimeImmutable());
        $subtarea->setUpdatedAt(new \DateTimeImmutable());

        if ($dto->estadoId) {
            $estado = $this->estadoRepository->find($dto->estadoId);
            $subtarea->setEstado($estado);
        }

        if ($dto->prioridadId) {
            $prioridad = $this->prioridadRepository->find($dto->prioridadId);
            $subtarea->setPrioridad($prioridad);
        }

        if ($dto->tareaId) {
            $tarea = $this->tareaRepository->find($dto->tareaId);
            $subtarea->setTarea($tarea);
        }

        foreach ($dto->categoriasId as $categoriaId) {
            $categoria = $this->categoriaRepository->find($categoriaId);
            if ($categoria) {
                $subtarea->addCategoria($categoria);
            }
        }

        $em = $this->getEntityManager();
        $em->persist($subtarea);
        $em->flush();

        $datos = SubtareaSerializer::serialize($subtarea);

        return $datos;
    }

    public function actualizar(int $id, SubtareaDTO $dto)
    {
        $subtarea = $this->find($id);

        if (!$subtarea) {
            return null;
        }

        $em = $this->getEntityManager();

        $subtarea->setTitulo($dto->titulo);
        $subtarea->setContenido($dto->contenido);
        $subtarea->setOrden($dto->orden);
        $subtarea->setUpdatedAt(new \DateTimeImmutable());

        $subtarea->setEstado($dto->estadoId ? $this->estadoRepository->find($dto->estadoId) : null);
        $subtarea->setPrioridad($dto->prioridadId ? $this->prioridadRepository->find($dto->prioridadId) : null);

        $subtarea->setTarea(
            $dto->tareaId ? $this->tareaRepository->find($dto->tareaId) : null
        );

        $subtarea->getCategorias()->clear();

        foreach ($dto->categoriasId as $categoriaId) {
            $categoria = $this->categoriaRepository->find($categoriaId);
            if ($categoria) {
                $subtarea->addCategoria($categoria);
            }
        }

        $subtarea->setUpdatedAt(new \DateTimeImmutable());
        
        $em->flush();

        $datos = SubtareaSerializer::serialize($subtarea);

        return $datos;
    }

    public function eliminar(int $id)
    {
        $subtarea = $this->find($id);

        if (!$subtarea) {
            return false;
        }

        $em = $this->getEntityManager();

        $em->remove($subtarea);
        $em->flush();

        return true;
    }
}