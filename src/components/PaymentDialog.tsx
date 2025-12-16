import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface DriverOffer {
  id: string;
  name: string;
  rating: number;
  trips: number;
  car: string;
  plate: string;
  photo: string;
  price: number;
  arrivalTime: string;
  distance: number;
  cardNumber: string;
  phone: string;
}

interface PaymentDialogProps {
  open: boolean;
  driver: DriverOffer | null;
  onOpenChange: (open: boolean) => void;
  onPayment: (driver: DriverOffer) => void;
  onCashPayment: () => void;
}

export default function PaymentDialog({
  open,
  driver,
  onOpenChange,
  onPayment,
  onCashPayment
}: PaymentDialogProps) {
  if (!driver) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Оплата поездки</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={driver.photo} />
              <AvatarFallback>ВД</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-lg">{driver.name}</h4>
              <p className="text-sm text-muted-foreground">{driver.car}</p>
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Стоимость поездки</span>
              <span className="font-semibold text-lg">{driver.price} ₽</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="CreditCard" size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">Карта водителя</span>
              </div>
              <p className="font-mono text-sm mt-1">{driver.cardNumber}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => onPayment(driver)}
              className="w-full h-12 text-base"
            >
              <Icon name="Smartphone" size={20} className="mr-2" />
              Оплатить через банковское приложение
            </Button>
            <Button
              variant="outline"
              onClick={onCashPayment}
              className="w-full h-12 text-base"
            >
              Оплачу наличными
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            При выборе онлайн-оплаты откроется ваше банковское приложение для перевода средств водителю
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}