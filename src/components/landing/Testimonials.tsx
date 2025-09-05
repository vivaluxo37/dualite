import { faker } from '@faker-js/faker';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Star } from 'lucide-react';

const testimonials = Array.from({ length: 9 }, () => ({
  id: faker.string.uuid(),
  quote: faker.lorem.paragraph(2),
  name: faker.person.fullName(),
  title: faker.person.jobTitle(),
  image: faker.image.avatar(),
  rating: faker.number.int({ min: 4, max: 5 }),
}));

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground">
            Real stories from traders who found their ideal broker with BrokerAnalysis.
          </p>
        </div>
        <Carousel className="w-full max-w-6xl mx-auto" opts={{ loop: true }}>
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2 h-full">
                  <Card className="h-full flex flex-col">
                    <CardContent className="flex flex-col justify-between h-full p-6">
                      <div>
                        <div className="flex items-center mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'}`}
                            />
                          ))}
                        </div>
                        <blockquote className="text-muted-foreground text-sm">
                          “{testimonial.quote}”
                        </blockquote>
                      </div>
                      <div className="flex items-center gap-4 mt-6">
                        <Avatar>
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-10" />
          <CarouselNext className="hidden sm:flex -right-10" />
        </Carousel>
      </div>
    </section>
  );
}
