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
        $estadoNombres = [
            'Pendiente',
            'En Progreso',
            'Completada',
            'Bloqueada',
            'Archivada'
        ];

        $estados = [];

        foreach ($estadoNombres as $nombre) {
            $estado = new Estado();
            $estado->setNombre($nombre);
            $manager->persist($estado);
            $estados[] = $estado;
        }

        $prioridadData = [
            'Baja',       
            'Media',      
            'Alta',       
            'Urgente',    
            'Crítica'     
        ];

        $prioridades = [];

        foreach ($prioridadData as $nombre) {
            $prioridad = new Prioridad();
            $prioridad->setNombre($nombre);
            $manager->persist($prioridad);
            $prioridades[] = $prioridad;
        }

        $categoriaNombres = [
            'Trabajo',
            'Personal',
            'Estudios',
            'Salud y Bienestar',
            'Finanzas',
            'Hogar',
            'Proyectos Personales',
            'Compras',
            'Social y Eventos',
            'Viajes'
        ];

        $categorias = [];

        foreach ($categoriaNombres as $nombre) {
            $categoria = new Categoria();
            $categoria->setNombre($nombre);
            $manager->persist($categoria);
            $categorias[] = $categoria;
        }

        $usuario = new Usuario();
        $usuario->setNombre('admin');
        $usuario->setImagen('default.png');
        $usuario->setEmail('admin@localhost.com');
        $usuario->setClave($this->hasher->hashPassword($usuario, 'Admin1234!'));
        $usuario->setCreatedAt(new \DateTimeImmutable());
        $usuario->setUpdatedAt(new \DateTime());
        $manager->persist($usuario);

        $tareasData = [
            [
                'titulo' => 'Planificar el proyecto de lanzamiento de la app',
                'contenido' => 'Definir el alcance, los hitos y los recursos necesarios para el lanzamiento de la nueva aplicación móvil.',
                'subtareas' => [
                    ['titulo' => 'Definir la arquitectura de la app', 'contenido' => 'Establecer la estructura técnica y las tecnologías a utilizar.'],
                    ['titulo' => 'Diseñar la interfaz de usuario (UI/UX)', 'contenido' => 'Crear wireframes, mockups y prototipos para la experiencia de usuario.'],
                    ['titulo' => 'Desarrollar el backend', 'contenido' => 'Implementar la lógica del servidor, la base de datos y las APIs.'],
                    ['titulo' => 'Desarrollar el frontend', 'contenido' => 'Codificar la interfaz de usuario y la interactividad en el cliente.'],
                    ['titulo' => 'Configurar el entorno de pruebas', 'contenido' => 'Preparar servidores y herramientas para las pruebas de calidad.']
                ]
            ],
            [
                'titulo' => 'Organizar la limpieza a fondo del hogar',
                'contenido' => 'Realizar una limpieza profunda en todas las habitaciones de la casa, incluyendo áreas difíciles de alcanzar.',
                'subtareas' => [
                    ['titulo' => 'Limpiar cocina (horno, nevera)', 'contenido' => 'Desengrasar y desinfectar electrodomésticos y superficies.'],
                    ['titulo' => 'Limpiar baños (azulejos, grifos)', 'contenido' => 'Eliminar sarro, hongos y desinfectar sanitarios.'],
                    ['titulo' => 'Aspirar y fregar suelos', 'contenido' => 'Limpiar todas las superficies de suelo de la casa.'],
                    ['titulo' => 'Limpiar ventanas y persianas', 'contenido' => 'Dejar cristales relucientes y quitar el polvo de las persianas.'],
                    ['titulo' => 'Organizar armarios y cajones', 'contenido' => 'Clasificar y desechar lo innecesario en ropa y objetos.']
                ]
            ],
            [
                'titulo' => 'Preparar el examen final de Bases de Datos',
                'contenido' => 'Repasar todos los temas del temario y practicar con ejercicios de años anteriores.',
                'subtareas' => [
                    ['titulo' => 'Estudiar normalización de bases de datos', 'contenido' => 'Comprender las formas normales y su aplicación.'],
                    ['titulo' => 'Practicar consultas SQL avanzadas', 'contenido' => 'Realizar ejercicios de JOINs, subconsultas y funciones de agregación.'],
                    ['titulo' => 'Repasar transacciones y control de concurrencia', 'contenido' => 'Entender ACID y mecanismos de bloqueo.'],
                    ['titulo' => 'Crear un resumen de temas clave', 'contenido' => 'Elaborar un documento conciso con los conceptos más importantes.'],
                    ['titulo' => 'Hacer un simulacro de examen', 'contenido' => 'Resolver un examen completo bajo condiciones de tiempo.']
                ]
            ],
            [
                'titulo' => 'Diseñar la nueva campaña de marketing digital',
                'contenido' => 'Crear una estrategia de marketing online para el próximo trimestre, incluyendo SEO, SEM y redes sociales.',
                'subtareas' => [
                    ['titulo' => 'Investigar palabras clave SEO', 'contenido' => 'Identificar términos relevantes para mejorar el posicionamiento orgánico.'],
                    ['titulo' => 'Configurar campañas de Google Ads', 'contenido' => 'Crear anuncios, establecer presupuestos y seleccionar audiencias.'],
                    ['titulo' => 'Desarrollar contenido para redes sociales', 'contenido' => 'Diseñar imágenes y redactar textos atractivos para posts.'],
                    ['titulo' => 'Establecer KPIs y métricas de seguimiento', 'contenido' => 'Definir indicadores de rendimiento para evaluar la campaña.'],
                    ['titulo' => 'Programar publicaciones y ads', 'contenido' => 'Utilizar herramientas para automatizar la difusión del contenido.']
                ]
            ],
            [
                'titulo' => 'Comprar los regalos de cumpleaños de la familia',
                'contenido' => 'Adquirir los regalos para los próximos cumpleaños de mi familia, pensando en sus gustos e intereses.',
                'subtareas' => [
                    ['titulo' => 'Investigar ideas de regalos para mamá', 'contenido' => 'Buscar opciones basadas en sus hobbies y necesidades.'],
                    ['titulo' => 'Comprar el regalo de papá', 'contenido' => 'Adquirir el artículo seleccionado y envolverlo.'],
                    ['titulo' => 'Elegir el regalo de mi hermano/a', 'contenido' => 'Pensar en algo práctico o relacionado con sus pasiones.'],
                    ['titulo' => 'Comprar tarjetas de felicitación', 'contenido' => 'Seleccionar tarjetas adecuadas para cada regalo.'],
                    ['titulo' => 'Envolver todos los regalos', 'contenido' => 'Preparar los paquetes de forma atractiva.']
                ]
            ],
            [
                'titulo' => 'Agendar y realizar chequeo médico anual',
                'contenido' => 'Programar una cita con el médico de cabecera y especialistas para un chequeo de salud completo.',
                'subtareas' => [
                    ['titulo' => 'Solicitar cita con médico de cabecera', 'contenido' => 'Pedir hora para revisión general y derivaciones.'],
                    ['titulo' => 'Programar análisis de sangre', 'contenido' => 'Agendar la extracción para las pruebas solicitadas.'],
                    ['titulo' => 'Visitar al dentista para revisión', 'contenido' => 'Chequeo dental y limpieza si es necesario.'],
                    ['titulo' => 'Hacer ejercicio físico semanalmente', 'contenido' => 'Mantener una rutina activa para mejorar la salud general.'],
                    ['titulo' => 'Revisar hábitos alimenticios', 'contenido' => 'Evaluar y ajustar la dieta para una alimentación más saludable.']
                ]
            ],
            [
                'titulo' => 'Planificar las vacaciones de verano',
                'contenido' => 'Definir el destino, presupuesto, alojamiento y actividades para las próximas vacaciones.',
                'subtareas' => [
                    ['titulo' => 'Investigar destinos posibles', 'contenido' => 'Explorar opciones de viaje y sus atractivos.'],
                    ['titulo' => 'Comparar precios de vuelos/transporte', 'contenido' => 'Buscar las mejores ofertas para el viaje.'],
                    ['titulo' => 'Reservar alojamiento', 'contenido' => 'Seleccionar y asegurar el lugar donde hospedarse.'],
                    ['titulo' => 'Crear itinerario de actividades', 'contenido' => 'Planificar visitas, tours y experiencias diarias.'],
                    ['titulo' => 'Armar el presupuesto de viaje', 'contenido' => 'Estimar gastos de comida, transporte, actividades, etc.']
                ]
            ],
            [
                'titulo' => 'Investigar nuevas inversiones financieras',
                'contenido' => 'Explorar opciones de inversión para diversificar la cartera y maximizar rendimientos.',
                'subtareas' => [
                    ['titulo' => 'Analizar fondos de inversión mutuos', 'contenido' => 'Evaluar rendimiento histórico y comisiones.'],
                    ['titulo' => 'Estudiar el mercado de criptomonedas', 'contenido' => 'Comprender riesgos y oportunidades en activos digitales.'],
                    ['titulo' => 'Consultar con un asesor financiero', 'contenido' => 'Obtener orientación profesional sobre opciones de inversión.'],
                    ['titulo' => 'Revisar estado de la cartera actual', 'contenido' => 'Evaluar el rendimiento de las inversiones existentes.'],
                    ['titulo' => 'Configurar alertas de mercado', 'contenido' => 'Recibir notificaciones sobre movimientos de precios de interés.']
                ]
            ],
            [
                'titulo' => 'Aprender un nuevo idioma (Francés)',
                'contenido' => 'Dedicar tiempo diario a estudiar francés, enfocándose en gramática, vocabulario y conversación.',
                'subtareas' => [
                    ['titulo' => 'Inscribirse en un curso de francés', 'contenido' => 'Buscar y apuntarse a clases online o presenciales.'],
                    ['titulo' => 'Practicar 30 min diarios con Duolingo', 'contenido' => 'Usar la aplicación para reforzar vocabulario y frases.'],
                    ['titulo' => 'Ver series/películas en francés con subtítulos', 'contenido' => 'Familiarizarse con la pronunciación y el ritmo del idioma.'],
                    ['titulo' => 'Buscar un compañero de intercambio de idioma', 'contenido' => 'Practicar conversación con un hablante nativo.'],
                    ['titulo' => 'Estudiar la gramática básica (verbos)', 'contenido' => 'Comprender las reglas de conjugación y estructura de oraciones.']
                ]
            ],
            [
                'titulo' => 'Organizar la fiesta de fin de año del equipo',
                'contenido' => 'Planificar y coordinar todos los detalles para la celebración de fin de año del equipo de trabajo.',
                'subtareas' => [
                    ['titulo' => 'Establecer la fecha y hora del evento', 'contenido' => 'Coordinar la disponibilidad de los miembros del equipo.'],
                    ['titulo' => 'Reservar el lugar/restaurante', 'contenido' => 'Buscar y asegurar un espacio adecuado para la celebración.'],
                    ['titulo' => 'Definir el menú y bebidas', 'contenido' => 'Elegir opciones gastronómicas y de coctelería.'],
                    ['titulo' => 'Crear la lista de invitados y enviar invitaciones', 'contenido' => 'Recopilar los asistentes y distribuir los detalles del evento.'],
                    ['titulo' => 'Planificar actividades de entretenimiento', 'contenido' => 'Considerar juegos, música o presentaciones para la fiesta.']
                ]
            ],
        ];

        foreach ($tareasData as $i => $data) {
            $tarea = new Tarea();
            $tarea->setTitulo($data['titulo']);
            $tarea->setContenido($data['contenido']);
            $tarea->setOrden($i + 1);
            $tarea->setEstado($estados[array_rand($estados)]);
            $tarea->setPrioridad($prioridades[array_rand($prioridades)]);

            $numCategorias = rand(1, 3);

            $selectedCategories = (array) array_rand($categorias, $numCategorias);

            foreach ($selectedCategories as $catIndex) {
                $tarea->addCategoria($categorias[$catIndex]);
            }

            $tarea->setCreatedAt(new \DateTimeImmutable());
            $tarea->setUpdatedAt(new \DateTimeImmutable());
            
            $manager->persist($tarea);

            foreach ($data['subtareas'] as $j => $subtareaData) {
                $subtarea = new Subtarea();
                $subtarea->setTitulo($subtareaData['titulo']);
                $subtarea->setContenido($subtareaData['contenido']);
                $subtarea->setOrden($j + 1);
                $subtarea->setTarea($tarea);
                $subtarea->setEstado($estados[array_rand($estados)]);
                $subtarea->setPrioridad($prioridades[array_rand($prioridades)]);

                $numSubCategorias = rand(1, 2);

                $selectedSubCategories = (array) array_rand($categorias, $numSubCategorias);

                foreach ($selectedSubCategories as $subCatIndex) {
                    $subtarea->addCategoria($categorias[$subCatIndex]);
                }

                $subtarea->setCreatedAt(new \DateTimeImmutable());
                $subtarea->setUpdatedAt(new \DateTimeImmutable());

                $manager->persist($subtarea);
            }
        }

        $manager->flush();
    }
}
