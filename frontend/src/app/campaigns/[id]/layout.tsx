"use client";

import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useGetCampaign from "@/lib/hooks/useGetCampaign";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import useSearchQuery from "@/lib/hooks/useSearchQuery";
import useTemplates from "@/lib/hooks/useTemplates";
import useFolders from "@/lib/hooks/useFolders";
import useDocuments from "@/lib/hooks/useDocuments";

export default function sideBar() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const campaign = useGetCampaign(campaignId);
  const templates = useTemplates(campaignId);
  const documents = useDocuments(campaignId);
  const folders = useFolders(campaignId);

  const searchQuery = useSearchQuery(campaignId, "teste");

  return (
    <Box
      sx={{
        width: "300px",
        minWidth: "300px",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            onClick={() => router.push(`/campaigns`)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <IconButton aria-label="Voltar" size="small">
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: '"Merriweather", "Georgia", serif',
                color: "primary.main",
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "180px",
              }}
            >
              {campaign.data?.name}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title={"Adicionar Membro"}>
              <IconButton
                aria-label="Membros"
                size="small"
                onClick={() => console.log("members modal open")}
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <TextField
          placeholder="Buscar documentos..."
          value={"searchQuery"}
          onChange={(e) => console.log("handlesearch")}
          fullWidth
          size="small"
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "background.default",
              fontSize: "0.875rem",
              borderRadius: "12px",
            },
          }}
        />
      </Box>

      <Stack direction={"row"} spacing={1} sx={{ p: 1 }}>
        <Button
          size="small"
          variant="text"
          color="inherit"
          startIcon={<AddIcon />}
          onClick={() => console.log("docmodal open")}
          sx={{ flex: 1, fontSize: "o.75rem" }}
        >
          Doc
        </Button>
        <Button
          size="small"
          variant="text"
          color="inherit"
          startIcon={<FolderIcon />}
          onClick={() => console.log("modalOpen")}
          sx={{ flex: 1, fontSize: "o.75rem" }}
        >
          Pasta
        </Button>
        <Button
          size="small"
          variant="text"
          color="inherit"
          startIcon={<SettingsIcon />}
          onClick={() => console.log("templateModal.onOpen")}
          sx={{ flex: 1, fontSize: "0.75rem" }}
        >
          Template
        </Button>
      </Stack>

      <Divider sx={{ borderColor: "divider" }} />

      <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        {searchQuery.data !== null ? (
          <Stack direction={"column"} spacing={1}>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", px: 1, pb: 0.5 }}
            >
              Resultados da busca
            </Typography>
            {searchQuery.data?.length === 0 ? (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  py: 4,
                  display: "block",
                }}
              >
                Nenhum Resultado
              </Typography>
            ) : (
              searchQuery.data?.map((doc) => <Typography>teste</Typography>)
            )}
          </Stack>
        ) : (
          <Stack direction={"column"} spacing={0}>
            {templates.data?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    px: 1,
                    pb: 0.5,
                    display: "block",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    letterSpacing: "0.05em",
                  }}
                >
                  Templates
                </Typography>
                {templates.data?.map((template) => (
                  <Box
                    key={template.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1,
                      py: 0.5,
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    <span>{template.Icon}</span>
                    <span>{template.Name}</span>
                  </Box>
                ))}
                <Divider sx={{ borderColor: "divider", my: 1 }} />
              </Box>
            )}

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                px: 1,
                pb: 0.5,
                display: "block",
                textTransform: "uppercase",
                fontWeight: "bold",
                letterSpacing: "0.05em",
              }}
            >
              Arquivos
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
