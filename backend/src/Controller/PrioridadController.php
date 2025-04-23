<?php

namespace App\Controller;

use App\DTO\PrioridadDTO;
use App\Service\PrioridadService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;
use App\Utils\DtoValidator;

#[Route('/api/prioridades')]
class PrioridadController extends AbstractController
{
    public function __construct(private PrioridadService $prioridadService) {}

    #[Route('/', name: 'listar_prioridades', methods: ['GET'])]
    #[OA\Get(summary: 'Listar todas las prioridades')]
    public function listar(): JsonResponse
    {
        $prioridades = $this->prioridadService->listar();
        return $this->json(['mensaje' => 'Prioridades listadas correctamente', 'prioridades' => $prioridades], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'obtener_prioridad', methods: ['GET'])]
    #[OA\Get(summary: 'Obtener una prioridad por ID')]
    public function obtener(int $id): JsonResponse
    {
        $prioridad = $this->prioridadService->obtener($id);

        if (!$prioridad) {
            return $this->json(['error' => 'Prioridad no encontrada.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['mensaje' => 'Prioridad cargada correctamente', 'prioridad' => $prioridad], Response::HTTP_OK);
    }

    #[Route('/', name: 'crear_prioridad', methods: ['POST'])]
    #[OA\Post(summary: 'Crear una nueva prioridad')]
    public function crear(Request $request, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new PrioridadDTO();
        $dto->nombre = $data['nombre'] ?? null;
        $dto->color = $data['color'] ?? null;

        $dtoValidator->validate($dto);

        $prioridad = $this->prioridadService->crear($dto);

        return $this->json(['mensaje' => 'Prioridad creada correctamente', 'prioridad' => $prioridad], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'actualizar_prioridad', methods: ['PUT'])]
    #[OA\Put(summary: 'Actualizar una prioridad existente')]
    public function actualizar(Request $request, int $id, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new PrioridadDTO();
        $dto->nombre = $data['nombre'] ?? null;
        $dto->color = $data['color'] ?? null;

        $dtoValidator->validate($dto);

        $prioridad = $this->prioridadService->actualizar($id, $dto);

        if (!$prioridad) {
            return $this->json(['error' => 'Prioridad no encontrada.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['mensaje' => 'Prioridad actualizada con éxito', 'prioridad' => $prioridad], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'eliminar_prioridad', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Eliminar una prioridad existente')]
    public function eliminar(int $id): JsonResponse
    {
        $exito = $this->prioridadService->eliminar($id);

        if (!$exito) {
            return $this->json(['error' => 'Prioridad no encontrada.'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['mensaje' => 'Prioridad eliminada con éxito.'], Response::HTTP_OK);
    }
}