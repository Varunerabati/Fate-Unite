import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Instagram, 
  Linkedin, 
  Mail,
  Users,
  Lightbulb,
  Cpu,
  Target,
  Award,
  Send,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FateLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Gallery images - 12 total
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1743677077216-00a458eff9e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGVkdWNhdGlvbiUyMHN0dWRlbnRzfGVufDB8fHx8MTc2MDA5NDc4M3ww&ixlib=rb-4.1.0&q=85",
      alt: "Students learning robotics"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1658584124309-768111d9c5db?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxyb2JvdGljcyUyMGVkdWNhdGlvbiUyMHN0dWRlbnRzfGVufDB8fHx8MTc2MDA5NDc4M3ww&ixlib=rb-4.1.0&q=85",
      alt: "Collaborative robotics work"
    },
    {
      id: 3,
      src: "https://images.pexels.com/photos/7869041/pexels-photo-7869041.jpeg",
      alt: "Hands-on STEM learning"
    },
    {
      id: 4,
      src: "https://images.pexels.com/photos/7869139/pexels-photo-7869139.jpeg",
      alt: "Student project work"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1660795468878-d9d8d75967b9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxTVEVNJTIwZWR1Y2F0aW9uJTIwd29ya3Nob3B8ZW58MHx8fHwxNzYwMDk0NzkxfDA&ixlib=rb-4.1.0&q=85",
      alt: "Educational workshop"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1616992873922-94702fd40c94?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxTVEVNJTIwZWR1Y2F0aW9uJTIwd29ya3Nob3B8ZW58MHx8fHwxNzYwMDk0NzkxfDA&ixlib=rb-4.1.0&q=85",
      alt: "Interactive learning session"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1637743408313-c9d5e869d9db?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxTVEVNJTIwZWR1Y2F0aW9uJTIwd29ya3Nob3B8ZW58MHx8fHwxNzYwMDk0NzkxfDA&ixlib=rb-4.1.0&q=85",
      alt: "Focused learning activity"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1623863568368-69e4cbe6cc0b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHw0fHxyb2JvdGljcyUyMGVkdWNhdGlvbiUyMHN0dWRlbnRzfGVufDB8fHx8MTc2MDA5NDc4M3ww&ixlib=rb-4.1.0&q=85",
      alt: "Students engaged in learning"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1743677077216-00a458eff9e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxyb2JvdGljcyUyMHdvcmtzaG9wJTIwc3R1ZGVudHN8ZW58MHx8fHwxNzYwMDk2MDg4fDA&ixlib=rb-4.1.0&q=85",
      alt: "Children interacting with robot"
    },
    {
      id: 10,
      src: "https://images.pexels.com/photos/7869041/pexels-photo-7869041.jpeg",
      alt: "Students in robotics workshop"
    },
    {
      id: 11,
      src: "https://images.pexels.com/photos/7869245/pexels-photo-7869245.jpeg",
      alt: "Students working on robotics projects"
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1755053757912-a63da9d6e0e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMHdvcmtzaG9wJTIwc3R1ZGVudHN8ZW58MHx8fHwxNzYwMDk2MDg4fDA&ixlib=rb-4.1.0&q=85",
      alt: "Students focused on technical work"
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Handle form submission (integrated with backend)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
    
    try {
      const response = await axios.post(`${API}/contact/submit`, formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        
        // Hide success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.message || 
                          'Failed to send message. Please try again.';
      setFormError(errorMessage);
      
      // Clear error message after 5 seconds
      setTimeout(() => setFormError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                F.A.T.E
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['Home', 'About', 'Services', 'Gallery', 'Founders', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {['Home', 'About', 'Services', 'Gallery', 'Founders', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  EdTech Innovation
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  From Ashes To{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Empire
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Empowering the next generation through interactive robotics, IoT, and automation education. 
                  We transform curiosity into innovation, building tomorrow's tech leaders today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  onClick={() => scrollToSection('contact')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3"
                  onClick={() => scrollToSection('about')}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={galleryImages[0].src}
                  alt="Students learning robotics"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Us</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                F.A.T.E (From Ashes To Empire) is pioneering the future of education through hands-on robotics, 
                IoT, and entrepreneurship programs. We believe in nurturing creativity and innovation in students 
                aged 10-18, both in urban and rural areas across India.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our unique teaching approach combines theoretical knowledge with practical application, 
                ensuring students don't just learn concepts but experience them. We're building a generation 
                of tech innovators who will shape tomorrow's world.
              </p>
              <div className="mt-8">
                <p className="text-lg text-blue-600 font-semibold">
                  "Building the foundation for tomorrow's innovators, one student at a time."
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={galleryImages[1].src}
                alt="About F.A.T.E"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive programs designed to ignite innovation and build technical expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Cpu className="h-8 w-8" />,
                title: "Robotics Workshops",
                description: "Hands-on robotics sessions covering design, programming, and automation"
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: "IoT Bootcamps",
                description: "Intensive programs on Internet of Things and smart device development"
              },
              {
                icon: <Lightbulb className="h-8 w-8" />,
                title: "Embedded System Workshops",
                description: "Deep dive into embedded programming, microcontrollers, and hardware integration"
              }
            ].map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <div className="text-blue-600">{service.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gallery</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">Moments from our workshops and learning experiences</p>
          </div>
          
          {/* Main Slideshow */}
          <div className="relative mb-12">
            <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-lg">
              <img
                src={galleryImages[currentSlide].src}
                alt={galleryImages[currentSlide].alt}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % galleryImages.length)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
          
          {/* Thumbnail Grid */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                className={`relative overflow-hidden rounded-lg aspect-square transition-all duration-200 ${
                  index === currentSlide ? 'ring-2 ring-blue-500' : 'hover:scale-105'
                }`}
                onClick={() => setCurrentSlide(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section id="founders" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Founders</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">The visionaries behind F.A.T.E</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Founder 1 */}
            <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8 text-center space-y-6">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwwfHx8fDE3NjAwMDkzMjJ8MA&ixlib=rb-4.1.0&q=85"
                    alt="Dinesh Vanga"
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Dinesh Vanga</h3>
                  <p className="text-blue-600 font-semibold">Embedded Engineer & Founder</p>
                  <p className="text-gray-600">
                    Passionate about embedded systems and robotics, Dinesh brings deep technical expertise 
                    in hardware design and automation to F.A.T.E's educational programs.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Founder 2 */}
            <Card className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8 text-center space-y-6">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwwfHx8fDE3NjAwMDkzMjJ8MA&ixlib=rb-4.1.0&q=85"
                    alt="Shashank K"
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Shashank K</h3>
                  <p className="text-purple-600 font-semibold">IoT Engineer & Founder</p>
                  <p className="text-gray-600">
                    With extensive experience in IoT and smart systems, Shashank drives innovation in 
                    connected technologies and helps students understand the Internet of Things ecosystem.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">Ready to start your journey? Get in touch with us!</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Let's Connect</h3>
                <p className="text-lg text-gray-600 mb-8">
                  Have questions about our programs? Want to enroll your child or school? 
                  We'd love to hear from you!
                </p>
              </div>
              
              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Follow Us</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com/fate_unite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full hover:shadow-lg transition-shadow duration-200"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <button 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full hover:shadow-lg transition-shadow duration-200"
                    title="LinkedIn (Coming Soon)"
                  >
                    <Linkedin className="h-6 w-6" />
                  </button>
                  <a
                    href="mailto:fateunite1807@gmail.com"
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 rounded-full hover:shadow-lg transition-shadow duration-200"
                  >
                    <Mail className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                
                {/* Success Message */}
                {isSubmitted && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}
                
                {/* Error Message */}
                {formError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    {formError}
                  </div>
                )}
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              F.A.T.E
            </h3>
            <p className="text-gray-400 mb-6">From Ashes To Empire - Transforming Education Through Innovation</p>
            <div className="flex justify-center space-x-6 mb-8">
              <a
                href="https://instagram.com/fate_unite"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <button className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin className="h-6 w-6" />
              </button>
              <a
                href="mailto:fateunite1807@gmail.com"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500 text-sm">
                © 2024 F.A.T.E (From Ashes To Empire). All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FateLandingPage;