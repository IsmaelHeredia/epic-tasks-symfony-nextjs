<?php

namespace App\Entity;

use App\Repository\TareaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TareaRepository::class)]
class Tarea
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['tarea:list', 'tarea:detail', 'subtarea:detail'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['tarea:list', 'tarea:detail', 'subtarea:detail'])]
    private string $titulo;

    #[ORM\Column(type: 'text')]
    #[Groups(['tarea:list', 'tarea:detail', 'subtarea:detail'])]
    private string $contenido;

    #[ORM\Column(type: 'integer')]
    #[Groups(['tarea:list', 'tarea:detail', 'subtarea:detail'])]
    private int $orden;

    #[ORM\ManyToOne(targetEntity: Estado::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['tarea:list', 'tarea:detail', 'subtarea:detail'])]
    private ?Estado $estado = null;

    #[ORM\ManyToOne(targetEntity: Prioridad::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['tarea:list', 'tarea:detail', 'subtarea:detail'])]
    private ?Prioridad $prioridad = null;

    #[ORM\ManyToMany(targetEntity: Categoria::class, inversedBy: 'tareas')]
    #[ORM\JoinTable(name: 'tareas_categorias')]
    #[Groups(['tarea:detail', 'subtarea:detail'])]
    private Collection $categorias;

    #[ORM\OneToMany(mappedBy: 'tarea', targetEntity: Subtarea::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['tarea:detail'])]
    private Collection $subtareas;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['tarea:list', 'tarea:detail'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['tarea:list', 'tarea:detail'])]
    private \DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->categorias = new ArrayCollection();
        $this->subtareas = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitulo(): string
    {
        return $this->titulo;
    }

    public function setTitulo(string $titulo): self
    {
        $this->titulo = $titulo;
        return $this;
    }

    public function getContenido(): string
    {
        return $this->contenido;
    }

    public function setContenido(string $contenido): self
    {
        $this->contenido = $contenido;
        return $this;
    }

    public function getOrden(): int
    {
        return $this->orden;
    }

    public function setOrden(int $orden): self
    {
        $this->orden = $orden;
        return $this;
    }

    public function getEstado(): ?Estado
    {
        return $this->estado;
    }

    public function setEstado(?Estado $estado): self
    {
        $this->estado = $estado;
        return $this;
    }

    public function getPrioridad(): ?Prioridad
    {
        return $this->prioridad;
    }

    public function setPrioridad(?Prioridad $prioridad): self
    {
        $this->prioridad = $prioridad;
        return $this;
    }

    public function getCategorias(): Collection
    {
        return $this->categorias;
    }

    public function addCategoria(Categoria $categoria): static
    {
        if (!$this->categorias->contains($categoria)) {
            $this->categorias->add($categoria);
            $categoria->addTarea($this);
        }

        return $this;
    }

    public function removeCategoria(Categoria $categoria): static
    {
        if ($this->categorias->removeElement($categoria)) {
            $categoria->removeTarea($this);
        }

        return $this;
    }

    public function getSubtareas(): Collection
    {
        return $this->subtareas;
    }

    public function addSubtarea(Subtarea $subtarea): self
    {
        if (!$this->subtareas->contains($subtarea)) {
            $this->subtareas[] = $subtarea;
            $subtarea->setTarea($this);
        }

        return $this;
    }

    public function removeSubtarea(Subtarea $subtarea): self
    {
        if ($this->subtareas->removeElement($subtarea)) {
            if ($subtarea->getTarea() === $this) {
                $subtarea->setTarea(null);
            }
        }

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
}
