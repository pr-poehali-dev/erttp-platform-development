import { useEffect, useRef } from 'react';

interface YandexMapProps {
  from?: string;
  to?: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMap({ from, to }: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      if (!window.ymaps) return;

      window.ymaps.ready(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
        }

        const map = new window.ymaps.Map(mapRef.current, {
          center: [55.751244, 37.618423],
          zoom: 12,
          controls: ['zoomControl', 'fullscreenControl']
        });

        mapInstanceRef.current = map;

        if (from && to) {
          const startPlacemark = new window.ymaps.Placemark(
            [55.751244, 37.618423],
            {
              balloonContent: from,
              iconCaption: 'Откуда'
            },
            {
              preset: 'islands#greenCircleDotIcon'
            }
          );

          const endPlacemark = new window.ymaps.Placemark(
            [55.774556, 37.632423],
            {
              balloonContent: to,
              iconCaption: 'Куда'
            },
            {
              preset: 'islands#blueCircleDotIcon'
            }
          );

          map.geoObjects.add(startPlacemark);
          map.geoObjects.add(endPlacemark);

          const multiRoute = new window.ymaps.multiRouter.MultiRoute(
            {
              referencePoints: [
                [55.751244, 37.618423],
                [55.774556, 37.632423]
              ],
              params: {
                routingMode: 'auto'
              }
            },
            {
              boundsAutoApply: true,
              wayPointIconFillColor: '#0EA5E9',
              routeActiveStrokeColor: '#0EA5E9',
              routeActiveStrokeWidth: 4
            }
          );

          map.geoObjects.add(multiRoute);
        }
      });
    };

    const timer = setTimeout(initMap, 500);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, [from, to]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '300px' }}
    />
  );
}
