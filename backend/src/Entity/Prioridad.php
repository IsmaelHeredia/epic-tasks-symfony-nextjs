<?php

namespace App\Entity;

use App\Repository\PrioridadRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PrioridadRepository::class)]
class Prioridad
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['prioridad:list', 'prioridad:detail', 'tarea:detail', 'subtarea:detail'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['prioridad:list', 'prioridad:detail', 'tarea:detail', 'subtarea:detail'])]
    private string $nombre;

    #[ORM\Column(length: 7)]
    #[Groups(['prioridad:list', 'prioridad:detail', 'tarea:detail', 'subtarea:detail'])]
    private string $color;

    #[ORM\OneToMany(mappedBy: 'prioridad', targetEntity: Tarea::class)]
    private Collection $tareas;

    #[ORM\OneToMany(mappedBy: 'prioridad', targetEntity: Subtarea::class)]
    private Collection $subtareas;

    public function __construct()
    {
        $this->tareas = new ArrayCollection();
        $this->subtareas = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): self
    {
        $this->nombre = $nombre;
        return $this;
    }

    public function getColor(): string
    {
        return $this->color;
    }

    public function setColor(string $color): self
    {
        $this->color = $color;
        return $this;
    }

    public function getTareas(): Collection
    {
        return $this->tareas;
    }

    public function addTarea(Tarea $tarea): self
    {
        if (!$this->tareas->contains($tarea)) {
            $this->tareas[] = $tarea;
            $tarea->setPrioridad($this);
        }

        return $this;
    }

    public function removeTarea(Tarea $tarea): self
    {
        if ($this->tareas->removeElement($tarea)) {
            if ($tarea->getPrioridad() === $this) {
                $tarea->setPrioridad(null);
            }
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
            $subtarea->setPrioridad($this);
        }

        return $this;
    }

    public function removeSubtarea(Subtarea $subtarea): self
    {
        if ($this->subtareas->removeElement($subtarea)) {
            if ($subtarea->getPrioridad() === $this) {
                $subtarea->setPrioridad(null);
            }
        }

        return $this;
    }
}
