<?php

namespace App\Controller;

use App\Service\EstadisticasService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Attributes as OA;

#[Route('/api/estadisticas')]
class EstadisticasController extends AbstractController
{
    public function __construct(private readonly EstadisticasService $estadisticasService)
    {
    }

    #[Route('/', name: 'generar_estadisticas', methods: ['GET'])]
    #[OA\Get(summary: 'Muestra las estadísticas')]
    public function index(): JsonResponse
    {
        $reporte = $this->estadisticasService->generarReporte();

        $data = array_map(function($item) {
            return [
                'nombreCategoria' => $item->nombreCategoria,
                'totalTareas' => $item->totalTareasSubtareas,
            ];
        }, $reporte);

        return $this->json(['mensaje' => 'Estadísticas cargadas correctamente', 'estadisticas' => $data], Response::HTTP_OK);
    }
}