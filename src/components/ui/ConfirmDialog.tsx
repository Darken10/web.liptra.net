import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'warning';
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'warning',
  loading = false,
}: ConfirmDialogProps) {
  const getIconComponent = () => {
    switch (variant) {
      case 'danger':
        return <AlertTriangle className="h-12 w-12" />;
      case 'primary':
        return <CheckCircle2 className="h-12 w-12" />;
      default:
        return <AlertCircle className="h-12 w-12" />;
    }
  };

  const getIconBgColor = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-100';
      case 'primary':
        return 'bg-blue-100';
      default:
        return 'bg-amber-100';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'danger':
        return 'text-red-600';
      case 'primary':
        return 'text-blue-600';
      default:
        return 'text-amber-600';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col items-center gap-4 py-6 px-6">
        <div className={`rounded-full p-4 ${getIconBgColor()}`}>
          <div className={getIconColor()}>
            {getIconComponent()}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 w-full pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
