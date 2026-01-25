import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Lock, User, ArrowRight, Building2, CheckCircle, Briefcase, 
  MapPin, Award, ChevronRight, HelpCircle, X, Star, TrendingUp, 
  Clock, Shield, Zap, LayoutDashboard, MessageSquare, FileSpreadsheet,
  Globe, Search, CalendarCheck, Share2, AlertCircle, ArrowDown, PieChart, Bell, DollarSign
} from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  // View State: 'LANDING' | 'AUTH'
  const [viewState, setViewState] = useState<'LANDING' | 'AUTH'>('LANDING');
  
  // Auth States
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation & Interaction States
  const [isLaptopOpen, setIsLaptopOpen] = useState(false);
  const laptopRef = useRef<HTMLDivElement>(null);
  
  // Sales Game State
  const [salesCount, setSalesCount] = useState(124);
  const [revenue, setRevenue] = useState(45200);
  const [clickEffect, setClickEffect] = useState<{id: number, x: number, y: number}[]>([]);

  // Onboarding States
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [worksInRealEstate, setWorksInRealEstate] = useState<boolean | null>(null);
  const [role, setRole] = useState('Consultor Imobiliário');
  const [agency, setAgency] = useState('');
  const [experience, setExperience] = useState('1-3 anos');

  // Scroll Observer for Laptop
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLaptopOpen(true);
        }
      },
      { threshold: 0.4 } // Opens when 40% of the laptop is visible
    );

    if (laptopRef.current) {
      observer.observe(laptopRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLaptopClick = (e: React.MouseEvent) => {
      // 1. Play Sound
      const audio = new Audio('https://www.myinstants.com/media/sounds/ka-ching.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {}); // Catch error if user hasn't interacted with document yet

      // 2. Increment Numbers
      setSalesCount(prev => prev + 1);
      setRevenue(prev => prev + 1500); // Add commission

      // 3. Visual Effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newEffect = { id: Date.now(), x, y };
      setClickEffect(prev => [...prev, newEffect]);

      // Remove effect after animation
      setTimeout(() => {
          setClickEffect(prev => prev.filter(ef => ef.id !== newEffect.id));
      }, 1000);
  };

  const handleAuthStart = (mode: 'LOGIN' | 'SIGNUP') => {
      setIsLogin(mode === 'LOGIN');
      setViewState('AUTH');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
      const element = document.getElementById('how-it-works');
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        onLogin();
      } else {
        setShowOnboarding(true);
      }
    }, 1000);
  };

  const completeOnboarding = () => {
     onLogin();
  };

  // --- LANDING PAGE COMPONENT ---
  if (viewState === 'LANDING') {
      return (
          <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
              
              {/* BACKGROUND ANIMATION */}
              <div className="fixed inset-0 z-0 pointer-events-none">
                  {/* Moving Gradient */}
                  <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                  <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                  
                  {/* Moving Grid/Stars */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-float-slow"></div>
              </div>

              {/* Navbar */}
              <nav className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto relative z-50">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/50">IC</div>
                      <span className="font-bold text-xl tracking-tight">ImobCurator</span>
                  </div>
                  <div className="flex gap-4">
                      <button 
                        onClick={() => handleAuthStart('LOGIN')}
                        className="text-gray-300 hover:text-white font-medium transition-colors"
                      >
                          Entrar
                      </button>
                      <button 
                        onClick={() => handleAuthStart('SIGNUP')}
                        className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                      >
                          Começar Grátis
                      </button>
                  </div>
              </nav>

              {/* Hero Section */}
              <header className="px-6 pt-12 pb-24 text-center max-w-7xl mx-auto relative z-10">
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-md">
                      <Star size={12} className="fill-indigo-300" /> A Ferramenta do Buyer Agent Moderno
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                      Domine a Arte da Compra.<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">Automatize o Resto.</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700">
                      Acabe com o caos de planilhas e links perdidos no WhatsApp. 
                      A primeira plataforma que centraliza a curadoria, organiza visitas e encanta o seu cliente comprador.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 mb-20">
                      <button 
                        onClick={() => handleAuthStart('SIGNUP')}
                        className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-600/40 transition-all hover:scale-105 flex items-center justify-center gap-2 border border-indigo-500"
                      >
                          Criar Conta Gratuita <ArrowRight size={20} />
                      </button>
                      <button 
                        onClick={scrollToHowItWorks}
                        className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl font-bold text-lg border border-slate-700 backdrop-blur-sm transition-all flex items-center justify-center gap-2 group"
                      >
                          Ver Como Funciona <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
                      </button>
                  </div>

                  {/* 3D LAPTOP ANIMATION (FRONT FACING & INTERACTIVE) */}
                  <div ref={laptopRef} className="relative w-full max-w-4xl mx-auto h-[300px] md:h-[500px] perspective-1500 group cursor-pointer" onClick={handleLaptopClick}>
                      <div className="relative w-full h-full transform-style-3d">
                          
                          {/* Base (Keyboard) - Front Facing */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] md:w-[700px] h-[16px] bg-slate-700 rounded-b-2xl shadow-2xl z-20 border-t border-slate-600">
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-700 to-slate-900 rounded-b-2xl"></div>
                              {/* Notch for opening */}
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-2 bg-slate-800 rounded-b-lg border border-slate-600 border-t-0"></div>
                          </div>

                          {/* Lid (Screen) - Opens Upwards */}
                          <div 
                            className={`absolute bottom-[16px] left-1/2 w-[80%] md:w-[700px] h-[200px] md:h-[420px] bg-slate-800 rounded-t-2xl border-4 border-slate-700 shadow-2xl origin-bottom transition-all duration-[1.5s] ease-in-out transform-style-3d
                                ${isLaptopOpen ? '-translate-x-1/2 rotate-x-0' : '-translate-x-1/2 -rotate-x-90'}
                            `}
                          >
                              {/* Screen Content (The Mockup) */}
                              <div className="w-full h-full bg-slate-950 rounded-t-lg overflow-hidden relative border-b border-slate-700 flex flex-col select-none">
                                  
                                  {/* Navbar Mock */}
                                  <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
                                      <div className="flex gap-1.5">
                                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                      </div>
                                      <div className="w-40 h-4 bg-slate-800 rounded-full"></div>
                                      <div className="w-6 h-6 rounded-full bg-indigo-600"></div>
                                  </div>

                                  {/* Main Dashboard Content */}
                                  <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                                      
                                      {/* Click Effects (Money Floating) */}
                                      {clickEffect.map(effect => (
                                          <div 
                                            key={effect.id}
                                            className="absolute text-green-400 font-bold text-xl pointer-events-none animate-float-up z-50"
                                            style={{ left: effect.x, top: effect.y }}
                                          >
                                              +€1.500
                                          </div>
                                      ))}

                                      <div className="text-center mb-8">
                                          <p className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Comissões Acumuladas</p>
                                          <h2 className="text-5xl md:text-6xl font-black text-white flex items-center justify-center gap-2">
                                              €{revenue.toLocaleString()}
                                              <TrendingUp className="text-green-500 animate-pulse" size={40} />
                                          </h2>
                                      </div>

                                      <div className="grid grid-cols-3 gap-6 w-full max-w-lg">
                                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col items-center group-hover:border-indigo-500/50 transition-colors">
                                              <p className="text-slate-400 text-xs mb-1">Vendas Fechadas</p>
                                              <p className="text-2xl font-bold text-white">{salesCount}</p>
                                          </div>
                                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col items-center group-hover:border-green-500/50 transition-colors">
                                              <p className="text-slate-400 text-xs mb-1">Visitas Hoje</p>
                                              <p className="text-2xl font-bold text-green-400">8</p>
                                          </div>
                                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col items-center group-hover:border-purple-500/50 transition-colors">
                                              <p className="text-slate-400 text-xs mb-1">Leads Ativas</p>
                                              <p className="text-2xl font-bold text-purple-400">24</p>
                                          </div>
                                      </div>

                                      {/* Mock Chart Line */}
                                      <div className="mt-8 w-full max-w-lg h-24 flex items-end justify-between gap-1 opacity-50">
                                          {[40, 60, 45, 70, 50, 80, 65, 90, 75, 100].map((h, i) => (
                                              <div 
                                                key={i} 
                                                className="w-full bg-indigo-600 rounded-t-sm transition-all duration-300" 
                                                style={{ height: `${(h / 100) * (salesCount % 10 + 5) * 10}%` }}
                                              ></div>
                                          ))}
                                      </div>

                                      <div className="absolute bottom-4 text-xs text-slate-500 flex items-center gap-2">
                                          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                          Sistema Online • Clique no ecrã para vender!
                                      </div>
                                  </div>
                              </div>
                              
                              {/* Reflection / Gloss */}
                              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent to-white/5 pointer-events-none rounded-t-xl"></div>
                          </div>
                      </div>
                      
                      {/* Laptop Shadow */}
                      <div className={`absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[60%] h-[20px] bg-black/50 blur-xl rounded-full transition-all duration-[1.5s] ${isLaptopOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
                  </div>

              </header>

              {/* BEFORE VS AFTER SECTION (Explicit Chaos vs Order) */}
              <section className="px-6 py-24 bg-slate-950 border-y border-slate-800 relative overflow-hidden z-10">
                  <div className="max-w-7xl mx-auto relative z-10">
                      <div className="text-center mb-16 animate-on-scroll">
                          <h2 className="text-3xl md:text-4xl font-bold mb-4">A Diferença é Visível.</h2>
                          <p className="text-gray-400">O seu cliente sente a desorganização. Mude a percepção dele hoje.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                          
                          {/* Left: The Chaos (Explicit Excel/WhatsApp/Email) */}
                          <div className="relative group animate-in slide-in-from-left-8 duration-700">
                              <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full"></div>
                              
                              <div className="relative bg-slate-900/50 border border-slate-800 p-8 rounded-3xl min-h-[400px] flex flex-col items-center justify-center overflow-hidden hover:border-red-500/30 transition-colors">
                                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-red-500/30">O Velho Jeito (Caos)</div>
                                  
                                  {/* Chaos Elements Stack */}
                                  <div className="relative w-full max-w-sm h-64 mt-8 group-hover:scale-105 transition-transform duration-500">
                                      
                                      {/* Excel Sheet (Background) */}
                                      <div className="absolute top-0 left-0 w-full bg-white text-slate-900 p-4 rounded-lg shadow-lg transform -rotate-6 border border-gray-300 opacity-80 scale-90 origin-bottom-left transition-transform group-hover:-rotate-12">
                                          <div className="flex items-center gap-2 mb-2 border-b pb-2 border-gray-200">
                                              <FileSpreadsheet className="text-green-600" size={20} />
                                              <span className="font-mono text-xs font-bold">Leads_Final_v2.xlsx</span>
                                          </div>
                                          <div className="space-y-2">
                                              <div className="h-2 w-full bg-gray-200 rounded"></div>
                                              <div className="h-2 w-full bg-gray-200 rounded"></div>
                                              <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                                              <div className="text-xs text-red-500 font-mono mt-1">#REF! ERROR</div>
                                          </div>
                                      </div>

                                      {/* Email (Middle) */}
                                      <div className="absolute top-8 right-0 w-64 bg-white text-slate-900 p-4 rounded-lg shadow-xl transform rotate-3 border border-gray-300 z-10 transition-transform group-hover:rotate-6 group-hover:translate-x-4">
                                          <div className="flex items-center gap-2 mb-2">
                                              <Mail className="text-blue-500" size={18} />
                                              <span className="text-xs font-bold">Caixa de Entrada (1,243)</span>
                                          </div>
                                          <p className="text-[10px] text-gray-500">Re: Visita cancelada...</p>
                                          <p className="text-[10px] text-gray-500">Fwd: Fotos da casa...</p>
                                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">99+</div>
                                      </div>

                                      {/* WhatsApp (Foreground) */}
                                      <div className="absolute bottom-0 left-8 w-72 bg-white text-slate-900 p-4 rounded-2xl shadow-2xl border border-gray-200 z-20 transform -rotate-2 transition-transform group-hover:rotate-0 group-hover:-translate-y-2">
                                          <div className="flex items-center gap-2 mb-3">
                                              <div className="bg-green-500 p-1.5 rounded-full text-white"><MessageSquare size={14} /></div>
                                              <span className="text-xs font-bold">Cliente Ana</span>
                                              <span className="ml-auto text-[10px] text-gray-400">10:42</span>
                                          </div>
                                          <div className="bg-green-100 p-2 rounded-lg rounded-tl-none text-xs text-slate-800 mb-2 w-3/4">
                                              Qual era o preço daquela casa amarela? O link não abre... 😕
                                          </div>
                                          <div className="bg-gray-100 p-2 rounded-lg rounded-tr-none text-xs text-slate-600 ml-auto w-3/4">
                                              Vou procurar no histórico, só um minuto...
                                          </div>
                                      </div>

                                  </div>

                                  <p className="mt-8 text-red-400 text-sm font-medium flex items-center gap-2">
                                      <AlertCircle size={16} /> Dados fragmentados = Vendas perdidas
                                  </p>
                              </div>
                          </div>

                          {/* Right: The Solution (Clean UI) */}
                          <div className="relative group animate-in slide-in-from-right-8 duration-700 delay-200">
                              <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full"></div>
                              
                              <div className="relative bg-slate-900 border border-indigo-500/30 p-8 rounded-3xl min-h-[400px] flex flex-col items-center justify-center shadow-2xl shadow-indigo-900/20 hover:border-indigo-500 transition-colors">
                                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg shadow-indigo-500/40">ImobCurator (Ordem)</div>
                                  
                                  <div className="relative w-full max-w-sm mt-8 space-y-4 group-hover:scale-105 transition-transform duration-500">
                                      
                                      {/* Client Card UI */}
                                      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg flex items-center gap-4">
                                          <img src="https://picsum.photos/id/65/100/100" className="w-12 h-12 rounded-full border-2 border-indigo-500" alt="Ana" />
                                          <div className="flex-1">
                                              <h3 className="font-bold text-white">Ana Silva</h3>
                                              <div className="flex gap-2 mt-1">
                                                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded font-bold">Proposta Ativa</span>
                                                  <span className="bg-green-500/20 text-green-300 text-[10px] px-2 py-0.5 rounded font-bold">3 Visitas</span>
                                              </div>
                                          </div>
                                          <div className="bg-slate-700 p-2 rounded-lg text-indigo-400">
                                              <ChevronRight size={20} />
                                          </div>
                                      </div>

                                      {/* Property Match UI */}
                                      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
                                          <div className="flex justify-between items-center mb-3">
                                              <span className="text-xs font-bold text-gray-400 uppercase">Novo Match IA</span>
                                              <span className="text-green-400 text-xs font-bold flex items-center gap-1"><Star size={10} className="fill-green-400" /> 98%</span>
                                          </div>
                                          <div className="flex gap-3">
                                              <img src="https://picsum.photos/id/15/200/200" className="w-16 h-16 rounded-lg object-cover" alt="Casa" />
                                              <div>
                                                  <p className="font-bold text-white text-sm">T2 Chiado Premium</p>
                                                  <p className="text-indigo-400 text-sm font-bold">€450.000</p>
                                                  <p className="text-xs text-gray-500 mt-1">Jardim • Renovado</p>
                                              </div>
                                          </div>
                                          <div className="mt-3 flex gap-2">
                                              <button className="flex-1 bg-indigo-600 text-white text-xs py-2 rounded-lg font-bold">Adicionar à Proposta</button>
                                          </div>
                                      </div>

                                  </div>

                                  <p className="mt-8 text-indigo-300 text-sm font-medium flex items-center gap-2">
                                      <CheckCircle size={16} /> Centralizado, profissional e rápido.
                                  </p>
                              </div>
                          </div>

                      </div>
                  </div>
              </section>

              {/* HOW IT WORKS SECTION (Enhanced Animation) */}
              <section id="how-it-works" className="py-32 px-6 bg-slate-900 relative z-10 overflow-hidden">
                  <div className="max-w-7xl mx-auto relative">
                      <div className="text-center mb-24 animate-on-scroll">
                          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Como Funciona?</h2>
                          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Três passos simples para automatizar o seu trabalho.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                          {/* Connecting Line (Desktop) */}
                          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-900/50 to-transparent -translate-y-1/2 z-0"></div>

                          {/* Step 1 */}
                          <div className="relative z-10 text-center group animate-in zoom-in-50 duration-700 fill-mode-both" style={{ animationDelay: '0ms' }}>
                              <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300 shadow-2xl shadow-indigo-900/20 group-hover:border-indigo-500/50">
                                  {/* Giant Number Background */}
                                  <span className="absolute top-0 right-4 text-[120px] font-black text-slate-800/50 select-none leading-none -z-10 group-hover:text-indigo-900/20 transition-colors">1</span>
                                  
                                  <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                                      <Search size={36} />
                                  </div>
                                  <h3 className="text-2xl font-bold mb-3 text-white">Curadoria IA</h3>
                                  <p className="text-gray-400 text-sm leading-relaxed">
                                      A nossa IA varre 5+ portais e filtra "lixo". Você recebe apenas leads qualificados.
                                  </p>
                              </div>
                          </div>

                          {/* Step 2 */}
                          <div className="relative z-10 text-center group animate-in zoom-in-50 duration-700 fill-mode-both" style={{ animationDelay: '200ms' }}>
                              <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300 shadow-2xl shadow-purple-900/20 group-hover:border-purple-500/50">
                                  <span className="absolute top-0 right-4 text-[120px] font-black text-slate-800/50 select-none leading-none -z-10 group-hover:text-purple-900/20 transition-colors">2</span>
                                  
                                  <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                                      <Share2 size={36} />
                                  </div>
                                  <h3 className="text-2xl font-bold mb-3 text-white">Feedback Real</h3>
                                  <p className="text-gray-400 text-sm leading-relaxed">
                                      O cliente recebe um link exclusivo. Ele dá "Like" ou "Dislike" em tempo real.
                                  </p>
                              </div>
                          </div>

                          {/* Step 3 */}
                          <div className="relative z-10 text-center group animate-in zoom-in-50 duration-700 fill-mode-both" style={{ animationDelay: '400ms' }}>
                              <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300 shadow-2xl shadow-green-900/20 group-hover:border-green-500/50">
                                  <span className="absolute top-0 right-4 text-[120px] font-black text-slate-800/50 select-none leading-none -z-10 group-hover:text-green-900/20 transition-colors">3</span>
                                  
                                  <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-green-600/30 group-hover:scale-110 transition-transform">
                                      <CalendarCheck size={36} />
                                  </div>
                                  <h3 className="text-2xl font-bold mb-3 text-white">Agendamento</h3>
                                  <p className="text-gray-400 text-sm leading-relaxed">
                                      Converta Likes em visitas. O sistema coordena horários e envia emails aos colegas.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              {/* FEATURES GRID SECTION */}
              <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800 z-10 relative">
                  <div className="text-center mb-16 animate-on-scroll">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ferramentas de Elite.</h2>
                      <p className="text-gray-400">Tudo o que precisa para fechar mais negócios, numa só plataforma.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                          { icon: Search, title: "Curadoria IA", desc: "Varre múltiplos portais e filtra oportunidades.", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "hover:border-indigo-500/50" },
                          { icon: LayoutDashboard, title: "Portal do Cliente", desc: "Área exclusiva para feedback em tempo real.", color: "text-purple-400", bg: "bg-purple-500/10", border: "hover:border-purple-500/50" },
                          { icon: CalendarCheck, title: "Gestão de Visitas", desc: "Organize rotas e automatize o follow-up.", color: "text-blue-400", bg: "bg-blue-500/10", border: "hover:border-blue-500/50" },
                          { icon: Globe, title: "Microsite Pessoal", desc: "A sua página profissional para captar leads.", color: "text-green-400", bg: "bg-green-500/10", border: "hover:border-green-500/50" }
                      ].map((feature, i) => (
                          <div key={i} className={`bg-slate-800/30 p-6 rounded-2xl border border-slate-700 ${feature.border} transition-all hover:bg-slate-800 hover:-translate-y-1 group animate-in slide-in-from-bottom-8 duration-500`} style={{ animationDelay: `${i * 100}ms` }}>
                              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                                  <feature.icon size={24} />
                              </div>
                              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                          </div>
                      ))}
                  </div>
              </section>

              {/* Stats Section */}
              <section className="py-20 px-6 max-w-7xl mx-auto bg-slate-900/50 border-y border-slate-800 z-10 relative backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                      <div className="p-4 animate-in zoom-in-90 duration-700">
                          <div className="text-4xl md:text-5xl font-bold text-white mb-2">10h+</div>
                          <p className="text-indigo-300 text-sm uppercase font-bold tracking-wide">Poupadas por Semana</p>
                      </div>
                      <div className="p-4 border-y md:border-y-0 md:border-x border-slate-800 animate-in zoom-in-90 duration-700 delay-100">
                          <div className="text-4xl md:text-5xl font-bold text-white mb-2">30%</div>
                          <p className="text-green-400 text-sm uppercase font-bold tracking-wide">Aumento em Conversão</p>
                      </div>
                      <div className="p-4 animate-in zoom-in-90 duration-700 delay-200">
                          <div className="text-4xl md:text-5xl font-bold text-white mb-2">Top 1%</div>
                          <p className="text-purple-400 text-sm uppercase font-bold tracking-wide">Performance dos Agentes</p>
                      </div>
                  </div>
              </section>

              {/* Footer CTA */}
              <footer className="py-24 px-6 text-center bg-gradient-to-b from-slate-900 to-indigo-950 relative z-10">
                  <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">Pronto para elevar o nível?</h2>
                  <button 
                    onClick={() => handleAuthStart('SIGNUP')}
                    className="px-10 py-5 bg-white text-indigo-900 rounded-full font-bold text-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-2xl shadow-white/10"
                  >
                      Começar Agora (Grátis)
                  </button>
                  <p className="mt-6 text-gray-500">© 2026 ImobCurator. Feito para Buyer Agents.</p>
              </footer>

              {/* STYLES FOR 3D LAPTOP & ANIMATIONS */}
              <style>{`
                .perspective-1500 {
                    perspective: 1500px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .rotate-x-0 {
                    transform: rotateX(0deg);
                }
                .-rotate-x-90 {
                    transform: rotateX(-90deg);
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float-slow {
                    animation: float-slow 10s ease-in-out infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 5s ease infinite;
                }
                @keyframes float-up {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up 1s ease-out forwards;
                }
              `}</style>

          </div>
      );
  }

  // --- AUTH COMPONENT (Existing Login Logic Wrapped) ---
  if (showOnboarding) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
           <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
              
              {/* Left Side (Visual) */}
              <div className="w-full md:w-1/3 bg-indigo-600 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                       <Award size={24} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Perfil Profissional</h2>
                    <p className="text-indigo-100 text-sm">Personalize a sua experiência no ImobCurator para maximizar seus resultados.</p>
                 </div>
                 <div className="absolute bottom-0 right-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <Building2 size={200} />
                 </div>
              </div>

              {/* Right Side (Form) */}
              <div className="w-full md:w-2/3 p-8">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Configuração da Conta</h3>
                    <button onClick={() => setViewState('LANDING')} className="text-gray-400 hover:text-slate-900 dark:hover:text-white"><X size={20}/></button>
                 </div>
                 
                 <div className="space-y-6">
                    {/* ... (Existing Onboarding Logic) ... */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
                            Você trabalha no ramo imobiliário?
                        </label>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setWorksInRealEstate(true)}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${worksInRealEstate === true ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-500' : 'border-gray-200 dark:border-slate-600 hover:border-indigo-300 text-gray-600 dark:text-gray-300'}`}
                            >
                                <CheckCircle size={18} className={worksInRealEstate === true ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'} />
                                Sim
                            </button>
                            <button 
                                onClick={() => setWorksInRealEstate(false)}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${worksInRealEstate === false ? 'border-slate-600 bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-gray-300' : 'border-gray-200 dark:border-slate-600 hover:border-slate-300 text-gray-600 dark:text-gray-300'}`}
                            >
                                Não
                            </button>
                        </div>
                    </div>

                    {worksInRealEstate === true && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Qual a sua corretora / afiliação?</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {['Remax', 'Keller Williams', 'Century 21', 'Era', 'Independente', 'Agência Privada'].map((a) => (
                                        <button key={a} onClick={() => setAgency(a)} className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all text-center truncate ${agency === a ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300' : 'border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-750 text-gray-600 dark:text-gray-300'}`}>{a}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Qual o seu cargo principal?</label>
                                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white">
                                    <option>Consultor Imobiliário</option>
                                    <option>Gestor de Agência / Broker</option>
                                    <option>Assistente Administrativo</option>
                                    <option>Investidor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Tempo de Experiência</label>
                                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-750 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white">
                                    <option>Menos de 1 ano</option>
                                    <option>1-3 anos</option>
                                    <option>3-5 anos</option>
                                    <option>Mais de 5 anos</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {worksInRealEstate === false && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-xl text-sm flex gap-3 animate-in fade-in">
                            <HelpCircle className="flex-shrink-0" size={20} />
                            <p>O ImobCurator foi desenhado especificamente para agentes imobiliários. Você pode continuar, mas as ferramentas de CRM e curadoria podem não se aplicar ao seu uso.</p>
                        </div>
                    )}
                 </div>

                 <div className="mt-8 flex justify-end">
                    <button 
                       onClick={completeOnboarding}
                       disabled={worksInRealEstate === null || (worksInRealEstate === true && !agency)}
                       className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       Concluir Cadastro <ChevronRight size={18} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      
      {/* AUTH VIEW (Standard Login) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
        <button 
            onClick={() => setViewState('LANDING')}
            className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 z-30 transition-colors font-medium"
        >
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Site
        </button>

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90 z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80" 
            alt="Modern Architecture" 
            className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 text-white max-w-lg">
           <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-xl">
              <Building2 size={32} className="text-white" />
           </div>
           <h1 className="text-5xl font-bold mb-6">ImobCurator</h1>
           <p className="text-xl text-indigo-100 leading-relaxed mb-8">
              A plataforma de inteligência definitiva para Buyer Agents. 
              Centralize a curadoria, automatize visitas e feche mais negócios.
           </p>
           
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-green-500/20 rounded-full text-green-300">
                    <CheckCircle size={20} />
                 </div>
                 <span className="text-indigo-50 font-medium">Gestão de Propostas Inteligente</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-green-500/20 rounded-full text-green-300">
                    <CheckCircle size={20} />
                 </div>
                 <span className="text-indigo-50 font-medium">Curadoria Automática via IA</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-green-500/20 rounded-full text-green-300">
                    <CheckCircle size={20} />
                 </div>
                 <span className="text-indigo-50 font-medium">Microsite Pessoal Incluso</span>
              </div>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Mobile Back Button */}
        <button 
            onClick={() => setViewState('LANDING')}
            className="absolute top-6 left-6 lg:hidden text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
        >
            <X size={24} />
        </button>

        <div className="max-w-md w-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    {isLogin ? 'Insira seus dados para acessar o painel.' : 'Comece a curadoria profissional hoje.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Nome Completo</label>
                        <div className="relative">
                            <User size={20} className="absolute left-3 top-3 text-gray-400" />
                            <input type="text" placeholder="Seu nome" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">E-mail Profissional</label>
                    <div className="relative">
                        <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@imobiliaria.com" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Palavra-passe</label>
                        {isLogin && <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">Esqueceu?</a>}
                    </div>
                    <div className="relative">
                        <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'A processar...' : (isLogin ? <>Entrar na Plataforma <ArrowRight size={20} /></> : <>Continuar <ArrowRight size={20} /></>)}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-slate-600 dark:text-gray-400">
                    {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        {isLogin ? 'Criar conta' : 'Fazer Login'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};