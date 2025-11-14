import * as React from "react";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import { cn } from "./utils";
import { Button } from "./button";
import { FontAwesome } from 'taro-icons'

type CarouselApi = {
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
};

type CarouselProps = {
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  setApi,
  className,
  children,
  ...props
}: React.ComponentProps<typeof View> & CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);
  const swiperRef = React.useRef<any>(null);

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < totalItems - 1;

  const scrollPrev = React.useCallback(() => {
    if (canScrollPrev && swiperRef.current) {
      swiperRef.current.swipePrev?.();
    }
  }, [canScrollPrev]);

  const scrollNext = React.useCallback(() => {
    if (canScrollNext && swiperRef.current) {
      swiperRef.current.swipeNext?.();
    }
  }, [canScrollNext]);

  const api: CarouselApi = React.useMemo(
    () => ({
      canScrollPrev: () => canScrollPrev,
      canScrollNext: () => canScrollNext,
      scrollPrev,
      scrollNext,
    }),
    [canScrollPrev, canScrollNext, scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (setApi) {
      setApi(api);
    }
  }, [api, setApi]);

  // 更新总项目数
  React.useEffect(() => {
    const childrenArray = React.Children.toArray(children);
    const carouselItems = childrenArray.filter(
      (child: any) => child?.type?.name === "CarouselItem"
    );
    setTotalItems(carouselItems.length);
  }, [children]);

  const handleChange = (e: any) => {
    setCurrentIndex(e.detail.current);
  };

  return (
    <CarouselContext.Provider
      value={{
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        orientation,
        setApi,
      }}
    >
      <View
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </View>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  className,
  ...props
}: React.ComponentProps<typeof Swiper>) {
  const { orientation } = useCarousel();

  return (
    <Swiper
      className={cn("overflow-hidden h-96", className)}
      direction={orientation === "horizontal" ? "horizontal" : "vertical"}
      displayMultipleItems={1}
      data-slot="carousel-content"
      {...props}
    />
  );
}

function CarouselItem({
  className,
  ...props
}: React.ComponentProps<typeof SwiperItem>) {
  return (
    <SwiperItem
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <FontAwesome family='solid' name='arrow-left' size={18} color='white'></FontAwesome>
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <FontAwesome family='solid' name='arrow-right' size={18} color='white'></FontAwesome>
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};