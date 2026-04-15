"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocale } from "@/lib/i18n";

interface ConfirmDeleteModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

export default function ConfirmDeleteModal({
  isModalOpen,
  setIsModalOpen,
  title,
  description,
  onConfirm,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const { t } = useLocale();

  const handleClose = () => {
    if (!isLoading) setIsModalOpen(false);
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            borderRadius: "24px",
            minWidth: { xs: "90%", sm: "400px" },
            border: "1px solid rgba(248, 81, 73, 0.2)",
            boxShadow:
              "0 24px 48px rgba(0, 0, 0, 0.5), 0 0 80px rgba(248, 81, 73, 0.05)",
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: "12px",
              bgcolor: "rgba(248, 81, 73, 0.1)",
              color: "#F85149",
              display: "flex",
            }}
          >
            <WarningAmberIcon />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, pb: 1, pt: 1 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="text"
          disabled={isLoading}
          sx={{
            color: "text.secondary",
            borderRadius: "12px",
            px: 2.5,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.04)",
            },
          }}
        >
          {t.modals.cancel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isLoading}
          sx={{
            borderRadius: "12px",
            px: 3,
            bgcolor: "#F85149",
            color: "#FFFFFF",
            "&:hover": {
              bgcolor: "#D13B36",
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : t.common.delete}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
