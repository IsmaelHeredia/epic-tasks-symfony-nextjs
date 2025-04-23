<?php

namespace App\Entity;

use App\Repository\EstadoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EstadoRepository::class)]
class Estado
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['estado:list', 'estado:detail', 'tarea:detail', 'subtarea:detail'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['estado:list', 'estado:detail', 'tarea:detail', 'subtarea:detail'])]
    private string $nombre;

    #[ORM\OneToMany(mappedBy: 'estado', targetEntity: Tarea::class)]
    private Collection $tareas;

    #[ORM\OneToMany(mappedBy: 'estado', targetEntity: Subtarea::class)]
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

    public function getTareas(): Collection
    {
        return $this->tareas;
    }

    public function addTarea(Tarea $tarea): self
    {
        if (!$this->tareas->contains($tarea)) {
            $this->tareas[] = $tarea;
            $tarea->setEstado($this);
        }

        return $this;
    }

    public function removeTarea(Tarea $tarea): self
    {
        if ($this->tareas->removeElement($tarea)) {
            if ($tarea->getEstado() === $this) {
                $tarea->setEstado(null);
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
            $subtarea->setEstado($this);
        }

        return $this;
    }

    public function removeSubtarea(Subtarea $subtarea): self
    {
        if ($this->subtareas->removeElement($subtarea)) {
            if ($subtarea->getEstado() === $this) {
                $subtarea->setEstado(null);
            }
        }

        return $this;
    }
}
