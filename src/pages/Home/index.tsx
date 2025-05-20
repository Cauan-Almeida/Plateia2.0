import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeroSection,
  FeaturesSection,
  FeatureBlock,
  TestimonialsSection,
  TestimonialCarousel,
  TestimonialContainer,
  TestimonialCard,
  UserInfo,
  UserAvatar,
  UserDetails,
  Rating,
  TestimonialText,
  CarouselControls,
  CarouselButton,
  CarouselDots,
  Dot,
  CTASection
} from './styles';

const Home: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      name: 'Emily Carter',
      role: 'Estudante de Música',
      rating: 5,
      text: 'O Plateia revolucionou minha forma de praticar. A possibilidade de receber feedback em tempo real de outros músicos me ajudou a evoluir muito mais rápido.',
      avatar: '/images/emily carter.jpg'
    },
    {
      name: 'Michael Santos',
      role: 'Professor de Violão',
      rating: 5,
      text: 'Como professor, o Plateia me permite acompanhar o progresso dos meus alunos de forma mais eficiente e oferecer orientações personalizadas.',
      avatar: '/images/Michael.jpg'
    },
    {
      name: 'Sophia Oliveira',
      role: 'Pianista Amadora',
      rating: 5,
      text: 'Adoro a comunidade do Plateia! Conheci outros músicos apaixonados e temos trocado experiências valiosas. A plataforma é intuitiva e muito útil.',
      avatar: '/images/Sophia.jpg'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  return (
    <>
      <HeroSection style={{ backgroundImage: 'url(/images/Hero.jpg)' }}>
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Transforme sua prática musical com feedback em tempo real</h1>
          <p>Conecte-se com outros músicos, receba orientações personalizadas e evolua mais rápido com o Plateia.</p>
          <Link to="/registro" className="btn btn-primary">Comece Agora</Link>
        </div>
      </HeroSection>

      <FeaturesSection>
        <div className="container">
          <div className="section-header">
            <h2>Recursos</h2>
            <p>Descubra como o Plateia pode transformar sua jornada musical</p>
          </div>

          <FeatureBlock>
            <div className="feature-content">
              <h3>Prática Colaborativa</h3>
              <p>Conecte-se com outros músicos, compartilhe suas performances e receba feedback valioso para melhorar suas habilidades.</p>
              <Link to="/recursos" className="btn btn-primary">Saiba Mais</Link>
            </div>
            <div className="feature-image">
              <img src="/images/praticacolaborativa.jpg" alt="Prática Colaborativa" />
            </div>
          </FeatureBlock>

          <FeatureBlock reverse>
            <div className="feature-content">
              <h3>Feedback em Tempo Real</h3>
              <p>Receba comentários e sugestões de outros músicos enquanto pratica, permitindo ajustes imediatos e melhorias contínuas.</p>
              <Link to="/recursos" className="btn btn-primary">Saiba Mais</Link>
            </div>
            <div className="feature-image">
              <img src="/images/feedback.jpg" alt="Feedback em Tempo Real" />
            </div>
          </FeatureBlock>
        </div>
      </FeaturesSection>

      <TestimonialsSection>
        <div className="container">
          <div className="section-header">
            <h2>O que nossos usuários dizem</h2>
            <p>Histórias de sucesso de músicos que transformaram sua prática com o Plateia</p>
          </div>

          <TestimonialCarousel>
            <TestimonialContainer>
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} className={index === currentTestimonial ? 'active' : ''}>
                  <UserInfo>
                    <UserAvatar>
                      <img src={testimonial.avatar} alt={testimonial.name} />
                    </UserAvatar>
                    <UserDetails>
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </UserDetails>
                  </UserInfo>
                  <Rating>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </Rating>
                  <TestimonialText>{testimonial.text}</TestimonialText>
                </TestimonialCard>
              ))}
            </TestimonialContainer>

            <CarouselControls>
              <CarouselButton onClick={prevTestimonial}>
                <i className="fas fa-chevron-left"></i>
              </CarouselButton>
              <CarouselDots>
                {testimonials.map((_, index) => (
                  <Dot
                    key={index}
                    active={index === currentTestimonial}
                    onClick={() => goToTestimonial(index)}
                  />
                ))}
              </CarouselDots>
              <CarouselButton onClick={nextTestimonial}>
                <i className="fas fa-chevron-right"></i>
              </CarouselButton>
            </CarouselControls>
          </TestimonialCarousel>
        </div>
      </TestimonialsSection>

      <CTASection>
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para transformar sua prática musical?</h2>
            <p>Junte-se a milhares de músicos que já estão evoluindo com o Plateia</p>
            <Link to="/registro" className="btn btn-primary">Comece Agora</Link>
          </div>
        </div>
      </CTASection>
    </>
  );
};

export default Home; 