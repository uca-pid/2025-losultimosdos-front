"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

export function NewBadgeModal({
  badge,
  open,
  onClose,
}: {
  badge: any;
  open: boolean;
  onClose: (open: boolean) => void;
}) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (open && badge && !firedRef.current) {
      firedRef.current = true;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    if (!open) {
      firedRef.current = false;
    }
  }, [open, badge]);

  if (!badge) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-background border border-primary max-w-md text-center p-8">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-3"
        >
          <div className="text-5xl">{badge.icon}</div>

          <h2 className="text-2xl font-bold text-primary">
            ¡Nuevo logro desbloqueado!
          </h2>

          <p className="text-lg font-semibold">{badge.name}</p>

          <p className="text-muted-foreground">{badge.description}</p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
