import React, { useState, useEffect } from 'react';
import {
  FaTrophy as Trophy,
  FaBriefcase as Briefcase,
  FaUsers as Users,
  FaBolt as Zap,
  FaCircleCheck as CheckCircle2,
  FaRegCalendar as Calendar,
  FaLocationDot as MapPin,
  FaRegClock as Clock,
  // FaStar as Sparkles, // re-enable with the "Official Ticket Passes" badge
  FaArrowRight as ArrowRight,
  FaChevronDown as ChevronDown,
  FaChevronUp as ChevronUp,
  FaHeartPulse as HeartPulse,
  FaCrown as Crown,
  FaTicket as Ticket,
  FaChevronLeft as ChevronLeft,
  FaChevronRight as ChevronRight,
  FaEarthAfrica as Globe,
  FaAward as Award,
  FaPhone as Phone,
  FaEnvelope as Mail,
  FaBuildingColumns as Building2,
  FaArrowTrendUp as TrendingUp,
  FaLaptopCode as Laptop,
  FaShirt as Shirt,
  // FaSeedling as Seedling, // re-enable with the "Beginners & Tech Enthusiasts" audience card
} from 'react-icons/fa6';
import { PaystackCheckoutModal } from '../components/PaystackCheckoutModal';
import { ticketTiers, peopleAdmitted, type TicketTier } from '../data/ticketTiers';
import { useAvailability, passesLeft, LOW_STOCK_THRESHOLD } from '../data/ticketSlots';

// Event start: Sat 7 Nov 2026, 10:00 AM Accra time. Ghana is UTC+0 all year, so 'Z' is local time.
// Keep the ISO format exact (two-digit hour); a typo here makes the countdown show all zeros.
const EVENT_START = new Date('2026-11-07T10:00:00Z');

// Google Form for partnership sign-ups. Paste the form's share link here;
// until then the partnership button falls back to email.
const PARTNERSHIP_FORM_URL = 'https://forms.gle/wgTvpzg8ocVc3StS9';
const PARTNERSHIP_MAILTO = 'mailto:techies4impact@gmail.com?subject=Play4Impact%20Partnership%20Inquiry';

const faqs = [
  {
    q: 'What is Play4Impact?',
    a: 'PLAY4IMPACT is a premier tech lifestyle event powered by Techies4Impact. It seamlessly blends high-energy racket sports, innovation showcases, investor deal-making, wellness experiences, and executive networking.',
  },
  {
    q: 'Can I participate in the Padel matches or watch?',
    a: 'All attendees can watch the Padel matches. Players are limited to registered corporate entities unless otherwise stated.  ',
  },
  {
    q: 'How do payments work via Paystack?',
    a: 'Payments are processed securely via Paystack API (Mobile Money or Bank Cards in GHS). Upon successful payment, an instant digital gate pass with a unique reference code will be generated for you.',
  },
  {
    q: 'What is the P4I Clubhouse?',
    a: 'P4I Clubhouse is a curated community of tech, corporate and sports lifestyle individuals. Approved members benefit from early updates, exclusive discounts and new developments within the Play4Impact ecosystem. Membership is by application.',
  },
  {
    q: 'Where and when is the event taking place?',
    a: 'Play4Impact Padel is scheduled to take place on Saturday, 7th November 2026 at Padel Zone, Labone - Accra, Ghana.',
  },
  {
    q: 'Is there a dress code?',
    a: 'Yes! The dress code is Play4Impact Whites: white + a touch of Play4Impact colour.',
  },
  {
    q: 'Will food be provided?',
    a: 'Your ticket includes complimentary drinks and water. Food will be available for purchase from our food vendors.',
  },
];

// Event partners & sponsors (all Ghana-based or active in Ghana).
// darkTile: logo is white/light and needs a dark background to be visible.
const eventPartners: { name: string; category: string; logo: string; darkTile?: boolean }[] = [
  { name: 'Diaspora Affairs', category: 'Institutional Partner', logo: '/images/p4i/sponsors/diaspora-affairs.png' },
  { name: 'Ghana Fintech & Payments Association ', category: 'Institutional Partner', logo: '/images/p4i/sponsors/ghana-fintech.png' },
  { name: 'R&R Wellness', category: 'Official Wellness Partner', logo: '/images/p4i/sponsors/rr-wellness-logo.png' },
  { name: 'Lyvv Cosmetics', category: 'Official Selfcare Partner', logo: '/images/p4i/sponsors/lyvv-cosmetics.png' },
  { name: 'Media For Us', category: 'Media Partner', logo: '/images/p4i/sponsors/media-for-us.png' },
  { name: 'YFM Ghana', category: 'Media Partner', logo: '/images/p4i/sponsors/yfm-ghana.png' },
  { name: 'Sporty FM', category: 'Media Partner', logo: '/images/p4i/sponsors/sporty-fm.png' },
  { name: 'Red Bull', category: 'Energy Partner', logo: '/images/p4i/sponsors/red-bull.svg' },
  { name: 'Stella Artois', category: 'Official Beverage Partner', logo: '/images/p4i/sponsors/stella-artois.svg' },
  { name: 'Decathlon', category: 'Sports Partner', logo: '/images/p4i/sponsors/decathlon-logo.png' },
  { name: 'Rivia Clinics', category: 'Official Medical Partner', logo: '/images/p4i/sponsors/rivia-clinics-logo.png' },
  { name: 'Awake Water', category: 'Hydration Partner', logo: '/images/p4i/sponsors/awake-water.png', darkTile: true },
  { name: 'MX24 TV', category: 'Media Partner', logo: '/images/p4i/sponsors/mx24-tv.png' },
  { name: 'B&FT', category: 'Media Partner', logo: '/images/p4i/sponsors/bft.png' },
];

const highlightsStories = [
  {
    id: 1,
    category: 'MATCH DAY ACTION',
    access: 'All Passes Access',
    title: 'Padel Championship Matches',
    desc: 'Feel the energy as corporate teams and organizations battle it out on court.',
    image: '/images/p4i/hero.jpg',
  },
  {
    id: 2,
    category: 'VIP INVESTOR LOUNGE',
    title: 'Champions & Investor Mixer',
    desc: 'Connect with founders, CEOs, investors and global leaders in a curated session.',
    image: '/images/p4i/mixer.jpg',
  },
  {
    id: 3,
    category: 'TECH & AI SHOWCASE',
    access: 'All Passes Access',
    title: 'Digital Demos & Innovation Zone',
    desc: 'Explore new digital products and AI tools from top tech teams.',
    image: '/images/p4i/innovation-demos.jpg',
  },
  // {
  //   id: 4,
  //   category: 'WELLNESS & RECOVERY',
  //   access: 'Executive Pass Exclusive',
  //   title: 'Wellness Treat by R&R',
  //   desc: 'Recharge between matches with a signature wellness treat from R&R wellness.',
  //   image: '/images/p4i/wellness.jpg',
  // },
  {
    id: 4,
    category: 'COMMUNITY VIBES',
    access: 'All Passes Access',
    title: 'Networking & Entertainment',
    desc: 'Enjoy curated soothing playlists between matches while connecting with like-minded individuals.',
    image: '/images/p4i/courtside-lounge.jpg',
  },
  {
    id: 5,
    category: 'COMMUNITY VIBES',
    access: 'All Passes Access',
    title: 'Brand Activations',
    desc: 'Engage with premium brands within the Play4Impact ecosystem.',
    image: '/images/p4i/clubhouse.jpg',
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
          <h2 className="font-poppins text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
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
                {/* <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-[#83D318] text-[#10324B] text-[11px] font-black rounded-md uppercase shadow-md truncate">
                    {story.access}
                  </span>
                  <span className="px-3 py-1 bg-[#10324B]/80 backdrop-blur-md text-[#83D318] text-[10px] font-bold rounded-full border border-[#83D318]/40 truncate">
                    {story.category}
                  </span>
                </div> */}

                {/* Card Bottom Details: fixed-height, top-aligned so titles line up across cards */}
                <div className="absolute bottom-6 left-6 right-6 h-34 xl:h-22 flex flex-col gap-2">
                  <h3 className="font-poppins text-2xl font-extrabold text-white tracking-tight leading-tight line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="font-poppins text-sm text-slate-200 leading-relaxed line-clamp-3">
                    {story.desc}
                  </p>
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

// Subtle padel-court line art for the hero. Drawn in landscape coordinates and
// rotated for portrait; faded out towards the edges with a radial mask.
const CourtBackdrop: React.FC<{ orientation: 'landscape' | 'portrait'; className?: string }> = ({ orientation, className = '' }) => {
  const portrait = orientation === 'portrait';
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      viewBox={portrait ? '0 0 900 1600' : '0 0 1600 900'}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      style={{
        maskImage: 'radial-gradient(ellipse at center, #000 35%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, #000 35%, transparent 80%)',
      }}
    >
      <g transform={portrait ? 'translate(900 0) rotate(90)' : undefined}>
        {/* Glass walls */}
        <rect x="136" y="146" width="1328" height="608" rx="22" stroke="#F1F9E5" strokeOpacity="0.05" strokeWidth="2" strokeDasharray="4 10" />
        {/* Playing surface */}
        <rect x="160" y="170" width="1280" height="560" rx="14" fill="#005461" fillOpacity="0.28" stroke="#F1F9E5" strokeOpacity="0.1" strokeWidth="2.5" />
        {/* Service lines + centre service line */}
        <g stroke="#F1F9E5" strokeOpacity="0.08" strokeWidth="2">
          <line x1="352" y1="170" x2="352" y2="730" />
          <line x1="1248" y1="170" x2="1248" y2="730" />
          <line x1="352" y1="450" x2="1248" y2="450" />
        </g>
        {/* Net + posts */}
        <line x1="800" y1="156" x2="800" y2="744" stroke="#83D318" strokeOpacity="0.22" strokeWidth="4" />
        <circle cx="800" cy="156" r="6" fill="#83D318" fillOpacity="0.25" />
        <circle cx="800" cy="744" r="6" fill="#83D318" fillOpacity="0.25" />
      </g>
    </svg>
  );
};

// Fixed-width countdown cell: each digit gets its own slot so proportional
// digits (e.g. a narrow "1") never make the timer jiggle as it ticks.
const CountdownUnit: React.FC<{ value: number; label: string; highlight?: boolean }> = ({ value, label, highlight }) => (
  <div className="min-w-[2.6rem] sm:min-w-[3.5rem] px-1.5 sm:px-2.5 py-1 rounded-lg bg-[#10324B] border border-[#83D318]/40 shadow-sm flex flex-col items-center leading-none">
    <span className={`flex font-poppins font-black text-[15px] sm:text-xl ${highlight ? 'text-[#83D318]' : 'text-white'}`}>
      {String(value).padStart(2, '0').split('').map((digit, i) => (
        <span key={i} className="inline-block w-[0.68em] text-center">{digit}</span>
      ))}
    </span>
    <span className="mt-1 font-poppins text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-300">
      {label}
    </span>
  </div>
);

export const Play4ImpactPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<TicketTier>(ticketTiers[1]); // Default Premium Pass
  const [availability] = useAvailability(); // live ticket slots
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Dynamic Top Nav CTA Visibility
  // Nav CTA stays hidden until the hero "Get Tickets" button has scrolled out of view.
  // A callback ref (state) re-attaches the observer if the hero button is ever re-mounted.
  const [showTopNavCta, setShowTopNavCta] = useState(false);
  const [heroCtaEl, setHeroCtaEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!heroCtaEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowTopNavCta(!entry.isIntersecting);
      },
      // Top margin = sticky nav height, so sliding under the nav counts as "gone"
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
    );

    observer.observe(heroCtaEl);
    return () => observer.disconnect();
  }, [heroCtaEl]);

  // Real-time Countdown timer to the event start (EVENT_START)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = EVENT_START.getTime();

    const updateCountdown = () => {
      const difference = Math.max(0, targetDate - Date.now()); // stays at 0 once the event starts
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBuyTicket = (tier: TicketTier) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const renderTierCard = (tier: TicketTier) => {
    const left = passesLeft(tier, availability); // null = unknown
    const soldOut = left === 0;

    return (
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
            <h3 className="font-poppins text-2xl font-black text-white uppercase">
                {/* "General Pass (Triple Treat)" -> name + lime subtitle */}
                {tier.name.replace(/\s*\(.*\)$/, '')}
                {tier.name.match(/\((.*)\)$/) && (
                  <span className="block mt-1 text-lg text-[#83D318]">{tier.name.match(/\((.*)\)$/)![1]}</span>
                )}
              </h3>
            <p className="text-xs text-slate-300 mt-2 min-h-[36px]">{tier.tagline}</p>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-wrap items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-[#83D318]">
              {tier.price}
            </span>
            <span className="text-lg font-bold text-slate-300">GHS</span>
            <span className="text-xs text-slate-400">
            / {peopleAdmitted(tier) > 1 ? `${peopleAdmitted(tier)} people` : 'person'}
          </span>
            {left !== null && left > 0 && left <= LOW_STOCK_THRESHOLD && (
              <span className="ml-auto px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/40 text-[10px] font-black uppercase tracking-wider text-rose-300">
                Only {left} left
              </span>
            )}
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
            disabled={soldOut}
            className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
              soldOut
                ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                : tier.popular
                ? 'bg-[#83D318] hover:bg-[#96eb1e] text-[#10324B] hover:scale-105 cursor-pointer'
                : 'bg-[#005461] hover:bg-[#006f80] text-white hover:scale-105 cursor-pointer'
            }`}
          >
            {soldOut ? (
              <span>Sold Out</span>
            ) : (
              <>
                <span>Buy Ticket</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
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
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3 md:gap-4">
            
            {/* Left: Play 4 Impact Transparent Logo */}
            <div className="flex items-center gap-4 shrink-0">
              <a href="/" className="flex items-center gap-3 group">
                <img
                  src="/images/p4i/logo.png"
                  alt="Play 4 Impact"
                  className="h-9 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(131,211,24,0.35)] group-hover:scale-105 transition-transform"
                />
              </a>
            </div>

            {/* Center: Live Ticking Countdown Timer */}
            <div className="flex items-center gap-1.5 sm:gap-2" role="timer" aria-label="Countdown to event">
              <span className="hidden xl:inline mr-1 font-poppins text-xs font-extrabold uppercase text-slate-300 tracking-wider">
                Event Starts In:
              </span>
              <CountdownUnit value={timeLeft.days} label="Days" />
              <CountdownUnit value={timeLeft.hours} label="Hrs" />
              <CountdownUnit value={timeLeft.minutes} label="Mins" />
              <CountdownUnit value={timeLeft.seconds} label="Secs" highlight />
            </div>

            {/* Right: Get Tickets CTA Button (desktop) */}
            <div className={`hidden md:flex items-center gap-3 transition-all duration-500 transform ${
              showTopNavCta
                ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
                : 'opacity-0 scale-90 pointer-events-none -translate-y-2'
            }`}>
              <button
                onClick={() => handleBuyTicket(ticketTiers[0])}
                className="py-2.5 px-5 sm:px-6 bg-[#83D318] hover:bg-[#96eb1e] text-[#10324B] font-poppins text-xs sm:text-sm uppercase tracking-wider font-black rounded-xl shadow-lg border border-[#10324B] flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <Ticket className="w-4 h-4 text-[#10324B]" />
                <span>Get Tickets</span>
                <ArrowRight className="w-4 h-4 text-[#10324B]" />
              </button>
            </div>

          </div>

          {/* Mobile: Get Tickets sticker "pasted" across the nav's bottom edge */}
          <div className={`md:hidden absolute right-4 top-full -translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            showTopNavCta
              ? 'opacity-100 scale-100 -rotate-3 pointer-events-auto'
              : 'opacity-0 scale-75 rotate-6 pointer-events-none'
          }`}>
            <button
              onClick={() => handleBuyTicket(ticketTiers[0])}
              className="relative py-2 px-4 bg-[#83D318] text-[#10324B] font-poppins text-[11px] uppercase tracking-wider font-black rounded-lg border-2 border-[#10324B] shadow-[3px_3px_0_#10324B] flex items-center gap-1.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer whitespace-nowrap"
            >
              {/* Tape strip holding the sticker to the nav */}
              <span
                aria-hidden="true"
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-6 w-11 h-4 bg-[#F1F9E5]/75 rounded-[2px] shadow-sm"
              ></span>
              <Ticket className="w-3.5 h-3.5 text-[#10324B]" />
              <span>Get Tickets</span>
            </button>
          </div>
        </header>
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-[#10324B] lg:min-h-[calc(100svh-76px)] lg:flex lg:flex-col">
          {/* Padel court backdrop: landscape court on desktop, portrait court on mobile */}
          <CourtBackdrop orientation="landscape" className="hidden lg:block" />
          <CourtBackdrop orientation="portrait" className="lg:hidden" />
          <div className="pointer-events-none absolute -right-32 top-1/4 w-[32rem] h-[32rem] rounded-full bg-[#83D318]/10 blur-3xl"></div>

          <div className="relative max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 xl:px-24 pt-16 pb-16 md:pt-20 md:pb-20 lg:py-12 lg:flex-1 flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-20 xl:gap-28 items-center">

              {/* LEFT COLUMN */}
              <div className="lg:col-span-6 space-y-8">

                {/* Eyebrow */}
                {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#005461]/70 border border-[#83D318]/40 font-poppins text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-slate-100">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-[#83D318] animate-ping opacity-75"></span>
                    <span className="relative w-2 h-2 rounded-full bg-[#83D318]"></span>
                  </span>
                  Padel Edition · Accra 2026
                </div> */}

                <h1 className="font-boldonse flex flex-col gap-3 sm:gap-5 text-[min(calc((100vw_-_48px)/9.4),3rem)] sm:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-white leading-[1.3] drop-shadow-lg">
                  <span className="whitespace-nowrap">Play. Connect.</span>
                  <span className="relative self-start text-[#83D318]">
                    Grow. Impact
                    <svg
                      aria-hidden="true"
                      className="absolute left-0 -bottom-3 sm:-bottom-4 w-full h-3 sm:h-4"
                      viewBox="0 0 400 16"
                      preserveAspectRatio="none"
                      fill="none"
                    >
                      <path d="M3 11 C 70 3, 140 3, 205 8 S 330 14, 397 5" stroke="#F1F9E5" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>

                <p className="font-poppins text-slate-200 text-base sm:text-lg font-normal leading-relaxed max-w-xl pt-2">
                 Play4Impact is a premier ecosystem
engagement platform that leverages sport,
wellness, networking, innovation, and community
engagement to bring together professionals,
entrepreneurs, innovators, institutions, corporate
organizations, community leaders, diaspora
stakeholders, and emerging changemakers.
                </p>

                {/* Date, Time & Venue Info Cards */}
                <div className="pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { label: 'Date', value: 'Nov 7, 2026', icon: Calendar },
                      { label: 'Time', value: '10:00 AM', icon: Clock },
                      { label: 'Venue', value: 'Padel Zone', fullValue: 'Padel Zone, Labone', icon: MapPin },
                    ].map((info) => {
                      const InfoIcon = info.icon;
                      return (
                        <div key={info.label} className={`relative group ${info.fullValue ? 'col-span-2 sm:col-span-1' : ''}`}>
                          <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-xl sm:rounded-2xl bg-[#83D318] transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5"></div>
                          <div className="relative h-full p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#005461] border border-[#83D318]/40 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-[#006878]">
                            <div className="flex items-center gap-2.5 sm:gap-3">
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#83D318]/15 border border-[#83D318]/50 text-[#83D318] flex items-center justify-center shrink-0">
                                <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-poppins text-[10px] font-extrabold uppercase tracking-wider text-[#83D318] block truncate">
                                  {info.label}
                                </span>
                                <span className="font-poppins text-sm font-black text-white block truncate" title={info.fullValue}>
                                  {info.fullValue ? (
                                    <>
                                      <span className="sm:hidden">{info.fullValue}</span>
                                      <span className="hidden sm:inline">{info.value}</span>
                                    </>
                                  ) : (
                                    info.value
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dress code */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/15">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-[#10324B] flex items-center justify-center shrink-0 shadow-md">
                    <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-poppins text-[10px] font-extrabold uppercase tracking-wider text-[#83D318] block">
                      Dress Code: Play4Impact Whites
                    </span>
                    <span className="font-poppins text-sm font-semibold text-white block">
                      White + a touch of Play4Impact colour.
                    </span>
                  </div>
                </div>

                {/* Quick stats */}
                {/* <div className="grid grid-cols-4 divide-x divide-white/10 pt-4">
                  {[
                    { value: '300+', label: 'Attendees' },
                    { value: '50+', label: 'Investors' },
                    { value: '20+', label: 'Startups' },
                    { value: '4', label: 'Courts' },
                  ].map((stat) => (
                    <div key={stat.label} className="px-2 first:pl-0 sm:px-4">
                      <span className="block font-boldonse text-base sm:text-2xl text-[#83D318] leading-tight">
                        {stat.value}
                      </span>
                      <span className="block mt-1 font-poppins text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div> */}

              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-6">

                <div className="relative group cursor-pointer">

                  <button
                    ref={setHeroCtaEl}
                    onClick={() => handleBuyTicket(ticketTiers[0])}
                    className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 z-20 py-3.5 px-6 sm:px-7 bg-[#83D318] hover:bg-[#96eb1e] text-[#10324B] font-poppins text-base sm:text-lg uppercase tracking-wider font-black rounded-xl shadow-2xl border-2 border-[#10324B] flex items-center justify-center gap-2.5 transform rotate-3 hover:rotate-0 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    <Ticket className="w-5 h-5 text-[#10324B]" />
                    <span>Get Tickets</span>
                    <ArrowRight className="w-5 h-5 text-[#10324B]" />
                  </button>

                  <div className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 rounded-[2rem] bg-[#83D318] transition-all duration-500 group-hover:translate-x-5 group-hover:translate-y-5 group-hover:shadow-[0_0_60px_rgba(131,211,24,0.45)]"></div>
                  <div className="absolute inset-0 -translate-x-3 -translate-y-3 sm:-translate-x-4 sm:-translate-y-4 rounded-[2rem] border-2 border-[#005461] transition-all duration-500 group-hover:-translate-x-5 group-hover:-translate-y-5 group-hover:border-[#83D318]/50"></div>

                  <div className="relative overflow-hidden w-full h-[380px] sm:h-[460px] rounded-[2rem] shadow-2xl bg-[#005461] ring-1 ring-white/10">
                    <img
                      src="/images/p4i/rackets.jpg"
                      alt="Play 4 Impact Padel Championship"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10324B]/95 via-black/20 to-transparent"></div>

                    {/* Live matches chip */}
                    {/* <div className="absolute top-16 sm:top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10324B]/85 backdrop-blur-md border border-white/15 font-poppins text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-white shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      Live Padel Matches
                    </div> */}

                    <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#10324B]/90 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3 shadow-xl">
                      <div className="min-w-0">
                        <span className="font-poppins text-[10px] uppercase tracking-wider text-[#83D318] font-bold block">
                          Africa's Tech Lifestyle Experience
                        </span>
                        <h3 className="font-poppins text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                          Play4Impact 2026 - Padel Edition
                        </h3>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-[#83D318] text-[#10324B] flex items-center justify-center font-bold shadow-md shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Floating experience chips (disabled for now) */}
                  {/*
                  <div className="hidden sm:flex absolute -left-8 top-[38%] z-10 animate-float items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#F1F9E5] text-[#10324B] shadow-2xl border-2 border-[#10324B] -rotate-3">
                    <div className="w-8 h-8 rounded-xl bg-[#83D318] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="block font-poppins text-[10px] font-extrabold uppercase tracking-wider text-[#005461]">Investor Mixer</span>
                      <span className="block font-poppins text-sm font-black">Investors & Networking</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex absolute -right-6 top-[58%] z-10 animate-float-delayed items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#10324B] text-white shadow-2xl border-2 border-[#83D318] rotate-2">
                    <div className="w-8 h-8 rounded-xl bg-[#83D318]/20 text-[#83D318] flex items-center justify-center">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="block font-poppins text-[10px] font-extrabold uppercase tracking-wider text-[#83D318]">Wellness</span>
                      <span className="block font-poppins text-sm font-black">Health Checks</span>
                    </div>
                  </div>
                  */}
                </div>

              </div>

            </div>
          </div>

          {/* Tilted marquee band */}
          <div className="relative pb-10 pt-2">
            <div className="-mx-4 -rotate-[1.5deg] bg-[#83D318] border-y-2 border-[#10324B] py-3 overflow-hidden shadow-[0_10px_40px_-10px_rgba(131,211,24,0.5)]">
              <div className="animate-marquee-flow items-center">
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex items-center shrink-0" aria-hidden={copy === 1}>
                    {['Padel', 'Tech', 'Investors', 'Wellness', 'Networking', 'Impact', 'Padel', 'Tech', 'Investors', 'Wellness', 'Networking', 'Impact'].map((word, i) => (
                      <span key={i} className="flex items-center font-boldonse text-sm sm:text-lg text-[#10324B] uppercase whitespace-nowrap">
                        <span className="px-5 sm:px-7">{word}</span>
                        <span className="text-[#10324B]/60">✦</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PILLARS / EXPERIENCE VISUAL HIGHLIGHTS */}
        <section id="highlights" className="py-20 bg-[#0A1F2E] overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EventHighlightsCarousel />
          </div>
        </section>

        {/* TICKET TIERS SECTION */}
        <section id="tickets" className="py-24 bg-[#10324B] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#83D318] text-[#10324B] text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>Official Ticket Passes</span>
              </div> */}
              <h2 className="font-poppins text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
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

            {/* Pricing Cards Grid: single passes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {ticketTiers.filter((tier) => peopleAdmitted(tier) === 1).map(renderTierCard)}
            </div>

            {/* Group passes */}
            <div className="mt-20 text-center space-y-2">
              <span className="text-xs font-bold text-[#83D318] uppercase tracking-widest">Group Passes</span>
              <h3 className="font-poppins text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Bring Your Crew <span className="text-[#83D318]">&amp; Save</span>
              </h3>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
              {ticketTiers.filter((tier) => peopleAdmitted(tier) > 1).map(renderTierCard)}
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
              <h2 className="font-poppins pt-6 text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                The Five <span className="text-[#83D318]">Play4Impact Pillars</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg">
                Fusing sports, innovation, investment, wellness, and community to inspire transformational growth across Africa.
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
                  focus: ['Physical Wellness', 'Active Living', 'Workplace Health', 'Community Building Through Sport', 'Recreational Sport'],
                },
                {
                  number: '02',
                  title: 'Innovation & Technology',
                  desc: 'Artificial intelligence, digital transformation, tech careers, ecosystems, and future of work.',
                  icon: Zap,
                  focus: ['Artificial Intelligence', 'Digital Transformation', 'Innovation Ecosystems', 'Future of Work', 'Digital Skills'],
                },
                {
                  number: '03',
                  title: 'Wealth & Opportunity',
                  desc: 'Entrepreneurship, wealth building, investment readiness, career development, and business growth.',
                  icon: Crown,
                  focus: ['Entrepreneurship', 'Wealth Building', 'Investment Readiness', 'Career Development', 'Business Growth'],
                },
                {
                  number: '04',
                  title: 'Community & Impact',
                  desc: 'Social impact, youth empowerment, community development, volunteerism, and sustainability.',
                  icon: Users,
                  focus: ['Social Impact', 'Youth Empowerment', 'Community Development', 'Volunteerism', 'Sustainability', 'Leadership'],
                },
                {
                  number: '05',
                  title: 'Global Connections',
                  desc: 'Strategic partnerships, diaspora engagement, international collaboration, and knowledge exchange.',
                  icon: Globe,
                  focus: ['Strategic Partnerships', 'Diaspora Engagement', 'International Collaboration', 'Global Talent', 'Investment Promotion', 'Cross-Border Deals'],
                },
              ].map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="group relative flex flex-col overflow-hidden rounded-3xl p-6 bg-[#10324B] border border-white/10 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#83D318]/60"
                  >
                    {/* Lime accent bar that extends on hover */}
                    <span className="absolute inset-x-0 top-0 h-1 bg-[#83D318] origin-left scale-x-25 transition-transform duration-500 group-hover:scale-x-100"></span>

                    {/* Oversized pillar number watermark */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none select-none absolute -right-1 -bottom-5 font-boldonse text-8xl leading-none text-white/[0.04] transition-colors duration-300 group-hover:text-[#83D318]/[0.08]"
                    >
                      {pillar.number}
                    </span>

                    <div className="relative flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#83D318] text-[#10324B] flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(131,211,24,0.6)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="font-poppins text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Pillar {pillar.number}
                      </span>
                    </div>

                    <h3 className="relative mt-6 min-h-[2lh] font-poppins text-lg font-black text-white uppercase tracking-tight leading-snug">
                      {pillar.title}
                    </h3>
                    {/* <p className="relative mt-2 text-sm text-slate-300 leading-relaxed">
                      {pillar.desc}
                    </p> */}

                    <ul className="relative pt-4 flex flex-wrap gap-2">
                      {pillar.focus.map((item, fIdx) => (
                        <li
                          key={fIdx}
                          className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-200 transition-colors group-hover:border-[#83D318]/30"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
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
                <h2 className="font-poppins text-3xl pt-6 sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                  Who Attends <span className="text-[#83D318]">Play4Impact?</span>
                </h2>
                <p className="text-slate-200 text-base leading-relaxed">
                  The event brings together <strong>300+ participants</strong> from Ghana, West Africa, and global diaspora networks including: professionals, founders, corporate executives, CEOs, investors and innovators.
                </p>

                {/* <div className="p-6 rounded-2xl bg-[#005461]/60 border border-[#83D318]/40 shadow-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-[#83D318]" />
                    <h4 className="font-poppins text-lg font-black text-white uppercase">Open To The Whole Tech Community</h4>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Whether you're a founder, a VC partner, a developer shipping code every day, or someone curious about breaking into tech, Play4Impact creates an organic, high-energy space for real conversations and lifelong connections.
                  </p>
                </div> */}
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Tech Founders & Entrepreneurs', desc: 'Building high-growth startups and digital solutions across Africa.', icon: Zap },
                    { title: 'Corporate Executives ', desc: 'C-suite leaders seeking strategic partnerships & workplace wellness.', icon: Briefcase },
                    { title: 'Investors & VC Partners', desc: 'Angel investors and venture funds exploring early & growth-stage deals.', icon: TrendingUp },
                    { title: 'Diaspora Professionals', desc: 'Global Ghanaian & African diaspora stakeholders driving investment & talent.', icon: Globe },
                    { title: 'Government & Public Sector', desc: 'Policy makers, innovation hubs & public sector representatives.', icon: Building2 },
                    { title: 'Emerging Talent & Leaders', desc: 'Future leaders, innovators & high-potential ecosystem changemakers.', icon: Award },
                    { title: 'Professionals', desc: 'Engineers, creatives and everyone in between building their careers.', icon: Laptop },
                    // { title: 'Beginners & Tech Enthusiasts', desc: 'Students, career switchers & anyone curious about tech. No experience needed.', icon: Seedling },
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
                          <h4 className="font-poppins text-sm font-black text-white uppercase tracking-tight">
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
              <h2 className="font-poppins text-3xl pt-3 sm:text-5xl font-black text-white uppercase tracking-tight">
                Event Partners & <span className="text-[#83D318]">Sponsors</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg">
                Supported by government institutions, global brands, wellness and media organizations.
              </p>
            </div>

            {/* Infinite Flowing Sponsor Marquee Carousel */}
            <div className="relative w-full overflow-hidden py-4">
              <div className="absolute top-0 bottom-0 left-0 w-24 z-10 bg-gradient-to-r from-[#0B1E2B] via-[#0B1E2B]/80 to-transparent pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-24 z-10 bg-gradient-to-l from-[#0B1E2B] via-[#0B1E2B]/80 to-transparent pointer-events-none" />

              <div className="animate-marquee-flow flex gap-5 items-center">
                {[...eventPartners, ...eventPartners].map((sponsor, sIdx) => (
                  <div
                    key={sIdx}
                    className="w-56 sm:w-64 shrink-0 p-4 rounded-3xl bg-[#004753]/50 border border-white/10 hover:border-[#83D318]/70 transition-all duration-300 flex flex-col items-center justify-between text-center space-y-3 shadow-xl backdrop-blur-md group hover:bg-[#005461]/80 hover:-translate-y-1 cursor-pointer"
                  >
                    <div
                      className={`w-full h-24 rounded-2xl px-4 py-3 flex items-center justify-center shadow-inner group-hover:scale-[1.03] transition-transform duration-300 overflow-hidden border ${
                        sponsor.darkTile ? 'bg-[#10324B] border-white/10' : 'bg-white border-slate-100'
                      }`}
                    >
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="w-full px-1">
                      <h4 className="font-poppins text-xs font-black text-white uppercase group-hover:text-[#83D318] transition-colors truncate">
                        {sponsor.name}
                      </h4>
                      <span className="font-poppins text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block truncate mt-0.5">
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
                  <h3 className="font-poppins pt-3 text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                    Let’s Play4Impact <span className="text-[#83D318]">Together!</span>
                  </h3>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    Interested in sponsoring, hosting a startup demo, or securing corporate player slots for your company? Fill out our quick partnership form. It takes about 2 minutes, and our Partnership & Growth team will get back to you.
                  </p>
                </div>

                {/* Contact Card */}
                <div className="p-6 rounded-2xl bg-[#10324B]/90 border border-[#83D318]/50 shadow-xl space-y-4 shrink-0 w-full md:w-auto min-w-[280px]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#83D318] tracking-widest block">
                      Partnership / Growth Lead
                    </span>
                    <h4 className="font-poppins text-xl font-black text-white uppercase">Abena Adoma</h4>
                  </div>

                  <div className="space-y-2 text-xs font-semibold text-slate-200 border-t border-white/10 pt-3">
                    <a
                      href="tel:0578796905"
                      className="flex items-center gap-2 hover:text-[#83D318] transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#83D318]" />
                      <span>+233 57 879 6905</span>
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
                    href={PARTNERSHIP_FORM_URL || PARTNERSHIP_MAILTO}
                    {...(PARTNERSHIP_FORM_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="w-full py-3 bg-[#83D318] hover:bg-[#96eb1e] text-[#10324B] font-poppins text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                  >
                    <span>Become a Partner</span>
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
              <h2 className="font-poppins text-3xl font-black text-white uppercase">Frequently Asked Questions</h2>
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
                <p className="text-slate-300">Powered by Techies4Impact • Accra, Ghana</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-slate-200">
              <a href="#tickets" className="hover:text-[#83D318] transition-colors">Tickets & Passes</a>
              <a href="#highlights" className="hover:text-[#83D318] transition-colors">Event Highlights</a>
              <a href="/terms" className="hover:text-[#83D318] transition-colors">Terms of Service</a>
              <a href="/privacy" className="hover:text-[#83D318] transition-colors">Privacy Policy</a>
              <a href="/refunds" className="hover:text-[#83D318] transition-colors">Refunds Policy</a>
            </div>

            <div className="text-center md:text-right text-slate-300 text-[11px]">
              <p>© 2026 Techies4Impact. All Rights Reserved.</p>
              <p className="mt-1 text-[#83D318] font-bold">Nov 7, 2026 • Padel Zone, Labone - Accra</p>
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
