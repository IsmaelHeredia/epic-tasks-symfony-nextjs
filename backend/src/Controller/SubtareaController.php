<?php

namespace App\Controller;

use App\DTO\SubtareaDTO;
use App\Service\SubtareaService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Attributes as OA;
use App\Utils\DtoValidator;

#[Route('/api/subtareas')]
class SubtareaController extends AbstractController
{
    public function __construct(
        private SubtareaService $subtareaService,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('', methods: ['GET'])]
    #[OA\Get(summary: 'Listar todas las subtareas')]
    public function listar(): JsonResponse
    {
        $subtareas = $this->subtareaService->listar();
        return $this->json(['mensaje' => 'Subtareas listadas correctamente', 'subtareas' => $subtareas], Response::HTTP_OK);
    }

    #[Route('/{id}', methods: ['GET'])]
    #[OA\Get(summary: 'Obtener una subtarea por ID')]
    public function obtener(int $id): JsonResponse
    {
        $subtarea = $this->subtareaService->obtener($id);

        if (!$subtarea) {
            return $this->json(['mensaje' => 'Subtarea no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['mensaje' => 'Subtarea cargada correctamente', 'subtarea' => $subtarea], Response::HTTP_OK);
    }

    #[Route('', methods: ['POST'])]
    #[OA\Post(summary: 'Crear una nueva subtarea')]
    public function crear(Request $request, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new SubtareaDTO();
        $dto->titulo = $data['titulo'] ?? null;
        $dto->contenido = $data['contenido'] ?? null;
        $dto->orden = $data['orden'] ?? null;
        $dto->estadoId = $data['estadoId'] ?? null;
        $dto->prioridadId = $data['prioridadId'] ?? null;
        $dto->categoriasId = $data['categoriasId'] ?? [];
        $dto->tareaId = $data['tareaId'] ?? null;

        $dtoValidator->validate($dto);

        $tarea = $this->subtareaService->crear($dto);

        return $this->json(['mensaje' => 'Subtarea creada correctamente', 'tarea' => $tarea], Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['PUT'])]
    #[OA\Put(summary: 'Actualizar una subtarea existente')]
    public function actualizar(int $id, Request $request, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new SubtareaDTO();
        $dto->titulo = $data['titulo'] ?? null;
        $dto->contenido = $data['contenido'] ?? null;
        $dto->orden = $data['orden'] ?? null;
        $dto->estadoId = $data['estadoId'] ?? null;
        $dto->prioridadId = $data['prioridadId'] ?? null;
        $dto->categoriasId = $data['categoriasId'] ?? [];
        $dto->tareaId = $data['tareaId'] ?? null;

        $dtoValidator->validate($dto);

        $subtarea = $this->subtareaService->actualizar($id, $dto);

        if (!$subtarea) {
            return $this->json(['error' => 'Subtarea no encontrada'], 404);
        }

        return $this->json(['mensaje' => 'Subtarea actualizada con éxito', 'subtarea' => $subtarea], Response::HTTP_OK);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Eliminar una subtarea existente')]
    public function eliminar(int $id): JsonResponse
    {
        $eliminado = $this->subtareaService->eliminar($id);

        if (!$eliminado) {
            return $this->json(['mensaje' => 'Subtarea no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
