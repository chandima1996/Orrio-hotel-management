import React from "react";
import { ShieldAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  password,
  setPassword,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <ShieldAlert /> Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Enter admin password to confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label>Admin Password</Label>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            <Input
              type="password"
              placeholder="Hint: admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
