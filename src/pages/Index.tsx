import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import OrderForm from '@/components/OrderForm';
import DriverOffersDialog from '@/components/DriverOffersDialog';
import PaymentDialog from '@/components/PaymentDialog';
import RideHistory from '@/components/RideHistory';

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
}

interface Ride {
  id: string;
  from: string;
  to: string;
  date: string;
  price: number;
  status: 'completed' | 'active' | 'cancelled';
}

const mockRides: Ride[] = [
  { id: '1', from: 'ул. Ленина, 25', to: 'пр. Победы, 14', date: '2025-12-07 14:30', price: 350, status: 'completed' },
  { id: '2', from: 'ТЦ Галерея', to: 'Аэропорт', date: '2025-12-06 09:15', price: 550, status: 'completed' },
  { id: '3', from: 'Парк Горького', to: 'Вокзал', date: '2025-12-05 18:45', price: 250, status: 'completed' }
];

const mockDriverOffers: DriverOffer[] = [
  {
    id: '1',
    name: 'Алексей Иванов',
    rating: 4.9,
    trips: 1247,
    car: 'Toyota Camry',
    plate: 'М777АА777',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver1',
    price: 380,
    arrivalTime: '3 мин',
    distance: 1.2,
    cardNumber: '2200 7012 3456 7890'
  },
  {
    id: '2',
    name: 'Дмитрий Петров',
    rating: 4.8,
    trips: 892,
    car: 'Hyundai Solaris',
    plate: 'К555ВВ555',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver2',
    price: 420,
    arrivalTime: '5 мин',
    distance: 2.5,
    cardNumber: '2200 7011 1111 2222'
  },
  {
    id: '3',
    name: 'Сергей Козлов',
    rating: 4.95,
    trips: 2103,
    car: 'Volkswagen Polo',
    plate: 'А123СС123',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver3',
    price: 350,
    arrivalTime: '7 мин',
    distance: 3.8,
    cardNumber: '2200 7013 9999 8888'
  }
];

export default function Index() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passengerPrice, setPassengerPrice] = useState([400]);
  const [manualPrice, setManualPrice] = useState('');
  const [showOffersDialog, setShowOffersDialog] = useState(false);
  const [driverOffers, setDriverOffers] = useState<DriverOffer[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverOffer | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [orderPublished, setOrderPublished] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [minPrice] = useState(150);

  useEffect(() => {
    if (orderPublished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [orderPublished, timeLeft]);

  useEffect(() => {
    if (orderPublished) {
      const timer1 = setTimeout(() => {
        setDriverOffers([mockDriverOffers[0]]);
        toast({
          title: '🚗 Новое предложение!',
          description: `${mockDriverOffers[0].name} предлагает ${mockDriverOffers[0].price} ₽`
        });
      }, 3000);

      const timer2 = setTimeout(() => {
        setDriverOffers((prev) => [...prev, mockDriverOffers[1]]);
        toast({
          title: '🚗 Новое предложение!',
          description: `${mockDriverOffers[1].name} предлагает ${mockDriverOffers[1].price} ₽`
        });
      }, 7000);

      const timer3 = setTimeout(() => {
        setDriverOffers((prev) => [...prev, mockDriverOffers[2]]);
        toast({
          title: '🚗 Новое предложение!',
          description: `${mockDriverOffers[2].name} предлагает ${mockDriverOffers[2].price} ₽`
        });
      }, 12000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [orderPublished]);

  const getGeolocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: '❌ Ошибка',
        description: 'Геолокация не поддерживается вашим браузером',
        variant: 'destructive'
      });
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://geocode-maps.yandex.ru/1.x/?apikey=YOUR_API_KEY&geocode=${longitude},${latitude}&format=json&lang=ru_RU`
          );
          const data = await response.json();
          const address = data.response.GeoObjectCollection.featureMember[0]?.GeoObject.metaDataProperty.GeocoderMetaData.text || 'Адрес не найден';
          
          setFrom(address);
          toast({
            title: '✅ Местоположение определено',
            description: address
          });
        } catch {
          setFrom(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast({
            title: '✅ Координаты получены',
            description: 'Введите адрес вручную для уточнения'
          });
        }
        setGettingLocation(false);
      },
      (error) => {
        setGettingLocation(false);
        toast({
          title: '❌ Ошибка геолокации',
          description: error.message === 'User denied Geolocation' 
            ? 'Разрешите доступ к геолокации в настройках браузера'
            : 'Не удалось определить местоположение',
          variant: 'destructive'
        });
      }
    );
  };

  const handlePriceChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < minPrice && value !== '') {
      toast({
        title: '⚠️ Слишком низкая цена',
        description: `Минимальная цена поездки ${minPrice} ₽`,
        variant: 'destructive'
      });
      return;
    }
    setManualPrice(value);
    if (numValue >= minPrice) {
      setPassengerPrice([numValue]);
    }
  };

  const handlePublishOrder = () => {
    const finalPrice = manualPrice ? parseInt(manualPrice) : passengerPrice[0];
    
    if (finalPrice < minPrice) {
      toast({
        title: '⚠️ Цена слишком низкая',
        description: `Минимальная цена поездки ${minPrice} ₽`,
        variant: 'destructive'
      });
      return;
    }

    if (from && to && finalPrice > 0) {
      setOrderPublished(true);
      setShowOffersDialog(true);
      setTimeLeft(120);
      setDriverOffers([]);
      toast({
        title: '📢 Заказ опубликован!',
        description: 'Водители начнут присылать предложения'
      });
    }
  };

  const handleAcceptOffer = (driver: DriverOffer) => {
    setSelectedDriver(driver);
    setShowOffersDialog(false);
    setOrderPublished(false);
    setShowPaymentDialog(true);
  };

  const handlePayment = (driver: DriverOffer) => {
    const amount = driver.price;
    const cardNumber = driver.cardNumber.replace(/\s/g, '');
    
    const sbpUrl = `https://qr.nspk.ru/proactive/order?amount=${amount * 100}&bankAccount=${cardNumber}&name=${encodeURIComponent(driver.name)}`;
    
    window.open(sbpUrl, '_blank');
    
    toast({
      title: '💳 Открываем оплату',
      description: 'Выберите банковское приложение для оплаты'
    });

    setTimeout(() => {
      toast({
        title: '✅ Водитель едет к вам!',
        description: `Прибудет через ${driver.arrivalTime}`
      });
    }, 1500);
  };

  const handleCashPayment = () => {
    setShowPaymentDialog(false);
    if (selectedDriver) {
      toast({
        title: '✅ Водитель едет к вам!',
        description: `Прибудет через ${selectedDriver.arrivalTime}`
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Car" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-card-foreground">TaxiGo</h1>
                <p className="text-sm text-muted-foreground">Ваша цена — ваши правила</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="User" size={24} />
            </Button>
          </div>
        </header>

        <Tabs defaultValue="order" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="order">
              <Icon name="MapPin" size={18} className="mr-2" />
              Заказ
            </TabsTrigger>
            <TabsTrigger value="active">
              <Icon name="Navigation" size={18} className="mr-2" />
              Активные
            </TabsTrigger>
            <TabsTrigger value="history">
              <Icon name="Clock" size={18} className="mr-2" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-6">
            <OrderForm
              from={from}
              to={to}
              passengerPrice={passengerPrice}
              manualPrice={manualPrice}
              minPrice={minPrice}
              gettingLocation={gettingLocation}
              orderPublished={orderPublished}
              timeLeft={timeLeft}
              onFromChange={setFrom}
              onToChange={setTo}
              onPriceChange={handlePriceChange}
              onSliderChange={(value) => {
                setPassengerPrice(value);
                setManualPrice('');
              }}
              onGeolocation={getGeolocation}
              onPublishOrder={handlePublishOrder}
              formatTime={formatTime}
            />

            {orderPublished && driverOffers.length > 0 && (
              <Card className="p-6 bg-card border-primary animate-slide-in-right">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Предложения водителей</h3>
                  <Badge variant="secondary" className="animate-pulse">
                    {driverOffers.length} предложений
                  </Badge>
                </div>
                <Button
                  onClick={() => setShowOffersDialog(true)}
                  variant="outline"
                  className="w-full"
                >
                  Посмотреть все предложения
                  <Icon name="ChevronRight" size={18} className="ml-2" />
                </Button>
              </Card>
            )}

            {selectedDriver && (
              <Card className="p-6 bg-card border-primary animate-scale-in">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedDriver.photo} />
                    <AvatarFallback>ВД</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{selectedDriver.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={16} />
                      <span>{selectedDriver.rating}</span>
                      <span>•</span>
                      <span>{selectedDriver.car}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{selectedDriver.price} ₽</div>
                    <div className="text-sm text-muted-foreground">{selectedDriver.arrivalTime}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Icon name="Phone" size={18} className="mr-2" />
                    Позвонить
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Icon name="MessageSquare" size={18} className="mr-2" />
                    Написать
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {!selectedDriver && !orderPublished ? (
              <Card className="p-12 bg-card border-border text-center">
                <Icon name="Navigation" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Нет активных поездок</p>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <RideHistory rides={mockRides} />
          </TabsContent>
        </Tabs>

        <DriverOffersDialog
          open={showOffersDialog}
          offers={driverOffers}
          passengerPrice={parseInt(manualPrice) || passengerPrice[0]}
          timeLeft={timeLeft}
          onOpenChange={setShowOffersDialog}
          onAcceptOffer={handleAcceptOffer}
          formatTime={formatTime}
        />

        <PaymentDialog
          open={showPaymentDialog}
          driver={selectedDriver}
          onOpenChange={setShowPaymentDialog}
          onPayment={handlePayment}
          onCashPayment={handleCashPayment}
        />
      </div>
    </div>
  );
}
