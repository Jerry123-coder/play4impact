import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Briefcase,
  Users,
  Zap,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Crown,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Globe,
  Award,
  Phone,
  Mail,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { PaystackCheckoutModal, type TicketTier } from '../components/PaystackCheckoutModal';

export const ticketTiers: TicketTier[] = [
  {
    id: 'basic',
    name: 'Basic Pass',
    price: 250,
    tagline: 'Essential access to matches, innovation zones, and health checks.',
    features: [
      'Complimentary refreshments',
      'Access to watch padel matches (All attendees)',
      'Access to partners / innovation zones',
      'Access to Health checks',
    ],
    color: 'green',
  },
  {
    id: 'standard',
    name: 'Standard Pass',
    price: 500,
    popular: true,
    badge: 'MOST POPULAR',
    tagline: 'Full clubhouse access + VIP Champions & Investor Mixer.',
    features: [
      'Complimentary refreshments',
      'Access to watch padel matches',
      'Access to partners / innovation zones',
      'Access to health checks',
      'Automatic member of P4I Clubhouse',
      'Access to Champions and investor mixer',
    ],
    color: 'blue',
  },
  {
    id: 'deluxe',
    name: 'Deluxe Pass',
    price: 950,
    badge: 'VIP EXECUTIVE',
    tagline: 'Priority red-carpet experience, R&R wellness treat & souvenirs.',
    features: [
      'Priority check-in',
      'Complimentary refreshments',
      'Priority access to watch padel matches',
      'Access to partners / innovation zones',
      'Access to health checks',
      'Priority access to Champions and investor mixer',
      'Automatic member of P4I Clubhouse',
      'Wellness treat by R&R',
      'P4I Lifestyle souvenir',
    ],
    color: 'amber',
  },
];

const faqs = [
  {
    q: 'What is Play 4 Impact?',
    a: 'PLAY4IMPACT is a premier tech lifestyle event presented by Techies4Impact. It seamlessly blends high-energy sports (Padel tennis matches), digital technology showcases, investor deal-making, wellness experiences, and executive networking.',
  },
  {
    q: 'Can I participate in the Padel matches or watch?',
    a: 'All attendees can watch the Padel matches. Players are limited to registered corporate entities unless otherwise stated. Deluxe and Standard pass holders receive priority viewing access and entry into the exclusive Champions & Investor Mixer.',
  },
  {
    q: 'How do payments work via Paystack?',
    a: 'Payments are processed securely via Paystack API (Mobile Money or Bank Cards in GHS). Upon successful payment, an instant digital gate pass with a unique reference code will be generated for you.',
  },
  {
    q: 'What is the P4I Clubhouse and R&R Wellness Treat?',
    a: 'P4I Clubhouse is a curated community of tech, corporate and sports lifestyle individuals. Approved members benefit from early updates, exclusive discounts and new developments within the Play4Impact ecosystem. Membership is by application. Deluxe Pass holders also receive a signature wellness pampering treatment curated by R&R.',
  },
  {
    q: 'Where and when is the event taking place?',
    a: 'Play4Impact Padel is scheduled to take place on Saturday, 7th November 2026 at Rolider Sports Complex, Dzorwulu - Accra, Ghana.',
  },
];

const highlightsStories = [
  {
    id: 1,
    category: 'MATCH DAY ACTION',
    access: 'All Passes Access',
    title: 'Padel Championship Matches',
    desc: 'Feel the electric energy as corporate teams and tech leaders battle on court in high-octane matches.',
    image: '/images/p4i/hero.jpg',
    highlight: 'Corporate Teams • 4 Courts • Live Scores',
  },
  {
    id: 2,
    category: 'VIP INVESTOR LOUNGE',
    access: 'Standard & Deluxe Exclusive',
    title: 'Champions & Investor Sunset Mixer',
    desc: 'Connect directly with angel investors, VC partners, and tech pioneers in our private sunset networking lounge.',
    image: '/images/p4i/mixer.jpg',
    highlight: '50+ Investors • Private VIP Lounge',
  },
  {
    id: 3,
    category: 'TECH & AI SHOWCASE',
    access: 'All Passes Access',
    title: 'Digital Demos & Innovation Expo',
    desc: 'Explore cutting-edge digital products, AI tools, and smart lifestyle solutions built by West Africa’s top tech teams.',
    image: '/images/p4i/networking.jpg',
    highlight: '20+ Interactive Startup Booths',
  },
  {
    id: 4,
    category: 'WELLNESS & RECOVERY',
    access: 'Deluxe Pass Exclusive',
    title: 'R&R Luxury Wellness Treat',
    desc: 'Indulge in complimentary health screenings, stress-relief massage therapies, and luxury wellness treats hosted by R&R.',
    image: '/images/p4i/wellness.jpg',
    highlight: 'Health Screenings & Spa Pampering',
  },
  {
    id: 5,
    category: 'COMMUNITY VIBES',
    access: 'All Passes Access',
    title: 'P4I Clubhouse & Executive Networking',
    desc: 'Curated community of tech, corporate and sports lifestyle individuals. Celebrate wins with signature refreshments & organic deal-making.',
    image: '/images/p4i/clubhouse.jpg',
    highlight: 'Curated Community • Application Only',
  },
];

const EventHighlightsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % highlightsStories.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % highlightsStories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + highlightsStories.length) % highlightsStories.length);
  };

  const minSwipeDistance = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsAutoPlaying(true);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  return (
    <div
      className="space-y-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Section Header with Navigation Arrows */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#83D318] uppercase tracking-widest block mb-1">
            Event Highlights
          </span>
          <h2 className="font-nexa text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            What To Expect At <span className="text-[#83D318]">P4I</span>
          </h2>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
          <p className="text-slate-300 text-sm max-w-md hidden sm:block">
            An immersive day packed with action-packed sport matches, high-octane investment lounges, and refreshing health treats.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-2xl bg-[#005461] hover:bg-[#83D318] hover:text-[#10324B] text-white flex items-center justify-center transition-all shadow-lg cursor-pointer active:scale-95 border border-white/10"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-2xl bg-[#005461] hover:bg-[#83D318] hover:text-[#10324B] text-white flex items-center justify-center transition-all shadow-lg cursor-pointer active:scale-95 border border-white/10"
              aria-label="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Moving Multi-Card Track Viewport */}
      <div className="relative overflow-hidden py-2 px-0.5">
        <div
          className="flex gap-6 transition-transform duration-700 ease-out"
          style={{
            transform: isMobile
              ? `translateX(calc(-${currentIndex} * (100% + 1.5rem)))`
              : `translateX(calc(-${currentIndex} * (50% + 0.75rem)))`,
          }}
        >
          {highlightsStories.concat(highlightsStories).map((story, idx) => (
            <div
              key={`${story.id}-${idx}`}
              className="w-full md:w-[calc(50%-0.75rem)] flex-shrink-0 relative rounded-3xl overflow-hidden border border-[#005461] bg-[#005461] group hover:border-[#83D318]/70 shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10324B] via-[#10324B]/70 to-transparent"></div>

                {/* Top Badge */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-[#83D318] text-[#10324B] text-[11px] font-black rounded-md uppercase shadow-md truncate">
                    {story.access}
                  </span>
                  <span className="px-3 py-1 bg-[#10324B]/80 backdrop-blur-md text-[#83D318] text-[10px] font-bold rounded-full border border-[#83D318]/40 truncate">
                    {story.category}
                  </span>
                </div>

                {/* Card Bottom Details */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <h3 className="font-nexa text-2xl font-extrabold text-white tracking-tight">
                    {story.title}
                  </h3>
                  <p className="font-nexa text-xs text-slate-200 leading-relaxed">
                    {story.desc}
                  </p>
                  <div className="pt-1 text-[11px] font-bold text-[#83D318] flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>{story.highlight}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Navigation Indicator Dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {highlightsStories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex % highlightsStories.length
                ? 'w-8 bg-[#83D318]'
                : 'w-2.5 bg-[#005461] hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export const Play4ImpactPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<TicketTier>(ticketTiers[1]); // Default Premium Pass
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Dynamic Top Nav CTA Visibility
  const [showTopNavCta, setShowTopNavCta] = useState(false);
  const heroCtaRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const target = heroCtaRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowTopNavCta(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Real-time Countdown timer targeting November 7, 2026
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-11-07T09:00:00Z').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBuyTicket = (tier: TicketTier) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#10324B] text-slate-100 font-sans selection:bg-[#83D318] selection:text-[#10324B]">
      {/* Dynamic Background Noise / Glow Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#005461]/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#83D318]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#005461]/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        
        {/* Standalone Play 4 Impact Header */}
        <header className="sticky top-0 z-50 bg-[#005461]/95 border-b border-[#83D318]/40 backdrop-blur-xl shadow-2xl py-3 px-4 sm:px-8">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left: Play 4 Impact Transparent Logo */}
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-3 group">
                <img
                  src="/images/p4i/logo.png"
                  alt="Play 4 Impact"
                  className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(131,211,24,0.35)] group-hover:scale-105 transition-transform"
                />
              </a>
            </div>

            {/* Center: Live Ticking Countdown Timer */}
            <div className="flex items-center gap-2 sm:gap-3 font-nexa text-xs sm:text-base font-black text-white">
              <span className="hidden xl:inline font-nexa text-xs font-extrabold uppercase text-slate-300 tracking-wider">
                Event Starts In:
              </span>
              <div className="px-2.5 py-1 rounded-lg bg-[#10324B] border border-[#83D318]/40 shadow-sm flex items-baseline gap-1">
                <span>{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="font-nexa text-[9px] font-extrabold text-[#83D318] uppercase">Days</span>
              </div>
              <span className="text-[#83D318] font-bold">:</span>
              <div className="px-2.5 py-1 rounded-lg bg-[#10324B] border border-[#83D318]/40 shadow-sm flex items-baseline gap-1">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="font-nexa text-[9px] font-extrabold text-[#83D318] uppercase">Hrs</span>
              </div>
              <span className="text-[#83D318] font-bold">:</span>
              <div className="px-2.5 py-1 rounded-lg bg-[#10324B] border border-[#83D318]/40 shadow-sm flex items-baseline gap-1">
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="font-nexa text-[9px] font-extrabold text-[#83D318] uppercase">Mins</span>
              </div>
              <span className="text-[#83D318] font-bold">:</span>
              <div className="px-2.5 py-1 rounded-lg bg-[#10324B] border border-[#83D318]/40 shadow-sm flex items-baseline gap-1 text-[#83D318] animate-pulse">
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="font-nexa text-[9px] font-extrabold text-[#83D318] uppercase">Secs</span>
              </div>
            </div>

            {/* Right: Get Tickets CTA Button */}
            <div className={`flex items-center gap-3 transition-all duration-500 transform ${
              showTopNavCta
                ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
                : 'opacity-0 scale-90 pointer-events-none -translate-y-2'
            }`}>
              <button
                onClick={() => handleBuyTicket(ticketTiers[0])}
                className="py-2.5 px-5 sm:px-6 bg-[#83D318] hover:bg-[#96eb1e] text-[#10324B] font-nexa text-xs sm:text-sm uppercase tracking-wider font-black rounded-xl shadow-lg border border-[#10324B] flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <Ticket className="w-4 h-4 text-[#10324B]" />
                <span>Get Tickets</span>
                <ArrowRight className="w-4 h-4 text-[#10324B]" />
              </button>
            </div>

          </div>
        </header>
        
        {/* HERO SECTION */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center pt-12 pb-20 md:pt-20 md:pb-24 overflow-hidden bg-[#10324B]">
          <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 xl:px-24">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-28 items-center">
              
              {/* LEFT COLUMN */}
              <div className="lg:col-span-6 space-y-6">
                
                <div className="flex flex-col gap-2 sm:gap-4 align-left pt-1">
                  <h1 className="font-boldonse text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-tight whitespace-nowrap drop-shadow-lg">
                    Play. Connect.
                  </h1>
                  <h1 className="font-boldonse text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-black text-[#83D318] tracking-tight leading-tight drop-shadow-lg">
                    Grow Impact
                  </h1>
                </div>

                <p className="font-nexa text-slate-200 text-base sm:text-lg font-normal leading-relaxed max-w-xl">
                  PLAY4IMPACT is a premier tech lifestyle event presented by Techies4Impact. It seamlessly blends high-energy sports (Padel tennis matches), digital technology showcases, investor deal-making, wellness experiences, and executive networking.
                </p>

                {/* Date, Time & Venue Info Cards */}
                <div className="pt-2">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    
                    {/* Event Date Card */}
                    <div className="relative group cursor-pointer">
                      <div
                        className="absolute -inset-0.5 sm:-inset-1 bg-[#83D318] transform -rotate-1 opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#96eb1e]"
                        style={{
                          clipPath: 'polygon(0% 12%, 32% 0%, 78% 8%, 100% 0%, 94% 88%, 100% 100%, 18% 92%, 0% 100%, 6% 48%)',
                          WebkitClipPath: 'polygon(0% 12%, 32% 0%, 78% 8%, 100% 0%, 94% 88%, 100% 100%, 18% 92%, 0% 100%, 6% 48%)',
                        }}
                      ></div>
                      <div
                        className="relative p-2 sm:p-3.5 bg-[#005461] transition-transform duration-300 group-hover:bg-[#006878]"
                        style={{
                          clipPath: 'polygon(0% 12%, 32% 0%, 78% 8%, 100% 0%, 94% 88%, 100% 100%, 18% 92%, 0% 100%, 6% 48%)',
                          WebkitClipPath: 'polygon(0% 12%, 32% 0%, 78% 8%, 100% 0%, 94% 88%, 100% 100%, 18% 92%, 0% 100%, 6% 48%)',
                        }}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-3">
                          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#83D318] text-[#10324B] flex items-center justify-center font-black shadow-md shrink-0">
                            <Calendar className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#10324B]" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-nexa text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#83D318] block truncate">
                              Date
                            </span>
                            <span className="font-nexa text-[11px] sm:text-sm font-black text-white block truncate">
                              Nov 7, 2026
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Time Card */}
                    <div className="relative group cursor-pointer">
                      <div
                        className="absolute -inset-0.5 sm:-inset-1 bg-[#83D318] transform rotate-1 opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#96eb1e]"
                        style={{
                          clipPath: 'polygon(2% 0%, 68% 6%, 100% 0%, 94% 85%, 100% 100%, 28% 94%, 0% 100%, 6% 12%)',
                          WebkitClipPath: 'polygon(2% 0%, 68% 6%, 100% 0%, 94% 85%, 100% 100%, 28% 94%, 0% 100%, 6% 12%)',
                        }}
                      ></div>
                      <div
                        className="relative p-2 sm:p-3.5 bg-[#005461] transition-transform duration-300 group-hover:bg-[#006878]"
                        style={{
                          clipPath: 'polygon(2% 0%, 68% 6%, 100% 0%, 94% 85%, 100% 100%, 28% 94%, 0% 100%, 6% 12%)',
                          WebkitClipPath: 'polygon(2% 0%, 68% 6%, 100% 0%, 94% 85%, 100% 100%, 28% 94%, 0% 100%, 6% 12%)',
                        }}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-3">
                          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#83D318]/20 border border-[#83D318]/60 text-[#83D318] flex items-center justify-center font-black shadow-md shrink-0">
                            <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-nexa text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#83D318] block truncate">
                              Time
                            </span>
                            <span className="font-nexa text-[11px] sm:text-sm font-black text-white block truncate">
                              9:00 AM
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Card */}
                    <div className="relative group cursor-pointer">
                      <div
                        className="absolute -inset-0.5 sm:-inset-1 bg-[#83D318] transform -rotate-1 opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#96eb1e]"
                        style={{
                          clipPath: 'polygon(0% 6%, 74% 0%, 100% 8%, 92% 88%, 100% 100%, 15% 94%, 0% 100%, 5% 52%)',
                          WebkitClipPath: 'polygon(0% 6%, 74% 0%, 100% 8%, 92% 88%, 100% 100%, 15% 94%, 0% 100%, 5% 52%)',
                        }}
                      ></div>
                      <div
                        className="relative p-2 sm:p-3.5 bg-[#005461] transition-transform duration-300 group-hover:bg-[#006878]"
                        style={{
                          clipPath: 'polygon(0% 6%, 74% 0%, 100% 8%, 92% 88%, 100% 100%, 15% 94%, 0% 100%, 5% 52%)',
                          WebkitClipPath: 'polygon(0% 6%, 74% 0%, 100% 8%, 92% 88%, 100% 100%, 15% 94%, 0% 100%, 5% 52%)',
                        }}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-3">
                          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#83D318]/20 border border-[#83D318]/60 text-[#83D318] flex items-center justify-center font-black shadow-md shrink-0">
                            <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-nexa text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#83D318] block truncate">
                              Venue
                            </span>
                            <span className="font-nexa text-[11px] sm:text-sm font-black text-white block truncate" title="Rolider Sports Complex, Dzorwulu">
                              Rolider Sports
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-6 space-y-6">
                
                <div className="relative group cursor-pointer">
                  
                  <button
                    ref={heroCtaRef}
                    onClick={() => handleBuyTicket(ticketTiers[0])}
                    className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 z-20 py-3.5 px-6 sm:px-7 bg-[#83D318] hover:bg-[#96eb1e] text-[#10324B] font-nexa text-base sm:text-lg uppercase tracking-wider font-black rounded-xl shadow-2xl border-2 border-[#10324B] flex items-center justify-center gap-2.5 transform rotate-3 hover:rotate-0 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    <Ticket className="w-5 h-5 text-[#10324B]" />
                    <span>Get Tickets</span>
                    <ArrowRight className="w-5 h-5 text-[#10324B]" />
                  </button>

                  <div
                    className="absolute -inset-3.5 bg-[#83D318] transform -rotate-4 opacity-95 transition-all duration-500 group-hover:-inset-7 group-hover:scale-[1.06] group-hover:-rotate-5 group-hover:shadow-[0_0_60px_rgba(131,211,24,0.85)] group-hover:bg-[#96eb1e]"
                    style={{
                      clipPath:
                        'polygon(0% 14%, 28% 0%, 72% 8%, 100% 0%, 94% 80%, 100% 100%, 18% 92%, 0% 100%, 4% 48%)',
                      WebkitClipPath:
                        'polygon(0% 14%, 28% 0%, 72% 8%, 100% 0%, 94% 80%, 100% 100%, 18% 92%, 0% 100%, 4% 48%)',
                    }}
                  ></div>

                  <div
                    className="absolute -inset-2 bg-[#005461] transform rotate-6 transition-all duration-500 group-hover:-inset-4 group-hover:scale-105 group-hover:rotate-8 group-hover:bg-[#006878]"
                    style={{
                      clipPath:
                        'polygon(2% 18%, 24% 0%, 76% 4%, 98% 0%, 90% 86%, 100% 98%, 14% 96%, 0% 100%, 8% 52%)',
                      WebkitClipPath:
                        'polygon(2% 18%, 24% 0%, 76% 4%, 98% 0%, 90% 86%, 100% 98%, 14% 96%, 0% 100%, 8% 52%)',
                    }}
                  ></div>

                  <div
                    className="relative overflow-hidden w-full h-[360px] sm:h-[420px] shadow-2xl bg-[#005461]"
                    style={{
                      clipPath:
                        'polygon(0% 16%, 26% 0%, 74% 6%, 100% 0%, 92% 84%, 100% 100%, 16% 94%, 0% 100%, 6% 50%)',
                      WebkitClipPath:
                        'polygon(0% 16%, 26% 0%, 74% 6%, 100% 0%, 92% 84%, 100% 100%, 16% 94%, 0% 100%, 6% 50%)',
                    }}
                  >
                    <img
                      src="/images/p4i/rackets.jpg"
                      alt="Play 4 Impact Padel Championship"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10324B]/95 via-black/20 to-transparent"></div>

                    <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#10324B]/90 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-xl">
                      <div>
                        <span className="font-nexa text-[10px] uppercase tracking-wider text-[#83D318] font-bold block">
                          Padel & Tech Lifestyle
                        </span>
                        <h3 className="font-nexa text-base font-bold text-white uppercase tracking-tight">
                          Play 4 Impact Event 2026
                        </h3>
                      </div>
                      
                      <div className="w-9 h-9 rounded-full bg-[#83D318] text-[#10324B] flex items-center justify-center font-bold shadow-md">
                        <Trophy className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* PILLARS / EXPERIENCE VISUAL HIGHLIGHTS */}
        <section className="py-20 bg-[#0A1F2E] overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EventHighlightsCarousel />
          </div>
        </section>

        {/* TICKET TIERS SECTION */}
        <section id="tickets" className="py-24 bg-[#10324B] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#83D318] text-[#10324B] text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>Official Ticket Passes</span>
              </div>
              <h2 className="font-nexa text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                Choose Your <span className="text-[#83D318]">Pass Tier</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg">
                Instant secure checkout integrated with Paystack. All attendees can watch Padel matches. Players limited to registered corporate entities.
              </p>

              {/* Community Partners Promo Banner */}
              {/* <div className="mt-4 p-3.5 rounded-2xl bg-[#005461]/60 border border-[#83D318]/50 max-w-xl mx-auto flex items-center justify-center gap-2.5 text-xs text-white shadow-lg">
                <Gift className="w-5 h-5 text-[#83D318] shrink-0" />
                <span>
                  <strong>Community Partners:</strong> Use promo code <code className="bg-[#83D318] text-[#10324B] px-2 py-0.5 rounded font-mono font-black">PLAY26</code> for <strong>12% off</strong> all pass tiers!
                </span>
              </div> */}
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {ticketTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${
                    tier.popular
                      ? 'bg-[#005461] border-2 border-[#83D318] shadow-2xl'
                      : 'bg-[#0A1F2E] border border-[#005461] hover:border-[#83D318]/40'
                  }`}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#83D318] text-[#10324B] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
                      {tier.badge}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-nexa text-2xl font-black text-white uppercase">{tier.name}</h3>
                      <p className="text-xs text-slate-300 mt-2 min-h-[36px]">{tier.tagline}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-[#83D318]">
                        {tier.price}
                      </span>
                      <span className="text-lg font-bold text-slate-300">GHS</span>
                      <span className="text-xs text-slate-400">/ person</span>
                    </div>

                    <div className="space-y-3 pt-2">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                        What's Included:
                      </span>
                      <ul className="space-y-2.5">
                        {tier.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-[#83D318] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => handleBuyTicket(tier)}
                      className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                        tier.popular
                          ? 'bg-[#83D318] hover:bg-[#96eb1e] text-[#10324B] hover:scale-105'
                          : 'bg-[#005461] hover:bg-[#006f80] text-white hover:scale-105'
                      }`}
                    >
                      <span>Buy {tier.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* THE 5 PLAY4IMPACT PILLARS */}
        <section id="pillars" className="py-24 bg-[#0A1F2E] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="px-4 py-1.5 bg-[#83D318] text-[#10324B] text-xs font-black rounded-full uppercase tracking-widest shadow-md">
                Ecosystem Framework
              </span>
              <h2 className="font-nexa text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                The Five <span className="text-[#83D318]">Play4Impact Pillars</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg">
                Fusing sports, technology, investment, wellness, and impact to inspire transformational growth across Africa.
              </p>
            </div>

            {/* 5 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                {
                  number: '01',
                  title: 'Wellness & Play',
                  desc: 'Physical wellness, active living, workplace health, and community building through sport.',
                  icon: HeartPulse,
                  focus: ['Physical Wellness', 'Active Living', 'Workplace Health', 'Recreational Sport'],
                  color: 'from-emerald-500/20 to-[#005461]',
                },
                {
                  number: '02',
                  title: 'Innovation & Technology',
                  desc: 'Artificial intelligence, digital transformation, tech careers, ecosystems, and future of work.',
                  icon: Zap,
                  focus: ['Artificial Intelligence', 'Digital Transformation', 'Tech Careers', 'Digital Skills'],
                  color: 'from-sky-500/20 to-[#005461]',
                },
                {
                  number: '03',
                  title: 'Wealth & Opportunity',
                  desc: 'Entrepreneurship, wealth building, investment readiness, career development, and business growth.',
                  icon: Crown,
                  focus: ['Entrepreneurship', 'Wealth Building', 'Investment Readiness', 'Business Growth'],
                  color: 'from-amber-500/20 to-[#005461]',
                },
                {
                  number: '04',
                  title: 'Community & Impact',
                  desc: 'Social impact, youth empowerment, community development, volunteerism, and sustainability.',
                  icon: Users,
                  focus: ['Social Impact', 'Youth Empowerment', 'Sustainability', 'Leadership'],
                  color: 'from-indigo-500/20 to-[#005461]',
                },
                {
                  number: '05',
                  title: 'Global Connections',
                  desc: 'Strategic partnerships, diaspora engagement, international collaboration, and knowledge exchange.',
                  icon: Globe,
                  focus: ['Diaspora Engagement', 'Global Talent', 'Investment Promotion', 'Cross-Border Deals'],
                  color: 'from-teal-500/20 to-[#005461]',
                },
              ].map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="relative rounded-3xl p-6 bg-gradient-to-b from-[#005461]/80 to-[#10324B] border border-[#005461] hover:border-[#83D318]/70 shadow-xl transition-all hover:-translate-y-2 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-2xl font-black text-[#83D318] opacity-80">
                          {pillar.number}
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-[#83D318]/20 border border-[#83D318]/40 text-[#83D318] flex items-center justify-center font-bold shadow-sm group-hover:bg-[#83D318] group-hover:text-[#10324B] transition-colors">
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-nexa text-lg font-black text-white uppercase tracking-tight">
                          {pillar.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 space-y-1.5">
                        <span className="text-[10px] font-bold text-[#83D318] uppercase tracking-wider block">
                          Key Focus Areas:
                        </span>
                        <ul className="space-y-1">
                          {pillar.focus.map((item, fIdx) => (
                            <li key={fIdx} className="text-[11px] text-slate-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#83D318] shrink-0"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHO ATTENDS? */}
        <section id="who-attends" className="py-24 bg-[#10324B] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                <span className="px-4 py-1.5 bg-[#83D318] text-[#10324B] text-xs font-black rounded-full uppercase tracking-widest shadow-md">
                  Target Audience
                </span>
                <h2 className="font-nexa text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                  Who Attends <span className="text-[#83D318]">Play 4 Impact?</span>
                </h2>
                <p className="text-slate-200 text-base leading-relaxed">
                  The event brings together approximately <strong>300+ carefully curated participants</strong> from Ghana, West Africa, and global diaspora networks to share ideas, build strategic partnerships, and collaborate around common goals.
                </p>

                <div className="p-6 rounded-2xl bg-[#005461]/60 border border-[#83D318]/40 shadow-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-[#83D318]" />
                    <h4 className="font-nexa text-lg font-black text-white uppercase">High-Curated Network</h4>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    From tech founders to VC partners, corporate titans, and government representatives—Play4Impact creates an organic, high-energy environment for dealmaking and lifelong connections.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Tech Founders & Entrepreneurs', desc: 'Building high-growth startups and digital solutions across Africa.', icon: Zap },
                    { title: 'Corporate Executives & Titans', desc: 'C-suite leaders seeking strategic partnerships & workplace wellness.', icon: Briefcase },
                    { title: 'Investors & VC Partners', desc: 'Angel investors and venture funds exploring early & growth-stage deals.', icon: TrendingUp },
                    { title: 'Diaspora Professionals', desc: 'Global Ghanaian & African diaspora stakeholders driving investment & talent.', icon: Globe },
                    { title: 'Government & Public Sector', desc: 'Policy makers, innovation hubs & public sector representatives.', icon: Building2 },
                    { title: 'Emerging Talent & Leaders', desc: 'Future tech leaders, innovators & high-potential ecosystem changemakers.', icon: Award },
                  ].map((group, idx) => {
                    const GroupIcon = group.icon;
                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#0A1F2E] border border-[#005461] hover:border-[#83D318]/50 shadow-md transition-all hover:-translate-y-1 flex items-start gap-3.5"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#005461] text-[#83D318] flex items-center justify-center shrink-0 shadow-inner">
                          <GroupIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-nexa text-sm font-black text-white uppercase tracking-tight">
                            {group.title}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {group.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* EVENT PARTNERS & SPONSORS */}
        <section id="partners" className="py-24 bg-[#0A1F2E] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            
            <div className="max-w-3xl mx-auto space-y-3">
              <span className="px-4 py-1.5 bg-[#83D318] text-[#10324B] text-xs font-black rounded-full uppercase tracking-widest shadow-md">
                Ecosystem Support
              </span>
              <h2 className="font-nexa text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                Event Partners & <span className="text-[#83D318]">Sponsors</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg">
                Supported by premier government institutions, global brands, wellness leaders, and West Africa’s top media platforms.
              </p>
            </div>

            {/* Infinite Flowing Sponsor Marquee Carousel */}
            <div className="relative w-full overflow-hidden py-4">
              <div className="absolute top-0 bottom-0 left-0 w-24 z-10 bg-gradient-to-r from-[#0B1E2B] via-[#0B1E2B]/80 to-transparent pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-24 z-10 bg-gradient-to-l from-[#0B1E2B] via-[#0B1E2B]/80 to-transparent pointer-events-none" />

              <div className="animate-marquee-flow flex gap-5 items-center">
                {[
                  { name: 'Diaspora Affairs', category: 'Office of the President', logo: '/images/p4i/sponsors/diaspora-affairs.png' },
                  { name: 'Ghana Fintech', category: '& Payments Association', logo: '/images/p4i/sponsors/ghana-fintech.png' },
                  { name: 'R&R Wellness', category: 'Luxury Partner', logo: '/images/p4i/sponsors/rr-wellness.png' },
                  { name: 'Lyvv Cosmetics', category: 'Beauty & Wellness', logo: '/images/p4i/sponsors/lyvv-cosmetics.png' },
                  { name: 'Media For Us', category: 'Media & Production', logo: '/images/p4i/sponsors/media-for-us.png' },
                  { name: 'YFM Ghana', category: 'Radio Partner', logo: '/images/p4i/sponsors/yfm-ghana.png' },
                  { name: 'Red Bull', category: 'Energy Partner', logo: '/images/p4i/sponsors/red-bull.svg' },
                  { name: 'Stella Artois', category: 'Beverage Partner', logo: '/images/p4i/sponsors/stella-artois.svg' },
                  { name: 'Decathlon', category: 'Sports & Apparel', logo: '/images/p4i/sponsors/decathlon.svg' },
                  { name: 'Rivia Clinics', category: 'Health & Wellness', logo: '/images/p4i/sponsors/rivia-clinics.png' },
                  { name: 'Awake Water', category: 'Hydration Partner', logo: '/images/p4i/sponsors/awake-water.svg' },
                  { name: 'MX24 TV', category: 'Television Partner', logo: '/images/p4i/sponsors/mx24-tv.svg' },
                  { name: 'B&FT', category: 'Business Newspaper', logo: '/images/p4i/sponsors/bft.png' },
                  // Duplicated for seamless loop
                  { name: 'Diaspora Affairs', category: 'Office of the President', logo: '/images/p4i/sponsors/diaspora-affairs.png' },
                  { name: 'Ghana Fintech', category: '& Payments Association', logo: '/images/p4i/sponsors/ghana-fintech.png' },
                  { name: 'R&R Wellness', category: 'Luxury Partner', logo: '/images/p4i/sponsors/rr-wellness.png' },
                  { name: 'Lyvv Cosmetics', category: 'Beauty & Wellness', logo: '/images/p4i/sponsors/lyvv-cosmetics.png' },
                  { name: 'Media For Us', category: 'Media & Production', logo: '/images/p4i/sponsors/media-for-us.png' },
                  { name: 'YFM Ghana', category: 'Radio Partner', logo: '/images/p4i/sponsors/yfm-ghana.png' },
                  { name: 'Red Bull', category: 'Energy Partner', logo: '/images/p4i/sponsors/red-bull.svg' },
                  { name: 'Stella Artois', category: 'Beverage Partner', logo: '/images/p4i/sponsors/stella-artois.svg' },
                  { name: 'Decathlon', category: 'Sports & Apparel', logo: '/images/p4i/sponsors/decathlon.svg' },
                  { name: 'Rivia Clinics', category: 'Health & Wellness', logo: '/images/p4i/sponsors/rivia-clinics.png' },
                  { name: 'Awake Water', category: 'Hydration Partner', logo: '/images/p4i/sponsors/awake-water.svg' },
                  { name: 'MX24 TV', category: 'Television Partner', logo: '/images/p4i/sponsors/mx24-tv.svg' },
                  { name: 'B&FT', category: 'Business Newspaper', logo: '/images/p4i/sponsors/bft.png' },
                ].map((sponsor, sIdx) => (
                  <div
                    key={sIdx}
                    className="w-56 sm:w-64 shrink-0 p-4 rounded-3xl bg-[#004753]/50 border border-white/10 hover:border-[#83D318]/70 transition-all duration-300 flex flex-col items-center justify-between text-center space-y-3 shadow-xl backdrop-blur-md group hover:bg-[#005461]/80 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="w-full h-20 bg-white rounded-2xl p-3 flex items-center justify-center shadow-inner group-hover:scale-[1.03] transition-transform duration-300 overflow-hidden border border-slate-100">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="w-full px-1">
                      <h4 className="font-nexa text-xs font-black text-white uppercase group-hover:text-[#83D318] transition-colors truncate">
                        {sponsor.name}
                      </h4>
                      <span className="font-nexa text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block truncate mt-0.5">
                        {sponsor.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* DIRECT PARTNERSHIP & CONTACT SECTION */}
        <section id="contact" className="py-20 bg-[#10324B] relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#005461] via-[#0E2F46] to-[#005461] border-2 border-[#83D318] p-8 sm:p-12 shadow-2xl space-y-8 text-center sm:text-left">
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl">
                  <span className="px-3 py-1 bg-[#83D318] text-[#10324B] text-xs font-black rounded-md uppercase tracking-wider">
                    Partnership Opportunities
                  </span>
                  <h3 className="font-nexa text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                    Let’s Play4Impact <span className="text-[#83D318]">Together!</span>
                  </h3>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    Interested in sponsoring, hosting a startup demo booth, or securing corporate player slots for your company? Reach out directly to our Partnership & Growth team.
                  </p>
                </div>

                {/* Contact Card */}
                <div className="p-6 rounded-2xl bg-[#10324B]/90 border border-[#83D318]/50 shadow-xl space-y-4 shrink-0 w-full md:w-auto min-w-[280px]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#83D318] tracking-widest block">
                      Partnership / Growth Lead
                    </span>
                    <h4 className="font-nexa text-xl font-black text-white uppercase">Abena Adoma</h4>
                  </div>

                  <div className="space-y-2 text-xs font-semibold text-slate-200 border-t border-white/10 pt-3">
                    <a
                      href="tel:0578796905"
                      className="flex items-center gap-2 hover:text-[#83D318] transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#83D318]" />
                      <span>0578796905 / +233 57 879 6905</span>
                    </a>
                    <a
                      href="mailto:techies4impact@gmail.com"
                      className="flex items-center gap-2 hover:text-[#83D318] transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#83D318]" />
                      <span>techies4impact@gmail.com</span>
                    </a>
                  </div>

                  <a
                    href="mailto:techies4impact@gmail.com?subject=Play4Impact%20Partnership%20Inquiry"
                    className="w-full py-3 bg-[#83D318] hover:bg-[#96eb1e] text-[#10324B] font-nexa text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                  >
                    <span>Inquire for Partnership</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-20 bg-[#0A1F2E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-2">
              <span className="text-xs font-bold text-[#83D318] uppercase tracking-widest">
                Got Questions?
              </span>
              <h2 className="font-nexa text-3xl font-black text-white uppercase">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl bg-[#005461]/30 border border-[#005461] overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full px-6 py-4 text-left font-bold text-white flex items-center justify-between gap-4 hover:text-[#83D318]"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#83D318] shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-[#005461]/40 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#005461] border-t border-[#83D318]/30 py-12 text-slate-200 text-xs">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src="/images/p4i/logo.png"
                alt="Play 4 Impact Logo"
                className="h-10 w-auto object-contain brightness-110 drop-shadow-[0_0_8px_rgba(131,211,24,0.4)]"
              />
              <div>
                <p className="font-bold text-white text-sm uppercase">PLAY4IMPACT 2026</p>
                <p className="text-slate-300">Presented by Techies4Impact & Seventh Creative • Accra, Ghana</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-slate-200">
              <a href="#tickets" className="hover:text-[#83D318] transition-colors">Tickets & Passes</a>
              <a href="#about-event" className="hover:text-[#83D318] transition-colors">Event Highlights</a>
              <a href="/terms" className="hover:text-[#83D318] transition-colors">Terms of Service</a>
              <a href="/privacy" className="hover:text-[#83D318] transition-colors">Privacy Policy</a>
              <a href="/refunds" className="hover:text-[#83D318] transition-colors">Refunds Policy</a>
            </div>

            <div className="text-center md:text-right text-slate-300 text-[11px]">
              <p>© 2026 Techies4Impact. All Rights Reserved.</p>
              <p className="mt-1 text-[#83D318] font-bold">Nov 7, 2026 • Rolider Sports Complex, Dzorwulu - Accra</p>
            </div>

          </div>
        </footer>
      </div>

      {/* Paystack Checkout Modal */}
      <PaystackCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTier={selectedTier}
        allTiers={ticketTiers}
      />
    </div>
  );
};

export default Play4ImpactPage;
