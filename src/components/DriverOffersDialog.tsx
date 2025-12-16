import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface DriverOffersDialogProps {
  open: boolean;
  offers: DriverOffer[];
  passengerPrice: number;
  timeLeft: number;
  onOpenChange: (open: boolean) => void;
  onAcceptOffer: (driver: DriverOffer) => void;
  formatTime: (seconds: number) => string;
}

export default function DriverOffersDialog({
  open,
  offers,
  passengerPrice,
  timeLeft,
  onOpenChange,
  onAcceptOffer,
  formatTime
}: DriverOffersDialogProps) {
  const sortedOffers = [...offers].sort((a, b) => a.price - b.price);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Предложения водителей</DialogTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Clock" size={18} />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Ваша цена: <span className="font-semibold text-primary">{passengerPrice} ₽</span>
          </p>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {sortedOffers.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p className="text-muted-foreground">Ищем водителей...</p>
            </div>
          ) : (
            sortedOffers.map((driver, index) => (
              <Card
                key={driver.id}
                className={`p-4 border-2 transition-all hover:border-primary cursor-pointer animate-slide-in-right ${
                  index === 0 ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => onAcceptOffer(driver)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={driver.photo} />
                    <AvatarFallback>ВД</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{driver.name}</h4>
                      {index === 0 && <Badge className="bg-primary">Лучшая цена</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={14} />
                        <span>{driver.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{driver.trips} поездок</span>
                      <span>•</span>
                      <span>{driver.car}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        <span>{driver.arrivalTime}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Icon name="Navigation" size={14} />
                        <span>{driver.distance} км</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{driver.price} ₽</div>
                    <div className="text-xs text-muted-foreground">
                      {driver.price > passengerPrice
                        ? `+${driver.price - passengerPrice} ₽`
                        : driver.price < passengerPrice
                        ? `-${passengerPrice - driver.price} ₽`
                        : 'Ваша цена'}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}