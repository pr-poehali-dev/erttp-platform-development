import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Ride {
  id: string;
  from: string;
  to: string;
  date: string;
  price: number;
  status: 'completed' | 'active' | 'cancelled';
}

interface RideHistoryProps {
  rides: Ride[];
}

export default function RideHistory({ rides }: RideHistoryProps) {
  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <Card key={ride.id} className="p-4 bg-card border-border hover:border-primary transition-colors cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <div className="pt-1">
                  <Icon name="Circle" size={10} className="text-muted-foreground mb-1" />
                  <div className="w-px h-8 bg-border ml-1"></div>
                  <Icon name="MapPin" size={10} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{ride.from}</p>
                  <p className="text-sm font-medium text-card-foreground mt-6">{ride.to}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <Icon name="Calendar" size={12} />
                <span>{new Date(ride.date).toLocaleString('ru-RU')}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-card-foreground mb-1">{ride.price} ₽</div>
              <Badge variant={ride.status === 'completed' ? 'default' : 'secondary'}>
                {ride.status === 'completed' ? 'Завершена' : 'Отменена'}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
