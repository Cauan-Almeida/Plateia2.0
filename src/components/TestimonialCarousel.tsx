import React from 'react';
import { useCarousel } from '../hooks/useCarousel';
import '../styles/TestimonialCarousel.css';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'João Silva',
    role: 'Estudante de Direito',
    avatar: '/images/avatar1.jpg',
    rating: 5,
    text: 'O Plateia transformou completamente minha forma de me comunicar. As técnicas aprendidas me ajudaram a superar o medo de falar em público.'
  },
  {
    id: 2,
    name: 'Maria Santos',
    role: 'Profissional de Marketing',
    avatar: '/images/avatar2.jpg',
    rating: 5,
    text: 'Excelente plataforma! Os exercícios práticos e o feedback da comunidade são fundamentais para o desenvolvimento das habilidades de oratória.'
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    role: 'Professor',
    avatar: '/images/avatar3.jpg',
    rating: 5,
    text: 'Como professor, sempre tive dificuldade com apresentações. O Plateia me deu as ferramentas necessárias para melhorar minhas aulas.'
  }
];

const TestimonialCarousel: React.FC = () => {
  const {
    currentIndex,
    goToNext,
    goToPrevious,
    goToSlide,
    pauseCarousel,
    resumeCarousel
  } = useCarousel({ totalItems: testimonials.length, autoPlayInterval: 5000 });

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <div 
          className="testimonial-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onMouseEnter={pauseCarousel}
          onMouseLeave={resumeCarousel}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <div className="user-info">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
                <div className="rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-controls">
          <button className="prev-btn" onClick={goToPrevious}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
          <button className="next-btn" onClick={goToNext}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel; 