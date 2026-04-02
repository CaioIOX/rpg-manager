"use client";

import useMaps from "@/lib/hooks/useMaps";
import useDeleteMap from "@/lib/hooks/useDeleteMap";
import { MapSummary } from "@/lib/types/Map";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import AddIcon from "@mui/icons-material/Add";
import MapIcon from "@mui/icons-material/Map";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import MapListCard from "./_components/MapListCard";
import CreateMapModal from "./_components/CreateMapModal";
import ConfirmDeleteModal from "../../_components/ConfirmDeleteModal";

export default function MapsPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const queryClient = useQueryClient();

  const { data: maps, isLoading } = useMaps(campaignId);
  const deleteMap = useDeleteMap();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [mapToDelete, setMapToDelete] = useState<MapSummary | undefined>();

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: { xs: 3, md: 4 },
          animation: "fadeInUp 0.5s ease-out",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #E6E6E6 0%, #8B949E 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
              fontSize: { xs: "1.8rem", sm: "2.125rem" },
            }}
          >
            Mapas
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Gerencie os mapas da sua campanha
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1,
            background: "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
            fontWeight: 600,
            fontSize: "0.85rem",
            textTransform: "none",
            boxShadow: "0 4px 16px rgba(212, 175, 55, 0.2)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
              boxShadow: "0 6px 20px rgba(212, 175, 55, 0.3)",
            },
          }}
        >
          Novo Mapa
        </Button>
      </Box>

      {/* Map grid */}
      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={200}
              sx={{
                borderRadius: "16px",
                bgcolor: "rgba(22, 27, 34, 0.5)",
              }}
            />
          ))}
        </Box>
      ) : maps && maps.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {maps.map((map) => (
            <MapListCard
              key={map.id}
              map={map}
              onDelete={setMapToDelete}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <MapIcon
            sx={{
              fontSize: 64,
              color: "rgba(212, 175, 55, 0.12)",
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              mb: 1,
            }}
          >
            Nenhum mapa ainda
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.disabled", mb: 3, maxWidth: 400, mx: "auto" }}
          >
            Faça upload de imagens de mapas para marcar locais importantes, criar
            pontos de interesse e vincular documentos da sua campanha.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
            sx={{
              borderRadius: "12px",
              px: 3,
              borderColor: "rgba(212, 175, 55, 0.3)",
              color: "#D4AF37",
              "&:hover": {
                borderColor: "#D4AF37",
                bgcolor: "rgba(212, 175, 55, 0.06)",
              },
            }}
          >
            Criar Primeiro Mapa
          </Button>
        </Box>
      )}

      {/* Modals */}
      <CreateMapModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
      />

      <ConfirmDeleteModal
        isModalOpen={!!mapToDelete}
        setIsModalOpen={() => setMapToDelete(undefined)}
        title="Apagar Mapa"
        description={`Tem certeza que deseja apagar o mapa "${mapToDelete?.name}"? Todos os marcadores serão removidos.`}
        isLoading={deleteMap.isPending}
        onConfirm={() => {
          if (mapToDelete) {
            deleteMap.mutate(
              { campaignId, mapId: mapToDelete.id },
              {
                onSuccess: () => {
                  setMapToDelete(undefined);
                  queryClient.invalidateQueries({
                    queryKey: ["maps", campaignId],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["currentUser"],
                  });
                },
              },
            );
          }
        }}
      />
    </Box>
  );
}
